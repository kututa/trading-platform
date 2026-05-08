import React, { useState } from 'react';
import { CRYPTO_OPTIONS, DEPOSIT_HISTORY, fmt } from '../mockData';

type Step = 1 | 2 | 3;

const Deposit: React.FC = () => {
  const [step, setStep] = useState<Step>(2); // Defaulted to step 2 to match your screenshot
  const [selectedCrypto, setSelectedCrypto] = useState("");

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>↗</div>
        <div>
          <h1 style={styles.title}>Deposit Crypto</h1>
          <p style={styles.subtitle}>Deposit cryptocurrency to fund your account</p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Card: New Deposit */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconTitle}>
               <span style={{ marginRight: '8px' }}>🗂</span> New Deposit
            </div>
            <div style={styles.balance}>
               <span style={styles.balanceLabel}>Current Balance</span>
               <span style={styles.balanceValue}>$0.00</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div style={styles.progressRow}>
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div style={{
                  ...styles.stepCircle,
                  background: s <= step ? '#00E676' : '#1A1D23',
                  color: s <= step ? '#000' : '#4A5568'
                }}>
                  {s}
                </div>
                {s < 3 && <div style={{ ...styles.stepLine, background: s < step ? '#00E676' : '#2D3748' }} />}
              </React.Fragment>
            ))}
          </div>

          <div style={styles.stepTitleSection}>
            <h2 style={styles.stepHeading}>Select Currency & Network</h2>
            <p style={styles.stepSubheading}>Depositing $50.00</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Cryptocurrency</label>
            <select 
              style={styles.select} 
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              <option value="">Select a cryptocurrency</option>
              {CRYPTO_OPTIONS.map(c => <option key={c.sym} value={c.sym}>{c.name}</option>)}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
            <button style={styles.btnGenerate}>
               <span style={{ marginRight: '8px' }}>㗊</span> Generate Address
            </button>
          </div>
        </div>

        {/* Right Card: Deposit History */}
        <div style={styles.card}>
          <div style={styles.iconTitle}>
             <span style={{ marginRight: '8px' }}>🕒</span> Deposit History
          </div>
          
          <div style={styles.historyList}>
            {DEPOSIT_HISTORY.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <div style={styles.historyMain}>
                  <div style={styles.historyInfo}>
                    <div style={styles.historyHeader}>
                      <span style={styles.coinIcon}>{item.sym === 'USDT' ? '💎' : '₿'}</span>
                      <span style={styles.historyAmount}>${item.amount}</span>
                    </div>
                    <div style={styles.historyAddr}>{fmt.addr(item.address)}</div>
                    <div style={styles.historyCryptoAmt}>{item.cryptoAmount}</div>
                  </div>
                  <div style={styles.historyStatus}>
                    <div style={{
                      ...styles.statusBadge,
                      color: item.status === 'waiting' ? '#FFB800' : '#FF5252',
                      background: item.status === 'waiting' ? 'rgba(255,184,0,0.1)' : 'rgba(255,82,82,0.1)'
                    }}>
                      {item.status === 'waiting' ? '◌ Waiting' : 'ⓧ Expired'}
                    </div>
                    <div style={styles.historyDate}>{item.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .deposit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '40px', backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
  headerIcon: { backgroundColor: '#064e3b', color: '#00E676', padding: '10px', borderRadius: '8px', fontWeight: 'bold' },
  title: { fontSize: '24px', margin: 0 },
  subtitle: { color: '#718096', margin: 0, fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  card: { backgroundColor: '#0D0F12', border: '1px solid #1A1D23', borderRadius: '16px', padding: '32px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  iconTitle: { fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center' },
  balance: { textAlign: 'right' },
  balanceLabel: { display: 'block', color: '#718096', fontSize: '12px', marginBottom: '4px' },
  balanceValue: { fontSize: '20px', fontWeight: 'bold' },
  progressRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' },
  stepCircle: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' },
  stepLine: { height: '2px', width: '40px', margin: '0 8px' },
  stepTitleSection: { textAlign: 'center', marginBottom: '32px' },
  stepHeading: { fontSize: '18px', margin: '0 0 8px 0' },
  stepSubheading: { color: '#718096', fontSize: '14px', margin: 0 },
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', color: '#E2E8F0', fontSize: '14px', marginBottom: '12px' },
  select: { width: '100%', padding: '14px', backgroundColor: '#1A1D23', border: '1px solid #2D3748', borderRadius: '8px', color: '#fff', outline: 'none' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '32px' },
  btnBack: { flex: 1, padding: '14px', backgroundColor: '#1A1D23', border: '1px solid #2D3748', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnGenerate: { flex: 2, padding: '14px', backgroundColor: '#00E676', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  historyList: { marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  historyItem: { borderBottom: '1px solid #1A1D23', paddingBottom: '16px' },
  historyMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  coinIcon: { fontSize: '18px' },
  historyAmount: { fontSize: '18px', fontWeight: 600 },
  historyAddr: { fontSize: '12px', color: '#4A5568', fontFamily: 'monospace' },
  historyCryptoAmt: { fontSize: '12px', color: '#718096' },
  historyStatus: { textAlign: 'right' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '8px', display: 'inline-block' },
  historyDate: { fontSize: '12px', color: '#4A5568' }
};

export default Deposit;