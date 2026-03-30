import sys
import os
sys.path.insert(0, os.path.abspath("."))
from ai_engine.genai_service import analyze_resume

target_role = "Data Scientist"
resume_text = "I am a Data Scientist. I know Python, SQL, and Machine Learning. I have a B.Tech."

try:
    result = analyze_resume(resume_text, target_role)
    print("SUCCESS:")
    print(result)
except Exception as e:
    print("FAILED:")
    print(e)
