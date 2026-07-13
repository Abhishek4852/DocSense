# Project Flow

This document traces the step-by-step journey of data through the DocSense system, mapping business logic to the specific files executing it.

## 1. Document Upload Flow

1.  **Frontend (`UploadPage.jsx`)**
    *   **Logic**: The user selects a document type (e.g., Legal, Q&A) and uploads a PDF. 
    *   **Tools**: React, Axios, FormData.
2.  **Backend API (`documents/views.py` - `upload_document`)**
    *   **Logic**: Receives the file and `document_type`. Saves the `Document` model to the PostgreSQL database and persists the physical file in `/media/documents/`. Extracts text from the file.
    *   **Tools**: Django REST Framework, PyPDF2.
3.  **Dynamic Chunking (`rag/chunking.py` & `rag/chunking_config.py`)**
    *   **Logic**: The extracted text is passed to `chunk_text()`. Based on the `document_type`, it looks up the specific `chunk_size`, `chunk_overlap`, and `separators` in `chunking_config.py`. It splits the long text into meaningful smaller chunks.
    *   **Tools**: LangChain `RecursiveCharacterTextSplitter`.
4.  **Vector Embedding (`rag/embedding.py`)**
    *   **Logic**: `add_to_vector_store()` takes the chunks, converts them into numeric vectors, and saves them to a local FAISS index file (`org_<id>.index`).
    *   **Tools**: HuggingFace `all-MiniLM-L6-v2`, FAISS.

## 2. Web Chat Flow

1.  **Frontend (`ChatPage.jsx`)**
    *   **Logic**: User types a question. The UI displays the message and sends a POST request to the backend.
    *   **Tools**: React, Tailwind CSS.
2.  **Backend API (`chat/views.py` - `chat_message`)**
    *   **Logic**: Verifies JWT authentication. Looks up the organization's ChatSession.
    *   **Tools**: Django SimpleJWT.
3.  **Retrieval & Re-Ranking (`rag/retriever.py`)**
    *   **Logic**: `retrieve_context()` searches the FAISS index for the top 10 chunks similar to the question. It then uses a Cross-Encoder to re-rank those 10 chunks against the user's question, returning only the top 3 most relevant chunks.
    *   **Tools**: FAISS, Sentence-Transformers (`ms-marco-MiniLM`).
4.  **Generation (`rag/generator.py`)**
    *   **Logic**: `generate_answer()` takes the top 3 chunks and the user's question, constructs a prompt, and asks the LLM to generate an answer based *only* on that context.
    *   **Tools**: Google Gemini 1.5 Pro API.
5.  **Response (`chat/views.py`)**
    *   **Logic**: Saves the AI's response to the database and returns it to the React frontend to display.

## 3. WhatsApp Integration Flow

1.  **Frontend Config (`WhatsAppSettingsPage.jsx`)**
    *   **Logic**: The organization admin inputs their Meta API token and selects *which* documents the WhatsApp bot should have access to.
2.  **Meta Webhook Trigger (`whatsapp/views.py` - `whatsapp_webhook`)**
    *   **Logic**: A WhatsApp user texts the organization's number. Meta sends a JSON payload to this endpoint.
    *   **Tools**: Django `@api_view`, Meta Graph API.
3.  **Authentication & Routing (`whatsapp/views.py`)**
    *   **Logic**: The view extracts the incoming `phone_number_id`, looks up the `WhatsAppConfig`, and validates the token. It passes the user's text and the `selected_docs` IDs to the RAG pipeline.
4.  **Filtered Retrieval (`rag/retriever.py`)**
    *   **Logic**: Similar to the Web Chat flow, but `retrieve_context()` filters the FAISS results to *only* include chunks from the documents authorized in `selected_docs`.
5.  **WhatsApp Response (`whatsapp/views.py`)**
    *   **Logic**: Receives the generated answer from `generator.py` and makes a POST request to Meta's `/messages` API endpoint to send the text message to the user's WhatsApp.
    *   **Tools**: Python `requests` library.
