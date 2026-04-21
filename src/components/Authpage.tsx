import React, { useState, useMemo } from 'react';
import CountryList from 'country-list-with-dial-code-and-flag';

/* ── Country list from package ── */
interface Country {
  code: string;  // dial code, e.g. "+254"
  name: string;  // country name, e.g. "Kenya"
  flag: string;  // emoji flag, e.g. "🇰🇪"
}

interface CountryRecord {
  name?: string;
  dial_code?: string;
  flag?: string;
}

type CountryListApi = {
  getAll?: () => unknown;
};

function toCountryArray(value: unknown): CountryRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CountryRecord => typeof item === 'object' && item !== null);
}

function resolveRawCountries(): CountryRecord[] {
  try {
    const mod = CountryList as unknown;

    if (typeof mod === 'object' && mod !== null) {
      const modObj = mod as Record<string, unknown>;
      const api = modObj as CountryListApi;

      if (typeof api.getAll === 'function') {
        return toCountryArray(api.getAll());
      }

      const defaultApi = modObj.default as CountryListApi | undefined;
      if (defaultApi && typeof defaultApi.getAll === 'function') {
        return toCountryArray(defaultApi.getAll());
      }
    }

    return toCountryArray(mod);
  } catch {
    return [];
  }
}

// The package exports objects with shape: { name, dial_code, flag }
// Transform and sort alphabetically; default dial code = Kenya (+254)
const rawCountries = resolveRawCountries();

const COUNTRIES: Country[] = (Array.isArray(rawCountries)
  ? rawCountries
  : [])
  .map(c => ({
    code: c.dial_code ?? '',
    name: c.name ?? '',
    flag: c.flag ?? '',
  }))
  .filter(c => c.code.length > 0 && c.name.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

const DEFAULT_DIAL_CODE = COUNTRIES.find(c => c.code === '+1')?.code ?? '+1';

/* ── Password strength ── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Weak',   color: '#FF5A5A' },
    { label: 'Fair',   color: '#F5A623' },
    { label: 'Good',   color: '#C9A84C' },
    { label: 'Strong', color: '#2DD4A0' },
  ];
  return { score, label: map[score - 1]?.label ?? 'Weak', color: map[score - 1]?.color ?? '#FF5A5A' };
}

/* ── Decorative candlestick background ── */
const BG_CANDLES = [
  [0.6,0.9,0.5,0.8,true],[0.55,0.75,0.45,0.6,false],[0.58,0.8,0.5,0.72,true],
  [0.7,0.85,0.6,0.65,false],[0.62,0.78,0.55,0.74,true],[0.7,0.9,0.62,0.8,true],
  [0.75,0.88,0.65,0.7,false],[0.68,0.82,0.6,0.76,true],[0.72,0.9,0.65,0.85,true],
  [0.8,0.95,0.7,0.75,false],
];

const DecoBg: React.FC = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
  >
    {BG_CANDLES.map(([o, h, l, c, bull], i) => {
      const x    = 20 + i * 38;
      const scaleY = 500;
      const oy = 600 - Number(o) * scaleY;
      const cy = 600 - Number(c) * scaleY;
      const hy = 600 - Number(h) * scaleY;
      const ly = 600 - Number(l) * scaleY;
      const by = Math.min(oy, cy);
      const bh = Math.max(Math.abs(oy - cy), 4);
      const col = bull ? '#2DD4A0' : '#FF5A5A';
      return (
        <g key={i}>
          <line x1={x} y1={hy} x2={x} y2={ly} stroke={col} strokeWidth="1.5" />
          <rect x={x - 8} y={by} width={16} height={bh} fill={col} rx="1" />
        </g>
      );
    })}
    <polyline
      points={BG_CANDLES.map(([, , c], i) => `${20 + i * 38},${600 - Number(c) * 500}`).join(' ')}
      fill="none"
      stroke="#C9A84C"
      strokeWidth="1"
      strokeDasharray="4 3"
    />
  </svg>
);

/* ── Country Select Options (memoized) ── */
const CountryOptions: React.FC = React.memo(() => (
  <>
    {COUNTRIES.map((c, i) => (
      <option key={`${c.code}-${i}`} value={c.code}>
        {c.flag} {c.code} {c.name}
      </option>
    ))}
  </>
));
CountryOptions.displayName = 'CountryOptions';

