from langchain_text_splitters import RecursiveCharacterTextSplitter
from .chunking_config import CHUNK_SIZE, CHUNK_OVERLAP, SEPARATORS

def chunk_text(text, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=SEPARATORS
    )
    # We can keep page metadata if we parse it carefully, 
    # but for simplicity, we split the text and return chunks.
    return splitter.split_text(text)
