from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from rag.parser import extract_text
from rag.chunking import chunk_text
from rag.embedding import generate_embeddings
from rag.vector_store import add_to_vector_store, remove_from_vector_store

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request):
    files = request.FILES.getlist('files')
    if not files:
        return Response({'error': 'No files uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
    org = request.user.organization
    if not org:
        return Response({'error': 'User does not belong to any organization'}, status=status.HTTP_400_BAD_REQUEST)
        
    for file in files:
        ext = file.name.lower().split('.')[-1]
        if ext not in ['pdf', 'md', 'txt', 'csv', 'docx']:
            continue
            
        document_type = request.data.get('document_type', 'Default')
        doc = Document.objects.create(organization=org, title=file.name, file=file, document_type=document_type, status='PROCESSING')
        
        try:
            text = extract_text(doc.file.path)
            chunks = chunk_text(text, document_type=document_type)
            embeddings = generate_embeddings(chunks)
            add_to_vector_store(org.id, embeddings, chunks, source_doc=doc.title)
            
            doc.status = 'READY'
            doc.save()
        except Exception as e:
            doc.status = 'FAILED'
            doc.save()
            print(f"Error processing {file.name}: {e}")
            
    return Response({'message': 'Files uploaded and processed successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_documents(request):
    org = request.user.organization
    docs = Document.objects.filter(organization=org).order_by('-created_at')
    data = [{'id': d.id, 'title': d.title, 'status': d.status, 'document_type': d.document_type, 'created_at': d.created_at} for d in docs]
    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_document(request, doc_id):
    try:
        doc = Document.objects.get(id=doc_id, organization=request.user.organization)
        doc_title = doc.title
        
        # Delete the actual physical file from the server
        if doc.file:
            doc.file.delete(save=False)
            
        doc.delete()
        
        # Remove from vector store
        remove_from_vector_store(request.user.organization.id, doc_title)
        
        return Response({'message': 'Document deleted'})
    except Document.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_text(request):
    text = request.data.get('text')
    title = request.data.get('title', 'Pasted Text')
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
    org = request.user.organization
    if not org:
        return Response({'error': 'User does not belong to any organization'}, status=status.HTTP_400_BAD_REQUEST)
        
    import os
    from django.conf import settings
    import uuid
    from django.core.files.base import ContentFile
    
    document_type = request.data.get('document_type', 'Default')
    
    filename = f"{uuid.uuid4().hex}_{title}.txt"
    
    doc = Document(organization=org, title=title, document_type=document_type, status='PROCESSING')
    doc.file.save(filename, ContentFile(text.encode('utf-8')))
    doc.save()
    
    try:
        chunks = chunk_text(text, document_type=document_type)
        embeddings = generate_embeddings(chunks)
        add_to_vector_store(org.id, embeddings, chunks, source_doc=doc.title)
        
        doc.status = 'READY'
        doc.save()
    except Exception as e:
        doc.status = 'FAILED'
        doc.save()
        print(f"Error processing pasted text: {e}")
        
    return Response({'message': 'Text uploaded and processed successfully'})