/* ══════════════════════════════════════════
   REGISTER FORM
══════════════════════════════════════════ */
const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    dialCode: DEFAULT_DIAL_CODE, phone: '', password: '', confirm: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={s.successWrap}>
        <div style={s.successIcon}>✓</div>
        <h2 style={s.successTitle}>Account Created!</h2>
        <p style={s.successSub}>Welcome to Horizon Markets. You can now sign in.</p>
        <button
          style={s.btnGold}
          onClick={() => { setSubmitted(false); onSwitch(); }}
          onMouseEnter={e => (e.currentTarget.style.background = '#E8D5A3')}
          onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={s.form} noValidate>

      {/* First Name / Last Name */}
      <div className="auth-name-row" style={s.row2}>
        <div style={s.fieldWrap}>
          <label style={s.label}>First Name</label>
          <input
            className="auth-input"
            style={{ ...s.input, ...(focused === 'fn' ? s.inputFocused : {}) }}
            placeholder="John"
            value={form.firstName}
            onChange={e => set('firstName', e.target.value)}
            onFocus={() => setFocused('fn')}
            onBlur={() => setFocused(null)}
            required
          />
        </div>
        <div style={s.fieldWrap}>
          <label style={s.label}>Last Name</label>
          <input
            className="auth-input"
            style={{ ...s.input, ...(focused === 'ln' ? s.inputFocused : {}) }}
            placeholder="Doe"
            value={form.lastName}
            onChange={e => set('lastName', e.target.value)}
            onFocus={() => setFocused('ln')}
            onBlur={() => setFocused(null)}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Email Address</label>
        <input
          className="auth-input"
          type="email"
          style={{ ...s.input, ...(focused === 'email' ? s.inputFocused : {}) }}
          placeholder="john@example.com"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          required
        />
      </div>

      {/* Phone */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Phone Number</label>
        <div
          className="auth-phone-row"
          style={{ ...s.phoneRow, ...(focused === 'phone' ? s.phoneRowFocused : {}) }}
        >
          <select
            className="auth-dial-select"
            style={s.dialSelect}
            value={form.dialCode}
            onChange={e => set('dialCode', e.target.value)}
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused(null)}
          >
            <CountryOptions />
          </select>
          <div style={s.phoneDivider} />
          <input
            type="tel"
            className="auth-phone-input"
            style={s.phoneInput}
            placeholder="000 000 0000"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused(null)}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Password</label>
        <div style={s.pwWrap}>
          <input
            className="auth-input"
            type={showPw ? 'text' : 'password'}
            style={{ ...s.input, paddingRight: '48px', ...(focused === 'pw' ? s.inputFocused : {}) }}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(null)}
            required
          />
          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
        {form.password.length > 0 && (
          <div style={s.strengthWrap}>
            <div style={s.strengthBar}>
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  style={{
                    ...s.strengthSeg,
                    background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
            <span style={{ ...s.strengthLabel, color: strength.color }}>{strength.label}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Confirm Password</label>
        <div style={s.pwWrap}>
          <input
            className="auth-input"
            type={showCf ? 'text' : 'password'}
            style={{
              ...s.input,
              paddingRight: '48px',
              ...(focused === 'cf' ? s.inputFocused : {}),
              ...(form.confirm && form.confirm !== form.password ? { borderColor: '#FF5A5A' } : {}),
            }}
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={e => set('confirm', e.target.value)}
            onFocus={() => setFocused('cf')}
            onBlur={() => setFocused(null)}
            required
          />
          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowCf(v => !v)}
            tabIndex={-1}
            aria-label="Toggle confirm password visibility"
          >
            {showCf ? '🙈' : '👁'}
          </button>
        </div>
        {form.confirm && form.confirm !== form.password && (
          <span style={s.errorMsg}>Passwords do not match</span>
        )}
      </div>

      {/* Terms */}
      <p style={s.terms}>
        By creating an account you agree to our{' '}
        <span style={s.termsLink}>Terms of Service</span> and{' '}
        <span style={s.termsLink}>Privacy Policy</span>.
      </p>

      {/* Submit */}
      <button
        type="submit"
        style={s.btnGold}
        onMouseEnter={e => (e.currentTarget.style.background = '#E8D5A3')}
        onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}
      >
        Create Account
      </button>

      {/* Switch */}
      <p style={s.switchText}>
        Already have an account?{' '}
        <span style={s.switchLink} onClick={onSwitch} role="button" tabIndex={0}>
          Sign In
        </span>
      </p>
    </form>
  );
};

