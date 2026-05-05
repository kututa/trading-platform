import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface NetworkOption {
  id: string;
  label: string;
  fee: number;
  feeLabel: string;
  placeholder: string;
}

interface CryptoOption {
  sym: string;
  name: string;
  icon: string;
  color: string;
  networks: NetworkOption[];
  minWithdraw: number;
}

interface WithdrawalRecord {
  id: string;
  sym: string;
  network: string;
  amount: number;
  fee: number;
  address: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    sym: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B',
    minWithdraw: 10,
    networks: [
      { id: 'trc20', label: 'Tron (TRC20)',     fee: 1,    feeLabel: '$1',    placeholder: 'Enter USDT address' },
      { id: 'erc20', label: 'Ethereum (ERC20)', fee: 5,    feeLabel: '$5',    placeholder: 'Enter USDT address' },
      { id: 'bep20', label: 'BNB Chain (BEP20)',fee: 0.5,  feeLabel: '$0.50', placeholder: 'Enter USDT address' },
    ],
  },
  {
    sym: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A',
    minWithdraw: 20,
    networks: [
      { id: 'btc', label: 'Bitcoin Network', fee: 2, feeLabel: '$2', placeholder: 'Enter BTC address' },
    ],
  },
  {
    sym: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA',
    minWithdraw: 15,
    networks: [
      { id: 'erc20', label: 'Ethereum (ERC20)', fee: 3,   feeLabel: '$3',   placeholder: 'Enter ETH address' },
      { id: 'arb',   label: 'Arbitrum',         fee: 0.5, feeLabel: '$0.50',placeholder: 'Enter ETH address' },
    ],
  },
  {
    sym: 'BNB', name: 'BNB', icon: '◈', color: '#F3BA2F',
    minWithdraw: 10,
    networks: [
      { id: 'bep20', label: 'BNB Chain (BEP20)', fee: 0.5, feeLabel: '$0.50', placeholder: 'Enter BNB address' },
    ],
  },
  {
    sym: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF',
    minWithdraw: 10,
    networks: [
      { id: 'sol', label: 'Solana Network', fee: 0.1, feeLabel: '$0.10', placeholder: 'Enter SOL address' },
    ],
  },
  {
    sym: 'XRP', name: 'Ripple', icon: '✕', color: '#00AAE4',
    minWithdraw: 10,
    networks: [
      { id: 'xrp', label: 'XRP Ledger', fee: 0.2, feeLabel: '$0.20', placeholder: 'Enter XRP address' },
    ],
  },
];

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: WithdrawalRecord['status'] }> = ({ status }) => {
  const map = {
    pending:   { color: '#FFB800', bg: 'rgba(255,184,0,0.1)',   label: 'Pending'   },
    completed: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)',   label: 'Completed' },
    failed:    { color: '#FF4444', bg: 'rgba(255,68,68,0.1)',   label: 'Failed'    },
  };
  const { color, bg, label } = map[status];
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, color, background: bg, padding: '3px 10px', borderRadius: '20px' }}>
      {label}
    </span>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  WITHDRAW PAGE
