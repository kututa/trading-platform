import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar, { type DashRoute } from '../components/DashboardSidebar';
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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

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

        /* ── Sidebar ── */
        .dashboard-sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          z-index: 300;
          transition: transform 0.25s ease;
        }

        /* Desktop: always visible */
        @media (min-width: 769px) {
          .dashboard-sidebar { transform: translateX(0) !important; }
          .sidebar-overlay { display: none !important; }
          .dashboard-mobile-toggle { display: none !important; }
          .dash-main { margin-left: 220px !important; }
        }

        /* Mobile: slide in/out */
        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%); }
          .dashboard-sidebar.is-open { transform: translateX(0); }
          .dashboard-mobile-toggle { display: flex !important; }
          .dash-main { margin-left: 0 !important; }
          .dash-content {
            padding: 16px !important;
            padding-top: 60px !important; /* clear the toggle button */
          }
        }

        /* Overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          z-index: 298;
        }
        .sidebar-overlay.is-visible {
          display: block;
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

      {/* Overlay — behind sidebar, above main */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu toggle */}
      <button
        type="button"
        className="dashboard-mobile-toggle"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(v => !v)}
        style={l.mobileToggle}
      >
        {sidebarOpen ? (
          /* × icon when open */
          <>
            <span style={{ ...l.mobileToggleLine, transform: 'rotate(45deg) translate(5px, 5px)' }} />
            <span style={{ ...l.mobileToggleLine, opacity: 0 }} />
            <span style={{ ...l.mobileToggleLine, transform: 'rotate(-45deg) translate(5px, -5px)' }} />
          </>
        ) : (
          <>
            <span style={l.mobileToggleLine} />
            <span style={l.mobileToggleLine} />
            <span style={l.mobileToggleLine} />
          </>
        )}
      </button>

      {/* Main content */}
      <div className="dash-main" style={l.main}>
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
    marginLeft: '220px', // overridden to 0 on mobile via CSS
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
  mobileToggle: {
    position: 'fixed',
    top: '14px',
    left: '14px',
    zIndex: 360,
    display: 'none', // shown via CSS on mobile
    flexDirection: 'column',
    gap: '5px',
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
  },
  mobileToggleLine: {
    display: 'block',
    width: '20px',
    height: '2px',
    background: '#E2E8F0',
    borderRadius: '1px',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },
};

export default DashboardLayout;