from fastapi import APIRouter, HTTPException
from schemas.genai import ResumeAnalyzeRequest, ResumeAnalyzeResponse, RoadmapRequest, RoadmapResponse, ResumeExtractRequest, ResumeExtractResponse
from ai_engine.genai_service import analyze_resume, generate_career_roadmap
from ai_engine.nlp_extractor import extract_resume_features_spacy

router = APIRouter()

@router.post("/resume-analyzer", response_model=ResumeAnalyzeResponse)
async def analyze_resume_endpoint(request: ResumeAnalyzeRequest):
    try:
        result = analyze_resume(request.resume_text, request.target_role)
        return ResumeAnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/resume-extract", response_model=ResumeExtractResponse)
async def extract_resume_endpoint(request: ResumeExtractRequest):
    try:
        # Use deterministic spaCy NER instead of generative AI hallucination
        result = extract_resume_features_spacy(request.resume_text)
        
        # Output Validation check
        if not result.get("skills"):
            # Fallback if text extraction yields literally nothing
            result["skills"] = ["No technical skills detected"]

        return ResumeExtractResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/career-roadmap", response_model=RoadmapResponse)
async def generate_roadmap_endpoint(request: RoadmapRequest):
    try:
        result = generate_career_roadmap(
            request.current_role, 
            request.target_role, 
            request.timeline_months,
            request.missing_skills,
            request.experience_level
        )
        return RoadmapResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
