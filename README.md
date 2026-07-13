# DocSense - AI-Powered Enterprise Knowledge Assistant

## 📌 Business Problem
In today's fast-paced corporate environment, organizations generate and store massive amounts of documentation (Legal codes, Financial reports, FAQs, Technical docs). However, retrieving exact, context-aware information from these isolated silos is incredibly time-consuming. Employees and clients often waste hours searching through PDFs for a single clause or answer, leading to lost productivity and delayed decision-making.

## 🚀 How We Overcame It
**DocSense** is an advanced Retrieval-Augmented Generation (RAG) platform designed to transform static documents into an interactive, intelligent conversational knowledge base. By leveraging state-of-the-art vector embeddings, Cross-Encoder re-ranking, and Large Language Models (LLMs), DocSense allows users to simply ask questions in natural language and receive highly accurate, cited answers instantly—not just via a web dashboard, but directly through **WhatsApp**.

---

## ✨ Key Features

* **Multi-Format Document Support**: Seamlessly upload PDFs, raw text, and other documents into isolated, secure organizational knowledge bases.
* **Dynamic Chunking Engine**: Intelligent parsing that applies different chunk sizes, overlaps, and structural separators based on the document type (e.g., Legal, Q&A, Technical) to preserve maximum context.
* **Cross-Encoder Re-Ranking**: Ensures unparalleled accuracy. We retrieve the top documents using FAISS, and then re-rank them locally using a Cross-Encoder model (`ms-marco-MiniLM`) before sending only the absolute best context to the LLM, drastically saving API costs while boosting precision.
* **WhatsApp Integration**: Your AI assistant goes wherever you go. Ask questions directly from WhatsApp and get instant, context-aware replies.
* **WhatsApp One-Time Configuration**: A dedicated UI dashboard to securely configure your Meta Developer webhooks and tokens in one click.
* **Multi-Tenant Architecture**: Designed from the ground up for B2B use cases. Each organization gets an isolated workspace. Documents, chats, and vector stores are strictly siloed per organization, ensuring proprietary knowledge remains entirely private.
* **Enterprise-Grade UI**: A beautiful, animated, and responsive frontend built with Tailwind CSS, featuring full Dark Mode support and glassmorphism aesthetics.

---

## 🛠️ Tech Stack

### Frontend
* **React** (via Vite)
* **Tailwind CSS v4** (for styling, animations, and dark mode)
* **Lucide React** (for modern icons)
* **React Router DOM** (for navigation)

### Backend
* **Python & Django**
* **Django REST Framework (DRF)**
* **SimpleJWT** (for secure authentication)
* **PostgreSQL** (Database)

### AI & Machine Learning
* **LangChain** (RAG Pipeline Orchestration)
* **Google Gemini 1.5 Pro** (Core LLM for generation)
* **HuggingFace Embeddings** (`all-MiniLM-L6-v2`)
* **Sentence-Transformers** (Cross-Encoder for Re-ranking)
* **FAISS** (Local Vector Store)

---

## 👨‍💻 Author
Designed & Built with ❤️ by **Abhishek Yaduwanshi**
