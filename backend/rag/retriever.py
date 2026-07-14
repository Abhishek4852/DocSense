from .embedding import generate_query_embedding
from .vector_store import retrieve_similar_chunks

# Lazy load the CrossEncoder model
_cross_encoder = None

def get_cross_encoder():
    global _cross_encoder
    if _cross_encoder is None:
        from sentence_transformers import CrossEncoder
        _cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    return _cross_encoder

def retrieve(org_id, query, top_k=3, selected_docs=None):
    # Retrieve more chunks initially (e.g., 10) for re-ranking
    initial_k = max(10, top_k * 3)
    query_emb = generate_query_embedding(query)
    chunks = retrieve_similar_chunks(org_id, query_emb, initial_k, selected_docs)
    
    if not chunks:
        return []
        
    # Re-rank using CrossEncoder
    encoder = get_cross_encoder()
    
    # Prepare pairs of (query, chunk_text)
    pairs = [[query, chunk['text']] for chunk in chunks]
    
    # Get scores
    scores = encoder.predict(pairs)
    
    # Add scores to chunks and sort
    for idx, chunk in enumerate(chunks):
        chunk['cross_score'] = float(scores[idx])
        
    ranked_chunks = sorted(chunks, key=lambda x: x['cross_score'], reverse=True)
    
    # Return the top_k requested
    return ranked_chunks[:top_k]
