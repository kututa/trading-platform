import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS, GAINERS, LOSERS, fmt } from '../mockData';
import { type DashRoute } from '../components/DashboardSidebar';

interface Props { onNavigate?: (r: DashRoute) => void }
type Tab = 'all' | 'gainers' | 'losers';

const Sparkline: React.FC<{ data: number[]; up: boolean }> = ({ data, up }) => {
  const w = 64; const h = 28;
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={up ? '#00FF88' : '#FF4444'} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

const Markets: React.FC<Props> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const toggleFav = (id: string) =>
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const baseList = tab === 'gainers' ? GAINERS : tab === 'losers' ? LOSERS : ASSETS;
  const filtered = useMemo(() =>
    baseList.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sym.toLowerCase().includes(search.toLowerCase())
    ), [baseList, search]);

  const handleNavigate = (r: DashRoute) => {
    if (onNavigate) { onNavigate(r); return; }
    navigate(r === 'overview' ? '/dashboard' : `/dashboard/${r}`);
  };

  return (
    <div style={m.page}>
      {/* Top cards - Now uses CSS Class for Grid logic */}
      <div className="top-cards-grid">
        <div style={m.glCard}>
          <div style={m.glCardHeader}>
            <span style={m.glCardTitle}>🔥 Top Gainers</span>
            <span style={{ color: '#00FF88', fontSize: '11px' }}>24h</span>
          </div>
          {GAINERS.slice(0, 4).map((a, i) => (
            <div key={a.id} style={m.miniRow}>
              <span style={m.miniRank}>{i + 1}</span>
              <div style={{ ...m.miniDot, background: a.color }} />
              <div style={{ flex: 1 }}>
                <div style={m.miniSym}>{a.sym}</div>
                <div style={m.miniName}>{a.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={m.miniPrice}>{fmt.price(a.price)}</div>
                <div style={{ ...m.miniPct, color: '#00FF88' }}>{fmt.pct(a.change24h)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={m.glCard}>
          <div style={m.glCardHeader}>
            <span style={m.glCardTitle}>📉 Top Losers</span>
            <span style={{ color: '#FF4444', fontSize: '11px' }}>24h</span>
          </div>
          {LOSERS.slice(0, 4).map((a, i) => (
            <div key={a.id} style={m.miniRow}>
              <span style={m.miniRank}>{i + 1}</span>
              <div style={{ ...m.miniDot, background: a.color }} />
              <div style={{ flex: 1 }}>
                <div style={m.miniSym}>{a.sym}</div>
                <div style={m.miniName}>{a.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={m.miniPrice}>{fmt.price(a.price)}</div>
                <div style={{ ...m.miniPct, color: '#FF4444' }}>{fmt.pct(a.change24h)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div style={m.tableCard}>
        <div style={m.toolbar}>
          <div style={m.tabs}>
            {(['all', 'gainers', 'losers'] as Tab[]).map(t => (
              <button key={t} style={{ ...m.tab, ...(tab === t ? m.tabActive : {}) }}
                onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div style={m.searchWrap}>
            <span style={m.searchIcon}>⌕</span>
            <input
              style={m.searchInput}
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll-container">
          <table style={m.table}>
            <thead>
              <tr>
                <th style={m.th}>#</th>
                <th style={m.th}>Name</th>
                <th style={{ ...m.th, textAlign: 'right' }}>Price</th>
                <th style={{ ...m.th, textAlign: 'right' }}>24h %</th>
                <th style={{ ...m.th, textAlign: 'right', minWidth: '100px' }}>Volume</th>
                <th style={{ ...m.th, textAlign: 'right', minWidth: '110px' }}>Market Cap</th>
                <th style={{ ...m.th, textAlign: 'center', minWidth: '72px' }}>Chart</th>
                <th style={{ ...m.th, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => {
                const up = a.change24h >= 0;
                const hov = hoveredRow === a.id;
                const fav = favorites.has(a.id);
                return (
                  <tr key={a.id}
                    style={{ background: hov ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={() => setHoveredRow(a.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={m.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button style={m.starBtn} onClick={() => toggleFav(a.id)}>
                          <span style={{ color: fav ? '#FFD700' : '#2A3A4A', fontSize: '14px' }}>★</span>
                        </button>
                        <span style={m.rank}>{idx + 1}</span>
                      </div>
                    </td>
                    <td style={m.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ ...m.dot, background: a.color }} />
                        <div>
                          <div style={m.sym}>{a.sym}</div>
                          <div style={m.name}>{a.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...m.td, textAlign: 'right', fontWeight: 600, color: '#E2E8F0' }}>{fmt.price(a.price)}</td>
                    <td style={{ ...m.td, textAlign: 'right' }}>
                      <span style={{ ...m.pctBadge, background: up ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)', color: up ? '#00FF88' : '#FF4444' }}>
                        {fmt.pct(a.change24h)}
                      </span>
                    </td>
                    <td style={{ ...m.td, textAlign: 'right', color: '#7A9AAA' }}>{fmt.vol(a.volume24h)}</td>
                    <td style={{ ...m.td, textAlign: 'right', color: '#7A9AAA' }}>{fmt.cap(a.marketCap)}</td>
                    <td style={{ ...m.td, textAlign: 'center' }}>
                      <Sparkline data={a.sparkline} up={up} />
                    </td>
                    <td style={{ ...m.td, textAlign: 'center' }}>
                      <button style={m.tradeBtn} onClick={() => handleNavigate('trade')}>Trade</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .top-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 14px;
        }

        @media (max-width: 768px) {
          .top-cards-grid {
            grid-template-columns: 1fr;
          }
          
          /* Toolbar wrap for mobile */
          div[style*="toolbar"] {
            flex-direction: column;
            align-items: stretch !important;
          }

          div[style*="tabs"] {
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          div[style*="searchWrap"] {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

const m: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' },
  glCard: { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '14px', padding: '18px 20px' },
  glCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' },
  glCardTitle: { fontSize: '14px', fontWeight: 700, color: '#E2E8F0' },
  miniRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0F1820' },
  miniRank: { fontSize: '10px', color: '#2A3A4A', width: '14px', textAlign: 'right' },
  miniDot: { width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 },
  miniSym: { fontSize: '12px', fontWeight: 700, color: '#E2E8F0' },
  miniName: { fontSize: '10px', color: '#3A5A6A' },
  miniPrice: { fontSize: '12px', fontWeight: 600, color: '#E2E8F0' },
  miniPct: { fontSize: '11px', fontWeight: 600 },
  tableCard: { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '14px', overflow: 'hidden' },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #1A2332', flexWrap: 'wrap', gap: '12px' },
  tabs: { display: 'flex', gap: '4px' },
  tab: { fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 600, color: '#5A7A8A', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.15s' },
  tabActive: { color: '#00FF88', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', background: '#111827', border: '1px solid #1A2332', borderRadius: '10px', padding: '7px 14px', minWidth: '200px' },
  searchIcon: { color: '#3A5A6A', fontSize: '16px' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '13px', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  th: { padding: '12px 16px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2A4A5A', borderBottom: '1px solid #1A2332', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#A2B8C8', whiteSpace: 'nowrap' },
  starBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0', lineHeight: 1 },
  rank: { fontSize: '11px', color: '#3A5A6A' },
  dot: { width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0 },
  sym: { fontSize: '13px', fontWeight: 700, color: '#E2E8F0' },
  name: { fontSize: '10px', color: '#3A5A6A' },
  pctBadge: { display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  tradeBtn: { fontFamily: "'Jost',sans-serif", fontSize: '11px', fontWeight: 600, color: '#00FF88', background: 'transparent', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer' },
};

export default Markets;