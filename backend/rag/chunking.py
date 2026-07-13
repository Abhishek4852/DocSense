from langchain_text_splitters import RecursiveCharacterTextSplitter
from .chunking_config import CHUNKING_PROFILES

def chunk_text(text, document_type="Default"):
    profile = CHUNKING_PROFILES.get(document_type, CHUNKING_PROFILES["Default"])
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=profile["chunk_size"],
        chunk_overlap=profile["chunk_overlap"],
        separators=profile["separators"]
    )
    return splitter.split_text(text)
