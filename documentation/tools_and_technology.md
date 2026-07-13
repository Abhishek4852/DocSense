# Tools and Technologies

DocSense integrates a wide variety of tools to achieve a high-performance, responsive, and intelligent system.

## 1. Frontend Technologies
*   **React 18**: Core UI library for building the single-page application.
*   **Vite**: Next-generation frontend tooling for ultra-fast Hot Module Replacement (HMR) and optimized build processes.
*   **Tailwind CSS v4**: Utility-first CSS framework. Used extensively for responsive design, complex layout grids, glassmorphism aesthetics, and native class-based Dark Mode.
*   **React Router DOM v6**: Handles client-side routing, protected routes (`<ProtectedRoute>`), and layout structures (`<Outlet>`).
*   **Lucide React**: Premium, lightweight SVG icon library used for all UI icons (Navbar, Sidebar, Features).
*   **Axios**: Promise-based HTTP client for making API requests to the Django backend.

## 2. Backend Technologies
*   **Python 3.10+**: Core backend programming language.
*   **Django 5.x**: High-level web framework used for ORM, admin panel, and robust security architecture.
*   **Django REST Framework (DRF)**: Toolkit for building RESTful Web APIs, handling serializers, views, and routing.
*   **djangorestframework-simplejwt**: Provides JSON Web Token (JWT) authentication, allowing secure stateless API communication with the React frontend.
*   **PostgreSQL**: Primary relational database used to store users, tenants, configuration, and document metadata.

## 3. AI / Machine Learning (RAG Stack)
*   **LangChain**: Orchestration framework used to chain together document loaders, text splitters, and LLM calls.
*   **Google Gemini 1.5 Pro API**: The core Large Language Model (LLM) responsible for reading the retrieved context and generating human-like, accurate answers.
*   **Sentence-Transformers**: HuggingFace library used for running local machine learning models.
    *   **Embeddings Model (`all-MiniLM-L6-v2`)**: Converts text chunks into high-dimensional vector representations.
    *   **Cross-Encoder Model (`ms-marco-MiniLM-L-6-v2`)**: Used for the Re-Ranking phase to score the relevance of FAISS results against the exact user query.
*   **FAISS (Facebook AI Similarity Search)**: Highly efficient library for dense vector similarity search. Used as the local vector database.
*   **PyPDF2 / python-docx**: Libraries used for parsing and extracting raw text from uploaded user files.

## 4. Integration & Deployment
*   **Meta Graph API (WhatsApp Cloud API)**: Used to receive webhooks from WhatsApp users and send AI-generated text back to their devices.
*   **ngrok**: Used during development to expose the local Django server to the internet so Meta can deliver Webhook payloads.
*   **Git / GitHub**: Version control system.
