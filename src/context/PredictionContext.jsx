import { createContext, useContext, useState, useEffect } from 'react';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [predictionData, setPredictionData] = useState(() => {
    const saved = localStorage.getItem('careerPrediction');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (predictionData) {
      localStorage.setItem('careerPrediction', JSON.stringify(predictionData));
    } else {
      localStorage.removeItem('careerPrediction');
    }
  }, [predictionData]);

  return (
    <PredictionContext.Provider value={{ predictionData, setPredictionData }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
