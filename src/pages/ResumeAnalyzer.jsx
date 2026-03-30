import { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, Percent, X, AlertCircle, Type, Briefcase, GraduationCap, Clock, Sparkles, User, BrainCircuit } from 'lucide-react';
import { aiService } from '../services/api';
import { usePrediction } from '../context/PredictionContext';
import { getRequiredSkillsForRole, isSupportingTool, isOptionalSkill, OPTIONAL_SKILLS } from '../data/skillsData';
import { Link } from 'react-router-dom';
import './ResumeAnalyzer.css';

export default function ResumeAnalyzer() {
  const { setPredictionData } = usePrediction();
  const [inputType, setInputType] = useState('text'); // 'text' | 'upload'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== "text/plain" && !selectedFile.name.endsWith('.txt')) {
       setErrorMsg("Please upload a .txt file or use the Paste Text option for accurate parsing.");
       return;
    }
    setErrorMsg('');
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setResumeText(e.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const analyze = async () => {
    if (!resumeText.trim()) {
      setErrorMsg("Please provide resume text.");
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      // Step 1: Extract Features using NLP
      const extraction = await aiService.extractResumeFeatures({ resume_text: resumeText });
      const extractedSkills = extraction.skills || [];
      const extractedEdu = extraction.education || 'Unknown';
      const extractedExp = extraction.experience_years || 0;

      // Step 2: Predict Job Role using ML Model
      const mlPayload = {
        degree: extractedEdu,
        specialization: "Computer Science", // Fallback required parameter
        academic_score: 8.0, // Fallback required parameter
        is_cgpa: true,
        marks_10th: 80.0,
        marks_12th: 80.0,
        skills: extractedSkills.join(', '),
        experience_years: extractedExp
      };
      
      const predictionResponse = await aiService.predictJob(mlPayload);
      const predictedRole = predictionResponse.predicted_role;
      const modelConfidence = predictionResponse.confidence;

      // Step 3: Compute Skill Gap
      const requiredSkills = getRequiredSkillsForRole(predictedRole);
      const allUserSkills = extractedSkills.map(s => s.toLowerCase());
      
      const matchedSkills = requiredSkills.filter(skill => 
        allUserSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill))
      );
      
      const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));
      
      const skillMatchPercent = requiredSkills.length > 0 
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
        : 0;
        
      const finalMatch = Math.min(100, Math.floor((modelConfidence + skillMatchPercent) / 2));

      // Update Global Context
      const newPredictionContext = {
        role: predictedRole,
        confidence: modelConfidence,
        match: finalMatch,
        requiredSkills,
        matchedSkills,
        missingSkills,
        inputs: {
          degree: extractedEdu,
          experience: extractedExp,
          selectedSkills: extractedSkills,
        }
      };
      setPredictionData(newPredictionContext);

      // Set Local State for UI
      setResults({
        education: extractedEdu,
        experience: extractedExp,
        extractedSkills,
        role: predictedRole,
        confidence: modelConfidence,
        matchScore: finalMatch,
        missingSkills,
        matchedSkills,
        predictions: predictionResponse.predictions || []
      });

    } catch (err) {
      setErrorMsg(err.message || "Failed to analyze resume.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="resume-container">
      <header className="page-header">
        <h1 className="page-title">Resume AI Analyzer</h1>
        <p className="page-subtitle">Upload your resume. Our AI extracts your profile, predicts your optimal role, and calculates skill gaps.</p>
      </header>

      <div className="resume-layout">
        
        {/* Upload & Input Panel */}
        <div className="form-card glass-panel sticky-panel">
          <div className="input-toggle">
            <button className={`path-tab ${inputType === 'text' ? 'active' : ''}`} onClick={() => setInputType('text')}>
              <Type size={16} className="inline-icon"/> Paste Text
            </button>
            <button className={`path-tab ${inputType === 'upload' ? 'active' : ''}`} onClick={() => setInputType('upload')}>
              <UploadCloud size={16} className="inline-icon"/> Upload .TXT
            </button>
          </div>

          {inputType === 'text' ? (
            <div className="textarea-container">
              <textarea 
                className="resume-textarea" 
                placeholder="Paste your unformatted resume content here for AI processing..." 
                value={resumeText} 
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          ) : (
            <div 
              className={`upload-zone ${file ? 'has-file' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt" 
                onChange={handleFileInput}
              />
              
              {file ? (
                <div className="file-info">
                  <FileType size={48} className="text-cyan-500 mb-2" />
                  <div className="file-details">
                    <h4 className="file-name">{file.name}</h4>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button 
                    className="remove-file-btn" 
                    onClick={(e) => { e.stopPropagation(); setFile(null); setResumeText(''); setResults(null); }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <UploadCloud size={54} className="upload-icon mb-4 text-slate-400" />
                  <h3 className="font-bold text-slate-700 mb-1">Drop your .txt resume here</h3>
                  <p className="text-sm text-slate-500">Supports plain text files (Max 5MB)</p>
                  <button className="browse-btn mt-4">Browse Files</button>
                </div>
              )}
            </div>
          )}

          {errorMsg && <div className="error-box mt-4">{errorMsg}</div>}

          <button 
            onClick={analyze} 
            className={`analyze-btn mt-4 ${isAnalyzing ? 'predicting' : ''}`} 
            disabled={isAnalyzing || !resumeText}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2 justify-center"><div className="spinner-small" /> Analyzing Physics & Data...</span>
            ) : (
              <span className="flex items-center gap-2 justify-center"><Sparkles size={18} /> Deep Analyze Resume</span>
            )}
          </button>
        </div>

        {/* Results Dashboard */}
        <div className="results-container">
          {results ? (
            <div className="results-wrapper reveal">
              
              {/* Row 1: Extracted Data & Prediction */}
              <div className="results-grid">
                
                {/* Extracted Profile */}
                <div className="result-card glass-panel profile-card">
                  <h3 className="card-heading border-b pb-3 mb-4"><User className="inline-icon text-indigo-500" size={18} /> Extracted NLP Profile</h3>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="tag-badge bg-indigo-50 text-indigo-700 border-indigo-200">
                      <GraduationCap size={16} /> {results.education}
                    </div>
                    <div className="tag-badge bg-indigo-50 text-indigo-700 border-indigo-200">
                      <Clock size={16} /> {results.experience} Years Exp
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-500 mb-2">IDENTIFIED SKILLS:</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedSkills.length > 0 ? results.extractedSkills.map((s, i) => (
                      <span key={i} className="skill-pill neutral">{s}</span>
                    )) : <span className="text-sm italic text-slate-400">No technical skills detected.</span>}
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="result-card glass-panel prediction-card">
                   <h3 className="card-heading border-b pb-3 mb-4"><BrainCircuit className="inline-icon text-cyan-500" size={18} /> AI Career Predictions</h3>
                   
                   <p className="text-sm font-bold text-slate-500 mb-3">TOP MATCHED ROLES:</p>
                   
                   <div className="predictions-list">
                     {results.predictions && results.predictions.map((pred, idx) => (
                       <div key={idx} className={`prediction-item ${idx === 0 ? 'top-match' : ''}`}>
                         <div className="flex justify-between items-center mb-1">
                           <span className="pred-role-name font-bold text-slate-700">{pred.role}</span>
                           <span className={`pred-score font-extrabold ${idx === 0 ? 'text-cyan-600' : 'text-slate-500'}`}>{pred.score}%</span>
                         </div>
                         <div className="progress-bar-bg bg-slate-100 rounded-full h-2 w-full overflow-hidden">
                           <div className={`progress-bar-fill h-full rounded-full ${idx === 0 ? 'bg-cyan-500' : 'bg-slate-300'}`} style={{ width: `${pred.score}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-slate-200">
                     <p className="text-sm text-slate-500">Skill Gap Analysis is based on your #1 match: <span className="font-bold text-cyan-600">{results.role}</span>.</p>
                   </div>
                </div>

              </div>

              {/* Row 2: Skill Gap Analysis */}
              <div className="result-card glass-panel mt-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 className="card-heading m-0"><AlertCircle className="inline-icon text-rose-500" size={18} /> Skill Gap Analysis</h3>
                  <Link to="/skill-gap" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View Detailed Analysis &rarr;</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 tracking-wide">MISSING CORE SKILLS:</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s)).length > 0 ? results.missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s)).map((s, i) => (
                        <span key={`core-${i}`} className="skill-pill missing">{s}</span>
                      )) : <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle size={16} /> All core skills found!</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 tracking-wide">MISSING SUPPORTING TOOLS:</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.filter(s => isSupportingTool(s)).length > 0 ? results.missingSkills.filter(s => isSupportingTool(s)).map((s, i) => (
                        <span key={`tool-${i}`} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-sm border border-blue-200 font-medium">{s}</span>
                      )) : <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle size={16} /> All tools found!</span>}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-emerald-600 mb-2 tracking-wide">RECOMMENDED OPTIONAL EXTRAS:</h4>
                  <div className="flex flex-wrap gap-2">
                    {OPTIONAL_SKILLS.filter(s => !results.extractedSkills.map(es => es.toLowerCase()).includes(s.toLowerCase())).slice(0, 4).map((s, i) => (
                      <span key={`opt-${i}`} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs border border-emerald-200 font-bold">{s}</span>
                    ))}
                  </div>
                </div>

                {results.missingSkills.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">RECOMMENDED ACTION:</h4>
                    <p className="text-sm text-slate-600 mb-3">Your resume lacks {results.missingSkills.length} total requirements for {results.role} roles. We recommend updating your resume layout and upskilling immediately to improve your ATS score.</p>
                    <div className="flex gap-4">
                       <Link to="/courses" className="action-link text-cyan-600">Find Courses</Link>
                       <Link to="/roadmap" className="action-link text-indigo-600">Generate Timeline</Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="empty-results glass-panel">
              <FileType size={64} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Ready for Extraction</h3>
              <p className="text-slate-500 text-center max-w-sm">Provide your resume text on the left to activate the AI. We'll extract your unstructured data into a structured career profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
