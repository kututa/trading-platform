import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar, { type DashRoute } from '../components/DashboardSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';

interface Props {
  children?: React.ReactNode;
  route?: DashRoute;
  onNavigate?: (r: DashRoute) => void;
  onLogout?: () => void;
}

const DashboardLayout: React.FC<Props> = ({ children, route, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const pathPart = location.pathname.split('/').filter(Boolean)[1];
  const derivedRoute: DashRoute =
    pathPart === 'markets' ||
    pathPart === 'trade' ||
    pathPart === 'deposit' ||
    pathPart === 'withdraw' ||
    pathPart === 'bots'
      ? pathPart
      : 'overview';

  const currentRoute = route ?? derivedRoute;

  const handleNavigate = onNavigate ?? ((r: DashRoute) => {
    navigate(r === 'overview' ? '/dashboard' : `/dashboard/${r}`);
  });

  const handleLogout = onLogout ?? (() => {
    logout();
    navigate('/login');
  });

  return (
    <div style={l.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body {
          background: #050A0E;
          color: #E2E8F0;
          font-family: 'Jost', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        input, select, button, textarea { font-family: 'Jost', sans-serif; }
        input::placeholder, textarea::placeholder { color: #2A3A4A; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0A0F14; }
        ::-webkit-scrollbar-thumb { background: #1A3A2A; border-radius: 4px; }

        /* Sidebar visible on desktop; slide-in on mobile */
        .dashboard-sidebar { transform: translateX(0) !important; }

        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%) !important; }
          .dashboard-sidebar.is-open { transform: translateX(0) !important; }
          .sidebar-overlay { display: block !important; }
          .dash-main { margin-left: 0 !important; }
          .dash-content { padding: 14px !important; }
        }

        @media (min-width: 769px) {
          .dashboard-sidebar { transform: translateX(0) !important; }
          .sidebar-overlay   { display: none !important; }
        }
      `}</style>

      {/* Sidebar */}
      <DashboardSidebar
        route={currentRoute}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay behind sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.72)',
            zIndex: 298,
            display: 'none', // toggled by CSS class
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="dash-main" style={l.main}>
        <DashboardNavbar
          route={currentRoute}
          onMenuToggle={() => setSidebarOpen(v => !v)}
          onNavigate={handleNavigate}
        />
        <main className="dash-content" style={l.content}>
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

const l: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#050A0E',
    fontFamily: "'Jost', sans-serif",
  },
  main: {
    flex: 1,
    marginLeft: '220px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: 0,
  },
  content: {
    padding: '24px',
    flex: 1,
    overflowX: 'hidden',
  },
};

export default DashboardLayout;