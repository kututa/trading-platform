import React from 'react';

const features = [
  { num: '01', title: 'Instant Execution',   desc: 'Industry-leading order execution speed with minimal slippage, even during peak market volatility.' },
  { num: '02', title: 'Zero Overnight Fees', desc: 'Hold positions overnight at no extra cost on most popular crypto assets. Terms apply.' },
  { num: '03', title: 'Competitive Spreads', desc: 'Consistently tight and stable spreads engineered for high-volatility market conditions.' },
  { num: '04', title: 'Enterprise Security', desc: 'Funds held in segregated accounts with PCI DSS-compliant infrastructure and regular penetration testing.' },
  { num: '05', title: '24/7 Monitoring',     desc: 'Track markets around the clock with live order books, price alerts, and real-time trade feeds.' },
  { num: '06', title: 'Multi-Reg Licensed',  desc: 'Regulated under FSA (Seychelles), CBCS (Curaçao), and FSC (BVI) with full compliance standards.' },
];

const Features: React.FC = () => {
  return (
    <section className="section-wrap">
      <div style={styles.sectionLabelRow}>
        <span style={styles.labelLine} />
        Why Vantrex
      </div>
      <h2 style={styles.sectionTitle}>
        Built for <strong style={styles.strong}>Serious Traders</strong>
      </h2>

      <div className="features-grid">
        {features.map(f => (
          <div
            key={f.num}
            style={styles.card}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={styles.featureNum}>{f.num}</div>
            <div style={styles.featureTitle}>{f.title}</div>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
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
    marginBottom: '48px',
  },
  strong: { fontWeight: 600 },
  card: {
    background: 'var(--navy-light)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '28px',
    transition: 'border-color 0.2s',
  },
  featureNum: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--gold-dark)',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'var(--text-primary)',
    marginBottom: '10px',
    textTransform: 'uppercase',
  },
  featureDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
    letterSpacing: '0.02em',
  },
};

export default Features;