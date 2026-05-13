import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ASSETS, GAINERS, LOSERS, fmt } from '../mockData';
import { type DashRoute } from '../components/DashboardSidebar';

interface Props { onNavigate?: (r: DashRoute) => void }

/* ── Sparkline SVG ── */
const Sparkline: React.FC<{ data: number[]; up: boolean; w?: number; h?: number }> = ({
  data, up, w = 80, h = 32,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const color = up ? '#00FF88' : '#FF4444';
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

/* ── Stat card ── */
const StatCard: React.FC<{ label: string; value: string; sub?: string; up?: boolean; icon: string }> = ({
  label, value, sub, up, icon,
}) => (
  <div style={c.statCard}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={c.statLabel}>{label}</div>
        <div style={c.statValue}>{value}</div>
      </div>
      <div style={c.statIcon}>{icon}</div>
    </div>
    {sub && (
      <div style={{ ...c.statSub, color: up ? '#00FF88' : '#FF4444', marginTop: '8px' }}>{sub}</div>
    )}
  </div>
);

/* ── Asset card (trending) ── */
const AssetCard: React.FC<{ asset: (typeof ASSETS)[0]; onTrade: () => void }> = ({ asset, onTrade }) => {
  const up = asset.change24h >= 0;
  return (
    <div style={c.assetCard}>
      <div style={c.assetCardTop}>
        <div style={{ ...c.assetDot, background: asset.color }} />
        <div>
          <div style={c.assetSym}>{asset.sym}</div>
          <div style={c.assetName}>{asset.name}</div>
        </div>
        <div style={{ ...c.badge, background: up ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)', color: up ? '#00FF88' : '#FF4444' }}>
          {fmt.pct(asset.change24h)}
        </div>
      </div>
      <div style={c.assetCardChart}>
        <Sparkline data={asset.sparkline} up={up} w={140} h={44} />
      </div>
      <div style={c.assetCardBottom}>
        <div style={c.assetPrice}>{fmt.price(asset.price)}</div>
        <button className="trade-btn-hover" style={c.tradeBtn} onClick={onTrade}>Trade</button>
      </div>
    </div>
  );
};

/* ── Gainer / Loser row ── */
const AssetRow: React.FC<{ asset: (typeof ASSETS)[0]; rank: number }> = ({ asset, rank }) => {
  const up = asset.change24h >= 0;
  return (
    <div style={c.listRow}>
      <span style={c.listRank}>{rank}</span>
      <div style={{ ...c.listDot, background: asset.color }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={c.listSym}>{asset.sym}</div>
        <div style={c.listName}>{asset.name}</div>
      </div>
      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
        <div style={c.listPrice}>{fmt.price(asset.price)}</div>
        <div style={{ ...c.listPct, color: up ? '#00FF88' : '#FF4444' }}>{fmt.pct(asset.change24h)}</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════ */
const DashboardOverview: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleNavigate = (r: DashRoute) => {
    if (onNavigate) {
      onNavigate(r);
      return;
    }
    navigate(r === 'overview' ? '/dashboard' : `/dashboard/${r}`);
  };

  return (
    <div style={c.page}>

      {/* Welcome banner */}
      <div className="welcome-banner" style={c.welcome}>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={c.welcomeGreet}>Welcome back,</div>
          <div style={c.welcomeName}>{user.name} 👋</div>
          <div style={c.welcomeSub}>Your portfolio is up 4.2% this week.</div>
        </div>
        <div className="welcome-actions" style={c.welcomeActions}>
          <button style={c.btnGreen} onClick={() => handleNavigate('deposit')}>+ Deposit</button>
          <button style={c.btnOutline} onClick={() => handleNavigate('trade')}>Trade Now</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={c.statsGrid}>
        <StatCard label="Balance"    value={`$${user.balance.toLocaleString()}`} sub="Stable"     up={true} icon="◈" />
        <StatCard label="24h Volume" value="$38.4B"   sub="+5.2%"    up={true} icon="⇅" />
        <StatCard label="Profit"     value="+$412.00" sub="Monthly"  up={true} icon="📈" />
        <StatCard label="Active"     value="12"        sub="Positions" up={true} icon="⦿" />
      </div>

      {/* Trending assets */}
      <div>
        <div style={c.sectionHeader}>
          <div style={c.sectionTitle}>Trending Assets</div>
          <button style={c.seeAll} onClick={() => handleNavigate('markets')}>See all →</button>
        </div>
        <div className="trending-grid" style={c.trendingGrid}>
          {ASSETS.slice(0, 3).map(a => (
            <AssetCard key={a.id} asset={a} onTrade={() => handleNavigate('trade')} />
          ))}
        </div>
      </div>

      {/* Gainers + Losers */}
      <div className="gl-grid" style={c.glGrid}>
        <div style={c.glCard}>
          <div style={c.glHeader}>
            <span style={c.glTitle}>🔥 Top Gainers</span>
            <span style={{ color: '#00FF88', fontSize: '11px', fontWeight: 700 }}>24h</span>
          </div>
          {GAINERS.slice(0, 4).map((a, i) => <AssetRow key={a.id} asset={a} rank={i + 1} />)}
        </div>

        <div style={c.glCard}>
          <div style={c.glHeader}>
            <span style={c.glTitle}>📉 Top Losers</span>
            <span style={{ color: '#FF4444', fontSize: '11px', fontWeight: 700 }}>24h</span>
          </div>
          {LOSERS.slice(0, 4).map((a, i) => <AssetRow key={a.id} asset={a} rank={i + 1} />)}
        </div>
      </div>

      <style>{`
        .trade-btn-hover:hover {
          background: #00FF88 !important;
          color: #050A0E !important;
        }

        /* Welcome banner */
        @media (max-width: 600px) {
          .welcome-banner {
            padding: 20px !important;
            gap: 16px !important;
          }
        }

        /* Welcome actions — full width + equal buttons on mobile */
        @media (max-width: 640px) {
          .welcome-actions {
            width: 100%;
          }
          .welcome-actions button {
            flex: 1;
          }
        }

        /* Stats: 4 → 2 → 1 column */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }

        /* Trending: 3 → 2 → 1 column */
        @media (max-width: 900px) {
          .trending-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .trending-grid { grid-template-columns: 1fr !important; }
        }

        /* Gainers/Losers: 2 → 1 column */
        @media (max-width: 768px) {
          .gl-grid { grid-template-columns: 1fr !important; }
        }

        /* Welcome name size on small screens */
        @media (max-width: 400px) {
          .welcome-name { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
};

/* ── Styles ── */
const c: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' },

  welcome: {
    background: 'linear-gradient(135deg, #0D1F14 0%, #0D1117 100%)',
    border: '1px solid #1A3A2A',
    borderRadius: '20px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
  },
  welcomeGreet: { fontSize: '13px', color: '#00FF88', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' },
  welcomeName:  { fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' },
  welcomeSub:   { fontSize: '14px', color: '#5A7A8A' },
  welcomeActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },

  btnGreen: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px', fontWeight: 700,
    color: '#050A0E', background: '#00FF88',
    border: 'none', borderRadius: '12px',
    padding: '12px 24px', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnOutline: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px', fontWeight: 600,
    color: '#E2E8F0', background: 'rgba(255,255,255,0.05)',
    border: '1px solid #1A2332', borderRadius: '12px',
    padding: '12px 24px', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statCard:  { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '20px' },
  statIcon:  { fontSize: '20px', color: '#00FF88', background: 'rgba(0,255,136,0.1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', flexShrink: 0 },
  statLabel: { fontSize: '11px', color: '#5A7A8A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
  statValue: { fontSize: '22px', fontWeight: 800, color: '#FFFFFF' },
  statSub:   { fontSize: '12px', fontWeight: 600 },

  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  sectionTitle:  { fontSize: '18px', fontWeight: 700, color: '#FFFFFF' },
  seeAll: { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: '#00FF88', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 },

  trendingGrid:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  assetCard:      { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  assetCardTop:   { display: 'flex', alignItems: 'center', gap: '12px' },
  assetDot:       { width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 },
  assetSym:       { fontSize: '14px', fontWeight: 700, color: '#FFFFFF' },
  assetName:      { fontSize: '11px', color: '#5A7A8A' },
  badge:          { marginLeft: 'auto', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap' },
  assetCardChart: { height: '44px', width: '100%' },
  assetCardBottom:{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  assetPrice:     { fontSize: '16px', fontWeight: 700, color: '#FFFFFF' },
  tradeBtn:       { fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 700, color: '#00FF88', background: 'transparent', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', transition: 'all 0.2s' },

  glGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  glCard:   { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '24px' },
  glHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  glTitle:  { fontSize: '15px', fontWeight: 700, color: '#FFFFFF' },

  listRow:  { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #1A2332' },
  listRank: { fontSize: '11px', color: '#3A5A6A', width: '14px', flexShrink: 0 },
  listDot:  { width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 },
  listSym:  { fontSize: '13px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  listName: { fontSize: '10px', color: '#5A7A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  listPrice:{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' },
  listPct:  { fontSize: '11px', fontWeight: 700 },
};

export default DashboardOverview;