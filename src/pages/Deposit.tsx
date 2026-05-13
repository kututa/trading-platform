import React, { useState } from 'react';
import { CRYPTO_OPTIONS, DEPOSIT_HISTORY, fmt } from '../mockData';

type Step = 1 | 2 | 3;

const Deposit: React.FC = () => {
  const [step, setStep] = useState<Step>(2);
  const [selectedCrypto, setSelectedCrypto] = useState('');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>↗</div>
        <div>
          <h1 style={styles.title}>Deposit Crypto</h1>
          <p style={styles.subtitle}>Fund your account via secure blockchain transfer</p>
        </div>
      </div>

      <div className="deposit-grid" style={styles.grid}>
        {/* Left Card: Transaction Form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconTitle}>
              <span style={{ marginRight: 10, color: '#00c864' }}>⚡</span> New Deposit
            </div>
            <div style={styles.balance}>
              <span style={styles.balanceLabel}>Current Balance</span>
              <span style={styles.balanceValue}>$0.00</span>
            </div>
          </div>

          {/* Stepper */}
          <div style={styles.progressRow}>
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div style={{
                  ...styles.stepCircle,
                  background: s < step ? '#00c864' : s === step ? 'rgba(0,200,100,0.15)' : 'var(--color-background-secondary, #1A2332)',
                  color: s < step ? '#fff' : s === step ? '#00c864' : 'var(--color-text-secondary, #5A7A8A)',
                  border: s === step ? '1.5px solid #00c864' : s < step ? 'none' : '0.5px solid var(--color-border-tertiary, #1A2332)',
                }}>
                  {s}
                </div>
                {s < 3 && (
                  <div style={{
                    ...styles.stepLine,
                    background: s < step ? '#00c864' : 'var(--color-border-tertiary, #1A2332)',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={styles.stepTitleSection}>
            <h2 style={styles.stepHeading}>Select Currency &amp; Network</h2>
            <p style={styles.stepSubheading}>Step {step} of 3: Configure your transfer details</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Asset</label>
            <select
              style={styles.select}
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              <option value="">Choose a cryptocurrency...</option>
              {CRYPTO_OPTIONS.map((c) => (
                <option key={c.sym} value={c.sym}>{c.name} ({c.sym})</option>
              ))}
            </select>
          </div>

          <div className="deposit-actions" style={styles.buttonGroup}>
            <button style={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
            <button style={styles.btnGenerate}>
              <span style={{ marginRight: 8 }}>⬡</span> Generate Address
            </button>
          </div>
        </div>

        {/* Right Card: Transaction History */}
        <div style={styles.card}>
          <div style={{ ...styles.iconTitle, marginBottom: '1rem' }}>
            <span style={{ marginRight: 10, color: '#00c864' }}>🕒</span> Activity
          </div>

          <div style={styles.historyList}>
            {DEPOSIT_HISTORY.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <div style={styles.historyTop}>
                    <span style={styles.historyAmount}>{item.cryptoAmount} {item.sym}</span>
                  </div>
                  <div style={styles.historyAddr}>{fmt.addr(item.address)}</div>
                  <div style={styles.historyUsd}>≈ ${item.amount}</div>
                </div>
                <div style={styles.historyRight}>
                  <div style={{
                    ...styles.statusBadge,
                    color: item.status === 'waiting' ? '#a16207' : '#b91c1c',
                    background: item.status === 'waiting' ? 'rgba(234,179,8,0.12)' : 'rgba(239,68,68,0.1)',
                  }}>
                    {item.status === 'waiting' ? '● Pending' : '○ Expired'}
                  </div>
                  <div style={styles.historyDate}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .deposit-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .deposit-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .deposit-actions {
            flex-direction: column-reverse !important;
          }
          .deposit-actions button {
            width: 100% !important;
            flex: unset !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '1.5rem 1rem',
    minHeight: '100vh',
    fontFamily: 'var(--font-sans)',
    boxSizing: 'border-box',
  },

  /* Header */
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' },
  headerIcon: {
    background: 'rgba(0,200,100,0.12)',
    color: '#00c864',
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 18,
    flexShrink: 0,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--color-text-primary, #fff)' },
  subtitle: { color: 'var(--color-text-secondary, #5A7A8A)', margin: '3px 0 0 0', fontSize: 13 },

  /* Grid — columns set via <style> for media queries */
  grid: { gap: 16 },

  /* Card */
  card: {
    background: 'var(--color-background-primary, #0D1117)',
    border: '0.5px solid var(--color-border-tertiary, #1A2332)',
    borderRadius: 16,
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: '1.5rem',
  },
  iconTitle: { fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', color: 'var(--color-text-primary, #E2E8F0)' },

  /* Balance */
  balance: { textAlign: 'right' },
  balanceLabel: { display: 'block', color: 'var(--color-text-secondary, #5A7A8A)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  balanceValue: { fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary, #fff)' },

  /* Stepper */
  progressRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
  stepCircle: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 13, flexShrink: 0, transition: 'all 0.2s ease' },
  stepLine: { height: 1.5, width: 40, flexShrink: 0 },

  /* Step info */
  stepTitleSection: { textAlign: 'center', marginBottom: '1.25rem' },
  stepHeading: { fontSize: 15, fontWeight: 500, margin: '0 0 4px 0', color: 'var(--color-text-primary, #fff)' },
  stepSubheading: { color: 'var(--color-text-secondary, #5A7A8A)', fontSize: 12, margin: 0 },

  /* Form */
  formGroup: { marginBottom: '1.25rem' },
  label: { display: 'block', color: 'var(--color-text-secondary, #5A7A8A)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' },
  select: { width: '100%', padding: '10px 12px', background: 'var(--color-background-secondary, #111827)', border: '0.5px solid var(--color-border-tertiary, #1A2332)', borderRadius: 8, color: 'var(--color-text-primary, #fff)', fontSize: 14, outline: 'none', cursor: 'pointer' },

  /* Buttons */
  buttonGroup: { display: 'flex', gap: 10 },
  btnBack: { flex: 1, padding: '10px 16px', background: 'transparent', border: '0.5px solid var(--color-border-secondary, #1A2332)', color: 'var(--color-text-secondary, #E2E8F0)', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13 },
  btnGenerate: { flex: 2, padding: '10px 16px', background: '#00c864', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  /* History */
  historyList: { display: 'flex', flexDirection: 'column' },
  historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '12px 0', borderBottom: '0.5px solid var(--color-border-tertiary, #1A2332)' },
  historyLeft: {},
  historyTop: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 },
  historyAmount: { fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary, #fff)' },
  historyAddr: { fontSize: 11, color: 'var(--color-text-secondary, #3A5A6A)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 2, wordBreak: 'break-all' },
  historyUsd: { fontSize: 11, color: 'var(--color-text-tertiary, #5A7A8A)' },
  historyRight: { textAlign: 'right', flexShrink: 0 },
  statusBadge: { padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'inline-block', whiteSpace: 'nowrap' },
  historyDate: { fontSize: 11, color: 'var(--color-text-tertiary, #3A5A6A)', marginTop: 4 },
};

export default Deposit;