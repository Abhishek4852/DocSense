# Low-Level Architecture (LLA)

This document breaks down the internal workings of the backend, database schemas, and the specific algorithms used in the RAG pipeline.

## 1. Database Schema (Django Models)

The system is designed with a **Multi-Tenant** approach, centered around the `Organization` model.

*   **User (`accounts.User`)**: Inherits from Django's AbstractUser. Contains a Foreign Key to `Organization`.
*   **Organization (`accounts.Organization`)**: Represents a tenant. Contains `name` and `created_at`.
*   **Document (`documents.Document`)**: Represents an uploaded file.
    *   Fields: `organization` (FK), `title`, `file` (FileField), `document_type` (for dynamic chunking), `status` (Processing, Completed, Error).
*   **ChatSession (`chat.ChatSession`) & ChatMessage (`chat.ChatMessage`)**: Stores conversation history to maintain context.
*   **WhatsAppConfig (`whatsapp.WhatsAppConfig`)**: Stores the Meta Developer credentials per organization.
    *   Fields: `organization` (OneToOne), `verify_token`, `access_token`, `phone_number_id`, `selected_docs` (ManyToMany with Document to limit what the WhatsApp bot can access).

## 2. RAG Pipeline Execution Flow

### A. Ingestion (Upload Phase)
1.  **Parsing**: `parser.py` reads the physical file (`.pdf`, `.txt`, `.docx`, `.csv`) and extracts raw text.
2.  **Dynamic Chunking**: `chunking.py` reads the `document_type` from the DB and maps it to `chunking_config.py`. It applies specific `chunk_size`, `chunk_overlap`, and `separators` (e.g., splitting legal docs by `\nCHAPTER `).
3.  **Embedding & FAISS**: `embedding.py` converts chunks into vectors using `sentence-transformers/all-MiniLM-L6-v2`. FAISS indexes these vectors locally at `backend/vector_store/org_<id>.index`. Metadata (like source document ID) is stored in a `.pkl` file.

### B. Retrieval & Generation (Query Phase)
1.  **Initial Retrieval**: When a query hits `retriever.py`, it calculates the vector of the question and performs a similarity search in FAISS, retrieving a wide net of results (Top 10-15 chunks).
2.  **Cross-Encoder Re-Ranking**: The top 15 chunks are passed to `ms-marco-MiniLM-L-6-v2` (a Cross-Encoder). It scores the *exact relationship* between the question and each chunk. The list is re-sorted, and only the Top 3 highest-scoring chunks are kept.
3.  **Generation**: `generator.py` combines the Top 3 chunks with the user's question and previous chat history into a structured prompt. This is sent to the Google Gemini 1.5 Pro API.
4.  **Response**: The LLM generates the answer, which is saved to `ChatMessage` and returned to the user via REST or WhatsApp.

## 3. Webhook Execution Flow (WhatsApp)
1.  Meta sends a POST request to `/api/whatsapp/webhook/`.
2.  The view verifies the payload, extracts the incoming phone number and message body.
3.  It looks up the `WhatsAppConfig` associated with the destination `phone_number_id`.
4.  It isolates the FAISS search to only the documents selected in `selected_docs`.
5.  Executes the RAG Retrieval & Generation phase.
6.  Dispatches an HTTP POST request to `graph.facebook.com/v19.0/.../messages` with the LLM's response.
