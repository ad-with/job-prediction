from pydantic import BaseModel, Field
from typing import List, Union

class PredictionRequest(BaseModel):
    degree: str = Field(..., description="Educational degree (e.g., B.Tech, MBA)")
    specialization: str = Field(..., description="Area of specialization")
    academic_score: float = Field(..., description="CGPA or Percentage")
    is_cgpa: bool = Field(True, description="True if score is CGPA, False if Percentage")
    marks_10th: float = Field(..., description="10th standard percentage")
    marks_12th: float = Field(..., description="12th standard percentage")
    skills: Union[List[str], str] = Field(..., description="List of technical and soft skills (or comma separated string)")
    experience_years: int = Field(0, ge=0, description="Years of professional experience")

class RolePrediction(BaseModel):
    role: str = Field(..., description="The predicted job role")
    score: float = Field(..., description="Overall match score percentage")

class PredictionResponse(BaseModel):
    identified_skills: List[str] = Field(default_factory=list, description="Skills used for this prediction")
    predictions: List[RolePrediction] = Field(default_factory=list, description="Top role predictions with scores")
    predicted_role: str = Field(None, description="The top predicted job role")
    confidence: float = Field(None, description="Confidence score of the top prediction")
    explanation: str = Field(None, description="Detailed explanation of why this role was predicted")
