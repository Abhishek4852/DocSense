from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import uuid
import requests
import json
from .models import WhatsAppConfig, WhatsAppContact, WhatsAppMessage
from rag.retriever import retrieve
from rag.prompt import build_prompt
from rag.generator import generate_answer

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def whatsapp_config(request):
    organization = request.user.organization
    
    if request.method == 'GET':
        try:
            config = WhatsAppConfig.objects.get(organization=organization)
            return Response({
                'is_active': config.is_active,
                'phone_number_id': config.phone_number_id,
                'verify_token': config.verify_token,
                'has_access_token': bool(config.access_token),
                'selected_docs': config.selected_docs
            })
        except WhatsAppConfig.DoesNotExist:
            return Response({'error': 'Not configured'}, status=status.HTTP_404_NOT_FOUND)
            
    elif request.method == 'POST':
        phone_number_id = request.data.get('phone_number_id')
        access_token = request.data.get('access_token', '')
        selected_docs = request.data.get('selected_docs', [])
        
        if not phone_number_id:
            return Response({'error': 'Missing phone_number_id'}, status=status.HTTP_400_BAD_REQUEST)
            
        config, created = WhatsAppConfig.objects.get_or_create(organization=organization)
        
        if created and not access_token:
            return Response({'error': 'Missing access token'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not config.verify_token:
            config.verify_token = str(uuid.uuid4())
            
        config.phone_number_id = phone_number_id
        config.selected_docs = selected_docs
        
        if access_token.strip():
            config.access_token = access_token.strip()
            
        config.is_active = True
        config.save()
        return Response({
            'message': 'Configuration saved',
            'verify_token': config.verify_token
        })
        
    elif request.method == 'DELETE':
        WhatsAppConfig.objects.filter(organization=organization).delete()
        return Response({'message': 'Configuration removed'})

from django.http import HttpResponse

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def whatsapp_webhook(request):
    if request.method == 'GET':
        # Webhook Verification
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        
        if mode == 'subscribe' and token:
            if WhatsAppConfig.objects.filter(verify_token=token).exists():
                return HttpResponse(challenge, content_type="text/plain", status=200)
        return HttpResponse('Error', status=403)
        
    elif request.method == 'POST':
        # Receive Message
        try:
            data = request.data
            
            # Check if this is a valid WhatsApp API payload
            if 'object' in data and data['object'] == 'whatsapp_business_account':
                for entry in data.get('entry', []):
                    for change in entry.get('changes', []):
                        value = change.get('value', {})
                        
                        # Process only messages
                        if 'messages' in value:
                            phone_number_id = value['metadata']['phone_number_id']
                            message_obj = value['messages'][0]
                            contact_obj = value['contacts'][0]
                            
                            sender_phone = message_obj['from']
                            message_text = message_obj['text']['body']
                            sender_name = contact_obj.get('profile', {}).get('name', 'Unknown')
                            
                            # Find config
                            config = WhatsAppConfig.objects.filter(phone_number_id=phone_number_id, is_active=True).first()
                            
                            if config:
                                handle_whatsapp_message(config, sender_phone, sender_name, message_text)
                                
            return Response('EVENT_RECEIVED', status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Webhook error: {e}")
            return Response('EVENT_RECEIVED', status=status.HTTP_200_OK)

def handle_whatsapp_message(config, sender_phone, sender_name, message_text):
    org = config.organization
    
    # Get or create contact
    contact, _ = WhatsAppContact.objects.get_or_create(
        organization=org,
        phone_number=sender_phone,
        defaults={'name': sender_name}
    )
    
    # Save user message
    WhatsAppMessage.objects.create(contact=contact, role='USER', message=message_text)
    
    # RAG Retrieval
    # Check if selected_docs is empty (which means all docs) or has items
    selected = config.selected_docs if config.selected_docs else None
    chunks = retrieve(org.id, message_text, top_k=3, selected_docs=selected)
    
    if not chunks:
        answer = "I couldn't find this information in the uploaded documents."
    else:
        # We don't have full chat history for prompt here, keeping it simple for now
        history_str = ""
        recent_msgs = WhatsAppMessage.objects.filter(contact=contact).order_by('-created_at')[:5]
        for m in reversed(recent_msgs):
            r = "User" if m.role == "USER" else "DocSense"
            history_str += f"{r}: {m.message}\n"
            
        prompt = build_prompt(message_text, chunks, history_str)
        answer = generate_answer(prompt)
        
    # Save system message
    WhatsAppMessage.objects.create(contact=contact, role='SYSTEM', message=answer)
    
    # Send reply via Meta Graph API
    url = f"https://graph.facebook.com/v18.0/{config.phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {config.access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": sender_phone,
        "type": "text",
        "text": {"body": answer}
    }
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"Failed to send message: {response.text}")
