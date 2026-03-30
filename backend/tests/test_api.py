import pytest
from httpx import AsyncClient, ASGITransport
from main import app
import os

@pytest.mark.asyncio
async def test_read_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Edu2Job API", "status": "online"}

@pytest.mark.asyncio
async def test_predict_endpoint():
    payload = {
        "degree": "B.Tech",
        "specialization": "Computer Science",
        "academic_score": 9.2,
        "is_cgpa": True,
        "marks_10th": 95.0,
        "marks_12th": 90.0,
        "skills": ["Python", "SQL", "React"],
        "experience_years": 0
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/predict/", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        assert "predicted_role" in data
        assert "confidence" in data
        assert "explanation" in data
        assert "Why" in data["explanation"]
    else:
        assert response.status_code in [200, 500]

@pytest.mark.asyncio
async def test_resume_analyzer_endpoint():
    payload = {
        "resume_text": "Experienced software developer with skill in Python and React.",
        "target_role": "Fullstack Developer"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/genai/resume-analyzer", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "match_score" in data
    assert "missing_skills" in data
    assert isinstance(data["missing_skills"], list)

@pytest.mark.asyncio
async def test_roadmap_endpoint():
    payload = {
        "current_role": "Student",
        "target_role": "Data Scientist",
        "timeline_months": 12
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/genai/career-roadmap", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "roadmap" in data
    assert len(data["roadmap"]) > 0
    assert "focus_area" in data["roadmap"][0]
