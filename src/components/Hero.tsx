import React from 'react';

/* ── Ticker data ── */
const tickerData = [
  { sym: 'BTC',  price: '$75,186.03', change: '2.81%', up: false },
  { sym: 'ETH',  price: '$2,308.92',  change: '1.07%', up: false },
  { sym: 'BNB',  price: '$626.25',    change: '3.81%', up: true  },
  { sym: 'SOL',  price: '$85.07',     change: '0.30%', up: false },
  { sym: 'XRP',  price: '$1.42',      change: '0.01%', up: false },
  { sym: 'DOGE', price: '$0.0946',    change: '0.12%', up: true  },
  { sym: 'ADA',  price: '$0.2466',    change: '0.08%', up: false },
  { sym: 'TRX',  price: '$0.3298',    change: '0.05%', up: true  },
];

const metrics = [
  { value: '50,000+', label: 'Active Traders'  },
  { value: '$2.5B+',  label: 'Trading Volume'  },
  { value: '100+',    label: 'Trading Pairs'   },
  { value: '99.9%',   label: 'Platform Uptime' },
];

/* ── Candle data helpers ── */
interface Candle { o: number; h: number; l: number; c: number }

function genCandles(seed: number, count: number): Candle[] {
  let price = 75000 + seed;
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const open  = price;
    const move  = (Math.sin(i * 0.7 + seed) * 800) + (Math.random() - 0.48) * 600;
    const close = open + move;
    const high  = Math.max(open, close) + Math.random() * 300;
    const low   = Math.min(open, close) - Math.random() * 300;
    out.push({ o: open, h: high, l: low, c: close });
    price = close;
  }
  return out;
}

