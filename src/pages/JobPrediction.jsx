import React, { useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { usePrediction } from '../context/PredictionContext';
import { getRequiredSkillsForRole } from '../data/skillsData';
import { DEGREES_DATA, getDegreeType, getSpecializations } from '../data/degreesData';
import { SPECIALIZATION_MAPPING, getSkillsBySpecialization, getInterestsBySpecialization } from '../data/specializationData';
import { Sparkles, CheckCircle2, ChevronRight, BrainCircuit, User, Briefcase, GraduationCap, Building2, Layers, ArrowLeft, Info, Trophy, Medal, Search, X, Target, TrendingUp, Compass, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import './JobPrediction.css';

const TECHNICAL_SKILLS = [
  'Python', 'Java', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'PHP', 'Ruby', 'Swift',
  'HTML5', 'CSS3', 'React', 'Angular', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'Node.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible',
  'Linux', 'Bash', 'Networking', 'System Architecture', 'System Design', 'API Design', 'Data Modeling',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy',
  'Scikit-learn', 'Statistics', 'Predictive Modeling', 'Mathematics', 'Jupyter', 'Git',
  'Data Structures', 'Algorithms', 'Object-Oriented Programming (OOP)', 'REST APIs', 'GraphQL',
  'AutoCAD', 'STAAD Pro', 'SolidWorks', 'MATLAB', 'MathCAD', 'Revit', 'ETABS', 'SAP2000',
  'Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Construction Management',
  'Site Supervision', 'Quality Control', 'Safety Management', 'Material Testing', 'Earthquake Engineering',
  'Mechanics of Materials', 'Surveying Instruments', 'Data structure and algorithm(DSA)',
  'Microservices', 'Design Patterns', 'Test-Driven Development (TDD)', 'WebSockets', 'Data Warehousing', 'ETL processes',
  'Cloud Architecture', 'Performance Optimization'
];

const NON_TECH_SKILLS = [
  'Communication', 'Marketing', 'Finance', 'Management', 'Sales', 'Accounting',
  'SEO', 'Content Strategy', 'Digital Marketing', 'Recruiting', 'Employee Relations',
  'Business Analysis', 'Public Speaking', 'Economic Research', 'Tally', 'GST',
  'Financial Modeling', 'Tableau', 'Power BI', 'Excel', 'Data Visualization', 'Data Cleaning',
  'Data Manipulation', 'Analytical Thinking', 'UX Research', 'Interaction Design', 'Wireframing',
  'Prototyping', 'User Testing', 'Information Architecture', 'Visual Design', 'Figma', 'Adobe XD', 'Sketch',
  'InVision', 'Zeplin', 'Miro', 'Product Strategy', 'Agile', 'Scrum', 'Requirements Gathering',
  'Market Research', 'Market Analysis', 'Leadership', 'Jira', 'Confluence', 'Trello', 'Google Analytics',
  'A/B Testing', 'User Stories', 'Project Planning', 'Cost Estimation', 'Resource Management',
  'Risk Management', 'Contract Negotiation', 'MS Project', 'Primavera P6', 'Procore',
  'Cost Accounting Software', 'User Personas', 'Journey Mapping', 'Accessibility Guidelines (WCAG)',
  'Stakeholder Management', 'Data-Driven Decision Making', 'Business Intelligence', 'Exploratory Data Analysis (EDA)'
];

const TECHNICAL_INTERESTS = [
  'Software Development', 'Machine Learning', 'Cloud Engineering', 'Data Science',
  'System Architecture', 'Cybersecurity', 'Web Development', 'Mobile App Development',
  'Game Design', 'IoT', 'Structural Design', 'Automotive Systems'
];

const NON_TECH_INTERESTS = [
  'Finance', 'Marketing', 'Human Resources', 'Business Analytics',
  'Accounting', 'Corporate Strategy', 'Sales Management', 'Public Relations',
  'Economic Research', 'Content Creation', 'Teaching', 'Operations Management'
];

const SUPPORTING_TOOLS = [
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'Postman', 'Figma', 'Power BI', 'Tableau', 'Jira', 'Confluence', 'Webpack', 'Vite',
  'npm', 'yarn', 'TensorFlow', 'PyTorch', 'Jenkins', 'Terraform', 'Ansible', 'AutoCAD',
  'Civil 3D', 'STAAD Pro', 'MS Project', 'Revit', 'ETABS', 'SAP2000', 'MongoDB', 'Redis'
];

const OPTIONAL_SKILLS = [
  'Deep Learning', 'NLP', 'System Design', 'CI/CD', 'Microservices', 'GraphQL',
  'WebSockets', 'Agile/Scrum', 'React Native', 'Flutter', 'Cloud Computing',
  'Machine Learning', 'Data Warehousing', 'ETL processes', 'A/B Testing'
];

export default function JobPrediction() {
  const { setPredictionData } = usePrediction();
  const [step, setStep] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Academic Fields (Step 1)
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [academicScore, setAcademicScore] = useState('');
  const [isCgpa, setIsCgpa] = useState(true);
  const [marks10th, setMarks10th] = useState('');
  const [marks12th, setMarks12th] = useState('');

  // Skills & Interests Fields (Step 2)
  const [selectedCoreSkills, setSelectedCoreSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedOptionalSkills, setSelectedOptionalSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [skillSearch, setSkillSearch] = useState('');
  const [toolSearch, setToolSearch] = useState('');
  const [optionalSearch, setOptionalSearch] = useState('');
  const [experience, setExperience] = useState('');
  const [projectsCount, setProjectsCount] = useState('');
  const [internshipsCount, setInternshipsCount] = useState('');
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const count = parseInt(projectsCount) || 0;
    setProjects(prev => {
      const newProjects = [...prev];
      if (count > newProjects.length) {
        for (let i = newProjects.length; i < count; i++) newProjects.push({ name: '', tech: '' });
      } else if (count < newProjects.length) {
        newProjects.length = count;
      }
      return newProjects;
    });
  }, [projectsCount]);

  useEffect(() => {
    const count = parseInt(internshipsCount) || 0;
    setInternships(prev => {
      const newInternships = [...prev];
      if (count > newInternships.length) {
        for (let i = newInternships.length; i < count; i++) newInternships.push({ company: '', role: '' });
      } else if (count < newInternships.length) {
        newInternships.length = count;
      }
      return newInternships;
    });
  }, [internshipsCount]);

  const toggleItem = (item, selected, setSelected) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(s => s !== item)
        : [...prev, item]
    );
  };

  const isStep1Valid = () => {
    return degree && specialization && academicScore && marks10th && marks12th;
  };

  const isStep2Valid = () => {
    return selectedCoreSkills.length >= 2 && selectedInterests.length >= 1;
  };

  const getEducationRoles = () => {
    const specInterests = getInterestsBySpecialization(specialization);
    if (specInterests.length > 0) {
      return specInterests.slice(0, 4);
    }

    if (degree === 'B.Tech / B.E' || degree === 'BCA' || degree === 'MCA' || degree === 'M.Tech') {
      return ['Software Developer', 'Data Scientist', 'Civil Engineer', 'System Architect'];
    } else if (degree === 'BBA' || degree === 'MBA') {
      return ['Business Analyst', 'Marketing Manager', 'Product Manager', 'HR Manager'];
    } else if (degree === 'B.Com' || degree === 'M.Com') {
      return ['Accountant', 'Financial Analyst', 'Tax Consultant', 'Auditor'];
    } else if (degree === 'B.Sc' || degree === 'M.Sc' || degree === 'BA' || degree === 'MA') {
      return ['Data Analyst', 'Researcher', 'Economist', 'Teaching Professional'];
    } else {
      return ['Subject Matter Expert', 'Operations Executive'];
    }
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!isStep2Valid()) return;

    setIsPredicting(true);
    setResult(null);
    setError(null);

    try {
      const allProjectTech = projects.flatMap(p => p.tech.split(',').map(s => s.trim())).filter(Boolean);
      const allInternshipRoles = internships.map(i => i.role).filter(Boolean);

      const payload = {
        degree,
        specialization,
        academic_score: parseFloat(academicScore),
        is_cgpa: isCgpa,
        marks_10th: parseFloat(marks10th),
        marks_12th: parseFloat(marks12th),
        skills: Array.from(new Set([...selectedCoreSkills, ...selectedTools, ...selectedOptionalSkills, ...selectedInterests, ...allProjectTech, ...allInternshipRoles])),
        experience_years: parseInt(experience, 10) || 0
      };

      const apiResponse = await aiService.predictJob(payload);

      if (!apiResponse || !apiResponse.predicted_role) {
        throw new Error("No prediction received from AI service.");
      }
      const predictions = apiResponse.predictions || [];
      const topRole = apiResponse.predicted_role;
      const requiredSkills = getRequiredSkillsForRole(topRole);
      const allUserSkills = [...selectedCoreSkills, ...selectedTools, ...selectedOptionalSkills, ...selectedInterests].map(s => s.toLowerCase());

      const matchedSkills = requiredSkills.filter(skill =>
        allUserSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill))
      );

      const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));

      const newResult = {
        role: topRole,
        confidence: apiResponse.confidence,
        predictions: predictions,
        explanation: apiResponse.explanation,
        match: Math.min(100, Math.floor((apiResponse.confidence + (requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 80)) / 2)),
        requiredSkills,
        matchedSkills,
        missingSkills,
        actions: [
          `Master advanced concepts in ${topRole}`,
          'Build a standout portfolio project',
          'Get certified in core technologies'
        ]
      };

      setResult(newResult);
      setPredictionData(newResult);
    } catch (error) {
      console.error("Prediction failed:", error);
      setError(error.message);
    } finally {
      setIsPredicting(false);
    }
  };

  const isTechDegree = getDegreeType(degree) === 'technical';
  const isTechSpec = ['Computer Science', 'Information Technology', 'Data Science', 'Artificial Intelligence', 'Software Engineering'].includes(specialization);

  const specSkills = getSkillsBySpecialization(specialization);
  const specInterests = getInterestsBySpecialization(specialization);

  let skillOptions = [];
  let interestOptions = [];

  if (isTechDegree || isTechSpec) {
    // For technical paths, combine specialization-specific skills/interests with the full technical lists
    skillOptions = Array.from(new Set([...specSkills, ...TECHNICAL_SKILLS]));
    interestOptions = Array.from(new Set([...specInterests, ...TECHNICAL_INTERESTS]));
  } else if (specSkills.length > 0) {
    // For specialized non-tech paths (Physics, Chemistry, etc.), show ONLY their specific options
    skillOptions = specSkills;
    interestOptions = specInterests;
  } else {
    // Fallback to standard non-technical lists
    skillOptions = NON_TECH_SKILLS;
    interestOptions = NON_TECH_INTERESTS;
  }

  return (
    <div className="prediction-container">
      <header className="page-header">
        <h1 className="page-title">AI Career Predictor</h1>
        <p className="page-subtitle">Personalized career pathing driven by your educational background.</p>
      </header>

      <div className="prediction-layout">
        <div className="form-card glass-panel">
          {/* Progress Indicator */}
          <div className="stepper">
            <div className="step-wrapper">
              <div className={`step-item ${step > 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
                {step > 1 ? <CheckCircle2 size={20} /> : '1'}
              </div>
              <span className="step-label">Academic</span>
            </div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className="step-wrapper">
              <div className={`step-item ${step > 2 || result ? 'completed' : ''} ${step === 2 && !result ? 'active' : ''}`}>
                {step > 2 || result ? <CheckCircle2 size={20} /> : '2'}
              </div>
              <span className="step-label">Experience</span>
            </div>
            <div className={`step-line ${result ? 'active' : ''}`}></div>
            <div className="step-wrapper">
              <div className={`step-item ${result ? 'completed active' : ''}`}>
                {result ? <CheckCircle2 size={20} /> : '3'}
              </div>
              <span className="step-label">Prediction</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="form-section reveal">
              <div className="form-section-title">Step 1: Academic Background</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Degree</label>
                  <select className="form-input" value={degree} onChange={(e) => { setDegree(e.target.value); setSpecialization(''); setSelectedCoreSkills([]); setSelectedTools([]); setSelectedOptionalSkills([]); setSelectedInterests([]); }} required>
                    <option value="" disabled>Select degree</option>
                    {DEGREES_DATA.map(d => (
                      <option key={d.degree} value={d.degree}>{d.degree}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <select className="form-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required disabled={!degree}>
                    <option value="" disabled>Select specialization</option>
                    {getSpecializations(degree).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <div className="label-with-toggle">
                    <label>{isCgpa ? 'CGPA' : 'Percentage'}</label>
                    <button type="button" className="toggle-mini" onClick={() => setIsCgpa(!isCgpa)}>
                      Switch to {isCgpa ? '%' : 'CGPA'}
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder={isCgpa ? "e.g. 9.5" : "e.g. 85"}
                    value={academicScore}
                    onChange={(e) => setAcademicScore(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>10th Marks (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 92"
                    value={marks10th}
                    onChange={(e) => setMarks10th(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>12th Marks (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 88"
                    value={marks12th}
                    onChange={(e) => setMarks12th(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isStep1Valid() && (
                <div className="education-preview reveal">
                  <div className="preview-title">
                    <Layers size={16} />
                    Potential Paths from your {degree}
                  </div>
                  <div className="path-tags">
                    {getEducationRoles().map(role => (
                      <span key={role} className="path-tag">{role}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="predict-btn"
                disabled={!isStep1Valid()}
                onClick={() => setStep(2)}
              >
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="form-section reveal">
              <button className="back-btn" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back to Academic Background
              </button>
              <div className="form-section-title">Step 2: Skills & Interests</div>

              {/* CORE SKILLS */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <div className="section-label-row">
                  <label>Core Skills <span className="text-muted">(Select at least 2)</span></label>
                  <span className="selection-badge">{selectedCoreSkills.length} Selected</span>
                </div>

                {/* Search Bar */}
                <div className="skill-search-wrapper">
                  <div className="skill-search-input-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      className="skill-search-input"
                      placeholder="Search core skills (e.g. Python, Physics)..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                    />
                    {skillSearch && <X className="clear-search" size={18} onClick={() => setSkillSearch('')} />}
                  </div>

                  {skillSearch && (
                    <div className="search-results-dropdown glass-panel">
                      {skillOptions
                        .filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedCoreSkills.includes(skill))
                        .slice(0, 10).map(skill => (
                          <div key={skill} className="search-result-item" onClick={() => { toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills); setSkillSearch(''); }}>
                            <Sparkles size={14} className="text-cyan-400" /><span>{skill}</span>
                          </div>
                      ))}
                      {skillOptions.filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedCoreSkills.includes(skill)).length === 0 && (
                        <div className="no-results">No matching skills found. Try another term.</div>
                      )}
                    </div>
                  )}
                </div>

                {selectedCoreSkills.length > 0 && (
                  <div className="selected-skills-badges">
                    <div className="badges-label">Selected Core Skills:</div>
                    <div className="badges-container">
                      {selectedCoreSkills.map(skill => (
                        <span key={skill} className="selected-badge">{skill} <X size={14} className="remove-badge" onClick={() => toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills)} /></span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="skills-chip-container">
                  {skillOptions.filter(skill => !skillSearch || skill.toLowerCase().includes(skillSearch.toLowerCase())).slice(0, skillSearch ? 40 : 20).map(skill => (
                    <button key={skill} type="button" className={`skill-chip ${selectedCoreSkills.includes(skill) ? 'selected' : ''}`} onClick={() => toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills)}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUPPORTING TOOLS */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <div className="section-label-row">
                  <label>Supporting Tools</label>
                  <span className="selection-badge">{selectedTools.length} Selected</span>
                </div>

                <div className="skill-search-wrapper">
                  <div className="skill-search-input-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      className="skill-search-input"
                      placeholder="Search tools (e.g. Docker, Figma)..."
                      value={toolSearch}
                      onChange={(e) => setToolSearch(e.target.value)}
                    />
                    {toolSearch && <X className="clear-search" size={18} onClick={() => setToolSearch('')} />}
                  </div>

                  {toolSearch && (
                    <div className="search-results-dropdown glass-panel">
                      {SUPPORTING_TOOLS
                        .filter(tool => tool.toLowerCase().includes(toolSearch.toLowerCase()) && !selectedTools.includes(tool))
                        .slice(0, 10).map(tool => (
                          <div key={tool} className="search-result-item" onClick={() => { toggleItem(tool, selectedTools, setSelectedTools); setToolSearch(''); }}>
                            <Sparkles size={14} className="text-cyan-400" /><span>{tool}</span>
                          </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTools.length > 0 && (
                  <div className="selected-skills-badges">
                    <div className="badges-label">Selected Tools:</div>
                    <div className="badges-container">
                      {selectedTools.map(tool => (
                        <span key={tool} className="selected-badge tool-badge" style={{ background: '#0284c7', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)' }}>{tool} <X size={14} className="remove-badge" onClick={() => toggleItem(tool, selectedTools, setSelectedTools)} /></span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="skills-chip-container">
                  {SUPPORTING_TOOLS.filter(tool => !toolSearch || tool.toLowerCase().includes(toolSearch.toLowerCase())).slice(0, 15).map(tool => (
                    <button key={tool} type="button" className={`skill-chip ${selectedTools.includes(tool) ? 'selected' : ''}`} style={selectedTools.includes(tool) ? { background: '#0284c7', borderColor: '#0284c7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' } : {}} onClick={() => toggleItem(tool, selectedTools, setSelectedTools)}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTIONAL SKILLS */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <div className="section-label-row">
                  <label>Optional Skills <span className="text-muted">(Bonus)</span></label>
                  <span className="selection-badge">{selectedOptionalSkills.length} Selected</span>
                </div>

                <div className="skill-search-wrapper">
                  <div className="skill-search-input-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      className="skill-search-input"
                      placeholder="Search optional skills (e.g. CI/CD, NLP)..."
                      value={optionalSearch}
                      onChange={(e) => setOptionalSearch(e.target.value)}
                    />
                    {optionalSearch && <X className="clear-search" size={18} onClick={() => setOptionalSearch('')} />}
                  </div>

                  {optionalSearch && (
                    <div className="search-results-dropdown glass-panel">
                      {OPTIONAL_SKILLS
                        .filter(skill => skill.toLowerCase().includes(optionalSearch.toLowerCase()) && !selectedOptionalSkills.includes(skill))
                        .slice(0, 10).map(skill => (
                          <div key={skill} className="search-result-item" onClick={() => { toggleItem(skill, selectedOptionalSkills, setSelectedOptionalSkills); setOptionalSearch(''); }}>
                            <Sparkles size={14} className="text-cyan-400" /><span>{skill}</span>
                          </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedOptionalSkills.length > 0 && (
                  <div className="selected-skills-badges">
                    <div className="badges-label">Optional Skills:</div>
                    <div className="badges-container">
                      {selectedOptionalSkills.map(skill => (
                        <span key={skill} className="selected-badge optional-badge" style={{ background: '#10b981', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}>{skill} <X size={14} className="remove-badge" onClick={() => toggleItem(skill, selectedOptionalSkills, setSelectedOptionalSkills)} /></span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="skills-chip-container">
                  {OPTIONAL_SKILLS.filter(skill => !optionalSearch || skill.toLowerCase().includes(optionalSearch.toLowerCase())).slice(0, 12).map(skill => (
                    <button key={skill} type="button" className={`skill-chip ${selectedOptionalSkills.includes(skill) ? 'selected' : ''}`} style={selectedOptionalSkills.includes(skill) ? { background: '#10b981', borderColor: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' } : {}} onClick={() => toggleItem(skill, selectedOptionalSkills, setSelectedOptionalSkills)}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Career Interests (Select at least 2)</label>
                <div className="skills-chip-container">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      className={`skill-chip interest-chip ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => toggleItem(interest, selectedInterests, setSelectedInterests)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section-title experience-title">Experience & Projects</div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input type="number" min="0" max="50" className="form-input" placeholder="e.g. 2" value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Number of Projects</label>
                  <input type="number" min="0" max="20" className="form-input" placeholder="e.g. 3" value={projectsCount} onChange={(e) => setProjectsCount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Number of Internships</label>
                  <input type="number" min="0" max="10" className="form-input" placeholder="e.g. 1" value={internshipsCount} onChange={(e) => setInternshipsCount(e.target.value)} />
                </div>
              </div>

              {projects.length > 0 && (
                <div className="dynamic-inputs-section reveal">
                  <h4 className="dynamic-section-title">Project Details</h4>
                  {projects.map((proj, idx) => (
                    <div className="form-grid" key={`proj-${idx}`}>
                      <div className="form-group">
                        <label>Project {idx + 1} Name</label>
                        <input type="text" className="form-input" placeholder="e.g. E-Commerce App" value={proj.name} onChange={(e) => {
                          const newP = [...projects];
                          newP[idx].name = e.target.value;
                          setProjects(newP);
                        }} />
                      </div>
                      <div className="form-group">
                        <label>Tech Used <span className="text-muted">(comma separated)</span></label>
                        <input type="text" className="form-input" placeholder="e.g. React, Node.js" value={proj.tech} onChange={(e) => {
                          const newP = [...projects];
                          newP[idx].tech = e.target.value;
                          setProjects(newP);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {internships.length > 0 && (
                <div className="dynamic-inputs-section reveal">
                  <h4 className="dynamic-section-title">Internship Details</h4>
                  {internships.map((int, idx) => (
                    <div className="form-grid" key={`int-${idx}`}>
                      <div className="form-group">
                        <label>Company {idx + 1}</label>
                        <input type="text" className="form-input" placeholder="e.g. Google" value={int.company} onChange={(e) => {
                          const newI = [...internships];
                          newI[idx].company = e.target.value;
                          setInternships(newI);
                        }} />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <input type="text" className="form-input" placeholder="e.g. Frontend Intern" value={int.role} onChange={(e) => {
                          const newI = [...internships];
                          newI[idx].role = e.target.value;
                          setInternships(newI);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`predict-btn ${isPredicting ? 'predicting' : ''}`}
                disabled={isPredicting || !isStep2Valid()}
                onClick={handlePredict}
              >
                {isPredicting ? (
                  <>
                    <BrainCircuit className="spin-icon" size={20} />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Predict Career Path
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="result-column">
          {result ? (
            <div className="result-card glass-panel reveal">
              <div className="result-header">
                <div className="ai-badge">
                  <Sparkles size={16} />
                  AI Prediction Result
                </div>
              </div>

              <div className="predicted-role-section">
                <h4 className="result-label">Top Recommended Career</h4>
                <h2 className="predicted-role text-gradient">{result.role}</h2>
                <div className="confidence-pill">{result.confidence}% Match</div>
              </div>

              {/* Top 3 Alternative Predictions */}
              {result.predictions && result.predictions.length > 1 && (
                <div className="alternative-roles">
                  <h4 className="alt-title">Other Strong Matches</h4>
                  <div className="alt-roles-list">
                    {result.predictions.slice(1).map((pred, i) => (
                      <div key={i} className="alt-role-item">
                        <div className="alt-role-info">
                          {i === 0 ? <Medal size={16} className="silver-medal" /> : <Medal size={16} className="bronze-medal" />}
                          <span className="alt-role-name">{pred.role}</span>
                        </div>
                        <div className="alt-role-score">
                          <div className="score-bar-bg">
                            <div className="score-bar-fill" style={{ width: `${pred.score}%` }}></div>
                          </div>
                          <span className="score-text-mini">{pred.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="explanation-section">
                <div className="explanation-bubble">
                  <Info size={16} className="explanation-icon" />
                  <div className="explanation-text">
                    {result.explanation.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="next-steps">
                <h4 className="next-steps-title">Recommended Next Steps</h4>
                <ul className="action-list">
                  {result.actions.map((action, i) => (
                    <li key={i}><CheckCircle2 size={16} className="text-cyan-400" /> {action}</li>
                  ))}
                </ul>
              </div>

              <div className="explore-insights-section mt-8 pt-6 border-t border-slate-100">
                <h4 className="explore-title text-center text-slate-800 font-bold mb-4">Explore More Insights</h4>
                <div className="insights-grid">
                  <Link to="/dashboard/skills" className="insight-card">
                    <div className="insight-icon bg-purple-100 text-purple-600"><Target size={20} /></div>
                    <div className="insight-info">
                      <h5>Skill Gap Analysis</h5>
                      <p>Identify missing skills & core tools</p>
                    </div>
                  </Link>

                  <Link to="/dashboard/trends" className="insight-card">
                    <div className="insight-icon bg-emerald-100 text-emerald-600"><TrendingUp size={20} /></div>
                    <div className="insight-info">
                      <h5>Job Market Trends</h5>
                      <p>View hiring demand & salaries</p>
                    </div>
                  </Link>

                  <Link to="/dashboard/roadmap" className="insight-card">
                    <div className="insight-icon bg-blue-100 text-blue-600"><Compass size={20} /></div>
                    <div className="insight-info">
                      <h5>Career Roadmap</h5>
                      <p>Generate a step-by-step timeline</p>
                    </div>
                  </Link>

                  <Link to="/dashboard/courses" className="insight-card">
                    <div className="insight-icon bg-amber-100 text-amber-600"><BookOpen size={20} /></div>
                    <div className="insight-info">
                      <h5>Recommended Courses</h5>
                      <p>Upskill with targeted learning</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="preview-panel glass-panel reveal">
              <div className="preview-header">
                <User size={24} className="text-cyan-400" />
                <h3>Live Profile Preview</h3>
              </div>
              <div className="preview-content">
                <div className="preview-item">
                  <span className="preview-label">Academic Path</span>
                  <div className="preview-value">
                    {degree ? <span className="highlight-text">{degree} {specialization && `in ${specialization}`}</span> : <span className="text-muted">Not selected yet</span>}
                  </div>
                </div>

                <div className="preview-item">
                  <span className="preview-label">Skills & Tools <span className="count-badge">{selectedCoreSkills.length + selectedTools.length + selectedOptionalSkills.length}</span></span>
                  <div className="preview-skills">
                    {(selectedCoreSkills.length > 0 || selectedTools.length > 0 || selectedOptionalSkills.length > 0) ? (
                      <>
                        {selectedCoreSkills.map(s => <span key={s} className="preview-micro-chip">{s}</span>)}
                        {selectedTools.map(s => <span key={s} className="preview-micro-chip" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.2)' }}>{s}</span>)}
                        {selectedOptionalSkills.map(s => <span key={s} className="preview-micro-chip" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{s}</span>)}
                      </>
                    ) : (
                      <span className="text-muted text-sm">No skills added</span>
                    )}
                  </div>
                </div>

                <div className="preview-item">
                  <span className="preview-label">Experience</span>
                  <div className="preview-value">
                    {experience > 0 ? <span className="highlight-text">{experience} Years</span> : <span className="text-muted">Fresher</span>}
                    {projectsCount > 0 && <span className="preview-stat">• {projectsCount} Projects</span>}
                    {internshipsCount > 0 && <span className="preview-stat">• {internshipsCount} Internships</span>}
                  </div>
                </div>

                <div className="preview-item">
                  <span className="preview-label">Career Interests <span className="count-badge">{selectedInterests.length}</span></span>
                  <div className="preview-interests">
                    {selectedInterests.length > 0 ? (
                      selectedInterests.map(i => <span key={i} className="preview-micro-chip interest">{i}</span>)
                    ) : (
                      <span className="text-muted text-sm">No interests added</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="preview-footer">
                {isPredicting ? (
                  <>
                    <Sparkles size={28} className="text-cyan-400 spin-icon" />
                    <p className="predicting-text">AI is analyzing your profile...</p>
                  </>
                ) : error ? (
                  <>
                    <Info size={28} className="text-red-400" />
                    <p className="error-text">Prediction Error: {error}</p>
                    <button className="retry-mini-btn" onClick={handlePredict}>Try Again</button>
                  </>
                ) : (
                  <>
                    <BrainCircuit size={28} className="text-purple-400 spin-slow" />
                    <p>AI is waiting for your complete input...</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
