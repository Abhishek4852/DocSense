import faiss
import numpy as np
import os
import pickle

FAISS_INDEX_DIR = "vector_store/"
if not os.path.exists(FAISS_INDEX_DIR):
    os.makedirs(FAISS_INDEX_DIR)

def get_index_path(org_id):
    return os.path.join(FAISS_INDEX_DIR, f"org_{org_id}.index")

def get_metadata_path(org_id):
    return os.path.join(FAISS_INDEX_DIR, f"org_{org_id}_metadata.pkl")

def add_to_vector_store(org_id, embeddings, chunks, source_doc):
    if len(embeddings) == 0:
        return
    
    d = embeddings.shape[1]
    index_path = get_index_path(org_id)
    metadata_path = get_metadata_path(org_id)
    
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
    else:
        index = faiss.IndexFlatL2(d)
        metadata = []
        
    index.add(np.array(embeddings, dtype=np.float32))
    faiss.write_index(index, index_path)
    
    for chunk in chunks:
        metadata.append({
            'text': chunk,
            'source': source_doc
        })
        
    with open(metadata_path, 'wb') as f:
        pickle.dump(metadata, f)

def retrieve_similar_chunks(org_id, query_embedding, top_k=5, selected_docs=None):
    index_path = get_index_path(org_id)
    metadata_path = get_metadata_path(org_id)
    
    if not os.path.exists(index_path):
        return []
        
    index = faiss.read_index(index_path)
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
        
    query_vector = np.array([query_embedding], dtype=np.float32)
    # If filtering, we might need to retrieve more chunks initially
    search_k = top_k * 5 if selected_docs else top_k
    distances, indices = index.search(query_vector, search_k)
    
    results = []
    for idx in indices[0]:
        if idx != -1 and idx < len(metadata):
            meta = metadata[idx]
            if selected_docs:
                if meta['source'] in selected_docs:
                    results.append(meta)
            else:
                results.append(meta)
            if len(results) == top_k:
                break
            
    return results

def remove_from_vector_store(org_id, source_doc):
    index_path = get_index_path(org_id)
    metadata_path = get_metadata_path(org_id)
    
    if not os.path.exists(index_path) or not os.path.exists(metadata_path):
        return
        
    index = faiss.read_index(index_path)
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
        
    indices_to_keep = [i for i, m in enumerate(metadata) if m['source'] != source_doc]
    
    if len(indices_to_keep) == 0:
        os.remove(index_path)
        os.remove(metadata_path)
        return
        
    d = index.d
    new_index = faiss.IndexFlatL2(d)
    new_metadata = []
    
    vectors_to_keep = []
    for i in indices_to_keep:
        vectors_to_keep.append(index.reconstruct(i))
        new_metadata.append(metadata[i])
        
    new_index.add(np.array(vectors_to_keep, dtype=np.float32))
    
    faiss.write_index(new_index, index_path)
    with open(metadata_path, 'wb') as f:
        pickle.dump(new_metadata, f)
