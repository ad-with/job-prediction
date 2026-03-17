import { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, Percent, X, AlertCircle } from 'lucide-react';
import './ResumeAnalyzer.css';

const MOCK_SKILLS = [
  { name: 'React', found: true },
  { name: 'JavaScript', found: true },
  { name: 'TypeScript', found: true },
  { name: 'Node.js', found: false, type: 'missing' },
  { name: 'CSS/SASS', found: true },
  { name: 'GraphQL', found: false, type: 'missing' }
];

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate AI parsing
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        score: 78,
        matchRole: 'Frontend Developer',
        skills: MOCK_SKILLS
      });
    }, 2000);
  };

  return (
    <div className="resume-container">
      <header className="page-header">
        <h1 className="page-title">Resume Analyzer AI</h1>
        <p className="page-subtitle">Upload your resume to extract skills and match against industry standard roles.</p>
      </header>

      <div className="resume-content">
        {/* Upload Zone */}
        <div className="upload-section">
          <div 
            className={`upload-zone glass-panel ${file ? 'has-file' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileInput}
            />
            
            {file ? (
              <div className="file-info">
                <FileType size={48} className="text-cyan-400" />
                <div className="file-details">
                  <h4 className="file-name">{file.name}</h4>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button 
                  className="remove-file-btn" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResults(null); }}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="upload-prompt">
                <UploadCloud size={64} className="upload-icon" />
                <h3>Drop your resume here</h3>
                <p>Supports PDF, DOCX (Max 5MB)</p>
                <button className="browse-btn">Browse Files</button>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="analyzing-overlay">
                <div className="scanner-line"></div>
                <span>Extracting entities and structuring data...</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="analysis-results">
          {results ? (
            <div className="results-grid reveal">
              <div className="score-card glass-panel">
                <div className="score-header">
                  <h3>Compatibility Score</h3>
                  <Percent className="text-cyan-400" />
                </div>
                <div className="score-display">
                  <span className="huge-score text-gradient">{results.score}</span>
                  <p>Matched with <strong>{results.matchRole}</strong></p>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${results.score}%` }}></div>
                </div>
              </div>

              <div className="skills-card glass-panel">
                <h3>Extracted Skills</h3>
                <div className="extracted-skills-container">
                  {results.skills.map((skill, index) => (
                    <div key={index} className={`skill-tag ${skill.found ? 'found' : 'missing'}`}>
                      {skill.found ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-results glass-panel">
              <UploadCloud size={48} className="text-muted" />
              <p>Upload a document to view AI extraction results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