// ════════════════════════════════════════════════════════════════════════════
const Withdraw: React.FC = () => {
  const [selectedCrypto,  setSelectedCrypto]  = useState<CryptoOption | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(null);
  const [address,         setAddress]         = useState('');
  const [amount,          setAmount]          = useState('');
  const [addressErr,      setAddressErr]      = useState('');
  const [amountErr,       setAmountErr]       = useState('');
  const [history,         setHistory]         = useState<WithdrawalRecord[]>([]);
  const [submitted,       setSubmitted]       = useState(false);

  const availableBalance = 0.0;

  // Computed values
  const fee      = selectedNetwork?.fee ?? 0;
  const amtNum   = parseFloat(amount) || 0;
  const receive  = Math.max(amtNum - fee, 0);
  const minWith  = selectedCrypto?.minWithdraw ?? 10;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = CRYPTO_OPTIONS.find(c => c.sym === e.target.value) ?? null;
    setSelectedCrypto(found);
    setSelectedNetwork(null);
    setAddress('');
    setAmount('');
    setAddressErr('');
    setAmountErr('');
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = selectedCrypto?.networks.find(n => n.id === e.target.value) ?? null;
    setSelectedNetwork(found);
    setAddress('');
    setAmount('');
    setAddressErr('');
    setAmountErr('');
  };

  const validate = (): boolean => {
    let valid = true;
    if (!address.trim() || address.length < 10) {
      setAddressErr('Please enter a valid wallet address.');
      valid = false;
    } else {
      setAddressErr('');
    }
    if (!amount || amtNum <= 0) {
      setAmountErr('Please enter an amount.');
      valid = false;
    } else if (amtNum < minWith) {
      setAmountErr(`Minimum withdrawal is $${minWith}.`);
      valid = false;
    } else if (amtNum > availableBalance) {
      setAmountErr('Insufficient balance.');
      valid = false;
    } else {
      setAmountErr('');
    }
    return valid;
  };

  const handleSubmit = () => {
    if (!selectedCrypto || !selectedNetwork) return;
    if (!validate()) return;

    const record: WithdrawalRecord = {
      id: Date.now().toString(),
      sym: selectedCrypto.sym,
      network: selectedNetwork.label,
      amount: amtNum,
      fee,
      address,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    setHistory(prev => [record, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAddress('');
      setAmount('');
      setSelectedNetwork(null);
      setSelectedCrypto(null);
    }, 2500);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.wrapper}>

      {/* ── Page title ── */}
      <div style={s.pageTitle}>
        <div style={s.pageTitleIcon}>↙</div>
        <div>
          <div style={s.pageTitleText}>Withdraw Crypto</div>
          <div style={s.pageTitleSub}>Withdraw your cryptocurrency to an external wallet</div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={s.layout}>

        {/* LEFT — New Withdrawal */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardHeaderIcon}>▣</span>
            <span style={s.cardHeaderTitle}>New Withdrawal</span>
          </div>

          {/* Balance row */}
          <div style={s.balanceRow}>
            <span style={s.balanceLabel}>Available Balance</span>
            <span style={s.balanceVal}>${availableBalance.toFixed(2)}</span>
          </div>

          <div style={s.divider} />

          {/* Select Currency */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Select Currency</label>
            <div style={s.selectWrap}>
              {selectedCrypto && (
                <div style={{ ...s.cryptoIcon, background: selectedCrypto.color }}>
                  {selectedCrypto.icon}
                </div>
              )}
              {selectedCrypto && (
                <span style={s.cryptoSymLabel}>{selectedCrypto.sym}</span>
              )}
              {selectedCrypto && (
                <span style={s.cryptoNameLabel}>{selectedCrypto.name}</span>
              )}
              <select
                style={{
                  ...s.select,
                  paddingLeft: selectedCrypto ? '120px' : '14px',
                  color: selectedCrypto ? 'transparent' : '#5A7A8A',
                }}
                value={selectedCrypto?.sym ?? ''}
                onChange={handleCryptoChange}
              >
                <option value="" disabled>Select a cryptocurrency</option>
                {CRYPTO_OPTIONS.map(c => (
                  <option key={c.sym} value={c.sym}>{c.sym} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Network (appears after crypto selected) */}
          {selectedCrypto && (
            <div style={s.fieldGroup}>
              <label style={s.label}>Select Network</label>
              <div style={s.selectWrap}>
                {selectedNetwork && (
                  <span style={s.networkIcon}>▷</span>
                )}
                {selectedNetwork && (
                  <span style={s.networkLabel}>{selectedNetwork.label}</span>
                )}
                {selectedNetwork && (
                  <span style={s.networkFee}>Fee: {selectedNetwork.feeLabel}</span>
                )}
                <select
                  style={{
                    ...s.select,
                    paddingLeft: selectedNetwork ? '200px' : '14px',
                    color: selectedNetwork ? 'transparent' : '#5A7A8A',
                    borderColor: selectedNetwork ? 'rgba(0,255,136,0.35)' : '#1A2332',
                  }}
                  value={selectedNetwork?.id ?? ''}
                  onChange={handleNetworkChange}
                >
                  <option value="" disabled>Select a network</option>
                  {selectedCrypto.networks.map(n => (
                    <option key={n.id} value={n.id}>{n.label}  —  Fee: {n.feeLabel}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Address + Amount (appear after network selected) */}
          {selectedNetwork && (
            <>
              {/* Withdrawal Address */}
              <div style={s.fieldGroup}>
                <label style={s.label}>Withdrawal Address</label>
                <input
                  style={{ ...s.input, ...(addressErr ? { borderColor: '#FF4444' } : {}) }}
                  placeholder={selectedNetwork.placeholder}
                  value={address}
                  onChange={e => { setAddress(e.target.value); setAddressErr(''); }}
                />
                {addressErr && <span style={s.errMsg}>{addressErr}</span>}
              </div>

              {/* Amount */}
              <div style={s.fieldGroup}>
                <label style={s.label}>Amount (USD)</label>
                <div style={s.amountWrap}>
                  <span style={s.amountDollar}>$</span>
                  <input
                    style={{ ...s.amountInput, ...(amountErr ? { outline: '1px solid #FF4444' } : {}) }}
                    type="number"
                    placeholder="100.00"
                    value={amount}
                    min={minWith}
                    onChange={e => { setAmount(e.target.value); setAmountErr(''); }}
                  />
                </div>
                <span style={s.minNote}>Minimum withdrawal: ${minWith}</span>
                {amountErr && <span style={s.errMsg}>{amountErr}</span>}
              </div>

              {/* Fee summary */}
              <div style={s.feeSummary}>
                <div style={s.feeRow}>
                  <span style={s.feeLabel}>Network Fee</span>
                  <span style={s.feeVal}>${fee.toFixed(2)}</span>
                </div>
                <div style={{ ...s.feeRow, marginTop: '6px' }}>
                  <span style={{ ...s.feeLabel, fontWeight: 700, color: '#E2E8F0' }}>You will receive</span>
                  <span style={{ ...s.feeVal, color: '#00FF88', fontWeight: 700, fontSize: '15px' }}>
                    ${receive.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                style={{
                  ...s.btnSubmit,
                  background: submitted ? '#00CC6A' : '#00FF88',
                  opacity: submitted ? 0.9 : 1,
                }}
                onClick={handleSubmit}
                onMouseEnter={e => { if (!submitted) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {submitted ? '✓ Withdrawal Submitted' : 'Submit Withdrawal'}
              </button>
            </>
          )}
        </div>

        {/* RIGHT — Withdrawal History */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardHeaderIcon}>⏱</span>
            <span style={s.cardHeaderTitle}>Withdrawal History</span>
          </div>

          {history.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>↙</div>
              <div style={s.emptyText}>No withdrawal history</div>
            </div>
          ) : (
            <div style={s.historyList}>
              {history.map(item => (
                <div key={item.id} style={s.historyItem}>
                  <div style={s.historyTop}>
                    <div style={s.historyLeft}>
                      <div style={s.historyAmount}>${item.amount.toFixed(2)}</div>
                      <div style={s.historyMeta}>{item.sym} · {item.network}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div style={s.historyBottom}>
                    <span style={s.historyAddr}>
                      {item.address.slice(0, 10)}...{item.address.slice(-6)}
                    </span>
                    <span style={s.historyDate}>{item.date}</span>
                  </div>
                  <div style={s.historyFeeRow}>
                    <span style={s.historyFeeLabel}>Fee: ${item.fee.toFixed(2)}</span>
                    <span style={{ ...s.historyFeeLabel, color: '#00FF88' }}>
                      Received: ${Math.max(item.amount - item.fee, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .withdraw-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: "'Jost', sans-serif",
    maxWidth: '900px',
    width: '100%',
  },

  // Page title
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  pageTitleIcon: {
    width: '42px', height: '42px',
    background: 'rgba(0,255,136,0.1)',
    border: '1px solid rgba(0,255,136,0.2)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#00FF88', flexShrink: 0,
  },
  pageTitleText: { fontSize: '20px', fontWeight: 700, color: '#E2E8F0' },
  pageTitleSub:  { fontSize: '12px', color: '#3A5A6A', marginTop: '2px' },

  // Layout
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },

  // Card
  card: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '16px',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // Card header
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '4px',
  },
  cardHeaderIcon:  { fontSize: '16px', color: '#E2E8F0' },
  cardHeaderTitle: { fontSize: '16px', fontWeight: 700, color: '#E2E8F0' },

  // Balance row
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0 4px',
  },
  balanceLabel: { fontSize: '12px', color: '#3A5A6A' },
  balanceVal:   { fontSize: '18px', fontWeight: 700, color: '#E2E8F0' },

  divider: { height: '1px', background: '#1A2332' },

  // Fields
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: {
    fontSize: '11px', fontWeight: 600,
    letterSpacing: '0.06em',
    color: '#A2B8C8',
  },

  // Select with overlay
  selectWrap: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px',
    color: '#E2E8F0',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    padding: '12px 36px 12px 14px',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%233A5A6A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    position: 'relative' as const,
    zIndex: 1,
    transition: 'border-color 0.2s',
  },

  // Crypto overlay elements
  cryptoIcon: {
    position: 'absolute' as const,
    left: '10px',
    width: '26px', height: '26px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, color: '#fff',
    zIndex: 2, pointerEvents: 'none' as const, flexShrink: 0,
  },
  cryptoSymLabel: {
    position: 'absolute' as const,
    left: '44px',
    fontSize: '14px', fontWeight: 700, color: '#E2E8F0',
    zIndex: 2, pointerEvents: 'none' as const,
  },
  cryptoNameLabel: {
    position: 'absolute' as const,
    left: '80px',
    fontSize: '13px', color: '#5A7A8A',
    zIndex: 2, pointerEvents: 'none' as const,
  },

  // Network overlay elements
  networkIcon: {
    position: 'absolute' as const,
    left: '12px',
    fontSize: '13px', color: '#00FF88',
    zIndex: 2, pointerEvents: 'none' as const,
  },
  networkLabel: {
    position: 'absolute' as const,
    left: '30px',
    fontSize: '13px', fontWeight: 600, color: '#E2E8F0',
    zIndex: 2, pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
  },
  networkFee: {
    position: 'absolute' as const,
    left: '155px',
    fontSize: '12px', color: '#5A7A8A',
    zIndex: 2, pointerEvents: 'none' as const,
  },

  // Input
  input: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '13px', color: '#E2E8F0',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    padding: '12px 14px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  },

  // Amount field
  amountWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  amountDollar: {
    padding: '12px 0 12px 14px',
    fontSize: '14px', color: '#5A7A8A',
    flexShrink: 0,
  },
  amountInput: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '15px', fontWeight: 600, color: '#E2E8F0',
    background: 'none', border: 'none', outline: 'none',
    padding: '12px 14px',
    flex: 1, minWidth: 0,
  },
  minNote: { fontSize: '11px', color: '#2A4A5A' },
  errMsg:  { fontSize: '11px', color: '#FF4444' },

  // Fee summary
  feeSummary: {
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  feeRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  feeLabel: { fontSize: '12px', color: '#5A7A8A' },
  feeVal:   { fontSize: '13px', fontWeight: 600, color: '#E2E8F0' },

  // Submit button
  btnSubmit: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px', fontWeight: 700,
    color: '#050A0E',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    width: '100%',
    transition: 'opacity 0.15s, background 0.3s',
  },

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '36px',
    color: '#1A2332',
  },
  emptyText: { fontSize: '14px', color: '#2A4A5A' },

  // History
  historyList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  historyItem: {
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px',
  },
  historyLeft:   {},
  historyAmount: { fontSize: '16px', fontWeight: 700, color: '#E2E8F0' },
  historyMeta:   { fontSize: '11px', color: '#3A5A6A', marginTop: '2px' },
  historyBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyAddr: { fontSize: '11px', color: '#5A7A8A', fontFamily: 'monospace' },
  historyDate: { fontSize: '11px', color: '#2A4A5A' },
  historyFeeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #1A2332',
    paddingTop: '8px',
  },
  historyFeeLabel: { fontSize: '11px', color: '#3A5A6A' },
};

export default Withdraw;