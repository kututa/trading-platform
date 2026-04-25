import React, { useState } from 'react';
import { CRYPTO_OPTIONS, DEPOSIT_HISTORY, fmt } from '../mockData';

type Step = 1 | 2 | 3;

/* ── QR Code (SVG-based, no library) ── */
const QRCode: React.FC<{ value: string }> = ({ value }) => {
  // Deterministic pixel grid from string hash
  const size = 21;
  const pixels: boolean[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (__, col) => {
      const isEdge = row < 3 || col < 3 || row >= size - 3 || col >= size - 3;
      const isCornerBox =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);
      const hash = (value.charCodeAt((row * size + col) % value.length) + row * 7 + col * 13) % 2;
      return isCornerBox || (!isEdge && hash === 0);
    })
  );

  const cellSize = 8;
  const totalSize = size * cellSize;

  return (
    <svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`} style={{ borderRadius: '8px' }}>
      <rect width={totalSize} height={totalSize} fill="white" />
      {pixels.map((row, ri) =>
        row.map((on, ci) =>
          on ? (
            <rect key={`${ri}-${ci}`}
              x={ci * cellSize} y={ri * cellSize}
              width={cellSize} height={cellSize}
              fill="#050A0E"
            />
          ) : null
        )
      )}
    </svg>
  );
};

/* ── Step indicator ── */
const StepIndicator: React.FC<{ current: Step }> = ({ current }) => (
  <div style={d.steps}>
    {([1, 2, 3] as Step[]).map(s => (
      <React.Fragment key={s}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            ...d.stepCircle,
            background:   s < current ? '#00FF88' : s === current ? 'rgba(0,255,136,0.15)' : '#1A2332',
            border:       s === current ? '2px solid #00FF88' : '2px solid transparent',
            color:        s <= current ? '#00FF88' : '#2A4A5A',
          }}>
            {s < current ? '✓' : s}
          </div>
          <div style={{ fontSize: '10px', color: s === current ? '#00FF88' : '#2A4A5A', whiteSpace: 'nowrap' as const }}>
            {s === 1 ? 'Select Coin' : s === 2 ? 'Generate Address' : 'Copy & Send'}
          </div>
        </div>
        {s < 3 && <div style={{ ...d.stepLine, background: s < current ? '#00FF88' : '#1A2332' }} />}
      </React.Fragment>
    ))}
  </div>
);

/* ── Status badge ── */
const StatusBadge: React.FC<{ status: 'waiting' | 'completed' | 'expired' }> = ({ status }) => {
  const map = {
    waiting:   { color: '#FFB800', bg: 'rgba(255,184,0,0.1)',   label: 'Waiting'   },
    completed: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)',   label: 'Completed' },
    expired:   { color: '#FF4444', bg: 'rgba(255,68,68,0.1)',   label: 'Expired'   },
  };
  const { color, bg, label } = map[status];
  return <span style={{ fontSize: '11px', fontWeight: 600, color, background: bg, padding: '3px 10px', borderRadius: '6px' }}>{label}</span>;
};

/* ═══════════════════════════════════════════ DEPOSIT PAGE ═══ */
const Deposit: React.FC = () => {
  const [step,        setStep]       = useState<Step>(1);
  const [selectedCoin, setSelectedCoin] = useState(CRYPTO_OPTIONS[0]);
  const [address,     setAddress]    = useState('');
  const [copied,      setCopied]     = useState(false);

  const MOCK_ADDRESSES: Record<string, string> = {
    USDT: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    BTC:  '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf8a',
    ETH:  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    BNB:  'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
    SOL:  'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
    XRP:  'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  };

  const generateAddress = () => {
    setAddress(MOCK_ADDRESSES[selectedCoin.sym] ?? '0x000...DEMO');
    setStep(3);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={d.page}>

      {/* LEFT — deposit flow */}
      <div style={d.left}>
        <div style={d.card}>
          <div style={d.cardHeader}>
            <div style={d.cardTitle}>New Deposit</div>
            <div style={d.balancePill}>
              <span style={{ color: '#3A5A6A', fontSize: '11px' }}>Balance:</span>
              <span style={{ color: '#00FF88', fontWeight: 700, fontSize: '13px' }}>$0.00</span>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator current={step} />

          {/* ── Step 1: Select crypto ── */}
          {step === 1 && (
            <div style={d.stepContent}>
              <div style={d.stepTitle}>Select Cryptocurrency</div>
              <div style={d.coinGrid}>
                {CRYPTO_OPTIONS.map(c => (
                  <div key={c.sym}
                    style={{ ...d.coinOption, ...(selectedCoin.sym === c.sym ? d.coinOptionSel : {}) }}
                    onClick={() => setSelectedCoin(c)}
                  >
                    <div style={d.coinSym}>{c.sym}</div>
                    <div style={d.coinNetwork}>{c.network}</div>
                  </div>
                ))}
              </div>
              <div style={d.selectedInfo}>
                <div style={d.selectedRow}>
                  <span style={d.selectedLabel}>Selected</span>
                  <span style={d.selectedVal}>{selectedCoin.name} ({selectedCoin.sym})</span>
                </div>
                <div style={d.selectedRow}>
                  <span style={d.selectedLabel}>Network</span>
                  <span style={d.selectedVal}>{selectedCoin.network}</span>
                </div>
              </div>
              <button style={d.btnNext} onClick={() => setStep(2)}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Continue →</button>
            </div>
          )}

          {/* ── Step 2: Generate address ── */}
          {step === 2 && (
            <div style={d.stepContent}>
              <div style={d.stepTitle}>Generate Wallet Address</div>
              <div style={d.infoBox}>
                <div style={d.infoIcon}>ℹ</div>
                <div style={d.infoText}>
                  A unique {selectedCoin.sym} address will be generated for your deposit on the <strong>{selectedCoin.network}</strong> network. Send only {selectedCoin.sym} to this address.
                </div>
              </div>
              <div style={d.warningBox}>
                ⚠ Do not send any other asset to this address or funds may be lost permanently.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={d.btnBack} onClick={() => setStep(1)}>← Back</button>
                <button style={{ ...d.btnNext, flex: 1 }} onClick={generateAddress}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >Generate Address</button>
              </div>
            </div>
          )}

          {/* ── Step 3: QR + address ── */}
          {step === 3 && (
            <div style={d.stepContent}>
              <div style={d.stepTitle}>Scan QR or Copy Address</div>
              <div style={d.qrWrap}>
                <div style={d.qrBox}>
                  <QRCode value={address} />
                </div>
                <div style={d.qrLabel}>Scan with your wallet app</div>
              </div>
              <div style={d.addrLabel}>Deposit Address ({selectedCoin.network})</div>
              <div style={d.addrBox}>
                <span style={d.addrText}>{address}</span>
                <button style={d.copyBtn} onClick={copyAddress}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#00FF88')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2332')}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={d.noteBox}>
                <div style={d.noteTitle}>⏱ Important</div>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li style={d.noteItem}>Minimum deposit: 10 USDT equivalent</li>
                  <li style={d.noteItem}>Network confirmations required: 6</li>
                  <li style={d.noteItem}>Address expires in 24 hours</li>
                </ul>
              </div>
              <button style={d.btnBack} onClick={() => { setStep(1); setAddress(''); }}>← New Deposit</button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — history */}
      <div style={d.right}>
        <div style={d.card}>
          <div style={d.cardTitle}>Deposit History</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {DEPOSIT_HISTORY.map(dep => (
              <div key={dep.id} style={d.historyItem}>
                <div style={d.historyTop}>
                  <div>
                    <div style={d.historyAmount}>${dep.amount.toLocaleString()}</div>
                    <div style={d.historyCrypto}>{dep.cryptoAmount}</div>
                  </div>
                  <StatusBadge status={dep.status} />
                </div>
                <div style={d.historyBottom}>
                  <div style={d.historyAddr}>{fmt.addr(dep.address)}</div>
                  <div style={d.historyDate}>{dep.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .deposit-page { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const d: Record<string, React.CSSProperties> = {
  page:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' },
  left:  {},
  right: {},
  card:  { background: '#0D1117', border: '1px solid #1A2332', borderRadius: '16px', padding: '24px' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  cardTitle:  { fontSize: '16px', fontWeight: 700, color: '#E2E8F0' },
  balancePill:{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111827', border: '1px solid #1A2332', borderRadius: '20px', padding: '5px 12px' },

  steps:      { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '28px' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, transition: 'all 0.3s' },
  stepLine:   { flex: 1, height: '2px', minWidth: '32px', maxWidth: '60px', transition: 'background 0.3s' },

  stepContent: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepTitle:   { fontSize: '14px', fontWeight: 600, color: '#E2E8F0' },

  coinGrid:   { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' },
  coinOption: {
    padding: '12px 8px', background: '#111827', border: '1px solid #1A2332',
    borderRadius: '10px', cursor: 'pointer', textAlign: 'center' as const,
    transition: 'border-color 0.2s',
  },
  coinOptionSel: { borderColor: '#00FF88', background: 'rgba(0,255,136,0.06)' },
  coinSym:    { fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '2px' },
  coinNetwork:{ fontSize: '10px', color: '#3A5A6A' },

  selectedInfo: { background: '#111827', border: '1px solid #1A2332', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  selectedRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  selectedLabel:{ fontSize: '11px', color: '#3A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  selectedVal:  { fontSize: '13px', fontWeight: 600, color: '#E2E8F0' },

  infoBox:    { display: 'flex', gap: '10px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '10px', padding: '12px' },
  infoIcon:   { fontSize: '16px', color: '#00FF88', flexShrink: 0 },
  infoText:   { fontSize: '12px', color: '#7A9AAA', lineHeight: 1.6 },
  warningBox: { background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#FF7A7A', lineHeight: 1.6 },

  btnNext: {
    fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 700,
    color: '#050A0E', background: '#00FF88',
    border: 'none', borderRadius: '10px',
    padding: '13px', cursor: 'pointer',
    transition: 'opacity 0.15s', width: '100%',
  },
  btnBack: {
    fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 500,
    color: '#5A7A8A', background: 'transparent',
    border: '1px solid #1A2332', borderRadius: '10px',
    padding: '12px 16px', cursor: 'pointer',
    flexShrink: 0,
  },

  qrWrap:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  qrBox:    { padding: '16px', background: 'white', borderRadius: '12px', display: 'inline-block' },
  qrLabel:  { fontSize: '11px', color: '#3A5A6A' },

  addrLabel: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2A4A5A' },
  addrBox:   { display: 'flex', alignItems: 'center', gap: '10px', background: '#111827', border: '1px solid #1A2332', borderRadius: '10px', padding: '12px 14px' },
  addrText:  { fontSize: '11px', color: '#7A9AAA', flex: 1, wordBreak: 'break-all' as const, fontFamily: 'monospace' },
  copyBtn: {
    fontFamily: "'Jost',sans-serif", fontSize: '11px', fontWeight: 600,
    color: '#00FF88', background: 'transparent', border: '1px solid #1A2332',
    borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
    flexShrink: 0, transition: 'border-color 0.2s',
  },

  noteBox:   { background: '#111827', border: '1px solid #1A2332', borderRadius: '10px', padding: '14px' },
  noteTitle: { fontSize: '12px', fontWeight: 700, color: '#E2E8F0', marginBottom: '8px' },
  noteItem:  { fontSize: '11px', color: '#5A7A8A', lineHeight: 1.6 },

  historyItem:   { background: '#111827', border: '1px solid #1A2332', borderRadius: '12px', padding: '14px 16px' },
  historyTop:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' },
  historyAmount: { fontSize: '16px', fontWeight: 700, color: '#E2E8F0', marginBottom: '2px' },
  historyCrypto: { fontSize: '11px', color: '#3A5A6A' },
  historyBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  historyAddr:   { fontSize: '11px', color: '#5A7A8A', fontFamily: 'monospace' },
  historyDate:   { fontSize: '11px', color: '#2A4A5A' },
};

export default Deposit;