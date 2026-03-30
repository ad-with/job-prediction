import { useState, useEffect } from 'react';
import { MapPin, ArrowDown, Briefcase, GraduationCap, Calendar, Compass, Rocket, Target, Brain, Wrench, Code, Award, CheckCircle2 } from 'lucide-react';
import { aiService } from '../services/api';
import { usePrediction } from '../context/PredictionContext';
import './CareerRoadmap.css';

export default function CareerRoadmap() {
  const { predictionData } = usePrediction();
  
  const initialCurrentRole = predictionData?.inputs?.currentRole || (predictionData?.inputs?.degree ? `${predictionData.inputs.degree} Student` : '');
  const initialTargetRole = predictionData?.role || '';
  const initialExperience = predictionData?.inputs?.experience > 0 ? 'Experienced' : 'Fresher';
  const missingSkills = predictionData?.missingSkills || [];

  const [currentRole, setCurrentRole] = useState(initialCurrentRole);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Optional: Auto-generate if all data is present
  // useEffect(() => {
  //   if (predictionData && currentRole && targetRole && !roadmap) {
  //     // We let the user click generate so they know what's happening
  //   }
  // }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!currentRole || !targetRole) {
      setErrorMsg("Please provide both current and target roles.");
      return;
    }
    setErrorMsg('');
    setIsGenerating(true);
    setRoadmap(null);
    
    try {
      const payload = {
        current_role: currentRole,
        target_role: targetRole,
        timeline_months: timelineMonths,
        missing_skills: missingSkills,
        experience_level: initialExperience
      };
      const response = await aiService.generateRoadmap(payload);
      setRoadmap({
        brief: response.brief_roadmap || [],
        detailed: response.detailed_roadmap || []
      });
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusClass = (idx, total) => {
    if (idx === 0) return 'current';
    if (idx === total - 1) return 'future target-node';
    return 'future ongoing-node';
  };

  return (
    <div className="roadmap-container">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
      <header className="page-header">
        <h1 className="page-title">Career Progression Roadmap</h1>
        <p className="page-subtitle">Generate a personalized step-by-step pathway powered by AI, tailored to your skill gaps.</p>
      </header>

      <div className="roadmap-layout">
        
        {/* Form Panel */}
        <div className="form-card glass-panel roadmap-form sticky-panel">
          <h3 className="panel-title">
            <Compass size={20} className="text-cyan-400"/> Map Your Path
          </h3>
          <form onSubmit={handleGenerate} className="roadmap-inputs">
            
            {predictionData && (
              <div className="auto-filled-badge">
                <Rocket size={14} /> Profile details automatically loaded from prediction
              </div>
            )}

            <div className="form-group">
              <label><GraduationCap size={16}/> Current Status / Role</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. CS Student, Junior Dev" 
                value={currentRole} 
                onChange={(e) => setCurrentRole(e.target.value)} 
                required
              />
            </div>
            
            <div className="form-group">
              <label><Briefcase size={16}/> Target Role</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. AI Architect" 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label><Calendar size={16}/> Timeline (Months)</label>
              <input 
                type="number" 
                min="1"
                max="60"
                className="form-input" 
                value={timelineMonths} 
                onChange={(e) => setTimelineMonths(parseInt(e.target.value) || 6)} 
                required
              />
            </div>

            {missingSkills.length > 0 && (
              <div className="missing-skills-preview">
                <span className="preview-label">Integrating Missing Skills:</span>
                <div className="preview-tags">
                  {missingSkills.slice(0, 3).map(s => <span key={s} className="min-tag">{s}</span>)}
                  {missingSkills.length > 3 && <span className="min-tag">+{missingSkills.length - 3} more</span>}
                </div>
              </div>
            )}

            {errorMsg && <div className="error-box">{errorMsg}</div>}

            <button 
              type="submit" 
              className={`predict-btn ${isGenerating ? 'predicting' : ''}`} 
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Roadmap...' : 'Generate Roadmap Planner'}
            </button>
          </form>
        </div>

        {/* Timeline Panel */}
        <div className="timeline-container">
          {!roadmap && !isGenerating && (
            <div className="empty-state glass-panel text-center">
              <Compass size={48} className="text-muted mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">Awaiting Input</h3>
              <p className="text-muted">Fill out your details to generate a strategic AI timeline.</p>
            </div>
          )}

          {isGenerating && (
            <div className="empty-state glass-panel text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-indigo-400 font-semibold">Consulting Career Strategist AI...</p>
            </div>
          )}

          {roadmap && !isGenerating && (
            <div className="timeline-wrapper reveal">
              <div className="brief-roadmap-panel premium-glass-panel mb-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <h3 className="flex items-center gap-2 font-extrabold text-slate-800 mb-6 border-b border-slate-100 pb-4 text-xl tracking-tight">
                  <Target size={22} className="text-blue-600" /> Executive Progression Strategy
                </h3>
                <ul className="progression-list space-y-4">
                  {roadmap.brief.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-15px leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0 text-indigo-500"><CheckCircle2 size={18} /></span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="timeline-line"></div>
              {roadmap.detailed.map((stage, index) => (
                <div key={index} className={`timeline-node ${getStatusClass(index, roadmap.detailed.length)}`} style={{animationDelay: `${index * 0.15}s`}}>
                  
                  <div className="timeline-indicator">
                    <div className="indicator-circle">
                      <MapPin size={20} />
                    </div>
                  </div>

                  <div className="timeline-card premium-card">
                    <div className="premium-card-header border-b border-slate-100 pb-5 mb-6">
                      <div className="flex justify-between items-start">
                        <span className="premium-level-badge">{stage.month_or_phase}</span>
                      </div>
                      <h3 className="role-title text-slate-800 mt-4 font-extrabold text-2xl tracking-tight">{stage.focus_area}</h3>
                    </div>

                    <div className="card-body flex flex-col gap-7">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stage.skills_to_learn && stage.skills_to_learn.length > 0 && (
                          <div className="roadmap-section bg-slate-50 border border-slate-100 p-5 rounded-xl">
                            <p className="section-label flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4">
                              <Brain size={16} /> Core Skills
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {stage.skills_to_learn.map((s, idx) => (
                                <span key={idx} className="premium-chip skill-chip">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {stage.tools_to_practice && stage.tools_to_practice.length > 0 && (
                          <div className="roadmap-section bg-slate-50 border border-slate-100 p-5 rounded-xl">
                            <p className="section-label flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                              <Wrench size={16} /> Tools & Platforms
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {stage.tools_to_practice.map((t, idx) => (
                                <span key={idx} className="premium-chip tool-chip">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {stage.projects_to_build && stage.projects_to_build.length > 0 && (
                        <div className="roadmap-section w-full pt-1">
                          <p className="section-label flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4">
                            <Code size={16} /> Projects to Build
                          </p>
                          <ul className="project-list flex flex-col gap-3">
                           {stage.projects_to_build.map((p, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-[15px] text-slate-600 font-semibold bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                               <Rocket size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /> 
                               <span>{p}</span>
                             </li>
                           ))}
                          </ul>
                        </div>
                      )}

                      {stage.certifications && stage.certifications.length > 0 && (
                        <div className="roadmap-section w-full pt-4 border-t border-slate-100">
                          <p className="section-label flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">
                            <Award size={16} /> Recommended Certifications
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                           {stage.certifications.map((c, idx) => (
                             <span key={idx} className="premium-chip cert-chip">
                               {c}
                             </span>
                           ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
