def build_prompt(query, chunks, chat_history=None):
    context = "\n\n".join([f"Source: {c['source']}\nContent: {c['text']}" for c in chunks])
    
    history_section = ""
    if chat_history:
        history_section = f"Chat History (recent messages):\n{chat_history}\n\n"
        
    prompt = f"""You are DocSense, an AI-powered Enterprise Knowledge Assistant.
Answer the question based ONLY on the provided context below.
If the information is not available in the context, politely mention that the uploaded documents do not contain the answer.

{history_section}Context:
{context}

Question: {query}
Answer:"""
    return prompt
