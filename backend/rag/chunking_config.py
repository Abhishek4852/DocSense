# Configuration for Text Chunking in RAG Pipeline

# Maximum number of characters in each text chunk.
# Lower size helps avoid passing irrelevant context to the LLM.
CHUNK_SIZE = 3000

# Number of overlapping characters between consecutive chunks.
# This prevents important context from being broken between chunks.
CHUNK_OVERLAP = 700

# List of separators used by RecursiveCharacterTextSplitter.
# The splitter tries to split by the first separator. If chunks are still too large,
# it moves down the list. We include legal structure indicators like "\nCHAPTER " 
# and "\nClause " to keep legal sections together when possible.
SEPARATORS = [
    "\nCHAPTER ",
    "\nClause ",
    "\n--- Page ", 
    "\n\n", 
    "\n", 
    " ", 
    ""
]
