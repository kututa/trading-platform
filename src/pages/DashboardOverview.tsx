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
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

/* ── Stat card ── */
const StatCard: React.FC<{ label: string; value: string; sub?: string; up?: boolean; icon: string }> = ({
  label, value, sub, up, icon,
}) => (
  <div style={c.statCard}>
    <div style={c.statIcon}>{icon}</div>
    <div style={c.statLabel}>{label}</div>
    <div style={c.statValue}>{value}</div>
    {sub && (
      <div style={{ ...c.statSub, color: up ? '#00FF88' : '#FF4444' }}>{sub}</div>
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
        <button style={c.tradeBtn} onClick={onTrade}
          onMouseEnter={e => (e.currentTarget.style.background = '#00FF88')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >Trade</button>
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
      <div style={{ flex: 1 }}>
        <div style={c.listSym}>{asset.sym}</div>
        <div style={c.listName}>{asset.name}</div>
      </div>
      <div style={{ textAlign: 'right' as const }}>
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
      <div style={c.welcome}>
        <div>
          <div style={c.welcomeGreet}>Welcome back,</div>
          <div style={c.welcomeName}>{user.name} 👋</div>
          <div style={c.welcomeSub}>Here's what's happening in the market today.</div>
        </div>
        <div style={c.welcomeActions}>
          <button style={c.btnGreen} onClick={() => handleNavigate('deposit')}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >+ Deposit</button>
          <button style={c.btnOutline} onClick={() => handleNavigate('trade')}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#00FF88')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2332')}
          >Trade Now</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={c.statsGrid}>
        <StatCard label="Total Balance"   value={`$${user.balance.toFixed(2)}`} sub="No change" up={true}  icon="◈" />
        <StatCard label="24h Volume"      value="$38.4B"  sub="+5.2% vs yesterday" up={true}  icon="⇅" />
        <StatCard label="Top Gainer"      value="BNB"     sub="+3.81% today"       up={true}  icon="↑" />
        <StatCard label="Top Loser"       value="AVAX"    sub="-2.64% today"       up={false} icon="↓" />
      </div>

      {/* Trending assets */}
      <div style={c.sectionHeader}>
        <div style={c.sectionTitle}>Trending Assets</div>
        <button style={c.seeAll} onClick={() => handleNavigate('markets')}>See all →</button>
      </div>
      <div style={c.trendingGrid}>
        {ASSETS.slice(0, 6).map(a => (
          <AssetCard key={a.id} asset={a} onTrade={() => handleNavigate('trade')} />
        ))}
      </div>

      {/* Gainers + Losers */}
      <div style={c.glGrid}>
        {/* Gainers */}
        <div style={c.glCard}>
          <div style={c.glHeader}>
            <span style={c.glTitle}>🔥 Top Gainers</span>
            <span style={{ color: '#00FF88', fontSize: '11px' }}>24h</span>
          </div>
          {GAINERS.map((a, i) => <AssetRow key={a.id} asset={a} rank={i + 1} />)}
        </div>

        {/* Losers */}
        <div style={c.glCard}>
          <div style={c.glHeader}>
            <span style={c.glTitle}>📉 Top Losers</span>
            <span style={{ color: '#FF4444', fontSize: '11px' }}>24h</span>
          </div>
          {LOSERS.map((a, i) => <AssetRow key={a.id} asset={a} rank={i + 1} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .trending-grid { grid-template-columns: repeat(2,1fr) !important; }
          .gl-grid       { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .stats-grid    { grid-template-columns: 1fr 1fr !important; }
          .trending-grid { grid-template-columns: 1fr !important; }
          .welcome-actions { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

/* ── Styles ── */
const c: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },

  welcome: {
    background: 'linear-gradient(135deg,#0D1F14 0%,#0D1117 100%)',
    border: '1px solid #1A3A2A',
    borderRadius: '16px',
    padding: '28px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeGreet: { fontSize: '13px', color: '#3A6A4A', letterSpacing: '0.04em', marginBottom: '4px' },
  welcomeName:  { fontSize: '26px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' },
  welcomeSub:   { fontSize: '13px', color: '#5A7A8A' },
  welcomeActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' as const },
  btnGreen: {
    fontFamily: "'Jost',sans-serif",
    fontSize: '13px', fontWeight: 600,
    color: '#050A0E', background: '#00FF88',
    border: 'none', borderRadius: '10px',
    padding: '10px 22px', cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  btnOutline: {
    fontFamily: "'Jost',sans-serif",
    fontSize: '13px', fontWeight: 500,
    color: '#A2B8C8', background: 'transparent',
    border: '1px solid #1A2332', borderRadius: '10px',
    padding: '10px 22px', cursor: 'pointer',
    transition: 'border-color 0.2s',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '14px',
  },
  statCard: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '14px',
    padding: '20px',
  },
  statIcon:  { fontSize: '20px', marginBottom: '12px', color: '#00FF88' },
  statLabel: { fontSize: '11px', color: '#3A5A6A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' },
  statValue: { fontSize: '22px', fontWeight: 700, color: '#E2E8F0', marginBottom: '4px' },
  statSub:   { fontSize: '12px', fontWeight: 500 },

  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle:  { fontSize: '16px', fontWeight: 700, color: '#E2E8F0' },
  seeAll: {
    fontFamily: "'Jost',sans-serif",
    fontSize: '12px', color: '#00FF88',
    background: 'none', border: 'none', cursor: 'pointer',
  },

  trendingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '14px',
  },
  assetCard: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'border-color 0.2s',
    cursor: 'default',
  },
  assetCardTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  assetDot: { width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0 },
  assetSym:  { fontSize: '13px', fontWeight: 700, color: '#E2E8F0' },
  assetName: { fontSize: '11px', color: '#3A5A6A' },
  badge: {
    marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
    padding: '3px 8px', borderRadius: '6px',
  },
  assetCardChart: { overflow: 'hidden' },
  assetCardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  assetPrice: { fontSize: '14px', fontWeight: 700, color: '#E2E8F0' },
  tradeBtn: {
    fontFamily: "'Jost',sans-serif",
    fontSize: '11px', fontWeight: 600,
    color: '#00FF88', background: 'transparent',
    border: '1px solid rgba(0,255,136,0.3)',
    borderRadius: '8px', padding: '5px 12px',
    cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
  },

  glGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  glCard: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '14px',
    padding: '18px 20px',
  },
  glHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '14px',
  },
  glTitle: { fontSize: '14px', fontWeight: 700, color: '#E2E8F0' },
  listRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 0',
    borderBottom: '1px solid #0F1820',
  },
  listRank:  { fontSize: '11px', color: '#2A3A4A', width: '14px', textAlign: 'right' as const, flexShrink: 0 },
  listDot:   { width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0 },
  listSym:   { fontSize: '12px', fontWeight: 700, color: '#E2E8F0' },
  listName:  { fontSize: '10px', color: '#3A5A6A' },
  listPrice: { fontSize: '12px', fontWeight: 600, color: '#E2E8F0' },
  listPct:   { fontSize: '11px', fontWeight: 600 },
};

export default DashboardOverview;