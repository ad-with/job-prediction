import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# We expect GEMINI_API_KEY to be in the environment for full functionality
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Use flash for fast generation
MODEL_NAME = "gemini-1.5-flash"

def analyze_resume(resume_text: str, target_role: str) -> dict:
    if not GOOGLE_API_KEY:
        # Fallback dummy response if no API key is provided
        return {
            "match_score": 72,
            "missing_skills": ["Cloud Architecture", "Docker", "Agile methodologies"],
            "suggestions": ["Highlight quantifiable achievements", "Add projects related to Cloud"]
        }
        
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
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            # Maybe it starts with ``` instead of ```json
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            # Just extract between the first { and last }
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {
            "match_score": 50,
            "missing_skills": ["Error analyzing skills"],
            "suggestions": ["Please verify your API key or try again later."]
        }

def extract_resume_features(resume_text: str) -> dict:
    if not GOOGLE_API_KEY:
        # Fallback dummy response
        return {
            "skills": ["JavaScript", "React", "Node.js"],
            "education": "B.Tech",
            "experience_years": 2
        }
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert Resume Parser API. Extract core metadata from the provided resume text.
        Return ONLY a JSON response exactly matching this structure:
        {{
            "skills": ["List", "Of", "Technical", "Skills"],
            "education": "String representing highest education (e.g., 'B.Tech', 'Masters', 'BCA', 'Diploma', 'Other')",
            "experience_years": Integer representing estimated total years of work experience (use 0 for fresher)
        }}
        
        Resume Text:
        {resume_text}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API for extraction: {e}")
        return {
            "skills": ["Error extracting"],
            "education": "Unknown",
            "experience_years": 0
        }

def generate_career_roadmap(current: str, target: str, months: int, missing_skills: list | None = None, experience_level: str = "Fresher") -> dict:
    if not GOOGLE_API_KEY:
        # Dynamic fallback response
        detailed = []
        for m in range(1, months + 1):
            if m <= (months // 3) or m == 1:
                focus = "Foundation Skills"
                skills = ["Data Structures", "Algorithms"]
                tools = ["Git", "Command Line"]
                proj = ["Terminal App"]
            elif m <= (2 * months // 3):
                focus = "Intermediate Knowledge"
                skills = ["API Design", "Database Management"]
                tools = ["Docker", "Postman"]
                proj = ["Fullstack CRUD API"]
            else:
                focus = "Advanced Architecture"
                skills = ["System Design", "Cloud Deployment"]
                tools = ["AWS", "Kubernetes"]
                proj = ["Scalable Microservice"]

            detailed.append({
                "month_or_phase": f"Month {m}",
                "focus_area": focus,
                "skills_to_learn": skills,
                "tools_to_practice": tools,
                "projects_to_build": proj,
                "certifications": ["Platform Certification"] if m == months else []
            })
            
        return {
            "brief_roadmap": [
                "1. Master Core Fundamentals",
                "2. Build Foundation Projects",
                "3. Advanced System Concepts",
                "4. Final Polish & Apply"
            ],
            "detailed_roadmap": detailed
        }
    
    try:
        skills_context = f"The user needs to specifically learn these missing skills: {', '.join(missing_skills)}." if missing_skills and len(missing_skills) > 0 else ""
        
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert Career Strategist. Create a detailed, actionable career roadmap for a {experience_level} transitioning from "{current}" to "{target}" over exactly {months} months.
        {skills_context}

        CRITICAL REQUIREMENT: You MUST generate exactly {months} consecutive chronological objects inside the `detailed_roadmap` array. For example, if {months} is 6, generate an object for Month 1, Month 2, Month 3, Month 4, Month 5, and Month 6. DO NOT skip or group months.
        
        Return ONLY a JSON response exactly matching this structure:
        {{
            "brief_roadmap": [
                "String describing high-level step 1",
                "String describing high-level step 2",
                "String describing high-level step 3"
            ],
            "detailed_roadmap": [
                {{
                    "month_or_phase": "Month 1",
                    "focus_area": "Foundational focus",
                    "skills_to_learn": ["Skill 1", "Skill 2"],
                    "tools_to_practice": ["Tool 1", "Tool 2"],
                    "projects_to_build": ["Project Name 1"],
                    "certifications": ["Certification Name"]
                }},
                {{
                    "month_or_phase": "Month 2",
                    "focus_area": "Intermediate focus",
                    "skills_to_learn": ["Skill 3"],
                    "tools_to_practice": ["Tool 3"],
                    "projects_to_build": ["Project Name 2"],
                    "certifications": []
                }}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        detailed = []
        for m in range(1, months + 1):
            detailed.append({
                "month_or_phase": f"Month {m}",
                "focus_area": "Fallback Generation",
                "skills_to_learn": ["Failed to generate specific roadmap without API Key."],
                "tools_to_practice": [],
                "projects_to_build": [],
                "certifications": []
            })
            
        return {
            "brief_roadmap": ["Generation Failed - Using Fallback Timeline"],
            "detailed_roadmap": detailed
        }
