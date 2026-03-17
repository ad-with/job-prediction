import { ArrowRight, BrainCircuit, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="text-cyan-400" />
            <span>AI-Powered Career Intelligence</span>
          </div>
          
          <h1 className="hero-title">
            Predict your <span className="text-gradient">future.</span><br />
            Accelerate your career.
          </h1>
          
          <p className="hero-description">
            Edu2Job uses advanced machine learning to analyze your education, skills, and real-time job market data to predict the most suitable career paths and guide you to success.
          </p>

          <div className="hero-actions">
            <button 
              className="btn primary-btn"
              onClick={() => navigate('/login')}
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button className="btn secondary-btn">
              View Demo
            </button>
          </div>

          <div className="feature-highlights">
            <div className="highlight">
              <BrainCircuit className="text-purple-400" />
              <span>Smart Role Prediction</span>
            </div>
            <div className="highlight">
              <Target className="text-cyan-400" />
              <span>Skill Gap Analysis</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="glass-panel mockup-card">
            <div className="mockup-header">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-chart"></div>
              <div className="mockup-stats">
                <div className="mockup-stat"></div>
                <div className="mockup-stat"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
