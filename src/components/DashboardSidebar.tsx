import React from 'react';
import { useUser } from '../context/UserContext';

export type DashRoute = 'overview' | 'markets' | 'trade' | 'deposit' | 'withdraw' | 'bots';

interface Props {
  route: DashRoute;
  onNavigate: (r: DashRoute) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV: { id: DashRoute; label: string; icon: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: '▦' },
  { id: 'markets',  label: 'Markets',   icon: '◈' },
  { id: 'trade',    label: 'Trade',     icon: '⇅' },
  { id: 'deposit',  label: 'Deposit',   icon: '↓' },
  { id: 'withdraw', label: 'Withdraw',  icon: '↑' },
  { id: 'bots',     label: 'Bots',      icon: '⚙' },
];

const DashboardSidebar: React.FC<Props> = ({ route, onNavigate, onLogout, isOpen, onClose }) => {
  const { user } = useUser();

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 299,
          }}
          className="sidebar-overlay"
        />
      )}

      <aside
        className="dashboard-sidebar"
        style={{
          width: '220px',
          minWidth: '220px',
          background: '#0D1117',
          borderRight: '1px solid #1A2332',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0 20px',
          position: 'fixed' as const,
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 300,
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoMark}>H</div>
          <div>
            <div style={s.logoName}>Vantrex</div>
            <div style={s.logoSub}>Markets</div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={s.nav}>
          <div style={s.navSection}>MENU</div>
          {NAV.map(item => {
            const active = route === item.id;
            return (
              <button
                key={item.id}
                style={{
                  ...s.navItem,
                  ...(active ? s.navItemActive : {}),
                }}
                onClick={() => { onNavigate(item.id); onClose(); }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ ...s.navIcon, ...(active ? { color: '#00FF88' } : {}) }}>
                  {item.icon}
                </span>
                <span style={s.navLabel}>{item.label}</span>
                {active && <span style={s.activeBar} />}
              </button>
            );
          })}
        </nav>

        <div style={s.spacer} />

        {/* User card */}
        <div style={s.userCard}>
          <div style={s.avatar}>{user.name[0]}</div>
          <div style={{ minWidth: 0 }}>
            <div style={s.userName}>{user.name}</div>
            <div style={s.userEmail}>{user.email}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          style={s.logoutBtn}
          onClick={onLogout}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF4444')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2332')}
        >
          <span>⇤</span> Sign Out
        </button>
      </aside>
    </>
  );
};

const s: Record<string, React.CSSProperties> = {
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '20px 20px 18px',
    borderBottom: '1px solid #1A2332',
    marginBottom: '8px',
  },
  logoMark: {
    width: '34px', height: '34px',
    background: 'linear-gradient(135deg,#00FF88,#00CC6A)',
    borderRadius: '9px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: 700, color: '#050A0E', flexShrink: 0,
  },
  logoName: { fontSize: '15px', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.1 },
  logoSub:  { fontSize: '10px', color: '#3A5A4A', letterSpacing: '0.12em', textTransform: 'uppercase' as const },
  nav:      { display: 'flex', flexDirection: 'column', padding: '0 10px', gap: '2px' },
  navSection: {
    fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em',
    color: '#2A3A4A', textTransform: 'uppercase' as const,
    padding: '10px 10px 6px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '11px',
    padding: '10px 12px',
    borderRadius: '10px', border: 'none', background: 'transparent',
    color: '#5A7A8A', fontSize: '13px', fontWeight: 500,
    cursor: 'pointer', textAlign: 'left' as const,
    position: 'relative' as const,
    transition: 'background 0.15s',
    letterSpacing: '0.02em',
    width: '100%',
  },
  navItemActive: {
    background: 'rgba(0,255,136,0.08)',
    color: '#00FF88',
  },
  navIcon:  { fontSize: '15px', width: '18px', textAlign: 'center' as const, flexShrink: 0 },
  navLabel: { flex: 1 },
  activeBar: {
    position: 'absolute', right: 0, top: '50%',
    transform: 'translateY(-50%)',
    width: '3px', height: '18px',
    background: '#00FF88', borderRadius: '2px 0 0 2px',
  },
  spacer: { flex: 1 },
  userCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    margin: '8px 10px',
    padding: '12px',
    background: '#111827', borderRadius: '12px', border: '1px solid #1A2332',
  },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#00FF88,#00CC6A)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, color: '#050A0E', flexShrink: 0,
  },
  userName:  { fontSize: '13px', fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  userEmail: { fontSize: '10px', color: '#3A5A4A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  logoutBtn: {
    margin: '4px 10px 0',
    padding: '10px 14px',
    background: 'transparent',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    color: '#5A7A8A',
    fontSize: '12px', fontWeight: 500,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'border-color 0.2s',
    letterSpacing: '0.04em',
  },
};

export default DashboardSidebar;