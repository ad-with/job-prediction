import spacy
from spacy.matcher import PhraseMatcher
import re

# Use a global dictionary of skills
SKILLS_LIST = [
    # Programming Languages
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "R",
    # Web & Frontend
    "HTML", "CSS", "React", "Vue", "Angular", "Next.js", "Tailwind", "Bootstrap", "Redux", "SASS",
    # Backend & Frameworks
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", ".NET", "GraphQL", "REST APIs",
    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB", "Firebase",
    # Cloud & DevOps
    "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Linux", "Bash", "Shell Scripting",
    # Data Science & ML
    "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Keras", "NLP", "Computer Vision",
    # Theory & Tools
    "Algorithms", "Data Structures", "System Design", "Git", "GitHub", "Agile", "Scrum", "Jira",
    # Design & Marketing
    "Figma", "UI/UX", "Wireframing", "Prototyping", "Adobe XD", "Sketch", "SEO", "Digital Marketing", "Content Strategy", "Google Analytics",
    # Management
    "Product Management", "Roadmapping", "Stakeholder Management", "Recruiting", "Employee Relations", "Onboarding"
]

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # Fallback if model not installed yet, though it should be handled in environment
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
            
        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        # Initialize phrase matcher with our skill list
        skill_patterns = [self.nlp.make_doc(skill) for skill in SKILLS_LIST]
        self.matcher.add("SKILLS", skill_patterns)

    def clean_text(self, text: str) -> str:
        # Standardize whitespace and remove overly complex special characters
        # But keep alphanumeric, basic punctuation like ., +, # (for C#, C++, Node.js)
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'[^a-zA-Z0-9\s\.\+\#\-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_skills(self, doc) -> list:
        # Use SpaCy PhraseMatcher for exact/partial case-insensitive match
        matches = self.matcher(doc)
        extracted = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            # Map back to exactly how it looks in SKILLS_LIST for consistency
            matched_text = span.text.lower()
            for true_skill in SKILLS_LIST:
                if true_skill.lower() == matched_text:
                    extracted.add(true_skill)
                    break
        return list(extracted)

    def extract_education(self, text: str) -> str:
        text_lower = text.lower()
        if re.search(r'\b(phd|doctorate|doctor of philosophy)\b', text_lower):
            return "PhD"
        if re.search(r'\b(master|masters|m\.sc|m\.tech|mba|mca)\b', text_lower):
            return "Masters"
        if re.search(r'\b(bachelor|bachelors|b\.sc|b\.tech|bca|b\.e)\b', text_lower):
            return "Bachelors"
        if re.search(r'\b(diploma|associate)\b', text_lower):
            return "Diploma"
        return "Bachelors" # Default assumption if nothing is found and applying for tech jobs

    def extract_experience(self, text: str, doc) -> int:
        # Regex heuristics for "X years"
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*of\s*experience',
            r'experience\s*:\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*yrs\s*exp'
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, text.lower())
            if match:
                try:
                    return int(match.group(1))
                except:
                    pass
        
        # Determine based on dates (very rough heuristic: count number of DATE entities as proxy for roles)
        # Or look for "fresher", "entry level"
        if re.search(r'\b(fresher|entry level|junior|intern|internship)\b', text.lower()) and not re.search(r'senior|lead|manager', text.lower()):
            return 0
            
        return 2 # Safe fallback

    def parse(self, text: str) -> dict:
        cleaned_text = self.clean_text(text)
        doc = self.nlp(cleaned_text)
        
        skills = self.extract_skills(doc)
        education = self.extract_education(cleaned_text)
        experience_years = self.extract_experience(cleaned_text, doc)
        
        return {
            "skills": skills,
            "education": education,
            "experience_years": experience_years
        }

# Singleton instance
resume_parser = ResumeParser()

def extract_resume_features_spacy(resume_text: str) -> dict:
    """Entry point for the backend logic"""
    return resume_parser.parse(resume_text)
