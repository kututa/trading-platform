import React, { useState } from 'react';

/* ── Country list ── */
const COUNTRIES = [
  { code: '+1',   name: 'United States' },
  { code: '+44',  name: 'United Kingdom' },
  { code: '+93',  name: 'Afghanistan' },
  { code: '+355', name: 'Albania' },
  { code: '+213', name: 'Algeria' },
  { code: '+376', name: 'Andorra' },
  { code: '+244', name: 'Angola' },
  { code: '+54',  name: 'Argentina' },
  { code: '+374', name: 'Armenia' },
  { code: '+61',  name: 'Australia' },
  { code: '+43',  name: 'Austria' },
  { code: '+994', name: 'Azerbaijan' },
  { code: '+973', name: 'Bahrain' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+375', name: 'Belarus' },
  { code: '+32',  name: 'Belgium' },
  { code: '+501', name: 'Belize' },
  { code: '+229', name: 'Benin' },
  { code: '+975', name: 'Bhutan' },
  { code: '+591', name: 'Bolivia' },
  { code: '+387', name: 'Bosnia' },
  { code: '+267', name: 'Botswana' },
  { code: '+55',  name: 'Brazil' },
  { code: '+673', name: 'Brunei' },
  { code: '+359', name: 'Bulgaria' },
  { code: '+226', name: 'Burkina Faso' },
  { code: '+257', name: 'Burundi' },
  { code: '+855', name: 'Cambodia' },
  { code: '+237', name: 'Cameroon' },
  { code: '+1',   name: 'Canada' },
  { code: '+238', name: 'Cape Verde' },
  { code: '+236', name: 'Central African Rep.' },
  { code: '+235', name: 'Chad' },
  { code: '+56',  name: 'Chile' },
  { code: '+86',  name: 'China' },
  { code: '+57',  name: 'Colombia' },
  { code: '+269', name: 'Comoros' },
  { code: '+243', name: 'Congo (DRC)' },
  { code: '+242', name: 'Congo' },
  { code: '+506', name: 'Costa Rica' },
  { code: '+385', name: 'Croatia' },
  { code: '+53',  name: 'Cuba' },
  { code: '+357', name: 'Cyprus' },
  { code: '+420', name: 'Czech Republic' },
  { code: '+45',  name: 'Denmark' },
  { code: '+253', name: 'Djibouti' },
  { code: '+593', name: 'Ecuador' },
  { code: '+20',  name: 'Egypt' },
  { code: '+503', name: 'El Salvador' },
  { code: '+240', name: 'Equatorial Guinea' },
  { code: '+291', name: 'Eritrea' },
  { code: '+372', name: 'Estonia' },
  { code: '+268', name: 'Eswatini' },
  { code: '+251', name: 'Ethiopia' },
  { code: '+679', name: 'Fiji' },
  { code: '+358', name: 'Finland' },
  { code: '+33',  name: 'France' },
  { code: '+241', name: 'Gabon' },
  { code: '+220', name: 'Gambia' },
  { code: '+995', name: 'Georgia' },
  { code: '+49',  name: 'Germany' },
  { code: '+233', name: 'Ghana' },
  { code: '+30',  name: 'Greece' },
  { code: '+502', name: 'Guatemala' },
  { code: '+224', name: 'Guinea' },
  { code: '+245', name: 'Guinea-Bissau' },
  { code: '+592', name: 'Guyana' },
  { code: '+509', name: 'Haiti' },
  { code: '+504', name: 'Honduras' },
  { code: '+36',  name: 'Hungary' },
  { code: '+354', name: 'Iceland' },
  { code: '+91',  name: 'India' },
  { code: '+62',  name: 'Indonesia' },
  { code: '+98',  name: 'Iran' },
  { code: '+964', name: 'Iraq' },
  { code: '+353', name: 'Ireland' },
  { code: '+972', name: 'Israel' },
  { code: '+39',  name: 'Italy' },
  { code: '+225', name: 'Ivory Coast' },
  { code: '+81',  name: 'Japan' },
  { code: '+962', name: 'Jordan' },
  { code: '+7',   name: 'Kazakhstan' },
  { code: '+254', name: 'Kenya' },
  { code: '+965', name: 'Kuwait' },
  { code: '+996', name: 'Kyrgyzstan' },
  { code: '+856', name: 'Laos' },
  { code: '+371', name: 'Latvia' },
  { code: '+961', name: 'Lebanon' },
  { code: '+266', name: 'Lesotho' },
  { code: '+231', name: 'Liberia' },
  { code: '+218', name: 'Libya' },
  { code: '+370', name: 'Lithuania' },
  { code: '+352', name: 'Luxembourg' },
  { code: '+261', name: 'Madagascar' },
  { code: '+265', name: 'Malawi' },
  { code: '+60',  name: 'Malaysia' },
  { code: '+960', name: 'Maldives' },
  { code: '+223', name: 'Mali' },
  { code: '+356', name: 'Malta' },
  { code: '+222', name: 'Mauritania' },
  { code: '+230', name: 'Mauritius' },
  { code: '+52',  name: 'Mexico' },
  { code: '+373', name: 'Moldova' },
  { code: '+377', name: 'Monaco' },
  { code: '+976', name: 'Mongolia' },
  { code: '+382', name: 'Montenegro' },
  { code: '+212', name: 'Morocco' },
  { code: '+258', name: 'Mozambique' },
  { code: '+95',  name: 'Myanmar' },
  { code: '+264', name: 'Namibia' },
  { code: '+977', name: 'Nepal' },
  { code: '+31',  name: 'Netherlands' },
  { code: '+64',  name: 'New Zealand' },
  { code: '+505', name: 'Nicaragua' },
  { code: '+227', name: 'Niger' },
  { code: '+234', name: 'Nigeria' },
  { code: '+47',  name: 'Norway' },
  { code: '+968', name: 'Oman' },
  { code: '+92',  name: 'Pakistan' },
  { code: '+507', name: 'Panama' },
  { code: '+595', name: 'Paraguay' },
  { code: '+51',  name: 'Peru' },
  { code: '+63',  name: 'Philippines' },
  { code: '+48',  name: 'Poland' },
  { code: '+351', name: 'Portugal' },
  { code: '+974', name: 'Qatar' },
  { code: '+40',  name: 'Romania' },
  { code: '+7',   name: 'Russia' },
  { code: '+250', name: 'Rwanda' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+221', name: 'Senegal' },
  { code: '+381', name: 'Serbia' },
  { code: '+248', name: 'Seychelles' },
  { code: '+232', name: 'Sierra Leone' },
  { code: '+65',  name: 'Singapore' },
  { code: '+421', name: 'Slovakia' },
  { code: '+386', name: 'Slovenia' },
  { code: '+252', name: 'Somalia' },
  { code: '+27',  name: 'South Africa' },
  { code: '+82',  name: 'South Korea' },
  { code: '+211', name: 'South Sudan' },
  { code: '+34',  name: 'Spain' },
  { code: '+94',  name: 'Sri Lanka' },
  { code: '+249', name: 'Sudan' },
  { code: '+46',  name: 'Sweden' },
  { code: '+41',  name: 'Switzerland' },
  { code: '+963', name: 'Syria' },
  { code: '+886', name: 'Taiwan' },
  { code: '+992', name: 'Tajikistan' },
  { code: '+255', name: 'Tanzania' },
  { code: '+66',  name: 'Thailand' },
  { code: '+228', name: 'Togo' },
  { code: '+216', name: 'Tunisia' },
  { code: '+90',  name: 'Turkey' },
  { code: '+256', name: 'Uganda' },
  { code: '+380', name: 'Ukraine' },
  { code: '+971', name: 'UAE' },
  { code: '+598', name: 'Uruguay' },
  { code: '+998', name: 'Uzbekistan' },
  { code: '+58',  name: 'Venezuela' },
  { code: '+84',  name: 'Vietnam' },
  { code: '+967', name: 'Yemen' },
  { code: '+260', name: 'Zambia' },
  { code: '+263', name: 'Zimbabwe' },
];

/* ── Password strength ── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Weak',   color: '#FF5A5A' },
    { label: 'Fair',   color: '#F5A623' },
    { label: 'Good',   color: '#C9A84C' },
    { label: 'Strong', color: '#2DD4A0' },
  ];
  return { score, label: map[score - 1]?.label ?? 'Weak', color: map[score - 1]?.color ?? '#FF5A5A' };
}

/* ── Shared background panel (candlestick decoration) ── */
const BG_CANDLES = [
  [0.6,0.9,0.5,0.8, true ],[0.55,0.75,0.45,0.6,false],[0.58,0.8,0.5,0.72,true],
  [0.7,0.85,0.6,0.65,false],[0.62,0.78,0.55,0.74,true],[0.7,0.9,0.62,0.8,true],
  [0.75,0.88,0.65,0.7,false],[0.68,0.82,0.6,0.76,true],[0.72,0.9,0.65,0.85,true],
  [0.8,0.95,0.7,0.75,false],
];

const DecoBg: React.FC = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}
    viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"
  >
    {BG_CANDLES.map(([o,h,l,c,bull], i) => {
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
      points={BG_CANDLES.map(([,,, c], i) => `${20 + i * 38},${600 - Number(c) * 500}`).join(' ')}
      fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 3"
    />
  </svg>
);

/* ══════════════════════════════════════════
   REGISTER FORM
══════════════════════════════════════════ */
const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    dialCode: '+1', phone: '', password: '', confirm: '',
  });
  const [showPw, setShowPw]  = useState(false);
  const [showCf, setShowCf]  = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const strength = getStrength(form.password);
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
        <p style={s.successSub}>Welcome to Vantrex Markets. You can now sign in.</p>
        <button style={s.btnGold} onClick={() => { setSubmitted(false); onSwitch(); }}>
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      {/* Name row */}
      <div style={s.row2}>
        <div style={s.fieldWrap}>
          <label style={s.label}>First Name</label>
          <input
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
        <div style={{ ...s.phoneRow, ...(focused === 'phone' ? s.phoneRowFocused : {}) }}>
          <select
            style={s.dialSelect}
            value={form.dialCode}
            onChange={e => set('dialCode', e.target.value)}
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused(null)}
          >
            {COUNTRIES.map((c, i) => (
              <option key={i} value={c.code}>
                {c.code} {c.name}
              </option>
            ))}
          </select>
          <div style={s.phoneDivider} />
          <input
            type="tel"
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
            type={showPw ? 'text' : 'password'}
            style={{ ...s.input, paddingRight: '44px', ...(focused === 'pw' ? s.inputFocused : {}) }}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(null)}
            required
          />
          <button type="button" style={s.eyeBtn} onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
        {/* Strength bar */}
        {form.password.length > 0 && (
          <div style={s.strengthWrap}>
            <div style={s.strengthBar}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  ...s.strengthSeg,
                  background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                }} />
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
            type={showCf ? 'text' : 'password'}
            style={{
              ...s.input,
              paddingRight: '44px',
              ...(focused === 'cf' ? s.inputFocused : {}),
              ...(form.confirm && form.confirm !== form.password
                ? { borderColor: '#FF5A5A' } : {}),
            }}
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={e => set('confirm', e.target.value)}
            onFocus={() => setFocused('cf')}
            onBlur={() => setFocused(null)}
            required
          />
          <button type="button" style={s.eyeBtn} onClick={() => setShowCf(v => !v)} tabIndex={-1}>
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
        <span style={s.switchLink} onClick={onSwitch}>Sign In</span>
      </p>
    </form>
  );
};

