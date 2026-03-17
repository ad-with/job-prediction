import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    login({ email, name: email.split('@')[0] || 'User', role: 'AI Career Pro' });
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo">
            <Sparkles className="text-cyan-400" size={32} />
          </div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your Edu2Job account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-field">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot?</a>
            </div>
            <div className="input-field">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn full-width-btn">
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
}
