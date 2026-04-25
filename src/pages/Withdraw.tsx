import React, { useState, useMemo } from 'react';
import { CRYPTO_OPTIONS } from '../mockData';

const FEE_RATES: Record<string, { pct: number; fixed: number }> = {
  USDT: { pct: 0.001, fixed: 1.0  },
  BTC:  { pct: 0.001, fixed: 0.00002 },
  ETH:  { pct: 0.001, fixed: 0.003 },
  BNB:  { pct: 0.001, fixed: 0.001 },
  SOL:  { pct: 0.001, fixed: 0.01  },
  XRP:  { pct: 0.001, fixed: 0.1   },
};

const Withdraw: React.FC = () => {
  const [coin,     setCoin]     = useState(CRYPTO_OPTIONS[0]);
  const [address,  setAddress]  = useState('');
  const [amount,   setAmount]   = useState('');
  const [addrErr,  setAddrErr]  = useState('');
  const [amtErr,   setAmtErr]   = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fee = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const r = FEE_RATES[coin.sym] ?? { pct: 0.001, fixed: 1 };
    return parseFloat((amt * r.pct + r.fixed).toFixed(6));
  }, [amount, coin.sym]);

  const receive = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    return Math.max(amt - fee, 0).toFixed(6);
  }, [amount, fee]);

  const validate = () => {
    let valid = true;
    if (!address.trim() || address.length < 10) {
      setAddrErr('Please enter a valid wallet address.'); valid = false;
    } else { setAddrErr(''); }
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setAmtErr('Please enter a valid amount.'); valid = false;
    } else if (amt < fee * 2) {
      setAmtErr(`Minimum withdrawal is ${(fee * 2).toFixed(4)} ${coin.sym}.`); valid = false;
    } else { setAmtErr(''); }
    return valid;
  };

  const handleConfirm = () => {
    if (validate()) setConfirmed(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={w.successWrap}>
        <div style={w.successIcon}>✓</div>
        <div style={w.successTitle}>Withdrawal Submitted</div>
        <div style={w.successSub}>
          Your withdrawal of <strong style={{ color: '#E2E8F0' }}>{amount} {coin.sym}</strong> to{' '}
          <span style={{ fontFamily: 'monospace', color: '#7A9AAA' }}>{address.slice(0, 12)}...</span>{' '}
          has been submitted and is pending confirmation.
        </div>
        <button style={w.btnGreen}
          onClick={() => { setSubmitted(false); setConfirmed(false); setAmount(''); setAddress(''); }}
        >New Withdrawal</button>
      </div>
    );
  }

  return (
    <div style={w.page}>

      {/* LEFT — withdraw form */}
      <div style={w.formCard}>
        <div style={w.cardTitle}>Withdraw Funds</div>
        <div style={w.balanceBanner}>
          <span style={w.bannerLabel}>Available Balance</span>
          <span style={w.bannerVal}>$0.00 <span style={{ color: '#3A5A6A', fontWeight: 400 }}>≈ 0.00 {coin.sym}</span></span>
        </div>

        {/* Coin selector */}
        <div style={w.fieldGroup}>
          <label style={w.label}>Select Cryptocurrency</label>
          <div style={w.coinTabs}>
            {CRYPTO_OPTIONS.map(c => (
              <button key={c.sym}
                style={{ ...w.coinTab, ...(coin.sym === c.sym ? w.coinTabActive : {}) }}
                onClick={() => { setCoin(c); setConfirmed(false); }}
              >
                {c.sym}
              </button>
            ))}
          </div>
          <div style={w.networkPill}>Network: <strong style={{ color: '#E2E8F0' }}>{coin.network}</strong></div>
        </div>

        {/* Address */}
        <div style={w.fieldGroup}>
          <label style={w.label}>Withdrawal Address</label>
          <input
            style={{ ...w.input, ...(addrErr ? { borderColor: '#FF4444' } : {}) }}
            placeholder={`Enter ${coin.sym} ${coin.network} address`}
            value={address}
            onChange={e => { setAddress(e.target.value); setAddrErr(''); setConfirmed(false); }}
          />
          {addrErr && <span style={w.errMsg}>{addrErr}</span>}
        </div>

        {/* Amount */}
        <div style={w.fieldGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={w.label}>Amount ({coin.sym})</label>
            <button style={w.maxBtn} onClick={() => setAmount('0')}>MAX</button>
          </div>
          <div style={w.inputWrap}>
            <input
              style={{ ...w.inputInner, ...(amtErr ? { outline: '1px solid #FF4444' } : {}) }}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setAmtErr(''); setConfirmed(false); }}
            />
            <span style={w.suffix}>{coin.sym}</span>
          </div>
          {amtErr && <span style={w.errMsg}>{amtErr}</span>}
        </div>

        {/* Quick amounts */}
        <div style={w.quickAmts}>
          {['10', '50', '100', '500'].map(a => (
            <button key={a} style={w.quickBtn}
              onClick={() => { setAmount(a); setAmtErr(''); setConfirmed(false); }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00FF88')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2332')}
            >{a}</button>
          ))}
        </div>

        {/* Fee breakdown */}
        <div style={w.feeCard}>
          <div style={w.feeTitle}>Fee Breakdown</div>
          <div style={w.feeRow}>
            <span style={w.feeLabel}>Network Fee</span>
            <span style={w.feeVal}>{fee} {coin.sym}</span>
          </div>
          <div style={w.feeRow}>
            <span style={w.feeLabel}>Processing Fee</span>
            <span style={w.feeVal}>0.00 {coin.sym}</span>
          </div>
          <div style={{ ...w.feeRow, borderTop: '1px solid #1A2332', paddingTop: '10px', marginTop: '4px' }}>
            <span style={{ ...w.feeLabel, color: '#E2E8F0', fontWeight: 600 }}>You Receive</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#00FF88' }}>
              {receive} {coin.sym}
            </span>
          </div>
        </div>

        {/* Confirm toggle */}
        {!confirmed ? (
          <button style={w.btnGreen} onClick={handleConfirm}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >Review Withdrawal →</button>
        ) : (
          <div style={w.confirmBox}>
            <div style={w.confirmTitle}>⚠ Confirm Withdrawal</div>
            <div style={w.confirmDetail}>
              <div style={w.cdRow}><span style={w.cdLabel}>Amount</span><span style={w.cdVal}>{amount} {coin.sym}</span></div>
              <div style={w.cdRow}><span style={w.cdLabel}>To Address</span><span style={{ ...w.cdVal, fontFamily: 'monospace', fontSize: '11px' }}>{address.slice(0, 18)}...</span></div>
              <div style={w.cdRow}><span style={w.cdLabel}>Network</span><span style={w.cdVal}>{coin.network}</span></div>
              <div style={w.cdRow}><span style={w.cdLabel}>You Receive</span><span style={{ ...w.cdVal, color: '#00FF88' }}>{receive} {coin.sym}</span></div>
            </div>
            <div style={w.confirmWarning}>
              This action cannot be undone. Ensure the address is correct before confirming.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={w.btnBack} onClick={() => setConfirmed(false)}>← Edit</button>
              <button style={{ ...w.btnGreen, flex: 1 }} onClick={handleSubmit}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Confirm Withdrawal</button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — info panel */}
      <div style={w.infoCol}>
        {/* Important notice */}
        <div style={w.infoCard}>
          <div style={w.infoCardTitle}>📋 Withdrawal Guide</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {[
              { icon: '🔒', text: 'Double-check the wallet address before submitting. Incorrect addresses result in permanent loss.' },
              { icon: '⏱', text: 'Processing times vary by network: BTC (30–60 min), ETH (5–10 min), USDT TRC-20 (1–3 min).' },
              { icon: '📉', text: 'Network fees fluctuate based on blockchain congestion and are deducted from your withdrawal.' },
              { icon: '✅', text: 'Withdrawals are reviewed for security. Large amounts may require additional verification.' },
            ].map((item, i) => (
              <div key={i} style={w.guideItem}>
                <span style={w.guideIcon}>{item.icon}</span>
                <span style={w.guideText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network status */}
        <div style={w.infoCard}>
          <div style={w.infoCardTitle}>🌐 Network Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {CRYPTO_OPTIONS.map(c => (
              <div key={c.sym} style={w.netRow}>
                <div>
                  <div style={w.netSym}>{c.sym}</div>
                  <div style={w.netName}>{c.network}</div>
                </div>
                <div style={{ ...w.netStatus, color: '#00FF88' }}>● Operational</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .withdraw-page { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const w: Record<string, React.CSSProperties> = {
  page:       { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' },
  formCard:   { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  cardTitle:  { fontSize: '16px', fontWeight: 700, color: '#E2E8F0' },
  balanceBanner: { background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  bannerLabel: { fontSize: '11px', color: '#3A5A6A', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  bannerVal:   { fontSize: '18px', fontWeight: 700, color: '#00FF88' },

  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label:      { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2A4A5A' },

  coinTabs:    { display: 'flex', flexWrap: 'wrap' as const, gap: '6px' },
  coinTab: {
    fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 600,
    color: '#5A7A8A', background: '#111827',
    border: '1px solid #1A2332', borderRadius: '8px',
    padding: '7px 14px', cursor: 'pointer', transition: 'all 0.15s',
  },
  coinTabActive: { color: '#00FF88', borderColor: 'rgba(0,255,136,0.4)', background: 'rgba(0,255,136,0.06)' },
  networkPill:   { fontSize: '11px', color: '#5A7A8A', background: '#111827', border: '1px solid #1A2332', borderRadius: '8px', padding: '6px 12px', alignSelf: 'flex-start' },

  input: {
    fontFamily: "'Jost',sans-serif", fontSize: '13px', color: '#E2E8F0',
    background: '#111827', border: '1px solid #1A2332', borderRadius: '10px',
    padding: '12px 14px', outline: 'none', width: '100%',
    transition: 'border-color 0.2s',
  },
  inputWrap:   { display: 'flex', alignItems: 'center', background: '#111827', border: '1px solid #1A2332', borderRadius: '10px', overflow: 'hidden' },
  inputInner:  { fontFamily: "'Jost',sans-serif", fontSize: '15px', color: '#E2E8F0', background: 'none', border: 'none', outline: 'none', padding: '12px 14px', flex: 1, minWidth: 0 },
  suffix:      { fontSize: '12px', fontWeight: 600, color: '#3A5A6A', padding: '0 14px', flexShrink: 0 },
  maxBtn: {
    fontFamily: "'Jost',sans-serif", fontSize: '10px', fontWeight: 700,
    color: '#00FF88', background: 'rgba(0,255,136,0.08)',
    border: '1px solid rgba(0,255,136,0.2)', borderRadius: '6px',
    padding: '4px 10px', cursor: 'pointer',
  },
  errMsg: { fontSize: '11px', color: '#FF5555' },

  quickAmts: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' },
  quickBtn: {
    fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 500,
    color: '#5A7A8A', background: '#111827',
    border: '1px solid #1A2332', borderRadius: '8px',
    padding: '8px', cursor: 'pointer', transition: 'border-color 0.2s',
  },

  feeCard:  { background: '#111827', border: '1px solid #1A2332', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  feeTitle: { fontSize: '12px', fontWeight: 700, color: '#5A7A8A', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '4px' },
  feeRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  feeLabel: { fontSize: '12px', color: '#3A5A6A' },
  feeVal:   { fontSize: '12px', fontWeight: 600, color: '#E2E8F0' },

  btnGreen: {
    fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 700,
    color: '#050A0E', background: '#00FF88',
    border: 'none', borderRadius: '10px',
    padding: '13px', cursor: 'pointer', width: '100%',
    transition: 'opacity 0.15s',
  },
  btnBack: {
    fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 500,
    color: '#5A7A8A', background: 'transparent',
    border: '1px solid #1A2332', borderRadius: '10px',
    padding: '12px 18px', cursor: 'pointer', flexShrink: 0,
  },

  confirmBox:    { background: '#111827', border: '1px solid rgba(255,184,0,0.3)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' },
  confirmTitle:  { fontSize: '14px', fontWeight: 700, color: '#FFB800' },
  confirmDetail: { display: 'flex', flexDirection: 'column', gap: '8px' },
  cdRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cdLabel:  { fontSize: '11px', color: '#3A5A6A', textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
  cdVal:    { fontSize: '13px', fontWeight: 600, color: '#E2E8F0' },
  confirmWarning: { fontSize: '11px', color: '#FF7A7A', lineHeight: 1.6, background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: '8px', padding: '10px 12px' },

  infoCol:      { display: 'flex', flexDirection: 'column', gap: '16px' },
  infoCard:     { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '20px' },
  infoCardTitle:{ fontSize: '14px', fontWeight: 700, color: '#E2E8F0' },
  guideItem:    { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  guideIcon:    { fontSize: '16px', flexShrink: 0 },
  guideText:    { fontSize: '12px', color: '#5A7A8A', lineHeight: 1.6 },
  netRow:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #0F1820' },
  netSym:       { fontSize: '12px', fontWeight: 700, color: '#E2E8F0' },
  netName:      { fontSize: '10px', color: '#3A5A6A' },
  netStatus:    { fontSize: '11px', fontWeight: 600 },

  successWrap:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', minHeight: '60vh', textAlign: 'center' as const },
  successIcon:  { width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#00FF88' },
  successTitle: { fontSize: '22px', fontWeight: 700, color: '#E2E8F0' },
  successSub:   { fontSize: '13px', color: '#5A7A8A', lineHeight: 1.7, maxWidth: '420px' },
};

export default Withdraw;