import React from 'react';
import { useUser } from '../context/UserContext';
import { type DashRoute } from './DashboardSidebar';

const ROUTE_LABELS: Record<DashRoute, string> = {
  overview: 'Dashboard',
  markets:  'Markets',
  trade:    'Trade',
  deposit:  'Deposit',
  withdraw: 'Withdraw',
  bots:     'Bots',
};

interface Props {
  route: DashRoute;
  onMenuToggle: () => void;
  onNavigate: (r: DashRoute) => void;
  mobileMenuOpen: boolean;
}

const DashboardNavbar: React.FC<Props> = ({ route, onMenuToggle, onNavigate }) => {
  const { user } = useUser();

  return (
    <header style={s.bar}>
      {/* Hamburger */}
      <button style={s.burger} onClick={onMenuToggle} aria-label="Open menu" className="dash-burger">
        <span style={s.bline} />
        <span style={s.bline} />
        <span style={s.bline} />
      </button>

      {/* Page title */}
      <div style={s.title}>{ROUTE_LABELS[route]}</div>

      {/* Right section */}
      <div style={s.right}>
        {/* Quick nav pills (hidden on mobile) */}
        <div style={s.pills} className="dash-pills">
          {(['trade', 'deposit', 'withdraw'] as DashRoute[]).map(r => (
            <button
              key={r}
              style={{ ...s.pill, ...(route === r ? s.pillActive : {}) }}
              onClick={() => onNavigate(r)}
              onMouseEnter={e => { if (route !== r) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (route !== r) e.currentTarget.style.background = 'transparent'; }}
            >
              {ROUTE_LABELS[r]}
            </button>
          ))}
        </div>

        {/* Balance */}
        <div style={s.balancePill}>
          <span style={s.balLabel}>Balance</span>
          <span style={s.balVal}>${user.balance.toFixed(2)}</span>
        </div>

        {/* Avatar */}
        <div style={s.avatar}>{user.name[0]}</div>
      </div>

      <style>{`
        .dash-burger { display: none; }
        .dash-pills  { display: flex; }
        @media (max-width: 768px) {
          .dash-burger { display: flex !important; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
          .dash-pills  { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const s: Record<string, React.CSSProperties> = {
  bar: {
    height: '60px',
    background: '#0D1117',
    borderBottom: '1px solid #1A2332',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '14px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  burger: {
    flexDirection: 'column' as const,
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    flexShrink: 0,
  },
  bline: {
    display: 'block',
    width: '20px',
    height: '2px',
    background: '#E2E8F0',
    borderRadius: '1px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#E2E8F0',
    letterSpacing: '0.04em',
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  pills: {
    display: 'flex',
    gap: '4px',
  },
  pill: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    color: '#5A7A8A',
    background: 'transparent',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    transition: 'background 0.15s',
  },
  pillActive: {
    background: 'rgba(0,255,136,0.08)',
    color: '#00FF88',
  },
  balancePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '20px',
    padding: '6px 14px',
  },
  balLabel: { fontSize: '10px', color: '#3A5A4A', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  balVal:   { fontSize: '13px', fontWeight: 700, color: '#00FF88' },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00FF88, #00CC6A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    color: '#050A0E',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

export default DashboardNavbar;