import pytest
import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model_artifacts", "job_predictor.joblib")

def test_model_artifact_exists():
    """Verify the trained model file exists."""
    assert os.path.exists(MODEL_PATH), "Model artifact 'job_predictor.joblib' not found."

def test_model_inference():
    """Check if the model can make a basic prediction."""
    if not os.path.exists(MODEL_PATH):
        pytest.skip("Model not found")
        
    model = joblib.load(MODEL_PATH)
    test_data = pd.DataFrame([{
        "education": "Bachelors",
        "skills": "Python, Machine Learning, SQL",
        "experience_years": 2
    }])
    
    prediction = model.predict(test_data)
    assert len(prediction) == 1
    assert isinstance(prediction[0], str)
    assert len(prediction[0]) > 0

def test_model_proba():
    """Check if the model provides confidence scores."""
    if not os.path.exists(MODEL_PATH):
        pytest.skip("Model not found")
        
    model = joblib.load(MODEL_PATH)
    test_data = pd.DataFrame([{
        "education": "Masters",
        "skills": "React, JavaScript, HTML",
        "experience_years": 5
    }])
    
    proba = model.predict_proba(test_data)
    assert proba.shape[1] > 0
    assert max(proba[0]) <= 1.0
