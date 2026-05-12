import React, { useState } from 'react';

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

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    sym: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B',
    minWithdraw: 10,
    networks: [
      { id: 'trc20', label: 'Tron (TRC20)',      fee: 1,   feeLabel: '$1',    placeholder: 'Enter USDT TRC20 address' },
      { id: 'erc20', label: 'Ethereum (ERC20)',   fee: 5,   feeLabel: '$5',    placeholder: 'Enter USDT ERC20 address' },
      { id: 'bep20', label: 'BNB Chain (BEP20)',  fee: 0.5, feeLabel: '$0.50', placeholder: 'Enter USDT BEP20 address' },
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
      { id: 'erc20', label: 'Ethereum (ERC20)', fee: 3,   feeLabel: '$3',    placeholder: 'Enter ETH address' },
      { id: 'arb',   label: 'Arbitrum',         fee: 0.5, feeLabel: '$0.50', placeholder: 'Enter ETH address' },
    ],
  },
  {
    sym: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF',
    minWithdraw: 10,
    networks: [
      { id: 'sol', label: 'Solana Network', fee: 0.1, feeLabel: '$0.10', placeholder: 'Enter SOL address' },
    ],
  },
];

const StatusBadge: React.FC<{ status: WithdrawalRecord['status'] }> = ({ status }) => {
  const map = {
    pending:   { color: '#FFB800', bg: 'rgba(255,184,0,0.1)',  label: 'Pending'   },
    completed: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)', label: 'Completed' },
    failed:    { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', label: 'Failed'    },
  };
  const { color, bg, label } = map[status];
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, color, background: bg,
      padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  );
};

