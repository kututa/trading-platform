import React, { useState } from 'react';

const NAV_ITEMS = ['Markets', 'Trade', 'Assets', 'Platform', 'About'];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = () => setMenuOpen(prev => !prev);
  const close  = () => setMenuOpen(false);

  return (
    <>
      <nav style={styles.nav}>
        {/* Logo */}
        <div style={styles.logo}>
          Horizon<span style={styles.logoSpan}> Markets</span>
        </div>

        {/* Desktop links */}
        <ul className="nav-desktop-links" style={styles.navLinks}>
          {NAV_ITEMS.map(item => (
            <li key={item}>
              <a
                href="#"
                style={styles.navLink}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="nav-desktop-cta" style={styles.navCta}>
          <button
            style={styles.btnGhost}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Sign In
          </button>
          <button
            style={styles.btnGold}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
          >
            Get Started
          </button>
        </div>

        {/* Hamburger button — visible only on mobile via CSS class */}
        <button
          className="nav-hamburger"
          style={styles.hamburger}
          onClick={toggle}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span style={{
            ...styles.bar,
            transform: menuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none',
          }} />
          <span style={{
            ...styles.bar,
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
          }} />
          <span style={{
            ...styles.bar,
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile slide-in drawer */}
      <div
        className="nav-drawer"
        style={{
          ...styles.drawer,
          transform: menuOpen ? 'translateX(0)' : 'translateX(105%)',
        }}
        aria-hidden={!menuOpen}
      >
        <ul style={styles.drawerLinks}>
          {NAV_ITEMS.map(item => (
            <li key={item} style={styles.drawerItem}>
              <a
                href="#"
                style={styles.drawerLink}
                onClick={close}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div style={styles.drawerDivider} />

        <div style={styles.drawerCta}>
          <button style={styles.drawerBtnOutline} onClick={close}>Sign In</button>
          <button style={styles.drawerBtnGold} onClick={close}>Get Started</button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="nav-overlay"
          style={styles.overlay}
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  /* ── Nav bar ── */
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '64px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(10,15,30,0.97)',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    backdropFilter: 'blur(10px)',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    fontFamily: 'var(--futura)',
    flexShrink: 0,
  },
  logoSpan: {
    color: 'var(--text-primary)',
    fontWeight: 300,
  },

  /* Desktop links */
  navLinks: {
    display: 'flex',
    gap: '32px',
    listStyle: 'none',
  },
  navLink: {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontFamily: 'var(--futura)',
  },

  /* Desktop CTA */
  navCta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  btnGhost: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  btnGold: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--navy)',
    background: 'var(--gold)',
    border: 'none',
    padding: '9px 20px',
    borderRadius: '2px',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },

  /* Hamburger */
  hamburger: {
    display: 'none',         // overridden to flex by CSS class on mobile
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    zIndex: 300,
    flexShrink: 0,
  },
  bar: {
    display: 'block',
    width: '22px',
    height: '2px',
    background: 'var(--gold)',
    borderRadius: '2px',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },

  /* Drawer */
  drawer: {
    position: 'fixed',
    top: '64px',
    right: 0,
    width: '280px',
    height: 'calc(100dvh - 64px)',
    background: 'var(--navy-mid)',
    borderLeft: '1px solid var(--border)',
    zIndex: 190,
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 24px 40px',
    gap: '0',
    overflowY: 'auto',
  },
  drawerLinks: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
  },
  drawerItem: {
    borderBottom: '1px solid rgba(201,168,76,0.09)',
  },
  drawerLink: {
    display: 'block',
    padding: '16px 4px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontFamily: 'var(--futura)',
  },
  drawerDivider: {
    height: '1px',
    background: 'var(--border)',
    margin: '28px 0',
  },
  drawerCta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  drawerBtnOutline: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    background: 'transparent',
    border: '1px solid var(--gold)',
    padding: '13px',
    borderRadius: '2px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
  drawerBtnGold: {
    fontFamily: 'var(--futura)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--navy)',
    background: 'var(--gold)',
    border: 'none',
    padding: '13px',
    borderRadius: '2px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },

  /* Overlay */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 180,
    cursor: 'pointer',
  },
};

export default Navbar;