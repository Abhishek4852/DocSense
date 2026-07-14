import google.generativeai as genai
from django.conf import settings
import numpy as np

# Configure Gemini API (can safely be called repeatedly or globally)
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_embeddings(texts):
    if not texts:
        return []
    
    # Gemini embed_content supports a list of strings
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=texts,
        task_type="retrieval_document"
    )
    return np.array(result['embedding'], dtype=np.float32)

def generate_query_embedding(query):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=query,
        task_type="retrieval_query"
    )
    return np.array(result['embedding'], dtype=np.float32)