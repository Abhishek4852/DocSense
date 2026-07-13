import fitz  # PyMuPDF
import pandas as pd
from docx import Document as DocxDocument
import os

def extract_text(file_path):
    text = ""
    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if ext == '.pdf':
            with fitz.open(file_path) as doc:
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page.get_text("text")
        elif ext in ['.txt', '.md']:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        elif ext == '.csv':
            df = pd.read_csv(file_path)
            text = df.to_string(index=False)
        elif ext == '.docx':
            doc = DocxDocument(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            print(f"Unsupported file extension: {ext}")
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        
    return text
