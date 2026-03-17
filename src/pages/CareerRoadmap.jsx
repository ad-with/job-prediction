import { MapPin, ArrowDown, ExternalLink } from 'lucide-react';
import './CareerRoadmap.css';

const ROADMAP_STAGES = [
  {
    level: 'Beginner',
    title: 'Data Analyst',
    timeline: '0-2 Years',
    skills: ['SQL', 'Excel', 'Tableau', 'Basic Python'],
    salary: '$60k - $85k',
    status: 'completed'
  },
  {
    level: 'Intermediate',
    title: 'Data Scientist',
    timeline: '2-4 Years',
    skills: ['Pandas', 'Scikit-Learn', 'Statistics', 'A/B Testing'],
    salary: '$95k - $140k',
    status: 'current'
  },
  {
    level: 'Advanced',
    title: 'Machine Learning Engineer',
    timeline: '4-7 Years',
    skills: ['Deep Learning', 'PyTorch', 'MLOps', 'AWS/GCP'],
    salary: '$140k - $200k',
    status: 'future'
  },
  {
    level: 'Expert',
    title: 'AI Architect',
    timeline: '7+ Years',
    skills: ['System Design', 'LLMs', 'AI Strategy', 'Leadership'],
    salary: '$200k+',
    status: 'future'
  }
];

export default function CareerRoadmap() {
  return (
    <div className="roadmap-container">
      <header className="page-header">
        <h1 className="page-title">Career Progression Roadmap</h1>
        <p className="page-subtitle">Your personalized pathway to becoming an AI Architect.</p>
      </header>

      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {ROADMAP_STAGES.map((stage, index) => (
          <div key={index} className={`timeline-node ${stage.status}`}>
            
            <div className="timeline-indicator">
              <div className="indicator-circle">
                <MapPin size={16} />
              </div>
              {index < ROADMAP_STAGES.length - 1 && (
                <div className="indicator-connector"><ArrowDown size={16} /></div>
              )}
            </div>

            <div className="timeline-card glass-panel">
              <div className="card-header">
                <div>
                  <span className={`level-badge ${stage.level.toLowerCase()}`}>{stage.level}</span>
                  <h3 className="role-title">{stage.title}</h3>
                </div>
                <div className="card-meta">
                  <span className="timeline-duration">{stage.timeline}</span>
                  <span className="role-salary">{stage.salary}</span>
                </div>
              </div>

              <div className="card-body">
                <p className="skills-heading">Key Competencies:</p>
                <div className="skills-tags">
                  {stage.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="roadmap-skill">{skill}</span>
                  ))}
                </div>
              </div>

              {stage.status === 'current' && (
                <div className="current-action">
                  <button className="focus-btn text-gradient">
                    View Recommended Courses <ExternalLink size={16} />
                  </button>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