/* ══════════════════════════════════════════
   LOGIN FORM
══════════════════════════════════════════ */
const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={s.form} noValidate>

      {/* Email */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Email Address</label>
        <input
          className="auth-input"
          type="email"
          style={{ ...s.input, ...(focused === 'email' ? s.inputFocused : {}) }}
          placeholder="john@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          required
        />
      </div>

      {/* Password */}
      <div style={s.fieldWrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={s.label}>Password</label>
          <span style={s.forgotLink} role="button" tabIndex={0}>Forgot password?</span>
        </div>
        <div style={s.pwWrap}>
          <input
            className="auth-input"
            type={showPw ? 'text' : 'password'}
            style={{ ...s.input, paddingRight: '48px', ...(focused === 'pw' ? s.inputFocused : {}) }}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(null)}
            required
          />
          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{ ...s.btnGold, marginTop: '8px' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#E8D5A3')}
        onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}
      >
        {submitted ? '✓ Welcome Back' : 'Sign In'}
      </button>

      {/* Divider */}
      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>or continue with</span>
        <div style={s.dividerLine} />
      </div>

      {/* Social buttons */}
      <div className="auth-social-row" style={s.socialRow}>
        {['Google', 'Apple'].map(p => (
          <button
            key={p}
            type="button"
            style={s.socialBtn}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
          >
            {p === 'Google' ? '🔵' : '⚫'} {p}
          </button>
        ))}
      </div>

      <p style={s.switchText}>
        Don't have an account?{' '}
        <span style={s.switchLink} onClick={onSwitch} role="button" tabIndex={0}>
          Create Account
        </span>
      </p>
    </form>
  );
};