/* ══════════════════════════════════════════
   LOGIN FORM
══════════════════════════════════════════ */
const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <div style={s.fieldWrap}>
        <label style={s.label}>Email Address</label>
        <input
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

      <div style={s.fieldWrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={s.label}>Password</label>
          <span style={s.forgotLink}>Forgot password?</span>
        </div>
        <div style={s.pwWrap}>
          <input
            type={showPw ? 'text' : 'password'}
            style={{ ...s.input, paddingRight: '44px', ...(focused === 'pw' ? s.inputFocused : {}) }}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(null)}
            required
          />
          <button type="button" style={s.eyeBtn} onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        style={{ ...s.btnGold, marginTop: '8px', position: 'relative' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#E8D5A3')}
        onMouseLeave={e => (e.currentTarget.style.background = submitted ? '#2DD4A0' : '#C9A84C')}
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
      <div style={s.socialRow}>
        {['Google', 'Apple'].map(p => (
          <button key={p} type="button" style={s.socialBtn}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border, rgba(201,168,76,0.18))')}
          >
            {p === 'Google' ? '🔵' : '⚫'} {p}
          </button>
        ))}
      </div>

      <p style={s.switchText}>
        Don't have an account?{' '}
        <span style={s.switchLink} onClick={onSwitch}>Create Account</span>
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
    <div style={s.page}>
      {/* Left panel — branding */}
      <div style={s.leftPanel}>
        <DecoBg />
        <div style={s.leftContent}>
          <div style={s.brandLogo}>
            Vantrex<span style={s.brandLogoSpan}> Markets</span>
          </div>
          <div style={s.leftDivider} />
          <h2 style={s.leftHeading}>
            Trade Smarter.<br />
            <span style={s.leftHeadingGold}>Build Wealth.</span>
          </h2>
          <p style={s.leftSub}>
            Join 50,000+ traders who trust Vantrex Markets for
            real-time data, low-fee execution, and enterprise-grade security.
          </p>
          {/* Trust badges */}
          <div style={s.badges}>
            {['FSA Regulated', 'PCI DSS Compliant', '99.9% Uptime'].map(b => (
              <div key={b} style={s.badge}>
                <span style={s.badgeDot} />
                {b}
              </div>
            ))}
          </div>
          {/* Mini stats */}
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

      {/* Right panel — form */}
      <div style={s.rightPanel}>
        {/* Tab switcher */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(mode === 'register' ? s.tabActive : {}) }}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
          <button
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
              <h1 style={s.formTitle}>Create an Account</h1>
              <p style={s.formSub}>Start trading crypto with Vantrex Markets</p>
            </>
          ) : (
            <>
              <h1 style={s.formTitle}>Welcome Back</h1>
              <p style={s.formSub}>Sign in to your Vantrex Markets account</p>
            </>
          )}
        </div>

        {mode === 'register'
          ? <RegisterForm onSwitch={() => setMode('login')} />
          : <LoginForm    onSwitch={() => setMode('register')} />
        }
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --border: rgba(201,168,76,0.18);
        }

        body {
          font-family: 'Jost', 'Trebuchet MS', 'Century Gothic', sans-serif;
          background: #0A0F1E;
        }

        select option {
          background: #111827;
          color: #F0EDE6;
        }

        input::placeholder { color: #3A4A65; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0F1E; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }

        @media (max-width: 900px) {
          .auth-left  { display: none !important; }
          .auth-right { width: 100% !important; max-width: 480px !important; margin: 0 auto !important; border-left: none !important; }
          .auth-page  { justify-content: center !important; }
        }

        @media (max-width: 480px) {
          .auth-right { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const s: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Jost', 'Trebuchet MS', 'Century Gothic', sans-serif",
    background: '#0A0F1E',
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
  },
  miniStat: { display: 'flex', flexDirection: 'column', gap: '4px' },
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
  },

  /* Tabs */
  tabs: {
    display: 'flex',
    gap: '0',
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
  },
  tabActive: {
    color: '#C9A84C',
    borderBottomColor: '#C9A84C',
  },

  /* Form header */
  formHeader: { marginBottom: '28px' },
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
    maxWidth: '480px',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#5A6A85',
  },
  input: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '13px',
    color: '#F0EDE6',
    background: '#111827',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '3px',
    padding: '11px 14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    letterSpacing: '0.02em',
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
  },
  phoneRowFocused: {
    borderColor: 'rgba(201,168,76,0.6)',
  },
  dialSelect: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '12px',
    color: '#C9A84C',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '11px 8px 11px 12px',
    cursor: 'pointer',
    maxWidth: '130px',
    flexShrink: 0,
  },
  phoneDivider: {
    width: '1px',
    background: 'rgba(201,168,76,0.14)',
    margin: '8px 0',
    flexShrink: 0,
  },
  phoneInput: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '13px',
    color: '#F0EDE6',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '11px 14px',
    flex: 1,
    minWidth: 0,
    letterSpacing: '0.02em',
  },

  /* Password */
  pwWrap: { position: 'relative' as const },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: '2px',
    opacity: 0.6,
  },

  /* Strength */
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

  /* Submit button */
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

  /* Social */
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
    padding: '11px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  /* Switch */
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

  /* Success */
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