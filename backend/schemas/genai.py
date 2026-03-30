from pydantic import BaseModel, Field
from typing import List

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str = Field(..., description="Parsed text from the user's resume")
    target_role: str = Field(..., description="The job role the user is aiming for")

class ResumeAnalyzeResponse(BaseModel):
    match_score: int = Field(..., description="Percentage match of resume to target role")
    missing_skills: List[str] = Field(..., description="Skills missing from the resume")
    suggestions: List[str] = Field(..., description="Actionable suggestions for improvement")

class ResumeExtractRequest(BaseModel):
    resume_text: str = Field(..., description="Text from the uploaded resume file")

class ResumeExtractResponse(BaseModel):
    skills: List[str] = Field(..., description="Technical skills extracted from the resume")
    education: str = Field(..., description="Highest level of education detected (e.g. B.Tech, Masters, PhD, etc.)")
    experience_years: int = Field(..., description="Estimated years of professional experience as an integer")

class RoadmapRequest(BaseModel):
    current_role: str = Field(..., description="Current job role or education status")
    target_role: str = Field(..., description="The desired future job role")
    timeline_months: int = Field(6, description="Desired timeline to achieve the goal in months")
    missing_skills: List[str] = Field(default_factory=list, description="Target missing skills to focus on")
    experience_level: str = Field("Fresher", description="User's experience level")

class RoadmapDetailedStep(BaseModel):
    month_or_phase: str = Field(..., description="Month or phase identifier")
    focus_area: str = Field(..., description="Main learning focus")
    skills_to_learn: List[str] = Field(default_factory=list, description="Skills to learn")
    tools_to_practice: List[str] = Field(default_factory=list, description="Tools to practice")
    projects_to_build: List[str] = Field(default_factory=list, description="Projects to build")
    certifications: List[str] = Field(default_factory=list, description="Optional certifications")

class RoadmapResponse(BaseModel):
    brief_roadmap: List[str] = Field(..., description="High-level 3-5 key progression steps")
    detailed_roadmap: List[RoadmapDetailedStep] = Field(..., description="Detailed timeline-based roadmap")
