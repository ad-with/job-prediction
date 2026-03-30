from fastapi import APIRouter, HTTPException
from schemas.predict import PredictionRequest, PredictionResponse
import joblib
import os
import pandas as pd
import numpy as np

router = APIRouter()

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model_artifacts", "job_predictor.joblib")
model = None

def load_model():
    global model
    if model is None:
        try:
            if os.path.exists(MODEL_PATH):
                model = joblib.load(MODEL_PATH)
            else:
                print(f"Model path not found: {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")

@router.on_event("startup")
async def startup_event():
    load_model()

def scale_confidence(score, min_score=60.0, max_score=95.0, current_min=0.0, current_max=100.0):
    """ Scales raw confidence to a realistic range (e.g. 60-95%) """
    scaled = min_score + (score - current_min) * (max_score - min_score) / (current_max - current_min)
    return min(max_score, max(min_score, scaled))

@router.post("/", response_model=PredictionResponse)
async def predict_job_role(request: PredictionRequest):
    if model is None:
        load_model()
    if model is None:
        raise HTTPException(status_code=500, detail="Machine learning model not found. Please train it first.")
    
    try:
        # Prepare input for ML model
        skills_str = ", ".join(request.skills) if isinstance(request.skills, list) else request.skills
        
        input_data = pd.DataFrame([{
            "degree": request.degree,
            "specialization": request.specialization,
            "academic_score": request.academic_score,
            "marks_10th": request.marks_10th,
            "marks_12th": request.marks_12th,
            "skills": skills_str,
            "experience_years": request.experience_years
        }])
        
        # ML Prediction using explicit probabilities
        try:
            probas = model.predict_proba(input_data)[0]
            classes = model.classes_
            role_scores = {role: float(prob) * 100 for role, prob in zip(classes, probas)}
        except:
            prediction = model.predict(input_data)[0]
            role_scores = {prediction: 85.0} # Fallback base score

        # Hybrid Logic: Rule-based Filtering & Boosting based on Degree Domain
        degree_upper = request.degree.upper()
        spec_lower = request.specialization.lower()
        skills_lower = skills_str.lower()
        
        domain = "GENERAL"
        if any(d in degree_upper for d in ["B.TECH", "BCA", "MCA", "M.TECH"]) and not "CIVIL" in spec_lower and not "MECHANICAL" in spec_lower:
            domain = "TECH"
        elif any(d in degree_upper for d in ["B.TECH", "M.TECH", "DIPLOMA"]) and ("CIVIL" in spec_lower or "CONSTRUCTION" in spec_lower):
            domain = "CIVIL"
        elif any(d in degree_upper for d in ["B.TECH", "M.TECH", "DIPLOMA"]) and "MECHANICAL" in spec_lower:
            domain = "MECHANICAL"
        elif any(d in degree_upper for d in ["B.COM", "M.COM", "BBA", "MBA"]) and any(s in spec_lower for s in ["finance", "accounting", "commerce"]):
            domain = "FINANCE"
        elif any(d in degree_upper for d in ["BA", "B.SC", "M.SC", "MA"]) and any(s in spec_lower for s in ["math", "statistics", "economics"]):
            domain = "ANALYTICS"
        elif any(d in degree_upper for d in ["MBA", "BBA"]):
            domain = "BUSINESS"

        # Apply strict domain multipliers (penalize out-of-domain roles heavily)
        for role in role_scores:
            if domain == "CIVIL":
                if role not in ["Civil Engineer", "Site Engineer", "Structural Engineer", "Construction Manager"]:
                    role_scores[role] *= 0.1 # Heavily penalize unrelated roles
                else:
                    role_scores[role] *= 1.5 # Boost correct roles
                    
            elif domain == "FINANCE":
                if role not in ["Accountant", "Financial Analyst", "Business Analyst"]:
                    role_scores[role] *= 0.2
                else:
                    role_scores[role] *= 1.4
                    
            elif domain == "ANALYTICS":
                if role not in ["Data Analyst", "Economist", "Research Analyst", "Teaching Professional", "Data Scientist"]:
                    role_scores[role] *= 0.3
                else:
                    role_scores[role] *= 1.3
                    
            elif domain == "TECH":
                if role not in ["Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Data Scientist", "UX Designer", "Product Manager", "Data Analyst"]:
                    role_scores[role] *= 0.2
                else:
                    role_scores[role] *= 1.3
            
            elif domain == "BUSINESS":
                if role not in ["Marketing Specialist", "HR Manager", "Business Analyst", "Product Manager", "Accountant"]:
                    role_scores[role] *= 0.3
                else:
                    role_scores[role] *= 1.2

        # Skill-based refinement (Secondary)
        if "react" in skills_lower or "frontend" in skills_lower:
            role_scores["Frontend Developer"] = role_scores.get("Frontend Developer", 0) + 15.0
        if "node" in skills_lower or "backend" in skills_lower:
            role_scores["Backend Developer"] = role_scores.get("Backend Developer", 0) + 15.0
        if "autocad" in skills_lower or "staad" in skills_lower:
            role_scores["Civil Engineer"] = role_scores.get("Civil Engineer", 0) + 15.0
            role_scores["Structural Engineer"] = role_scores.get("Structural Engineer", 0) + 15.0

        # Sort and Normalize Scores (realistic range: 60-95%)
        sorted_raw = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
        max_raw_score = sum(role_scores.values()) or 1.0 # to avoid div/0
        
        predictions_formatted = []
        for role, raw_score in sorted_raw[:3]:
            # Convert raw arbitrary score to a percentage-like confidence
            relative_confidence = (raw_score / max_raw_score) * 100
            # Scale non-linearly to map 0-100 to 60-95 realistic range
            final_confidence = scale_confidence(relative_confidence, min_score=60.0, max_score=95.0, current_max=100.0)
            predictions_formatted.append({
                "role": role,
                "score": round(final_confidence, 1)
            })

        top_prediction = predictions_formatted[0]
        role = top_prediction["role"]
        
        # Generate Explanation
        explanation = f"Why {role}?\n\n• Your degree in {request.degree} ({request.specialization}) provides a strong foundation for this domain.\n"
        if request.academic_score > (8.5 if request.is_cgpa else 80):
            explanation += f"• Your excellent academic performance ({request.academic_score}{' CGPA' if request.is_cgpa else '%'}) demonstrates technical proficiency.\n"
        
        all_skills = (request.skills if isinstance(request.skills, list) else request.skills.split(","))
        relevant_skills = [s.strip() for s in all_skills if s.strip().lower() in role.lower() or any(term in s.lower() for term in ["python", "java", "react", "sql", "aws", "marketing", "finance", "autocad"])]
        if relevant_skills:
            explanation += f"• Your skills in {', '.join(relevant_skills[:3])} directly align with the core requirements of a {role}."
        else:
            explanation += "• Your educational background and academic scores strongly suggest success in this career path."

        return PredictionResponse(
            identified_skills=request.skills if isinstance(request.skills, list) else [s.strip() for s in skills_str.split(",")],
            predictions=predictions_formatted,
            predicted_role=role,
            confidence=top_prediction["score"],
            explanation=explanation
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
