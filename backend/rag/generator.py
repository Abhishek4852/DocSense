from django.conf import settings

def generate_answer(prompt):
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == 'YOUR_GEMINI_API_KEY_HERE':
        return "Gemini API Key is not configured in .env"
        
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating answer: {str(e)}"
