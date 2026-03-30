import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import JobPrediction from './pages/JobPrediction'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import JobMarketTrends from './pages/JobMarketTrends'
import CareerRoadmap from './pages/CareerRoadmap'
import Courses from './pages/Courses'
import Home from './pages/Home'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PredictionProvider } from './context/PredictionContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes with Sidebar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Standalone Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes (Simulated) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PredictionProvider>
                <Layout />
              </PredictionProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<JobPrediction />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="skills" element={<SkillGapAnalysis />} />
          <Route path="trends" element={<JobMarketTrends />} />
          <Route path="roadmap" element={<CareerRoadmap />} />
          <Route path="courses" element={<Courses />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