const Withdraw: React.FC = () => {
  const [selectedCrypto,  setSelectedCrypto]  = useState<CryptoOption | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(null);
  const [address,  setAddress]  = useState('');
  const [amount,   setAmount]   = useState('');
  const [addressErr, setAddressErr] = useState('');
  const [amountErr,  setAmountErr]  = useState('');
  const [history,  setHistory]  = useState<WithdrawalRecord[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const availableBalance = 1250.50;

  const fee     = selectedNetwork?.fee ?? 0;
  const amtNum  = parseFloat(amount) || 0;
  const receive = Math.max(amtNum - fee, 0);
  const minWith = selectedCrypto?.minWithdraw ?? 10;

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = CRYPTO_OPTIONS.find(c => c.sym === e.target.value) ?? null;
    setSelectedCrypto(found);
    setSelectedNetwork(null);
    setAddress(''); setAmount('');
    setAddressErr(''); setAmountErr('');
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = selectedCrypto?.networks.find(n => n.id === e.target.value) ?? null;
    setSelectedNetwork(found);
    setAddressErr('');
  };

  const handleSubmit = () => {
    if (!selectedCrypto || !selectedNetwork) return;
    let valid = true;
    if (address.length < 10) { setAddressErr('Invalid wallet address'); valid = false; }
    if (amtNum < minWith)    { setAmountErr(`Min withdrawal is $${minWith}`); valid = false; }
    if (amtNum > availableBalance) { setAmountErr('Insufficient balance'); valid = false; }
    if (!valid) return;

    const record: WithdrawalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      sym: selectedCrypto.sym,
      network: selectedNetwork.label,
      amount: amtNum,
      fee,
      address,
      status: 'pending',
      date: 'Just now',
    };
    setHistory(prev => [record, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAddress(''); setAmount('');
      setSelectedNetwork(null); setSelectedCrypto(null);
    }, 2000);
  };

  return (
    <div style={s.wrapper}>
      <style>{`
        .withdraw-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
        }
        .withdraw-card {
          background: #0D1117;
          border: 1px solid #1A2332;
          border-radius: 16px;
          padding: 24px;
          box-sizing: border-box;
          min-width: 0;
        }
        .withdraw-input {
          width: 100%;
          padding: 14px;
          background: #111827;
          border: 1px solid #1A2332;
          border-radius: 10px;
          color: #FFF;
          outline: none;
          font-size: 14px;
          box-sizing: border-box;
          font-family: inherit;
        }
        .withdraw-select {
          width: 100%;
          padding: 14px;
          background: #111827;
          border: 1px solid #1A2332;
          border-radius: 10px;
          color: #E2E8F0;
          outline: none;
          cursor: pointer;
          font-size: 14px;
          box-sizing: border-box;
          font-family: inherit;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%233A5A6A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-color: #111827;
          padding-right: 36px;
        }
        .withdraw-select-icon {
          padding-left: 44px !important;
        }
        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 760px) {
          .withdraw-layout {
            grid-template-columns: 1fr !important;
          }
          .withdraw-card {
            padding: 18px !important;
          }
        }
        @media (max-width: 480px) {
          .withdraw-card {
            padding: 14px !important;
          }
          .card-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .balance-display {
            text-align: left !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div style={s.pageTitleIcon}>↙</div>
        <div>
          <h2 style={s.pageTitleText}>Withdraw Funds</h2>
          <p style={s.pageTitleSub}>Transfer your assets to an external wallet securely.</p>
        </div>
      </div>

      <div className="withdraw-layout">
        {/* Form Card */}
        <div className="withdraw-card">
          <div className="card-header-row" style={s.cardHeader}>
            <span style={s.cardHeaderTitle}>Withdrawal Details</span>
            <div className="balance-display" style={{ textAlign: 'right' }}>
              <div style={s.balanceLabel}>Available</div>
              <div style={s.balanceVal}>${availableBalance.toLocaleString()}</div>
            </div>
          </div>

          {/* Currency */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Currency</label>
            <div style={{ position: 'relative' }}>
              {selectedCrypto && (
                <div style={{ ...s.cryptoIcon, background: selectedCrypto.color }}>
                  {selectedCrypto.icon}
                </div>
              )}
              <select
                className={`withdraw-select${selectedCrypto ? ' withdraw-select-icon' : ''}`}
                value={selectedCrypto?.sym ?? ''}
                onChange={handleCryptoChange}
              >
                <option value="" disabled>Select Asset</option>
                {CRYPTO_OPTIONS.map(c => (
                  <option key={c.sym} value={c.sym}>{c.name} ({c.sym})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Network */}
          {selectedCrypto && (
            <div style={s.fieldGroup}>
              <label style={s.label}>Network</label>
              <select
                className="withdraw-select"
                value={selectedNetwork?.id ?? ''}
                onChange={handleNetworkChange}
              >
                <option value="" disabled>Select Network</option>
                {selectedCrypto.networks.map(n => (
                  <option key={n.id} value={n.id}>{n.label} (Fee: {n.feeLabel})</option>
                ))}
              </select>
            </div>
          )}

          {/* Address + Amount */}
          {selectedNetwork && (
            <>
              <div style={s.fieldGroup}>
                <label style={s.label}>Recipient Address</label>
                <input
                  className="withdraw-input"
                  style={{ borderColor: addressErr ? '#FF4444' : '#1A2332' }}
                  placeholder={selectedNetwork.placeholder}
                  value={address}
                  onChange={e => { setAddress(e.target.value); setAddressErr(''); }}
                />
                {addressErr && <div style={s.errMsg}>{addressErr}</div>}
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Amount (USD)</label>
                <input
                  type="number"
                  className="withdraw-input"
                  style={{ borderColor: amountErr ? '#FF4444' : '#1A2332' }}
                  placeholder={`Min. $${minWith}`}
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setAmountErr(''); }}
                />
                {amountErr && <div style={s.errMsg}>{amountErr}</div>}
              </div>

              <div style={s.feeSummary}>
                <div style={s.feeRow}>
                  <span style={{ color: '#5A7A8A' }}>Network Fee</span>
                  <span style={{ color: '#E2E8F0' }}>${fee.toFixed(2)}</span>
                </div>
                <div style={{ ...s.feeRow, marginBottom: 0 }}>
                  <span style={{ fontWeight: 700, color: '#E2E8F0' }}>Total Receive</span>
                  <span style={{ color: '#00FF88', fontWeight: 800 }}>${receive.toFixed(2)}</span>
                </div>
              </div>

              <button
                style={{ ...s.btnSubmit, background: submitted ? '#00CC6A' : '#00FF88' }}
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </>
          )}
        </div>

        {/* History Card */}
        <div className="withdraw-card">
          <div style={{ ...s.cardHeader, marginBottom: '20px' }}>
            <span style={s.cardHeaderTitle}>Recent Withdrawals</span>
          </div>
          {history.length === 0 ? (
            <div style={s.emptyState}>No recent activity</div>
          ) : (
            <div style={s.historyList}>
              {history.map(item => (
                <div key={item.id} style={s.historyItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                      {item.amount} {item.sym}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#5A7A8A', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {item.address.slice(0, 20)}...
                  </div>
                  <div style={{ fontSize: '11px', color: '#3A5A6A', marginTop: '4px' }}>
                    {item.date} · {item.network}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '16px',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: "'Jost', sans-serif",
  },

  pageTitleIcon: {
    width: '48px', height: '48px', flexShrink: 0,
    background: 'rgba(0,255,136,0.1)',
    border: '1px solid #00FF8833',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#00FF88', fontSize: '20px',
  },
  pageTitleText: { fontSize: '22px', fontWeight: 800, color: '#FFF', margin: 0 },
  pageTitleSub:  { fontSize: '13px', color: '#5A7A8A', margin: '4px 0 0 0' },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '8px',
  },
  cardHeaderTitle: { fontSize: '15px', fontWeight: 700, color: '#E2E8F0' },
  balanceLabel:    { fontSize: '10px', color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.05em' },
  balanceVal:      { fontSize: '18px', fontWeight: 800, color: '#FFF' },

  fieldGroup: { marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
  label:      { fontSize: '12px', color: '#5A7A8A', fontWeight: 600 },

  cryptoIcon: {
    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
    width: '22px', height: '22px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, color: '#FFF', zIndex: 1,
  },

  feeSummary: {
    background: '#111827',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #1A2332',
    marginBottom: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  feeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#E2E8F0',
    alignItems: 'center',
  },

  btnSubmit: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#050A0E',
    fontFamily: 'inherit',
  },

  emptyState: { padding: '40px 20px', textAlign: 'center', color: '#3A5A6A', fontSize: '14px' },

  historyList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  historyItem: {
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '12px',
    padding: '14px',
  },

  errMsg: { color: '#FF4444', fontSize: '11px', marginTop: '2px' },
};

export default Withdraw;