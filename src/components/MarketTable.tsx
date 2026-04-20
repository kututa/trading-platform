import React from 'react';

interface Asset {
  sym: string;
  name: string;
  price: string;
  change: string;
  high: string;
  low: string;
  up: boolean;
}

const assets: Asset[] = [
  { sym: 'BTC',  name: 'Bitcoin',  price: '$75,186.03', change: '2.81%', high: '$76,240.66', low: '$73,724.31', up: false },
  { sym: 'ETH',  name: 'Ethereum', price: '$2,308.92',  change: '1.07%', high: '$2,350.24',  low: '$2,252.72',  up: false },
  { sym: 'BNB',  name: 'BNB',      price: '$626.25',    change: '3.81%', high: '$629.48',    low: '$615.00',    up: true  },
  { sym: 'SOL',  name: 'Solana',   price: '$85.07',     change: '0.30%', high: '$87.12',     low: '$82.94',     up: false },
  { sym: 'XRP',  name: 'Ripple',   price: '$1.42',      change: '0.01%', high: '$1.45',      low: '$1.39',      up: false },
  { sym: 'DOGE', name: 'Dogecoin', price: '$0.0946',    change: '0.12%', high: '$0.0964',    low: '$0.0926',    up: true  },
  { sym: 'ADA',  name: 'Cardano',  price: '$0.2466',    change: '0.08%', high: '$0.2509',    low: '$0.2408',    up: false },
  { sym: 'TRX',  name: 'TRON',     price: '$0.3298',    change: '0.05%', high: '$0.3366',    low: '$0.3282',    up: true  },
];

const MarketTable: React.FC = () => {
  return (
    <section className="section-wrap">
      <div style={styles.sectionLabelRow}>
        <span style={styles.labelLine} />
        Live Updates
      </div>
      <h2 style={styles.sectionTitle}>
        Real-Time <strong style={styles.strong}>Market Prices</strong>
      </h2>

      {/* Scrollable on mobile */}
      <div className="table-wrapper">
        <table style={styles.table}>
          <thead>
            <tr>
              {['Asset', 'Price', '24h Change', '24h High', '24h Low', ''].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr
                key={asset.sym}
                style={styles.tr}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={styles.td}>
                  <div style={styles.assetCell}>
                    <div style={styles.assetIcon}>{asset.sym.slice(0, 3)}</div>
                    <div>
                      <div style={styles.assetSym}>{asset.sym}</div>
                      <div style={styles.assetName}>{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...styles.td, fontWeight: 500 }}>{asset.price}</td>
                <td style={{ ...styles.td, color: asset.up ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
                  {asset.up ? '▲' : '▼'} {asset.change}
                </td>
                <td style={{ ...styles.td, color: 'var(--text-secondary)' }}>{asset.high}</td>
                <td style={{ ...styles.td, color: 'var(--text-secondary)' }}>{asset.low}</td>
                <td style={styles.td}>
                  <button
                    style={styles.tradeBtn}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--gold)';
                      e.currentTarget.style.color = 'var(--navy)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--gold)';
                    }}
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sectionLabelRow: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  labelLine: {
    display: 'inline-block',
    width: '24px',
    height: '1px',
    background: 'var(--gold)',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 300,
    letterSpacing: '-0.01em',
    marginBottom: '32px',
  },
  strong: { fontWeight: 600 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',   // forces scroll on small screens
  },
  th: {
    padding: '14px 20px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    textAlign: 'left',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid rgba(201,168,76,0.06)',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  td: {
    padding: '14px 20px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  assetCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  assetIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'var(--slate)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: 700,
    color: 'var(--gold)',
    flexShrink: 0,
  },
  assetSym:  { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.06em' },
  assetName: { fontSize: '11px', color: 'var(--text-muted)' },
  tradeBtn: {
    fontFamily: 'var(--futura)',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    background: 'transparent',
    border: '1px solid var(--gold)',
    padding: '6px 16px',
    borderRadius: '2px',
    transition: 'background 0.2s, color 0.2s',
    cursor: 'pointer',
  },
};

export default MarketTable;