import React, { useState } from 'react';
import { CRYPTO_OPTIONS, DEPOSIT_HISTORY, fmt } from '../mockData';

type Step = 1 | 2 | 3;

const Deposit: React.FC = () => {
  const [step, setStep] = useState<Step>(2);
  const [selectedCrypto, setSelectedCrypto] = useState("");

  return (
    <div style={styles.container}>
      {/* Header Section */}
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
               <span style={{ marginRight: '10px', color: '#00FF88' }}>⚡</span> New Deposit
            </div>
            <div style={styles.balance}>
               <span style={styles.balanceLabel}>Current Balance</span>
               <span style={styles.balanceValue}>$0.00</span>
            </div>
          </div>

          {/* Stepper Component */}
          <div style={styles.progressRow}>
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div style={{
                  ...styles.stepCircle,
                  background: s <= step ? '#00FF88' : '#1A2332',
                  color: s <= step ? '#050A0E' : '#5A7A8A',
                  border: s === step ? '4px solid rgba(0,255,136,0.2)' : 'none'
                }}>
                  {s}
                </div>
                {s < 3 && (
                  <div style={{ 
                    ...styles.stepLine, 
                    background: s < step ? '#00FF88' : '#1A2332' 
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={styles.stepTitleSection}>
            <h2 style={styles.stepHeading}>Select Currency & Network</h2>
            <p style={styles.stepSubheading}>Step 2 of 3: Configure your transfer details</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Asset</label>
            <div style={styles.selectWrapper}>
              <select 
                style={styles.select} 
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                <option value="">Choose a cryptocurrency...</option>
                {CRYPTO_OPTIONS.map(c => (
                  <option key={c.sym} value={c.sym}>{c.name} ({c.sym})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="deposit-actions" style={styles.buttonGroup}>
            <button style={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
            <button style={styles.btnGenerate}>
               <span style={{ marginRight: '8px' }}>㗊</span> Generate Address
            </button>
          </div>
        </div>

        {/* Right Card: Transaction History */}
        <div style={styles.card}>
          <div style={styles.iconTitle}>
             <span style={{ marginRight: '10px', color: '#00FF88' }}>🕒</span> Activity
          </div>
          
          <div style={styles.historyList}>
            {DEPOSIT_HISTORY.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <div style={styles.historyMain}>
                  <div style={styles.historyInfo}>
                    <div style={styles.historyHeader}>
                      <span style={styles.coinIcon}>{item.sym === 'USDT' ? '💎' : '₿'}</span>
                      <span style={styles.historyAmount}>{item.cryptoAmount} {item.sym}</span>
                    </div>
                    <div style={styles.historyAddr}>{fmt.addr(item.address)}</div>
                    <div style={styles.historyUsdVal}>≈ ${item.amount}</div>
                  </div>
                  <div style={styles.historyStatus}>
                    <div style={{
                      ...styles.statusBadge,
                      color: item.status === 'waiting' ? '#FFB800' : '#FF4444',
                      background: item.status === 'waiting' ? 'rgba(255,184,0,0.1)' : 'rgba(255,68,68,0.1)'
                    }}>
                      {item.status === 'waiting' ? '● Pending' : '○ Expired'}
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
        @media (max-width: 1024px) {
          .deposit-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .deposit-actions { flex-direction: column-reverse !important; }
          .deposit-actions button { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  headerIcon: { backgroundColor: 'rgba(0,255,136,0.1)', color: '#00FF88', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '20px' },
  title: { fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF' },
  subtitle: { color: '#5A7A8A', margin: '4px 0 0 0', fontSize: '14px' },
  
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' },
  
  card: { backgroundColor: '#0D1117', border: '1px solid #1A2332', borderRadius: '20px', padding: '32px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' },
  iconTitle: { fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', color: '#E2E8F0' },
  
  balance: { textAlign: 'right' },
  balanceLabel: { display: 'block', color: '#5A7A8A', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  balanceValue: { fontSize: '24px', fontWeight: 800, color: '#FFFFFF' },
  
  progressRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', transition: 'all 0.3s ease' },
  stepLine: { height: '2px', width: '60px', margin: '0 12px' },
  
  stepTitleSection: { textAlign: 'center', marginBottom: '40px' },
  stepHeading: { fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: '#FFFFFF' },
  stepSubheading: { color: '#5A7A8A', fontSize: '14px', margin: 0 },
  
  formGroup: { marginBottom: '32px' },
  label: { display: 'block', color: '#5A7A8A', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' },
  selectWrapper: { position: 'relative' },
  select: { width: '100%', padding: '16px', backgroundColor: '#111827', border: '1px solid #1A2332', borderRadius: '12px', color: '#FFFFFF', fontSize: '15px', outline: 'none', cursor: 'pointer' },
  
  buttonGroup: { display: 'flex', gap: '16px' },
  btnBack: { flex: 1, padding: '16px', backgroundColor: 'transparent', border: '1px solid #1A2332', color: '#E2E8F0', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' },
  btnGenerate: { flex: 2, padding: '16px', backgroundColor: '#00FF88', border: 'none', color: '#050A0E', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  historyList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  historyItem: { borderBottom: '1px solid #1A2332', paddingBottom: '20px' },
  historyMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  coinIcon: { fontSize: '20px' },
  historyAmount: { fontSize: '16px', fontWeight: 700, color: '#FFFFFF' },
  historyAddr: { fontSize: '12px', color: '#3A5A6A', fontFamily: 'monospace', marginBottom: '4px' },
  historyUsdVal: { fontSize: '12px', color: '#5A7A8A', fontWeight: 600 },
  historyStatus: { textAlign: 'right' },
  statusBadge: { padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, marginBottom: '8px', display: 'inline-block', textTransform: 'uppercase' },
  historyDate: { fontSize: '12px', color: '#3A5A6A', fontWeight: 500 }
};

export default Deposit;