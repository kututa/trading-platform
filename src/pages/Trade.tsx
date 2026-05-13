import React, { useState, useMemo } from 'react';
import { ASSETS, genCandles, genOrderBook, fmt } from '../mockData';

type TF = '1H' | '4H' | '1D' | '1W';
type Side = 'buy' | 'sell';
type OrderType = 'limit' | 'market';
type BottomTab = 'orders' | 'history' | 'positions';

/* ── Candlestick SVG chart ─────────────────────────────── */
const CandleChart: React.FC<{ basePrice: number }> = ({ basePrice }) => {
  const candles = useMemo(() => genCandles(basePrice, 50), [basePrice]);
  const W = 560; const H = 220;
  const PAD = { t: 20, b: 28, l: 8, r: 60 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const prices = candles.flatMap(c => [c.h, c.l]);
  const lo = Math.min(...prices); const hi = Math.max(...prices);
  const range = hi - lo || 1;

  const toY = (p: number) => PAD.t + cH - ((p - lo) / range) * cH;
  const cw = cW / candles.length;
  const bw = Math.max(cw * 0.6, 2);

  const ticks = 5;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const p = lo + (hi - lo) * (i / ticks);
    return { y: toY(p), label: fmt.price(p) };
  });

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={W - PAD.r} y2={g.y} stroke="#1A2332" strokeWidth="1" />
            <text x={W - PAD.r + 6} y={g.y + 4} fontSize="9" fill="#2A4A5A" fontFamily="Jost,sans-serif">{g.label.replace('$', '')}</text>
          </g>
        ))}
        {candles.map((c, i) => {
          const bull = c.c >= c.o;
          const col  = bull ? '#00FF88' : '#FF4444';
          const x    = PAD.l + i * cw + (cw - bw) / 2;
          const oy   = toY(Math.max(c.o, c.c));
          const bh   = Math.max(Math.abs(toY(c.o) - toY(c.c)), 1);
          const mx   = x + bw / 2;
          return (
            <g key={i}>
              <line x1={mx} y1={toY(c.h)} x2={mx} y2={toY(c.l)} stroke={col} strokeWidth="1" opacity="0.7" />
              <rect x={x} y={oy} width={bw} height={bh} fill={col} opacity={bull ? 0.85 : 0.9} rx="0.5" />
            </g>
          );
        })}
        {candles.map((c, i) => {
          const bull = c.c >= c.o;
          const col  = bull ? '#00FF8822' : '#FF444422';
          const x    = PAD.l + i * cw + (cw - bw) / 2;
          const vol  = Math.random() * 18 + 2;
          return <rect key={`v${i}`} x={x} y={H - PAD.b - vol} width={bw} height={vol} fill={col} rx="0.5" />;
        })}
      </svg>
    </div>
  );
};

