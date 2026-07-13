from sentence_transformers import SentenceTransformer

# Load the model once
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embeddings(texts):
    if not texts:
        return []
    embeddings = embedding_model.encode(texts, convert_to_numpy=True)
    return embeddings

def generate_query_embedding(query):
    return embedding_model.encode([query], convert_to_numpy=True)[0]