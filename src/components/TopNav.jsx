import { Bell, Search, User, ChevronDown } from 'lucide-react';
import './TopNav.css';

export default function TopNav() {
  return (
    <header className="topnav glass-panel">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search reports, analytics..."
          className="search-input"
        />
      </div>

      <div className="nav-actions">
        <button className="icon-btn action-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">ADVITH</span>
            <span className="user-role">AI Career Pro</span>
          </div>
          <ChevronDown size={14} className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
}