/* ══════════════════════════════════════════
   MAIN AUTH PAGE
══════════════════════════════════════════ */
const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  return (
    <>
      {/* ── Global + responsive styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          height: 100%;
          overflow-x: hidden;
        }

        body {
          font-family: 'Jost', 'Trebuchet MS', 'Century Gothic', sans-serif;
          background: #0A0F1E;
          -webkit-text-size-adjust: 100%;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0F1E; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }

        /* Placeholder */
        .auth-input::placeholder { color: #3A4A65; }
        .auth-phone-input::placeholder { color: #3A4A65; }

        /* Select dropdown option */
        .auth-dial-select option {
          background: #111827;
          color: #F0EDE6;
        }

        /* Touch-friendly tap highlight removal */
        .auth-input,
        .auth-dial-select,
        .auth-phone-input,
        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* ── TABLET (≤ 900px): hide left panel, full-width form ── */
        @media (max-width: 900px) {
          .auth-page {
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            min-height: 100dvh !important;
          }
          .auth-left {
            display: none !important;
          }
          .auth-right {
            width: 100% !important;
            max-width: 520px !important;
            flex: none !important;
            border-left: none !important;
            padding: 40px 32px 60px !important;
            margin: 0 auto !important;
          }
          .auth-form {
            max-width: 100% !important;
          }
        }

        /* ── MOBILE (≤ 600px): tighter padding ── */
        @media (max-width: 600px) {
          .auth-right {
            padding: 28px 20px 56px !important;
          }
          /* Name row: stack to single column */
          .auth-name-row {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          /* Social row: stack to single column on very small screens */
          .auth-social-row {
            grid-template-columns: 1fr !important;
          }
        }

        /* ── SMALL MOBILE (≤ 400px) ── */
        @media (max-width: 400px) {
          .auth-right {
            padding: 24px 16px 48px !important;
          }
          .auth-tabs {
            gap: 0 !important;
          }
          .auth-tab {
            padding-right: 16px !important;
            font-size: 10px !important;
          }
          .auth-form-title {
            font-size: 22px !important;
          }
        }

        /* ── Ensure phone row never overflows ── */
        .auth-phone-row {
          min-width: 0;
          width: 100%;
        }
        .auth-dial-select {
          min-width: 0;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .auth-phone-input {
          min-width: 0;
          flex: 1 1 0%;
        }

        /* ── Inputs: always full width, large enough tap target ── */
        .auth-input {
          width: 100% !important;
          min-height: 44px;
        }

        /* ── All buttons: full width on mobile, min tap height ── */
        .auth-btn-gold {
          width: 100% !important;
          min-height: 48px !important;
        }
        .auth-social-btn {
          min-height: 44px !important;
        }

        /* ── Prevent body scroll when focused on mobile ── */
        @media (max-width: 900px) {
          .auth-right {
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="auth-page" style={s.page}>

        {/* ── Left branding panel ── */}
        <div className="auth-left" style={s.leftPanel}>
          <DecoBg />
          <div style={s.leftContent}>
            <div style={s.brandLogo}>
              Horizon<span style={s.brandLogoSpan}> Markets</span>
            </div>
            <div style={s.leftDivider} />
            <h2 style={s.leftHeading}>
              Trade Smarter.<br />
              <span style={s.leftHeadingGold}>Build Wealth.</span>
            </h2>
            <p style={s.leftSub}>
              Join 50,000+ traders who trust Horizon Markets for
              real-time data, low-fee execution, and enterprise-grade security.
            </p>
            <div style={s.badges}>
              {['FSA Regulated', 'PCI DSS Compliant', '99.9% Uptime'].map(b => (
                <div key={b} style={s.badge}>
                  <span style={s.badgeDot} />
                  {b}
                </div>
              ))}
            </div>
            <div style={s.miniStats}>
              {[['$2.5B+', 'Volume'], ['100+', 'Pairs'], ['0%', 'Overnight Fees']].map(([v, l]) => (
                <div key={l} style={s.miniStat}>
                  <div style={s.miniStatVal}>{v}</div>
                  <div style={s.miniStatLabel}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-right" style={s.rightPanel}>

          {/* Tabs */}
          <div className="auth-tabs" style={s.tabs}>
            <button
              className="auth-tab"
              style={{ ...s.tab, ...(mode === 'register' ? s.tabActive : {}) }}
              onClick={() => setMode('register')}
            >
              Create Account
            </button>
            <button
              className="auth-tab"
              style={{ ...s.tab, ...(mode === 'login' ? s.tabActive : {}) }}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
          </div>

          {/* Form heading */}
          <div style={s.formHeader}>
            {mode === 'register' ? (
              <>
                <h1 className="auth-form-title" style={s.formTitle}>Create an Account</h1>
                <p style={s.formSub}>Start trading crypto with Horizon Markets</p>
              </>
            ) : (
              <>
                <h1 className="auth-form-title" style={s.formTitle}>Welcome Back</h1>
                <p style={s.formSub}>Sign in to your Horizon Markets account</p>
              </>
            )}
          </div>

          {/* Form */}
          <div className="auth-form" style={{ width: '100%', maxWidth: '480px' }}>
            {mode === 'register'
              ? <RegisterForm onSwitch={() => setMode('login')} />
              : <LoginForm    onSwitch={() => setMode('register')} />
            }
          </div>
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════
   STYLES (inline — desktop baseline)
══════════════════════════════════════════ */
const s: Record<string, React.CSSProperties> = {
  /* Page wrapper */
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Jost', 'Trebuchet MS', 'Century Gothic', sans-serif",
    background: '#0A0F1E',
    overflowX: 'hidden',
  },

  /* Left branding panel */
  leftPanel: {
    width: '42%',
    minHeight: '100vh',
    background: '#0D1424',
    borderRight: '1px solid rgba(201,168,76,0.14)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    padding: '60px 48px',
  },
  brandLogo: {
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#C9A84C',
    marginBottom: '28px',
  },
  brandLogoSpan: {
    color: '#F0EDE6',
    fontWeight: 300,
  },
  leftDivider: {
    width: '32px',
    height: '2px',
    background: '#C9A84C',
    marginBottom: '28px',
    borderRadius: '1px',
  },
  leftHeading: {
    fontSize: '34px',
    fontWeight: 300,
    lineHeight: 1.15,
    color: '#F0EDE6',
    letterSpacing: '-0.01em',
    marginBottom: '18px',
  },
  leftHeadingGold: {
    fontWeight: 600,
    color: '#C9A84C',
  },
  leftSub: {
    fontSize: '13px',
    color: '#A8B3C8',
    lineHeight: 1.7,
    letterSpacing: '0.03em',
    marginBottom: '32px',
    maxWidth: '320px',
  },
  badges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '36px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: '#A8B3C8',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#2DD4A0',
    display: 'inline-block',
    flexShrink: 0,
  },
  miniStats: {
    display: 'flex',
    gap: '28px',
    paddingTop: '28px',
    borderTop: '1px solid rgba(201,168,76,0.12)',
    flexWrap: 'wrap',
  },
  miniStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  miniStatVal: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#C9A84C',
    letterSpacing: '-0.01em',
  },
  miniStatLabel: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#5A6A85',
  },

  /* Right form panel */
  rightPanel: {
    flex: 1,
    overflowY: 'auto',
    padding: '48px 52px',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(201,168,76,0.08)',
    minWidth: 0,
  },

  /* Tabs */
  tabs: {
    display: 'flex',
    marginBottom: '36px',
    borderBottom: '1px solid rgba(201,168,76,0.14)',
  },
  tab: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#5A6A85',
    background: 'none',
    border: 'none',
    padding: '10px 24px 10px 0',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition: 'color 0.2s, border-color 0.2s',
    minHeight: '44px',
  },
  tabActive: {
    color: '#C9A84C',
    borderBottomColor: '#C9A84C',
  },

  /* Form header */
  formHeader: {
    marginBottom: '28px',
  },
  formTitle: {
    fontSize: '26px',
    fontWeight: 600,
    color: '#F0EDE6',
    letterSpacing: '-0.01em',
    marginBottom: '6px',
  },
  formSub: {
    fontSize: '13px',
    color: '#5A6A85',
    letterSpacing: '0.03em',
  },

  /* Form */
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '100%',
  },

  /* Two-column name row (desktop) */
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },

  /* Field wrapper */
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    minWidth: 0,
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#5A6A85',
  },

  /* Text input */
  input: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '16px',
    color: '#F0EDE6',
    background: '#111827',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '3px',
    padding: '12px 14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    letterSpacing: '0.02em',
    minHeight: '44px',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  inputFocused: {
    borderColor: 'rgba(201,168,76,0.6)',
  },

  /* Phone row */
  phoneRow: {
    display: 'flex',
    alignItems: 'stretch',
    background: '#111827',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '3px',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
    width: '100%',
    minWidth: 0,
    minHeight: '44px',
  },
  phoneRowFocused: {
    borderColor: 'rgba(201,168,76,0.6)',
  },
  dialSelect: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px',
    color: '#C9A84C',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '12px 6px 12px 12px',
    cursor: 'pointer',
    maxWidth: '120px',
    minWidth: 0,
    flexShrink: 0,
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  phoneDivider: {
    width: '1px',
    background: 'rgba(201,168,76,0.14)',
    margin: '8px 0',
    flexShrink: 0,
  },
  phoneInput: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '16px',
    color: '#F0EDE6',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '12px 14px',
    flex: '1 1 0%',
    minWidth: 0,
    letterSpacing: '0.02em',
    width: '100%',
  },

  /* Password wrapper */
  pwWrap: {
    position: 'relative' as const,
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    padding: '8px',
    opacity: 0.6,
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Password strength */
  strengthWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '6px',
  },
  strengthBar: {
    display: 'flex',
    gap: '4px',
    flex: 1,
  },
  strengthSeg: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 0.3s',
  },
  strengthLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  errorMsg: {
    fontSize: '11px',
    color: '#FF5A5A',
    letterSpacing: '0.04em',
  },

  /* Terms */
  terms: {
    fontSize: '11px',
    color: '#5A6A85',
    lineHeight: 1.6,
    letterSpacing: '0.03em',
  },
  termsLink: {
    color: '#C9A84C',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },

  /* Gold submit button */
  btnGold: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#0A0F1E',
    background: '#C9A84C',
    border: 'none',
    padding: '15px',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    width: '100%',
    minHeight: '48px',
  },

  /* Divider */
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(201,168,76,0.12)',
  },
  dividerText: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#5A6A85',
    flexShrink: 0,
  },

  /* Social row */
  socialRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  socialBtn: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: '#A8B3C8',
    background: '#111827',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '3px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '44px',
  },

  /* Switch text */
  switchText: {
    fontSize: '12px',
    color: '#5A6A85',
    textAlign: 'center' as const,
    letterSpacing: '0.04em',
    marginTop: '4px',
  },
  switchLink: {
    color: '#C9A84C',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  forgotLink: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#C9A84C',
    cursor: 'pointer',
  },

  /* Success state */
  successWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px 0',
    textAlign: 'center' as const,
  },
  successIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(45,212,160,0.12)',
    border: '1px solid rgba(45,212,160,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    color: '#2DD4A0',
  },
  successTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#F0EDE6',
    letterSpacing: '-0.01em',
  },
  successSub: {
    fontSize: '13px',
    color: '#5A6A85',
    letterSpacing: '0.03em',
    marginBottom: '8px',
  },
};

export default AuthPage;