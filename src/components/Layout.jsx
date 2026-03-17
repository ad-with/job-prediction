import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
