import { Target, ArrowRight, Zap, CheckCircle2, AlertCircle, Wrench, Sparkles, Check, X, AlertTriangle, BookOpen } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { Link } from 'react-router-dom';
import { isSupportingTool, isOptionalSkill, OPTIONAL_SKILLS } from '../data/skillsData';
import './SkillGapAnalysis.css';

export default function SkillGapAnalysis() {
  const { predictionData } = usePrediction();

  if (!predictionData || !predictionData.missingSkills) {
    return (
      <div className="gap-container empty-state glass-panel">
        <Target size={48} className="text-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Career Data Found</h2>
        <p className="text-muted mb-6">Please use the Job Prediction module or Resume Analyzer first to generate your skill gap analysis.</p>
        <Link to="/job-prediction" className="action-btn">Go to Prediction</Link>
      </div>
    );
  }

  const { role, match, matchedSkills, missingSkills } = predictionData;

  const coreMissing = missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s));
  const toolsMissing = missingSkills.filter(s => isSupportingTool(s));
  const optionalMissing = missingSkills.filter(s => isOptionalSkill(s));

  const coreMatched = matchedSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s));
  const toolsMatched = matchedSkills.filter(s => isSupportingTool(s));

  // Determine top 5 recommended optional skills specific to this prediction, avoiding what they already have
  const recommendOptional = OPTIONAL_SKILLS.filter(s => !matchedSkills.includes(s)).slice(0, 5);

  return (
    <div className="gap-container">
      <header className="page-header">
        <h1 className="page-title">Skill Gap Analysis</h1>
        <p className="page-subtitle">Compare your current proficiency against industry requirements for <strong>{role}</strong>.</p>
      </header>

      <div className="gap-content">
        <div className="gap-main-panel glass-panel reveal">
          
          <div className="overall-match-section mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={22} className="text-indigo-600" /> Overall Role Readiness</h3>
            
            <div className="match-display-wrapper">
              <div className="match-progress-container mb-3">
                <div className="match-bar-bg">
                  <div 
                    className="match-bar-fill" 
                    style={{ width: `${match}%`, background: match > 75 ? 'linear-gradient(90deg, #f97316, #10b981)' : match > 40 ? 'linear-gradient(90deg, #f97316, #eab308)' : 'linear-gradient(90deg, #ef4444, #f97316)' }}
                  ></div>
                </div>
              </div>
              
              <div className="match-status-details flex justify-between items-center">
                <span className={`match-label font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${match > 75 ? 'bg-emerald-100 text-emerald-700' : match > 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  {match > 75 ? 'High Readiness' : match > 40 ? 'Intermediate Readiness' : 'Needs Improvement'}
                </span>
                <span className="match-percentage text-4xl" style={{ color: match > 75 ? '#10b981' : match > 40 ? '#f59e0b' : '#ef4444' }}>{match}%</span>
              </div>
            </div>

            <p className="mt-6 text-slate-600 font-medium text-sm leading-relaxed border-l-4 border-indigo-200 pl-4">
              You are strong in <strong>{coreMatched.length}</strong> core concepts. You need to improve on <strong>{coreMissing.length}</strong> core skills and <strong>{toolsMissing.length}</strong> supporting tools to be fully ready for <strong className="text-indigo-600">{role}</strong> positions.
            </p>
          </div>

          <div className="skill-section-cards grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Skills Card */}
            <div className="skill-section-card core-skills-card">
               <h4 className="section-title text-slate-800"><Target size={20} className="text-purple-600"/> Core Skills</h4>
               
               <div className="skill-group mb-6">
                 <p className="group-label text-emerald-600"><CheckCircle2 size={14}/> Acquired</p>
                 <div className="flex flex-wrap gap-2.5">
                   {coreMatched.length > 0 ? coreMatched.map(s => (
                     <span key={s} className="skill-chip acquired-chip">
                       <Check size={14} className="opacity-70" /> {s}
                     </span>
                   )) : <span className="empty-text">None yet</span>}
                 </div>
               </div>
               
               <div className="skill-group">
                 <p className="group-label text-rose-500"><AlertCircle size={14}/> Critical Missing</p>
                 <div className="flex flex-wrap gap-2.5">
                   {coreMissing.length > 0 ? coreMissing.map(s => (
                     <span key={s} className="skill-chip missing-chip">
                       <X size={14} className="opacity-70" /> {s}
                     </span>
                   )) : <span className="empty-text">You mastered all core mechanics!</span>}
                 </div>
               </div>
            </div>

            {/* Supporting Tools Card */}
            <div className="skill-section-card tools-card">
               <h4 className="section-title text-slate-800"><Wrench size={20} className="text-blue-500"/> Supporting Tools</h4>
               
               <div className="skill-group mb-6">
                 <p className="group-label text-emerald-600"><CheckCircle2 size={14}/> Acquired</p>
                 <div className="flex flex-wrap gap-2.5">
                   {toolsMatched.length > 0 ? toolsMatched.map(s => (
                     <span key={s} className="skill-chip acquired-chip">
                       <Check size={14} className="opacity-70" /> {s}
                     </span>
                   )) : <span className="empty-text">None yet</span>}
                 </div>
               </div>
               
               <div className="skill-group">
                 <p className="group-label text-blue-600"><AlertTriangle size={14}/> To Learn</p>
                 <div className="flex flex-wrap gap-2.5">
                   {toolsMissing.length > 0 ? toolsMissing.map(s => (
                     <span key={s} className="skill-chip tools-missing-chip">
                       <Wrench size={12} className="opacity-70" /> {s}
                     </span>
                   )) : <span className="empty-text">No further tools required.</span>}
                 </div>
               </div>
            </div>
          </div>

          {/* Optional Bonus Skills Card */}
          <div className="bonus-skills-card mt-8">
             <div className="bonus-header mb-4">
               <h4 className="flex items-center gap-2 font-bold text-amber-800 text-lg"><Sparkles size={20} className="text-amber-500"/> Bonus Skills (Optional)</h4>
               <span className="bonus-badge">High Value</span>
             </div>
             <p className="text-sm text-amber-900 border-l-2 border-amber-300 pl-3 mb-5 max-w-2xl font-medium">Mastering these optional skills will set you apart from other candidates and increase your prediction confidence:</p>
             <div className="flex flex-wrap gap-3">
               {recommendOptional.map(s => (
                 <span key={s} className="bonus-chip shadow-sm bg-white">
                   <Sparkles size={14} className="text-amber-500" /> {s}
                 </span>
               ))}
             </div>
          </div>

        </div>

        <div className="recommendations-sidebar">
          <div className="glass-panel action-plan-card reveal" style={{ animationDelay: '0.2s' }}>
            <div className="action-plan-header">
               <div className="action-icon-wrapper bg-indigo-100 text-indigo-600">
                 <Zap size={24} />
               </div>
               <h3>Your Action Plan</h3>
            </div>
            
            <div className="action-stats my-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="stat-row">
                <span className="stat-dot bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                <span className="stat-label">Core Skills to Learn:</span>
                <span className="stat-value text-rose-600">{coreMissing.length}</span>
              </div>
              <div className="stat-row mb-0">
                <span className="stat-dot bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span className="stat-label">Tools to Practice:</span>
                <span className="stat-value text-blue-600">{toolsMissing.length}</span>
              </div>
            </div>

            <p className="action-desc mb-8 text-slate-600 leading-relaxed text-sm">
              Closing this gap will significantly improve your employability for the <strong>{role}</strong> role. Start by targeting your missing mechanics through dedicated courses.
            </p>
            
            <Link to="/dashboard/courses" className="action-primary-btn group">
               View Recommended Courses
               <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
