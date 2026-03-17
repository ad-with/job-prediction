import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Target, 
  TrendingUp, 
  Map, 
  GraduationCap, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/prediction', name: 'Job Prediction', icon: Briefcase },
  { path: '/dashboard/resume', name: 'Resume Analyzer', icon: FileText },
  { path: '/dashboard/skills', name: 'Skill Gap Analysis', icon: Target },
  { path: '/dashboard/trends', name: 'Job Market Trends', icon: TrendingUp },
  { path: '/dashboard/roadmap', name: 'Career Roadmap', icon: Map },
  { path: '/dashboard/courses', name: 'Courses', icon: GraduationCap },
  { path: '/dashboard/settings', name: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <BrainCircuit className="logo-icon text-gradient" size={28} />
          {!collapsed && <span className="logo-text text-gradient">Edu2Job</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon size={20} className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.name}</span>}
            </NavLink>
          );
        })}
        {user && (
          <div className="nav-item" onClick={logout} style={{ cursor: 'pointer', marginTop: 'auto' }}>
            <LogOut size={20} className="nav-icon text-gray-500" />
            {!collapsed && <span className="nav-label">Logout</span>}
          </div>
        )}
      </nav>
    </aside>
  );
}
