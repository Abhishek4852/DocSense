# Load the model lazily
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model

def generate_embeddings(texts):
    if not texts:
        return []
    embeddings = get_embedding_model().encode(texts, convert_to_numpy=True)
    return embeddings

def generate_query_embedding(query):
    return get_embedding_model().encode([query], convert_to_numpy=True)[0]