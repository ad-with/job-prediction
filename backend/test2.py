import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

MODEL_NAME = "gemini-1.5-flash"

def analyze_resume(resume_text: str, target_role: str) -> dict:
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert AI Career Coach. Analyze the following resume text against the target role: {target_role}.
        Return ONLY a JSON response exacty matching this structure:
        {{
            "match_score": integer (0 to 100),
            "missing_skills": ["Skill 1", "Skill 2"],
            "suggestions": ["Suggestion 1", "Suggestion 2"]
        }}
        
        Resume Text:
        {resume_text}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        print("RAW RESPONSE:", text)
        
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        print("PROCESSED RESPONSE:", text)
        return json.loads(text)
    except Exception as e:
        print("ERROR:", e)

analyze_resume("I know python", "Data Scientist")
