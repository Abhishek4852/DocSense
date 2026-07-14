from .embedding import generate_query_embedding
from .vector_store import retrieve_similar_chunks

def retrieve(org_id, query, top_k=3, selected_docs=None):
    query_emb = generate_query_embedding(query)
    chunks = retrieve_similar_chunks(org_id, query_emb, top_k, selected_docs)
    
    if not chunks:
        return []
        
    return chunks
