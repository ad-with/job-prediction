import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, BrainCircuit, User, Briefcase, GraduationCap, Building2, Layers } from 'lucide-react';
import './JobPrediction.css';

const SKILLS_LIST = [
  'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Kotlin',
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Tailwind CSS', 'Bootstrap',
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis',
  'AWS', 'Azure', 'Google Cloud',
  'Docker', 'Kubernetes', 'CI/CD', 'Jenkins',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Data Visualization', 'Pandas', 'NumPy', 'Scikit-learn',
  'Git', 'Linux', 'REST APIs', 'GraphQL'
];

const SPECIALIZATIONS = {
  default: ['Computer Science', 'Data Science', 'Artificial Intelligence', 'Information Technology', 'Electronics', 'Mechanical Engineering'],
  business: ['Business Administration', 'Finance', 'Marketing']
};

const INTERESTS_FRESHER = [
  'Software Development', 'Problem Solving', 'Data Analysis', 'Machine Learning',
  'Web Development', 'Team Collaboration', 'Project Management', 'System Design', 'Cloud Engineering'
];

const INTERESTS_EXPERIENCED = [
  'Technical Leadership', 'Product Development', 'System Architecture', 'Machine Learning',
  'Cloud Engineering', 'Engineering Management', 'Data Engineering'
];

const TASKS_LIST = [
  'Backend Development', 'Frontend Development', 'API Development', 'Data Analysis',
  'Machine Learning Model Development', 'Cloud Deployment', 'DevOps Automation'
];

