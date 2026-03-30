const API_BASE_URL = 'http://localhost:8000/api/v1';

export const aiService = {
  // Predictive AI
  async predictJob(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        let errorMsg = errData.detail || 'Failed to fetch prediction';
        if (Array.isArray(errData.detail)) {
          errorMsg = errData.detail.map((e) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ');
        }
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("predictJob API Error:", error);
      throw error;
    }
  },

  // Generative AI: Resume Analyzer
  async analyzeResume(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/genai/resume-analyzer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        let errorMsg = errData.detail || 'Failed to analyze resume';
        if (Array.isArray(errData.detail)) {
          errorMsg = errData.detail.map((e) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ');
        }
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("analyzeResume API Error:", error);
      throw error;
    }
  },

  // Generative AI: Resume NLP Extraction
  async extractResumeFeatures(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/genai/resume-extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        let errorMsg = errData.detail || 'Failed to extract resume features';
        if (Array.isArray(errData.detail)) {
          errorMsg = errData.detail.map((e) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ');
        }
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("extractResumeFeatures API Error:", error);
      throw error;
    }
  },

  // Generative AI: Career Roadmap
  async generateRoadmap(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/genai/career-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        let errorMsg = errData.detail || 'Failed to generate roadmap';
        if (Array.isArray(errData.detail)) {
          errorMsg = errData.detail.map((e) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ');
        }
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("generateRoadmap API Error:", error);
      throw error;
    }
  }
};