/* ── Order book ────────────────────────────────────────── */
const OrderBook: React.FC<{ mid: number }> = ({ mid }) => {
  const { asks, bids } = useMemo(() => genOrderBook(mid), [mid]);
  const maxAmt = Math.max(...asks.map(a => a.amount), ...bids.map(b => b.amount));

  const Row: React.FC<{ price: number; amount: number; side: 'ask' | 'bid' }> = ({ price, amount, side }) => {
    const pct = (amount / maxAmt) * 100;
    return (
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '4px 10px', fontSize: '11px' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${pct}%`, background: side === 'ask' ? 'rgba(255,68,68,0.06)' : 'rgba(0,255,136,0.06)', borderRadius: '2px' }} />
        <span style={{ color: side === 'ask' ? '#FF4444' : '#00FF88', fontWeight: 500, zIndex: 1 }}>{fmt.price(price)}</span>
        <span style={{ color: '#5A7A8A', zIndex: 1 }}>{amount.toFixed(4)}</span>
      </div>
    );
  };

  return (
    <div style={ob.wrap}>
      <div style={ob.header}>
        <span style={ob.title}>Order Book</span>
        <span style={{ color: '#3A5A6A', fontSize: '11px' }}>BTC/USDT</span>
      </div>
      <div style={ob.colHead}>
        <span>Price (USDT)</span><span>Amount (BTC)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {asks.map((a, i) => <Row key={i} price={a.price} amount={a.amount} side="ask" />)}
      </div>
      <div style={ob.midPrice}>{fmt.price(mid)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {bids.map((b, i) => <Row key={i} price={b.price} amount={b.amount} side="bid" />)}
      </div>
    </div>
  );
};

const ob: Record<string, React.CSSProperties> = {
  wrap:     { display: 'flex', flexDirection: 'column', gap: '2px' },
  header:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 8px', borderBottom: '1px solid #1A2332' },
  title:    { fontSize: '13px', fontWeight: 700, color: '#E2E8F0' },
  colHead:  { display: 'flex', justifyContent: 'space-between', padding: '4px 10px 4px', fontSize: '10px', color: '#2A4A5A', letterSpacing: '0.08em' },
  midPrice: { textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#00FF88', padding: '7px 0', borderTop: '1px solid #1A2332', borderBottom: '1px solid #1A2332', margin: '4px 0' },
};

/* ══════════════════════════════════════ TRADE PAGE ════ */
const Trade: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState(ASSETS[0]);
  const [pairSearch, setPairSearch] = useState('');
  const [tf, setTf] = useState<TF>('1H');
  const [side, setSide] = useState<Side>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [bottomTab, setBottomTab] = useState<BottomTab>('orders');
  const [showMarkets, setShowMarkets] = useState(false);

  const total = useMemo(() => {
    const p = parseFloat(price) || selectedPair.price;
    const a = parseFloat(amount) || 0;
    return (p * a).toFixed(2);
  }, [price, amount, selectedPair.price]);

  const pctFill = (pct: number) => setAmount(((pct / 100) * 0.1).toFixed(6));

  const filteredPairs = ASSETS.filter(a =>
    a.sym.toLowerCase().includes(pairSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(pairSearch.toLowerCase())
  );

  const up = selectedPair.change24h >= 0;

  return (
    <div style={t.page}>
      <div className="trade-layout" style={t.threeCol}>

        {/* LEFT — pairs list */}
        <div className="trade-left" style={t.leftCol}>
          <div style={t.colCard}>
            <div style={t.colTitle}>Markets</div>
            <div style={t.pairSearchWrap}>
              <span style={t.pairSearchIcon}>⌕</span>
              <input
                style={t.pairSearchInput}
                placeholder="Search..."
                value={pairSearch}
                onChange={e => setPairSearch(e.target.value)}
              />
            </div>
            <div style={t.pairList}>
              {filteredPairs.map(a => {
                const sel = a.id === selectedPair.id;
                return (
                  <div
                    key={a.id}
                    style={{ ...t.pairItem, ...(sel ? t.pairItemSel : {}) }}
                    onClick={() => setSelectedPair(a)}
                  >
                    <div style={{ ...t.pairDot, background: a.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={t.pairSym}>{a.sym}/USDT</div>
                      <div style={t.pairPrice}>{fmt.price(a.price)}</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: a.change24h >= 0 ? '#00FF88' : '#FF4444', flexShrink: 0 }}>
                      {fmt.pct(a.change24h)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER — chart */}
        <div className="trade-center" style={t.centerCol}>
          <div style={t.colCard}>
            <div style={t.chartHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ ...t.chartDot, background: selectedPair.color }} />
                <div style={{ minWidth: 0 }}>
                  <div style={t.chartPair}>{selectedPair.sym}/USDT</div>
                  <div style={t.chartName}>{selectedPair.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {/* Mobile: markets toggle */}
                <button
                  className="markets-toggle"
                  style={t.marketsToggle}
                  onClick={() => setShowMarkets(v => !v)}
                >
                  {showMarkets ? 'Hide Markets' : 'Markets'}
                </button>
                <div style={{ textAlign: 'right' }}>
                  <div style={t.chartPrice}>{fmt.price(selectedPair.price)}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: up ? '#00FF88' : '#FF4444' }}>
                    {fmt.pct(selectedPair.change24h)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile markets drawer */}
            {showMarkets && (
              <div className="mobile-markets" style={t.mobileMarkets}>
                <div style={t.pairSearchWrap}>
                  <span style={t.pairSearchIcon}>⌕</span>
                  <input
                    style={t.pairSearchInput}
                    placeholder="Search..."
                    value={pairSearch}
                    onChange={e => setPairSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredPairs.map(a => {
                    const sel = a.id === selectedPair.id;
                    return (
                      <div
                        key={a.id}
                        style={{ ...t.pairItem, ...(sel ? t.pairItemSel : {}) }}
                        onClick={() => { setSelectedPair(a); setShowMarkets(false); }}
                      >
                        <div style={{ ...t.pairDot, background: a.color }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={t.pairSym}>{a.sym}/USDT</div>
                          <div style={t.pairPrice}>{fmt.price(a.price)}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: a.change24h >= 0 ? '#00FF88' : '#FF4444', flexShrink: 0 }}>
                          {fmt.pct(a.change24h)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={t.tfRow}>
              {(['1H', '4H', '1D', '1W'] as TF[]).map(f => (
                <button
                  key={f}
                  style={{ ...t.tfBtn, ...(tf === f ? t.tfBtnActive : {}) }}
                  onClick={() => setTf(f)}
                >{f}</button>
              ))}
              <div className="chart-vol-hide" style={{ marginLeft: 'auto', fontSize: '11px', color: '#2A4A5A' }}>
                Vol: {fmt.vol(selectedPair.volume24h)}
              </div>
            </div>

            <div style={t.chartArea}>
              <CandleChart basePrice={selectedPair.price} />
            </div>
          </div>
        </div>

        {/* RIGHT — order book + buy/sell form */}
        <div className="trade-right-sidebar" style={t.rightCol}>
          <div style={t.colCard}>
            <OrderBook mid={selectedPair.price} />
          </div>

          <div style={t.colCard}>
            <div style={t.sideToggle}>
              <button
                style={{ ...t.sideBtn, ...(side === 'buy' ? t.sideBtnBuy : {}) }}
                onClick={() => setSide('buy')}
              >Buy</button>
              <button
                style={{ ...t.sideBtn, ...(side === 'sell' ? t.sideBtnSell : {}) }}
                onClick={() => setSide('sell')}
              >Sell</button>
            </div>

            <div style={t.orderTypeRow}>
              {(['limit', 'market'] as OrderType[]).map(ot => (
                <button
                  key={ot}
                  style={{ ...t.otBtn, ...(orderType === ot ? t.otBtnActive : {}) }}
                  onClick={() => setOrderType(ot)}
                >
                  {ot.charAt(0).toUpperCase() + ot.slice(1)}
                </button>
              ))}
            </div>

            {orderType === 'limit' && (
              <div style={t.inputGroup}>
                <label style={t.inputLabel}>Price (USDT)</label>
                <div style={t.inputWrap}>
                  <input
                    style={t.input}
                    type="number"
                    placeholder={selectedPair.price.toFixed(2)}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                  <span style={t.inputSuffix}>USDT</span>
                </div>
              </div>
            )}

            <div style={t.inputGroup}>
              <label style={t.inputLabel}>Amount ({selectedPair.sym})</label>
              <div style={t.inputWrap}>
                <input
                  style={t.input}
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <span style={t.inputSuffix}>{selectedPair.sym}</span>
              </div>
            </div>

            <div style={t.pctRow}>
              {[25, 50, 75, 100].map(p => (
                <button key={p} style={t.pctBtn} onClick={() => pctFill(p)}>{p}%</button>
              ))}
            </div>

            <div style={t.totalRow}>
              <span style={t.totalLabel}>Total</span>
              <span style={t.totalVal}>${total} USDT</span>
            </div>

            <button style={{
              ...t.submitBtn,
              background: side === 'buy' ? '#00FF88' : '#FF4444',
              color: side === 'buy' ? '#050A0E' : '#fff',
            }}>
              {side === 'buy' ? `Buy ${selectedPair.sym}` : `Sell ${selectedPair.sym}`}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div style={t.bottomCard}>
        <div style={t.bottomTabs}>
          {(['orders', 'history', 'positions'] as BottomTab[]).map(bt => (
            <button
              key={bt}
              style={{ ...t.btTab, ...(bottomTab === bt ? t.btTabActive : {}) }}
              onClick={() => setBottomTab(bt)}
            >
              {bt.charAt(0).toUpperCase() + bt.slice(1)}
            </button>
          ))}
        </div>
        <div style={t.bottomEmpty}>
          <div style={t.emptyIcon}>📋</div>
          <div style={t.emptyText}>No {bottomTab} yet</div>
          <div style={t.emptySub}>Your {bottomTab} will appear here once you start trading.</div>
        </div>
      </div>

      <style>{`
        /* Markets toggle button — hidden on desktop, shown on tablet/mobile */
        .markets-toggle { display: none; }
        .mobile-markets { display: none; }

        /* ── Desktop: 3-column ── */
        .trade-layout {
          display: grid;
          grid-template-columns: 200px 1fr 280px;
          gap: 14px;
        }

        /* ── Tablet (≤1200px): hide left sidebar, 2-column ── */
        @media (max-width: 1200px) {
          .trade-layout {
            grid-template-columns: 1fr 280px;
          }
          .trade-left { display: none; }
          .markets-toggle {
            display: inline-flex !important;
            align-items: center;
            font-family: 'Jost', sans-serif;
            font-size: 11px;
            font-weight: 600;
            color: #00FF88;
            background: rgba(0,255,136,0.08);
            border: 1px solid rgba(0,255,136,0.2);
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
            white-space: nowrap;
          }
          .mobile-markets {
            display: block !important;
            background: #111827;
            border: 1px solid #1A2332;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 12px;
          }
        }

        /* ── Mobile (≤900px): single column, order book + form side-by-side ── */
        @media (max-width: 900px) {
          .trade-layout {
            grid-template-columns: 1fr;
          }
          .trade-right-sidebar {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
        }

        /* ── Small mobile (≤600px): everything single column ── */
        @media (max-width: 600px) {
          .trade-right-sidebar {
            grid-template-columns: 1fr !important;
          }
          .chart-vol-hide { display: none; }
        }
      `}</style>
    </div>
  );
};

const t: Record<string, React.CSSProperties> = {
  page:       { display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' },
  threeCol:   { width: '100%' },
  leftCol:    {},
  centerCol:  { minWidth: 0 },
  rightCol:   { display: 'flex', flexDirection: 'column', gap: '14px' },
  colCard:    { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '14px', padding: '16px', overflow: 'hidden' },
  colTitle:   { fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '12px' },

  pairSearchWrap:  { display: 'flex', alignItems: 'center', gap: '6px', background: '#111827', border: '1px solid #1A2332', borderRadius: '8px', padding: '7px 10px', marginBottom: '10px' },
  pairSearchIcon:  { color: '#3A5A6A', fontSize: '14px', flexShrink: 0 },
  pairSearchInput: { background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '12px', width: '100%' },
  pairList:        { display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '420px', overflowY: 'auto' },
  pairItem:        { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  pairItemSel:     { background: 'rgba(0,255,136,0.07)' },
  pairDot:         { width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 },
  pairSym:         { fontSize: '11px', fontWeight: 700, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pairPrice:       { fontSize: '10px', color: '#3A5A6A' },

  chartHeader:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' },
  chartDot:     { width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 },
  chartPair:    { fontSize: '15px', fontWeight: 700, color: '#E2E8F0' },
  chartName:    { fontSize: '11px', color: '#3A5A6A' },
  chartPrice:   { fontSize: '18px', fontWeight: 700, color: '#E2E8F0' },

  mobileMarkets: {},

  tfRow:        { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' },
  tfBtn:        { fontFamily: "'Jost',sans-serif", fontSize: '11px', fontWeight: 600, color: '#3A5A6A', background: 'transparent', border: '1px solid transparent', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' },
  tfBtnActive:  { color: '#00FF88', background: 'rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.2)' },
  chartArea:    { overflow: 'hidden', width: '100%' },

  marketsToggle: {},

  sideToggle:   { display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1A2332', marginBottom: '12px' },
  sideBtn:      { fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 700, background: '#111827', border: 'none', padding: '9px', cursor: 'pointer', color: '#3A5A6A' },
  sideBtnBuy:   { background: 'rgba(0,255,136,0.12)', color: '#00FF88' },
  sideBtnSell:  { background: 'rgba(255,68,68,0.12)', color: '#FF4444' },

  orderTypeRow: { display: 'flex', gap: '6px', marginBottom: '14px' },
  otBtn:        { fontFamily: "'Jost',sans-serif", fontSize: '11px', fontWeight: 600, color: '#3A5A6A', background: 'transparent', border: '1px solid #1A2332', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer' },
  otBtnActive:  { color: '#E2E8F0', borderColor: '#3A5A6A', background: 'rgba(255,255,255,0.04)' },

  inputGroup:   { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
  inputLabel:   { fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2A4A5A' },
  inputWrap:    { display: 'flex', alignItems: 'center', background: '#111827', border: '1px solid #1A2332', borderRadius: '8px', overflow: 'hidden' },
  input:        { background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '13px', padding: '10px 12px', flex: 1, minWidth: 0 },
  inputSuffix:  { fontSize: '11px', color: '#3A5A6A', padding: '0 12px', flexShrink: 0 },

  pctRow:       { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', marginBottom: '14px' },
  pctBtn:       { fontFamily: "'Jost',sans-serif", fontSize: '11px', fontWeight: 600, color: '#5A7A8A', background: '#111827', border: '1px solid #1A2332', borderRadius: '6px', padding: '6px', cursor: 'pointer' },

  totalRow:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #1A2332', marginBottom: '12px' },
  totalLabel:   { fontSize: '11px', color: '#3A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase' },
  totalVal:     { fontSize: '14px', fontWeight: 700, color: '#E2E8F0' },

  submitBtn:    { fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 700, border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', width: '100%' },

  bottomCard:   { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '14px', overflow: 'hidden' },
  bottomTabs:   { display: 'flex', borderBottom: '1px solid #1A2332' },
  btTab:        { fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 600, color: '#3A5A6A', background: 'none', border: 'none', padding: '12px 20px', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  btTabActive:  { color: '#00FF88', borderBottomColor: '#00FF88' },

  bottomEmpty:  { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', gap: '8px' },
  emptyIcon:    { fontSize: '32px', opacity: 0.3 },
  emptyText:    { fontSize: '14px', fontWeight: 600, color: '#3A5A6A' },
  emptySub:     { fontSize: '12px', color: '#1A3A4A', textAlign: 'center' },
};

export default Trade;