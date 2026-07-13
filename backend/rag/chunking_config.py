# Configuration for Text Chunking in RAG Pipeline

# Document Type to Chunking Parameters Mapping
# This ensures that different types of documents get appropriately sized chunks and overlaps.
CHUNKING_PROFILES = {
    "General Article / Report": {
        "chunk_size": 1500,
        "chunk_overlap": 300,
        "separators": ["\n\n", "\n", " ", ""]
    },
    "Q&A / FAQs": {
        "chunk_size": 500,
        "chunk_overlap": 100,
        "separators": ["\nQ:", "\nQ ", "\n\n", "\n", " ", ""]
    },
    "Legal Document (Act/Code)": {
        "chunk_size": 2500,
        "chunk_overlap": 500,
        "separators": ["\nCHAPTER ", "\nPART ", "\nClause ", "\n--- Page ", "\n\n", "\n", " ", ""]
    },
    "Code / Technical Documentation": {
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "separators": ["\nclass ", "\ndef ", "\nfunction ", "\n\n", "\n", " ", ""]
    },
    "Financial Report": {
        "chunk_size": 800,
        "chunk_overlap": 150,
        "separators": ["\nTable ", "\nFigure ", "\n\n", "\n", " ", ""]
    },
    "Default": {
        "chunk_size": 1500,
        "chunk_overlap": 300,
        "separators": ["\n\n", "\n", " ", ""]
    }
}
