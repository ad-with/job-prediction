import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import joblib
import os
import random

# Setting seeds for reproducibility
np.random.seed(42)
random.seed(42)

def generate_synthetic_data(num_samples=4000):
    role_to_edu = {
        # Core Tech
        "Data Scientist": {"degrees": ["B.Tech", "M.Tech", "MCA", "M.Sc", "PhD"], "specializations": ["Data Science", "Artificial Intelligence", "Computer Science"]},
        "Software Engineer": {"degrees": ["B.Tech", "BCA", "MCA", "M.Tech"], "specializations": ["Computer Science", "Information Technology", "AI"]},
        "DevOps Engineer": {"degrees": ["B.Tech", "MCA", "M.Tech"], "specializations": ["Computer Science", "Information Technology", "Electronics"]},
        "Frontend Developer": {"degrees": ["B.Tech", "BCA", "B.Sc", "Diploma"], "specializations": ["Computer Science", "Information Technology", "Design"]},
        "Backend Developer": {"degrees": ["B.Tech", "MCA", "M.Tech", "BCA"], "specializations": ["Computer Science", "Information Technology"]},
        "UX Designer": {"degrees": ["B.Sc", "BA", "B.Tech", "Diploma"], "specializations": ["Design", "Information Technology", "CS"]},
        "Product Manager": {"degrees": ["MBA", "B.Tech"], "specializations": ["Business Administration", "Marketing", "Computer Science"]},
        
        # Civil / Mechanical / Core Engg
        "Civil Engineer": {"degrees": ["B.Tech", "M.Tech", "Diploma"], "specializations": ["Civil", "Civil Engineering"]},
        "Site Engineer": {"degrees": ["B.Tech", "Diploma"], "specializations": ["Civil", "Civil Engineering", "Construction"]},
        "Structural Engineer": {"degrees": ["B.Tech", "M.Tech"], "specializations": ["Civil", "Civil Engineering", "Structural Engineering"]},
        "Construction Manager": {"degrees": ["B.Tech", "MBA"], "specializations": ["Civil", "Civil Engineering", "Construction Management"]},
        "Mechanical Engineer": {"degrees": ["B.Tech", "M.Tech", "Diploma"], "specializations": ["Mechanical", "Mechanical Engineering"]},
        
        # Commerce / Arts / Science
        "Accountant": {"degrees": ["B.Com", "M.Com", "MBA"], "specializations": ["Accounting", "Finance", "Commerce"]},
        "Financial Analyst": {"degrees": ["B.Com", "M.Com", "MBA", "BBA"], "specializations": ["Finance", "Accounting", "Economics"]},
        "Economist": {"degrees": ["BA", "MA", "B.Sc", "M.Sc"], "specializations": ["Economics"]},
        "Research Analyst": {"degrees": ["BA", "B.Sc", "B.Com", "MA", "M.Sc"], "specializations": ["Economics", "Statistics", "Mathematics", "Business"]},
        "Teaching Professional": {"degrees": ["BA", "B.Sc", "B.Com", "MA", "M.Sc", "PhD"], "specializations": ["Education", "Physics", "Maths", "English", "History"]},
        "Data Analyst": {"degrees": ["B.Sc", "B.Tech", "BCA", "B.Com"], "specializations": ["Maths", "Mathematics", "Statistics", "Computer Science"]},
        
        # Management
        "Marketing Specialist": {"degrees": ["MBA", "BBA", "BA", "B.Com"], "specializations": ["Marketing", "Economics", "Communications"]},
        "Business Analyst": {"degrees": ["BBA", "MBA", "B.Tech", "B.Com"], "specializations": ["Business Administration", "Finance", "Information Technology"]},
        "HR Manager": {"degrees": ["MBA", "BBA", "BA"], "specializations": ["Human Resources", "Business Administration"]}
    }
    
    roles = list(role_to_edu.keys())
    
    role_to_skills = {
        "Data Scientist": ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "Scikit-Learn", "Deep Learning", "Statistics", "TensorFlow", "NumPy", "NLP"],
        "Software Engineer": ["Java", "C++", "C#", "Python", "Algorithms", "Data Structures", "System Design", "Git", "Go", "Rust"],
        "Product Manager": ["Roadmapping", "Agile", "Scrum", "Market Research", "Product Strategy", "Jira", "Stakeholder Management"],
        "UX Designer": ["Figma", "UI/UX", "Wireframing", "Prototyping", "User Testing", "Adobe XD", "Design Systems"],
        "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Jenkins"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular", "TypeScript", "Tailwind", "Next.js"],
        "Backend Developer": ["Python", "Node.js", "Java", "SQL", "MongoDB", "REST APIs", "GraphQL", "Docker", "PostgreSQL", "Django", "FastAPI"],
        "Marketing Specialist": ["SEO", "Content Strategy", "Digital Marketing", "Google Analytics", "Social Media", "Copywriting"],
        "HR Manager": ["Recruiting", "Employee Relations", "Onboarding", "Talent Acquisition", "Communication"],
        "Accountant": ["Accounting", "Tally", "GST", "Advanced Excel", "Finance", "Auditing", "Taxation"],
        "Business Analyst": ["Data Visualization", "Tableau", "Power BI", "SQL", "Market Research", "Process Improvement", "Excel"],
        "Civil Engineer": ["AutoCAD", "STAAD Pro", "Surveying", "Project Management", "Construction Materials", "Estimation"],
        "Site Engineer": ["Site Management", "AutoCAD", "Quality Control", "Surveying", "Health & Safety"],
        "Structural Engineer": ["STAAD Pro", "ETABS", "Structural Analysis", "AutoCAD", "Steel Design"],
        "Construction Manager": ["Project Management", "Primavera P6", "MS Project", "Contract Management", "Cost Estimation"],
        "Mechanical Engineer": ["SolidWorks", "AutoCAD", "Thermodynamics", "Manufacturing", "CAD/CAM", "Ansys"],
        "Financial Analyst": ["Financial Modeling", "Excel", "Valuation", "Accounting", "Data Analysis", "Bloomberg"],
        "Economist": ["Data Analysis", "Econometrics", "Stata", "R", "SAS", "Economic Research", "Statistics"],
        "Research Analyst": ["Research", "Data Analysis", "Report Writing", "Market Research", "SPSS", "Excel"],
        "Teaching Professional": ["Curriculum Development", "Public Speaking", "Communication", "Lesson Planning", "Mentoring"],
        "Data Analyst": ["SQL", "Excel", "Tableau", "Power BI", "Data Visualization", "Python", "Statistics"]
    }
    
    data = []
    
    # Generate balanced samples
    samples_per_role = num_samples // len(roles)
    
    for role in roles:
        for _ in range(samples_per_role):
            edu_info = role_to_edu[role]
            degree = random.choice(edu_info["degrees"])
            specialization = random.choice(edu_info["specializations"])
            
            # Skills
            num_skills = random.randint(3, 8)
            skills_pool = role_to_skills[role]
            skills = ", ".join(random.sample(skills_pool, min(num_skills, len(skills_pool))))
            
            # Academic scores
            academic_score = round(random.uniform(6.0, 9.8), 2) # Assume CGPA for synthetic
            marks_10th = round(random.uniform(60, 98), 1)
            marks_12th = round(random.uniform(60, 98), 1)
            
            experience = random.randint(0, 12)
            if degree in ["MBA", "M.Tech", "MCA", "M.Sc", "M.Com", "PhD"]:
                 experience = random.randint(1, 15)
                
            data.append({
                "degree": degree,
                "specialization": specialization,
                "academic_score": academic_score,
                "marks_10th": marks_10th,
                "marks_12th": marks_12th,
                "skills": skills,
                "experience_years": experience,
                "role": role
            })
        
    df = pd.DataFrame(data)
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/job_data.csv', index=False)
    return df

def train_job_model():
    print("Generating enriched academic-driven synthetic data...")
    df = generate_synthetic_data(5000) # Ensure enough data for balanced classes
    
    X = df[['degree', 'specialization', 'academic_score', 'marks_10th', 'marks_12th', 'skills', 'experience_years']]
    y = df['role']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Preprocessing
    categorical_features = ['degree', 'specialization']
    text_features = 'skills'
    numeric_features = ['academic_score', 'marks_10th', 'marks_12th', 'experience_years']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('text', CountVectorizer(binary=True), text_features)
        ])
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        # Using Gradient Boosting with optimized parameters to avoid overfitting and provide smoother probabilities
        ('classifier', GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=4, subsample=0.8, random_state=42))
    ])
    
    print("Training the Gradient Boosting model for higher precision...")
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.4f}")
    
    pipeline_dir = 'model_artifacts'
    os.makedirs(pipeline_dir, exist_ok=True)
    model_path = os.path.join(pipeline_dir, 'job_predictor.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == "__main__":
    train_job_model()
