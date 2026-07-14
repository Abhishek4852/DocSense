from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ChatSession, ChatMessage
# Heavy ML imports deferred

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def new_chat(request):
    title = request.data.get('title', 'New Chat')
    session = ChatSession.objects.create(
        user=request.user,
        organization=request.user.organization,
        title=title
    )
    return Response({'id': session.id, 'title': session.title, 'created_at': session.created_at})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    sessions = ChatSession.objects.filter(user=request.user).order_by('-created_at')
    data = [{'id': s.id, 'title': s.title, 'created_at': s.created_at} for s in sessions]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
        messages = ChatMessage.objects.filter(session=session).order_by('created_at')
        msg_data = []
        for m in messages:
            msg_data.append({
                'id': m.id,
                'role': m.role,
                'message': m.message,
                'source': m.source,
                'created_at': m.created_at
            })
        return Response({
            'id': session.id,
            'title': session.title,
            'messages': msg_data
        })
    except ChatSession.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_question(request):
    from rag.retriever import retrieve
    from rag.prompt import build_prompt
    from rag.generator import generate_answer
    
    session_id = request.data.get('session_id')
    question = request.data.get('question')
    selected_docs = request.data.get('selected_docs') # List of document titles
    
    if not session_id or not question:
        return Response({'error': 'session_id and question are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        
    # Fetch last 10 messages for conversational memory
    recent_msgs = ChatMessage.objects.filter(session=session).order_by('-created_at')[:10]
    history_str = ""
    if recent_msgs.exists():
        for msg in reversed(recent_msgs):
            role_name = "User" if msg.role == "USER" else "DocSense"
            history_str += f"{role_name}: {msg.message}\n"
            
    ChatMessage.objects.create(session=session, role='USER', message=question)
    
    org_id = request.user.organization.id
    chunks = retrieve(org_id, question, top_k=5, selected_docs=selected_docs)
    prompt = build_prompt(question, chunks, history_str)
    answer = generate_answer(prompt)
    
    sources = []
    seen_sources = set()
    for c in chunks:
        if c['source'] not in seen_sources:
            sources.append({'document': c['source']})
            seen_sources.add(c['source'])
            
    system_msg = ChatMessage.objects.create(
        session=session, 
        role='SYSTEM', 
        message=answer, 
        source=sources if sources else None
    )
    
    if session.messages.count() <= 2:
        session.title = question[:50]
        session.save()
        
    return Response({
        'answer': answer,
        'sources': sources
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
        session.delete()
        return Response({'message': 'Chat session deleted successfully.'}, status=status.HTTP_200_OK)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