/* ── Candlestick SVG renderer ── */
const CandleChart: React.FC<{
  candles: Candle[];
  width: number;
  height: number;
  label: string;
  price: string;
  change: string;
  up: boolean;
}> = ({ candles, width, height, label, price, change, up }) => {
  const pad = { t: 28, b: 8, l: 4, r: 4 };
  const chartW = width - pad.l - pad.r;
  const chartH = height - pad.t - pad.b;

  const allH = candles.map(c => c.h);
  const allL = candles.map(c => c.l);
  const maxP  = Math.max(...allH);
  const minP  = Math.min(...allL);
  const range = maxP - minP || 1;

  const toY = (p: number) => pad.t + chartH - ((p - minP) / range) * chartH;
  const cw   = chartW / candles.length;
  const body  = Math.max(cw * 0.55, 2);
  const gap   = (cw - body) / 2;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {/* Header row */}
      <text x={pad.l} y={12} fontSize="8" fontWeight="700"
        fill="#C9A84C" fontFamily="Jost, sans-serif" letterSpacing="1">
        {label}
      </text>
      <text x={width - pad.r} y={12} fontSize="8" fontWeight="600"
        fill="#F0EDE6" fontFamily="Jost, sans-serif" textAnchor="end">
        {price}
      </text>
      <text x={width - pad.r} y={22} fontSize="7"
        fill={up ? '#2DD4A0' : '#FF5A5A'} fontFamily="Jost, sans-serif" textAnchor="end">
        {up ? '▲' : '▼'} {change}
      </text>

      {/* Candles */}
      {candles.map((c, i) => {
        const x    = pad.l + i * cw;
        const bull = c.c >= c.o;
        const col  = bull ? '#2DD4A0' : '#FF5A5A';
        const by   = toY(Math.max(c.o, c.c));
        const bh   = Math.max(Math.abs(toY(c.o) - toY(c.c)), 1);
        const wick = x + gap + body / 2;
        return (
          <g key={i}>
            <line x1={wick} y1={toY(c.h)} x2={wick} y2={toY(c.l)}
              stroke={col} strokeWidth="0.8" strokeOpacity="0.7" />
            <rect x={x + gap} y={by} width={body} height={bh}
              fill={col} fillOpacity={bull ? 0.85 : 0.9} rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
};

/* ── Mobile mini chart (4 candles) ── */
const MiniChart: React.FC<{ candles: Candle[] }> = ({ candles }) => {
  const mini = candles.slice(-8);
  const w = 80; const h = 36;
  const allH = mini.map(c => c.h); const allL = mini.map(c => c.l);
  const maxP = Math.max(...allH); const minP = Math.min(...allL);
  const range = maxP - minP || 1;
  const toY = (p: number) => h - ((p - minP) / range) * h;
  const cw = w / mini.length; const body = cw * 0.55; const gap = (cw - body) / 2;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {mini.map((c, i) => {
        const bull = c.c >= c.o;
        const col  = bull ? '#2DD4A0' : '#FF5A5A';
        const by   = toY(Math.max(c.o, c.c));
        const bh   = Math.max(Math.abs(toY(c.o) - toY(c.c)), 1);
        const wick = i * cw + gap + body / 2;
        return (
          <g key={i}>
            <line x1={wick} y1={toY(c.h)} x2={wick} y2={toY(c.l)} stroke={col} strokeWidth="1" strokeOpacity="0.6" />
            <rect x={i * cw + gap} y={by} width={body} height={bh} fill={col} fillOpacity="0.9" rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
};

/* ── MacBook mockup ── */
const MacBook: React.FC = () => {
  const btcCandles = genCandles(0,   28);
  const ethCandles = genCandles(500, 28);

  return (
    <div style={mb.wrap}>
      {/* Screen bezel */}
      <div style={mb.screen}>
        {/* Notch */}
        <div style={mb.notch} />
        {/* Screen content */}
        <div style={mb.screenInner}>
          {/* Top bar */}
          <div style={mb.topBar}>
            <div style={mb.topDots}>
              <span style={{ ...mb.dot, background: '#FF5F57' }} />
              <span style={{ ...mb.dot, background: '#FEBC2E' }} />
              <span style={{ ...mb.dot, background: '#28C840' }} />
            </div>
            <div style={mb.topTitle}>Vantrex Markets — BTC/USDT</div>
            <div style={mb.topRight}>
              <span style={mb.badge}>● LIVE</span>
            </div>
          </div>
          {/* Chart area */}
          <div style={mb.chartArea}>
            <CandleChart candles={btcCandles} width={310} height={110}
              label="BTC/USDT · 1H" price="$75,186" change="2.81%" up={false} />
          </div>
          <div style={mb.divider} />
          <div style={mb.chartArea}>
            <CandleChart candles={ethCandles} width={310} height={80}
              label="ETH/USDT · 1H" price="$2,308" change="1.07%" up={false} />
          </div>
          {/* Bottom status bar */}
          <div style={mb.statusBar}>
            <span style={mb.statusDot} />
            <span>Market Open · Low Latency</span>
            <span style={{ marginLeft: 'auto', color: '#C9A84C' }}>99.9% Uptime</span>
          </div>
        </div>
      </div>
      {/* Hinge */}
      <div style={mb.hinge} />
      {/* Base */}
      <div style={mb.base}>
        <div style={mb.baseReflect} />
      </div>
    </div>
  );
};

const mb: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '360px' },
  screen: {
    width: '360px',
    background: '#0D1424',
    border: '2px solid #2A3550',
    borderBottom: 'none',
    borderRadius: '10px 10px 0 0',
    padding: '10px 10px 0',
    position: 'relative',
    boxShadow: '0 0 0 1px rgba(201,168,76,0.12) inset',
  },
  notch: {
    position: 'absolute',
    top: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '6px',
    background: '#1C2640',
    borderRadius: '0 0 4px 4px',
    zIndex: 2,
  },
  screenInner: {
    background: '#0A0F1E',
    borderRadius: '6px 6px 0 0',
    overflow: 'hidden',
    border: '1px solid #1C2640',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    background: '#111827',
    borderBottom: '1px solid rgba(201,168,76,0.12)',
    gap: '8px',
  },
  topDots: { display: 'flex', gap: '4px' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block' },
  topTitle: { fontSize: '8px', color: '#5A6A85', fontFamily: 'Jost, sans-serif', letterSpacing: '0.08em', flex: 1, textAlign: 'center' },
  topRight: { display: 'flex', alignItems: 'center' },
  badge: { fontSize: '7px', color: '#2DD4A0', fontFamily: 'Jost, sans-serif', letterSpacing: '0.1em' },
  chartArea: { padding: '8px 10px 4px' },
  divider: { height: '1px', background: 'rgba(201,168,76,0.08)', margin: '0 10px' },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    background: '#111827',
    borderTop: '1px solid rgba(201,168,76,0.1)',
    fontSize: '7px',
    color: '#5A6A85',
    fontFamily: 'Jost, sans-serif',
    letterSpacing: '0.08em',
  },
  statusDot: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: '#2DD4A0', display: 'inline-block', flexShrink: 0,
  },
  hinge: {
    width: '100%',
    height: '4px',
    background: 'linear-gradient(180deg, #2A3550, #1C2640)',
    borderRadius: '0 0 2px 2px',
  },
  base: {
    width: '400px',
    height: '12px',
    background: '#1C2640',
    borderRadius: '0 0 8px 8px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #2A3550',
    borderTop: 'none',
  },
  baseReflect: {
    position: 'absolute',
    top: '3px',
    left: '30%',
    width: '40%',
    height: '2px',
    background: 'rgba(201,168,76,0.12)',
    borderRadius: '2px',
  },
};

/* ── iPhone mockup ── */
const mobileAssets = [
  { sym: 'BTC', price: '$75,186', change: '2.81%', up: false, candles: genCandles(0, 8)   },
  { sym: 'ETH', price: '$2,308',  change: '1.07%', up: false, candles: genCandles(500, 8) },
  { sym: 'BNB', price: '$626.25', change: '3.81%', up: true,  candles: genCandles(200, 8) },
  { sym: 'SOL', price: '$85.07',  change: '0.30%', up: false, candles: genCandles(900, 8) },
];

const IPhone: React.FC = () => (
  <div style={ph.wrap}>
    {/* Phone body */}
    <div style={ph.body}>
      {/* Side buttons */}
      <div style={ph.volUp} />
      <div style={ph.volDn} />
      <div style={ph.power} />
      {/* Screen */}
      <div style={ph.screen}>
        {/* Dynamic Island */}
        <div style={ph.island} />
        {/* App content */}
        <div style={ph.content}>
          {/* App header */}
          <div style={ph.appHeader}>
            <span style={ph.appLogo}>H</span>
            <span style={ph.appTitle}>Vantrex</span>
            <span style={ph.appBell}>🔔</span>
          </div>
          {/* Greeting */}
          <div style={ph.greeting}>Markets</div>
          {/* Asset rows */}
          {mobileAssets.map(a => (
            <div key={a.sym} style={ph.assetCard}>
              <div style={ph.assetLeft}>
                <div style={ph.assetIcon}>{a.sym.slice(0,3)}</div>
                <div>
                  <div style={ph.assetSym}>{a.sym}</div>
                  <div style={{ ...ph.assetChg, color: a.up ? '#2DD4A0' : '#FF5A5A' }}>
                    {a.up ? '▲' : '▼'} {a.change}
                  </div>
                </div>
              </div>
              <MiniChart candles={a.candles} />
              <div style={ph.assetPrice}>{a.price}</div>
            </div>
          ))}
          {/* Bottom nav */}
          <div style={ph.bottomNav}>
            {['◎', '↗', '⊕', '☰'].map((ic, i) => (
              <div key={i} style={{ ...ph.navIcon, color: i === 0 ? '#C9A84C' : '#5A6A85' }}>{ic}</div>
            ))}
          </div>
        </div>
      </div>
      {/* Home indicator */}
      <div style={ph.homeBar} />
    </div>
  </div>
);

const ph: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  body: {
    width: '160px',
    background: '#111827',
    borderRadius: '32px',
    border: '2px solid #2A3550',
    padding: '10px',
    position: 'relative',
    boxShadow: '0 0 0 1px rgba(201,168,76,0.1) inset, 4px 12px 40px rgba(0,0,0,0.6)',
  },
  volUp: {
    position: 'absolute', left: '-4px', top: '72px',
    width: '3px', height: '22px', background: '#2A3550', borderRadius: '2px 0 0 2px',
  },
  volDn: {
    position: 'absolute', left: '-4px', top: '102px',
    width: '3px', height: '22px', background: '#2A3550', borderRadius: '2px 0 0 2px',
  },
  power: {
    position: 'absolute', right: '-4px', top: '88px',
    width: '3px', height: '32px', background: '#2A3550', borderRadius: '0 2px 2px 0',
  },
  screen: {
    background: '#0A0F1E',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '320px',
  },
  island: {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '12px',
    background: '#000',
    borderRadius: '8px',
    zIndex: 10,
  },
  content: {
    padding: '28px 10px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  appHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  },
  appLogo: {
    width: '18px',
    height: '18px',
    background: '#C9A84C',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    color: '#0A0F1E',
    fontFamily: 'Jost, sans-serif',
    textAlign: 'center',
    lineHeight: '18px',
  },
  appTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#F0EDE6',
    fontFamily: 'Jost, sans-serif',
    letterSpacing: '0.08em',
    flex: 1,
  },
  appBell: { fontSize: '10px' },
  greeting: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#F0EDE6',
    fontFamily: 'Jost, sans-serif',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  assetCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1C2640',
    borderRadius: '8px',
    padding: '6px 8px',
    gap: '4px',
  },
  assetLeft: { display: 'flex', alignItems: 'center', gap: '6px', minWidth: '50px' },
  assetIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#2A3550',
    border: '1px solid rgba(201,168,76,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '6px',
    fontWeight: 700,
    color: '#C9A84C',
    fontFamily: 'Jost, sans-serif',
    flexShrink: 0,
  },
  assetSym: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#F0EDE6',
    fontFamily: 'Jost, sans-serif',
    letterSpacing: '0.04em',
  },
  assetChg: {
    fontSize: '7px',
    fontWeight: 500,
    fontFamily: 'Jost, sans-serif',
  },
  assetPrice: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#F0EDE6',
    fontFamily: 'Jost, sans-serif',
    textAlign: 'right',
    minWidth: '40px',
  },
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 2px',
    borderTop: '1px solid rgba(201,168,76,0.1)',
    marginTop: '4px',
  },
  navIcon: {
    fontSize: '14px',
    cursor: 'pointer',
  },
  homeBar: {
    width: '40px',
    height: '3px',
    background: '#2A3550',
    borderRadius: '2px',
    margin: '8px auto 0',
  },
};

