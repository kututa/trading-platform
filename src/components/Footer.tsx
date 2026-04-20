import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div className="footer-top">
        <div>
          <div style={styles.logo}>
            Horizon<span style={styles.logoSpan}> Markets</span>
          </div>
          <p style={styles.tagline}>Your gateway to professional crypto trading.</p>
        </div>

        <div className="footer-links-group">
          {[
            { heading: 'Platform', links: ['Markets', 'Trade', 'Assets', 'Pricing'] },
            { heading: 'Company',  links: ['About', 'Careers', 'Blog', 'Press']    },
            { heading: 'Support',  links: ['Help Center', 'Contact', 'Legal', 'Privacy'] },
          ].map(col => (
            <div key={col.heading} style={styles.linkCol}>
              <div style={styles.linkHeading}>{col.heading}</div>
              {col.links.map(l => (
                <a
                  key={l}
                  href="#"
                  style={styles.link}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footerBottom}>
        <div style={styles.footerCopy}>© 2025 Horizon Markets. All rights reserved.</div>
        <div style={styles.footerLegal}>
          Horizon (SC) Ltd · FSA Seychelles SD016 &nbsp;|&nbsp;
          Horizon B.V. · CBCS Curaçao 7629LSI &nbsp;|&nbsp;
          Horizon (VG) Ltd · FSC BVI SIBA/L/20/9266
        </div>
        <div style={styles.riskWarning}>
          Risk Warning: Trading complex derivative products carries a high risk of losing money rapidly due to leverage.
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: 'var(--navy-mid)',
    borderTop: '1px solid var(--border)',
    padding: '48px 40px 28px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '12px',
    fontFamily: 'var(--futura)',
  },
  logoSpan: { color: 'var(--text-primary)', fontWeight: 300 },
  tagline: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    maxWidth: '220px',
    lineHeight: 1.6,
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  linkHeading: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  },
  link: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
    textDecoration: 'none',
  },
  footerBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerCopy: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
  },
  footerLegal: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    opacity: 0.7,
  },
  riskWarning: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    opacity: 0.6,
    maxWidth: '700px',
    lineHeight: 1.5,
  },
};

export default Footer;