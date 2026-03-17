import { Target, ArrowRight, Zap } from 'lucide-react';
import './SkillGapAnalysis.css';

const SKILL_GAPS = [
  { skill: 'Docker', current: 20, required: 80, importance: 'High' },
  { skill: 'Kubernetes', current: 10, required: 70, importance: 'High' },
  { skill: 'CI/CD Pipelines', current: 40, required: 85, importance: 'Medium' },
  { skill: 'Cloud Architecture', current: 50, required: 90, importance: 'Critical' },
];

export default function SkillGapAnalysis() {
  return (
    <div className="gap-container">
      <header className="page-header">
        <h1 className="page-title">Skill Gap Analysis</h1>
        <p className="page-subtitle">Compare your current proficiency against industry requirements for "Cloud Architect".</p>
      </header>

      <div className="gap-content">
        <div className="gap-list glass-panel">
          <div className="gap-list-header">
            <h3>Proficiency Delta</h3>
            <span className="badge">Target: Cloud Architect</span>
          </div>

          <div className="gap-items">
            {SKILL_GAPS.map((item, idx) => (
              <div key={idx} className="gap-item">
                <div className="gap-item-info">
                  <span className="gap-skill-name">{item.skill}</span>
                  <span className={`gap-importance ${item.importance.toLowerCase()}`}>
                    {item.importance} Priority
                  </span>
                </div>
                
                <div className="gap-bars">
                  <div className="bar-wrapper">
                    <span className="bar-label">Current ({item.current}%)</span>
                    <div className="bar-bg">
                      <div className="bar-fill current" style={{ width: `${item.current}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bar-wrapper">
                    <span className="bar-label">Required ({item.required}%)</span>
                    <div className="bar-bg">
                      <div className="bar-fill target" style={{ width: `${item.required}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-sidebar">
          <div className="glass-panel recommendation-card">
            <div className="rec-header">
              <Zap className="text-accent-purple" size={24} />
              <h3>Action Plan</h3>
            </div>
            <p className="rec-desc">To bridge the <strong>Cloud Architecture</strong> gap, we recommend the following learning path:</p>
            
            <ul className="rec-list">
              <li>
                <div className="rec-step">1</div>
                <div className="rec-detail">
                  <h4>AWS Certified Solutions Architect</h4>
                  <a href="#">View Course <ArrowRight size={14} /></a>
                </div>
              </li>
              <li>
                <div className="rec-step">2</div>
                <div className="rec-detail">
                  <h4>Docker & Kubernetes Mastery</h4>
                  <a href="#">View Course <ArrowRight size={14} /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