export default function JobPrediction() {
  const [userType, setUserType] = useState('fresher'); // 'fresher' | 'experienced'
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);

  // Common Fields
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Fresher Specific
  const [cgpa, setCgpa] = useState('');
  const [hasProjects, setHasProjects] = useState('');
  const [hasInternship, setHasInternship] = useState('');
  const [internshipRole, setInternshipRole] = useState('');

  // Experienced Specific
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState(5);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyRole, setCompanyRole] = useState('');

  const toggleItem = (item, selected, setSelected) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(s => s !== item)
        : [...prev, item]
    );
  };

  const isFormValid = () => {
    const commonValid = degree && specialization && selectedSkills.length > 0 && selectedInterests.length >= 2;
    if (userType === 'fresher') {
      return commonValid && cgpa && hasProjects && hasInternship;
    } else {
      return commonValid && currentRole && industry && selectedTasks.length > 0 && companyName && companyRole;
    }
  };

  const handlePredict = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsPredicting(true);
    setResult(null);

    setTimeout(() => {
      setIsPredicting(false);
      setResult({
        role: userType === 'fresher' ? 'Junior AI Developer' : 'Senior Systems Architect',
        confidence: 94,
        match: 88,
        actions: userType === 'fresher'
          ? ['Master cloud deployment basics', 'Build a portfolio project with React', 'Practice system design fundamentals']
          : ['Focus on technical leadership skills', 'Deep dive into distributed systems', 'Obtain AWS Professional Architect cert']
      });
    }, 1500);
  };

  return (
    <div className="prediction-container">
      <header className="page-header">
        <h1 className="page-title">AI Career Predictor</h1>
        <p className="page-subtitle">Personalized career pathing for every stage of your professional journey.</p>
      </header>

      <div className="prediction-layout">
        <div className="form-card glass-panel">
          {/* Path Toggle */}
          <div className="path-toggle-container">
            <button
              className={`path-tab ${userType === 'fresher' ? 'active' : ''}`}
              onClick={() => setUserType('fresher')}
            >
              <GraduationCap size={18} />
              Fresher
            </button>
            <button
              className={`path-tab ${userType === 'experienced' ? 'active' : ''}`}
              onClick={() => setUserType('experienced')}
            >
              <Briefcase size={18} />
              Experienced
            </button>
          </div>

          <form onSubmit={handlePredict} className="prediction-form">
            {userType === 'fresher' ? (
              <>
                <div className="form-section-title">Academic Background</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>
                    <select className="form-input" value={degree} onChange={(e) => setDegree(e.target.value)} required>
                      <option value="" disabled>Select degree</option>
                      <option value="B.Tech">B.Tech / B.E</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MCA">MCA</option>
                      <option value="MBA">MBA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Specialization</label>
                    <select className="form-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
                      <option value="" disabled>Select specialization</option>
                      {(['BBA', 'MBA'].includes(degree) ? SPECIALIZATIONS.business : SPECIALIZATIONS.default).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      max="10"
                      min="0"
                      className="form-input"
                      placeholder="Enter your CGPA"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Projects & Internships</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <span>Worked on academic/personal projects?</span>
                      <div className="radio-inputs">
                        <label><input type="radio" value="yes" checked={hasProjects === 'yes'} onChange={(e) => setHasProjects(e.target.value)} /> Yes</label>
                        <label><input type="radio" value="no" checked={hasProjects === 'no'} onChange={(e) => setHasProjects(e.target.value)} /> No</label>
                      </div>
                    </div>
                    <div className="radio-option">
                      <span>Completed any internships?</span>
                      <div className="radio-inputs">
                        <label><input type="radio" value="yes" checked={hasInternship === 'yes'} onChange={(e) => setHasInternship(e.target.value)} /> Yes</label>
                        <label><input type="radio" value="no" checked={hasInternship === 'no'} onChange={(e) => setHasInternship(e.target.value)} /> No</label>
                      </div>
                    </div>
                  </div>
                  {hasInternship === 'yes' && (
                    <div className="sub-input-group reveal">
                      <label>Internship Role</label>
                      <input type="text" className="form-input" placeholder="e.g. Web Dev Intern" value={internshipRole} onChange={(e) => setInternshipRole(e.target.value)} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Education Level</label>
                  <div className="form-grid">
                    <select className="form-input" value={degree} onChange={(e) => setDegree(e.target.value)} required>
                      <option value="" disabled>Select degree</option>
                      <option value="Bachelors">Bachelor's Degree</option>
                      <option value="Masters">Master's Degree</option>
                      <option value="Diploma">Diploma</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MCA">MCA</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                    <select className="form-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
                      <option value="" disabled>Select specialization</option>
                      {SPECIALIZATIONS.default.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-section-title">Professional Experience</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Current or Previous Role</label>
                    <input type="text" className="form-input" placeholder="e.g. Software Engineer" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Industry</label>
                    <select className="form-input" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
                      <option value="" disabled>Select industry</option>
                      <option value="IT">IT / Software</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <div className="slider-header">
                    <label>Years of Experience</label>
                    <span className="slider-value">{experience} years</span>
                  </div>
                  <input type="range" min="0" max="15" value={experience} onChange={(e) => setExperience(e.target.value)} className="experience-slider" />
                </div>

                <div className="form-group">
                  <label>Engineering Tasks Performed</label>
                  <div className="skills-chip-container">
                    {TASKS_LIST.map(task => (
                      <button
                        key={task}
                        type="button"
                        className={`skill-chip ${selectedTasks.includes(task) ? 'selected' : ''}`}
                        onClick={() => toggleItem(task, selectedTasks, setSelectedTasks)}
                      >
                        {task}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Role in Company</label>
                    <input type="text" className="form-input" value={companyRole} onChange={(e) => setCompanyRole(e.target.value)} required />
                  </div>
                </div>


              </>
            )}

            {/* Skills (Common) */}
            <div className="form-group">
              <label>Technical Skills</label>
              <div className="skills-chip-container">
                {SKILLS_LIST.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleItem(skill, selectedSkills, setSelectedSkills)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests (Common with validation) */}
            <div className="form-group">
              <label>Career Interest / Soft Skills (Select at least 2)</label>
              <div className="skills-chip-container">
                {(userType === 'fresher' ? INTERESTS_FRESHER : INTERESTS_EXPERIENCED).map(interest => (
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
              {selectedInterests.length > 0 && selectedInterests.length < 2 && (
                <span className="validation-error">Please select at least 2 areas.</span>
              )}
            </div>

            <button
              type="submit"
              className={`predict-btn ${isPredicting ? 'predicting' : ''}`}
              disabled={isPredicting || !isFormValid()}
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
          </form>
        </div>

        {/* Results Panel */}
        <div className="result-column">
          {result ? (
            <div className="result-card glass-panel reveal">
              <div className="result-header">
                <div className="ai-badge">
                  <Sparkles size={16} />
                  AI Prediction
                </div>
              </div>

              <div className="predicted-role-section">
                <h4 className="result-label">Optimal Career Match</h4>
                <h2 className="predicted-role text-gradient">{result.role}</h2>
              </div>

              <div className="score-circles">
                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart cyan">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${result.confidence}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="score-text">
                    <span className="score-value">{result.confidence}%</span>
                    <span className="score-label">Confidence</span>
                  </div>
                </div>

                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart purple">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${result.match}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="score-text">
                    <span className="score-value">{result.match}%</span>
                    <span className="score-label">Skill Match</span>
                  </div>
                </div>
              </div>

              <div className="next-steps">
                <h4 className="next-steps-title">Recommended Actions</h4>
                <ul className="action-list">
                  {result.actions.map((action, i) => (
                    <li key={i}><CheckCircle2 size={16} className="text-cyan-400" /> {action}</li>
                  ))}
                </ul>
                <button className="roadmap-btn">
                  View Full Roadmap <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <BrainCircuit size={48} className="empty-icon text-muted" />
              <h3>Awaiting Input</h3>
              <p>Fill out your profile details on the left for a personalized {userType} career prediction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