/* ── Hero component ── */
const Hero: React.FC = () => {
  return (
    <>
      {/* Ticker */}
      <div style={styles.tickerBar}>
        <div style={styles.tickerScroll}>
          {[...tickerData, ...tickerData].map((item, i) => (
            <div key={i} style={styles.tickerItem}>
              <span style={styles.tickerSym}>{item.sym}</span>
              <span style={styles.tickerPrice}>{item.price}</span>
              <span style={{ color: item.up ? 'var(--green)' : 'var(--red)', fontSize: '11px', letterSpacing: '0.04em' }}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero section */}
      <section className="hero-grid">
        {/* Left — copy */}
        <div>
          <div style={styles.heroLabel}>
            <span style={styles.heroLabelLine} />
            Professional Trading
          </div>
          <h1 className="hero-h1" style={styles.h1Base}>
            Trade With<br />
            <strong style={styles.h1Strong}>Precision</strong>
            <span style={{ fontWeight: 300 }}> &amp; Confidence</span>
          </h1>
          <p style={styles.heroSub}>
            Access real-time crypto markets with institutional-grade tools,
            lightning-fast execution, and zero overnight fees on major assets.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary}
              onClick={() => window.__goAuth?.()}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
            >Open Account</button>
            <button style={styles.btnOutline}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >Explore Markets</button>
          </div>
        </div>

        {/* Right — device mockups */}
        <div style={styles.devicesWrap}>
          {/* MacBook behind / left */}
          <div style={styles.macbookPos}>
            <MacBook />
          </div>
          {/* iPhone in front / right */}
          <div style={styles.iphonePos}>
            <IPhone />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="metrics-strip" style={styles.metricsStripBase}>
        {metrics.map(m => (
          <div key={m.label} style={styles.metric}>
            <div style={styles.metricVal}>{m.value}</div>
            <div style={styles.metricLabel}>{m.label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tickerBar: {
    background: 'var(--navy-mid)',
    borderBottom: '1px solid var(--border)',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tickerScroll: {
    display: 'flex',
    gap: '40px',
    animation: 'ticker 28s linear infinite',
    whiteSpace: 'nowrap',
    paddingLeft: '40px',
  },
  tickerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '11px',
    letterSpacing: '0.08em',
  },
  tickerSym:   { fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase' },
  tickerPrice: { color: 'var(--text-primary)' },

  heroLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  heroLabelLine: {
    display: 'inline-block',
    width: '24px',
    height: '1px',
    background: 'var(--gold)',
    flexShrink: 0,
  },
  h1Base: {
    fontWeight: 300,
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
    marginBottom: '24px',
  },
  h1Strong: {
    fontWeight: 600,
    color: 'var(--gold)',
    display: 'block',
  },
  heroSub: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    letterSpacing: '0.03em',
    marginBottom: '36px',
  },
  heroActions: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--navy)',
    background: 'var(--gold)',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '2px',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  btnOutline: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    background: 'transparent',
    border: '1px solid var(--gold)',
    padding: '13px 28px',
    borderRadius: '2px',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },

  /* Device mockup layout */
  devicesWrap: {
    position: 'relative',
    height: '340px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  macbookPos: {
    position: 'absolute',
    left: '0',
    bottom: '0',
    zIndex: 1,
    transform: 'scale(0.92)',
    transformOrigin: 'bottom left',
    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
  },
  iphonePos: {
    position: 'absolute',
    right: '0',
    bottom: '20px',
    zIndex: 2,
    animation: 'floatPhone 4s ease-in-out infinite',
    filter: 'drop-shadow(0 16px 32px rgba(201,168,76,0.12)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
  },

  metricsStripBase: {
    background: 'var(--navy-mid)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  metric: { textAlign: 'center' as const },
  metricVal: {
    fontSize: '28px',
    fontWeight: 300,
    color: 'var(--gold)',
    letterSpacing: '-0.01em',
    lineHeight: 1,
    marginBottom: '6px',
  },
  metricLabel: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
};

export default Hero;