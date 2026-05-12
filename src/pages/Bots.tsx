import React, { useState, useRef } from 'react';

interface Bot {
  id: string;
  name: string;
  passkey: string;
  asset: string;
  interval: string;
  tradeAmount: number;
  status: 'running' | 'stopped';
  winRate: number;
  profit: number;
  trades: number;
  createdAt: string;
}

const ASSETS = [
  'EUR/USD (OTC)', 'BTC/USD', 'ETH/USD', 'GBP/USD (OTC)',
  'USD/JPY (OTC)', 'AUD/USD (OTC)', 'SOL/USD', 'BNB/USD',
];

const INTERVALS = [
  '30 seconds', '1 minute', '5 minutes', '15 minutes',
  '30 minutes', '1 hour', '4 hours',
];

const ACCEPTED_EXT = ['.py', '.js', '.ts', '.json', '.zip'];

const StatChip: React.FC<{ label: string; value: string; color?: string }> = ({
  label, value, color = '#A2B8C8',
}) => (
  <div style={s.chip}>
    <div style={s.chipLabel}>{label}</div>
    <div style={{ ...s.chipVal, color }}>{value}</div>
  </div>
);

const StatusBadge: React.FC<{ status: 'running' | 'stopped' }> = ({ status }) => (
  <span style={{
    fontSize: '11px', fontWeight: 600,
    padding: '3px 10px', borderRadius: '20px',
    background: status === 'running' ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)',
    color: status === 'running' ? '#00FF88' : '#FF4444',
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    whiteSpace: 'nowrap',
  }}>
    <span style={{
      width: '6px', height: '6px', borderRadius: '50%',
      background: status === 'running' ? '#00FF88' : '#FF4444',
      display: 'inline-block',
      boxShadow: status === 'running' ? '0 0 6px #00FF88' : 'none',
      flexShrink: 0,
    }} />
    {status === 'running' ? 'Running' : 'Stopped'}
  </span>
);

const BotCard: React.FC<{
  bot: Bot;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ bot, onToggle, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const profitUp = bot.profit >= 0;

  return (
    <div style={s.botCard}>
      <div style={s.botCardHeader}>
        <div style={s.botIconWrap}>
          <span style={s.botIcon}>⚙</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={s.botName}>{bot.name}</div>
          <div style={s.botAsset}>{bot.asset} · {bot.interval}</div>
        </div>
        <StatusBadge status={bot.status} />
      </div>

      <div style={s.botStats}>
        <StatChip label="Win Rate"   value={`${bot.winRate}%`}    color={bot.winRate >= 50 ? '#00FF88' : '#FF4444'} />
        <StatChip label="Profit"     value={`${profitUp ? '+' : ''}$${bot.profit.toFixed(2)}`} color={profitUp ? '#00FF88' : '#FF4444'} />
        <StatChip label="Trades"     value={`${bot.trades}`}      color="#A2B8C8" />
        <StatChip label="Trade Size" value={`$${bot.tradeAmount}`} color="#A2B8C8" />
      </div>

      <div style={s.botCardFooter}>
        <div style={s.botDate}>Created {bot.createdAt}</div>
        <div style={s.botActions}>
          <button
            style={{
              ...s.actionBtn,
              background: bot.status === 'running' ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,136,0.1)',
              border: `1px solid ${bot.status === 'running' ? 'rgba(255,68,68,0.3)' : 'rgba(0,255,136,0.3)'}`,
              color: bot.status === 'running' ? '#FF4444' : '#00FF88',
            }}
            onClick={() => onToggle(bot.id)}
          >
            {bot.status === 'running' ? '⏹ Stop' : '▶ Start'}
          </button>

          {!confirmDelete ? (
            <button
              style={{ ...s.actionBtn, background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)', color: '#FF4444' }}
              onClick={() => setConfirmDelete(true)}
            >
              🗑 Delete
            </button>
          ) : (
            <div style={s.confirmRow}>
              <span style={{ fontSize: '11px', color: '#FF4444' }}>Confirm?</span>
              <button style={{ ...s.actionBtn, background: 'rgba(255,68,68,0.15)', border: '1px solid #FF4444', color: '#FF4444' }}
                onClick={() => onDelete(bot.id)}>Yes</button>
              <button style={{ ...s.actionBtn, background: 'transparent', border: '1px solid #1A2332', color: '#5A7A8A' }}
                onClick={() => setConfirmDelete(false)}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Bots: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [passkeySuccess, setPasskeySuccess] = useState(false);

  const [tradeAmount, setTradeAmount] = useState('10');
  const [interval, setInterval] = useState('1 minute');
  const [asset, setAsset] = useState('EUR/USD (OTC)');

  const [bots, setBots] = useState<Bot[]>([]);

  const isValidFile = (file: File) =>
    ACCEPTED_EXT.some(ext => file.name.toLowerCase().endsWith(ext));

  const handleFile = (file: File) => {
    if (!isValidFile(file)) {
      setUploadError(`Invalid file type. Accepted: ${ACCEPTED_EXT.join(', ')}`);
      setUploadedFile(null);
      return;
    }
    setUploadError('');
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (!uploadedFile) { setUploadError('Please select a bot file first.'); return; }
    addBot(`Bot from ${uploadedFile.name}`);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasskey = () => {
    if (!passkey.trim()) { setPasskeyError('Please enter a passkey.'); return; }
    if (passkey.trim().length < 8) { setPasskeyError('Invalid passkey format.'); return; }
    setPasskeyError('');
    setPasskeySuccess(true);
    addBot(`Bot #${bots.length + 1} (Passkey)`);
    setTimeout(() => { setPasskeySuccess(false); setPasskey(''); }, 2000);
  };

  const addBot = (name: string) => {
    const newBot: Bot = {
      id: Date.now().toString(),
      name,
      passkey: passkey || 'uploaded',
      asset,
      interval,
      tradeAmount: parseFloat(tradeAmount) || 10,
      status: 'running',
      winRate: Math.floor(Math.random() * 30 + 55),
      profit: parseFloat((Math.random() * 200 - 40).toFixed(2)),
      trades: Math.floor(Math.random() * 80 + 10),
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    setBots(prev => [newBot, ...prev]);
  };

  const toggleBot = (id: string) =>
    setBots(prev => prev.map(b => b.id === id
      ? { ...b, status: b.status === 'running' ? 'stopped' : 'running' }
      : b));

  const deleteBot = (id: string) =>
    setBots(prev => prev.filter(b => b.id !== id));

  const totalProfit  = bots.reduce((acc, b) => acc + b.profit, 0);
  const avgWinRate   = bots.length ? bots.reduce((acc, b) => acc + b.winRate, 0) / bots.length : 0;
  const totalTrades  = bots.reduce((acc, b) => acc + b.trades, 0);
  const runningCount = bots.filter(b => b.status === 'running').length;

  return (
    <div style={s.page}>
      <style>{`
        .bots-summary {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          background: #0D1117;
          border: 1px solid #1A2332;
          border-radius: 14px;
          padding: 16px 20px;
        }
        .bots-settings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .bots-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .passkey-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }
        .passkey-btn {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #050A0E;
          border: none;
          border-radius: 10px;
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .passkey-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111827;
          border: 1px solid #1A2332;
          border-radius: 10px;
          padding: 12px 16px;
          min-width: 0;
        }
        @media (max-width: 760px) {
          .bots-summary {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .bots-settings-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .bots-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .bots-summary {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 12px !important;
            gap: 8px !important;
          }
          .bots-settings-grid {
            grid-template-columns: 1fr !important;
          }
          .passkey-row {
            flex-direction: column !important;
          }
          .passkey-btn {
            width: 100% !important;
            justify-content: center;
          }
          .passkey-input-wrap {
            width: 100%;
          }
        }
        @media (max-width: 400px) {
          .bots-summary {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .action-btn-hover:hover { opacity: 0.75; }
      `}</style>

      {bots.length > 0 && (
        <div className="bots-summary">
          {[
            { label: 'Total Bots',   value: `${bots.length}`,                                                          color: '#E2E8F0' },
            { label: 'Running',      value: `${runningCount}`,                                                          color: '#00FF88' },
            { label: 'Total Profit', value: `${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`,                color: totalProfit >= 0 ? '#00FF88' : '#FF4444' },
            { label: 'Avg Win Rate', value: `${avgWinRate.toFixed(1)}%`,                                               color: avgWinRate >= 50 ? '#00FF88' : '#FF4444' },
            { label: 'Total Trades', value: `${totalTrades}`,                                                          color: '#A2B8C8' },
          ].map(stat => (
            <div key={stat.label} style={s.summaryItem}>
              <div style={s.summaryLabel}>{stat.label}</div>
              <div style={{ ...s.summaryVal, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <span style={s.cardHeaderIcon}>⬆</span>
          <span style={s.cardHeaderTitle}>UPLOAD TRADING BOT</span>
        </div>

        <div
          style={{
            ...s.dropZone,
            borderColor: dragOver ? '#00FF88' : uploadedFile ? 'rgba(0,255,136,0.5)' : 'rgba(255,255,255,0.1)',
            background: dragOver ? 'rgba(0,255,136,0.04)' : 'transparent',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXT.join(',')}
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <div style={s.dropIcon}>⬆</div>
          {uploadedFile ? (
            <>
              <div style={{ ...s.dropTitle, color: '#00FF88' }}>✓ {uploadedFile.name}</div>
              <div style={s.dropSub}>Ready to upload · {(uploadedFile.size / 1024).toFixed(1)} KB</div>
            </>
          ) : (
            <>
              <div style={s.dropTitle}>Drag &amp; drop your bot file here</div>
              <div style={s.dropSub}>or click to browse</div>
              <div style={s.dropHint}>Supports {ACCEPTED_EXT.join(', ')} files</div>
            </>
          )}
        </div>
        {uploadError && <div style={s.errorMsg}>{uploadError}</div>}

        <button style={s.btnUpload} className="action-btn-hover" onClick={handleUpload}>
          <span>⚙</span> Upload Trading Bot
        </button>
      </div>

      {/* OR */}
      <div style={s.orDivider}>
        <div style={s.orLine} />
        <span style={s.orText}>OR</span>
        <div style={s.orLine} />
      </div>

      {/* Passkey */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <span style={s.cardHeaderIcon}>🔑</span>
          <span style={s.cardHeaderTitle}>ACTIVATE WITH PASSKEY</span>
        </div>
        <p style={s.passkeyDesc}>
          Already have a trading bot passkey? Enter it below to activate your bot instantly.
        </p>
        <div className="passkey-row">
          <div className="passkey-input-wrap">
            <span style={s.passkeyIcon}>🔑</span>
            <input
              style={s.passkeyInput}
              type="text"
              placeholder="Enter your trading bot passkey"
              value={passkey}
              onChange={e => { setPasskey(e.target.value); setPasskeyError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handlePasskey(); }}
            />
          </div>
          <button
            className="passkey-btn action-btn-hover"
            style={{ background: passkeySuccess ? '#00CC6A' : '#00FF88' }}
            onClick={handlePasskey}
          >
            {passkeySuccess ? '✓ Activated' : '⚡ Submit Passkey'}
          </button>
        </div>
        {passkeyError && <div style={s.errorMsg}>{passkeyError}</div>}
        <div style={s.passkeyNote}>
          Passkeys are provided by authorized bot developers. Contact support if you need assistance.
        </div>
      </div>

      {/* Settings */}
      <div style={s.card}>
        <div style={s.settingsHeader}>
          <span style={s.settingsIcon}>⚙</span>
          <div>
            <div style={s.settingsTitle}>Bot Settings</div>
            <div style={s.settingsSub}>Configure your bot before starting</div>
          </div>
        </div>
        <div className="bots-settings-grid">
          <div style={s.settingField}>
            <label style={s.settingLabel}>Trade Amount ($)</label>
            <input
              style={s.settingInput}
              type="number"
              min="1"
              value={tradeAmount}
              onChange={e => setTradeAmount(e.target.value)}
            />
          </div>
          <div style={s.settingField}>
            <label style={s.settingLabel}>Trade Interval</label>
            <select style={s.settingSelect} value={interval} onChange={e => setInterval(e.target.value)}>
              {INTERVALS.map(iv => <option key={iv} value={iv}>{iv}</option>)}
            </select>
          </div>
          <div style={s.settingField}>
            <label style={s.settingLabel}>Trading Asset</label>
            <select style={s.settingSelect} value={asset} onChange={e => setAsset(e.target.value)}>
              {ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* My Bots */}
      <div style={s.card}>
        <div style={s.settingsHeader}>
          <span style={s.settingsIcon}>🤖</span>
          <div style={s.settingsTitle}>My Bots ({bots.length})</div>
        </div>

        {bots.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🤖</div>
            <div style={s.emptyTitle}>No bots added yet</div>
            <div style={s.emptySub}>Enter a passkey above or upload a bot file to add a trading bot</div>
          </div>
        ) : (
          <div className="bots-grid">
            {bots.map(bot => (
              <BotCard key={bot.id} bot={bot} onToggle={toggleBot} onDelete={deleteBot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '860px',
    margin: '0 auto',
    width: '100%',
    fontFamily: "'Jost', sans-serif",
    boxSizing: 'border-box',
    padding: '0 4px',
  },

  summaryItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  summaryLabel: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2A4A5A', textAlign: 'center' },
  summaryVal:   { fontSize: '18px', fontWeight: 700 },

  card: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxSizing: 'border-box',
    width: '100%',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    paddingBottom: '4px',
  },
  cardHeaderIcon:  { fontSize: '18px', color: '#00FF88' },
  cardHeaderTitle: { fontSize: '15px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.1em' },

  dropZone: {
    border: '2px dashed',
    borderRadius: '12px',
    padding: '36px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    textAlign: 'center',
  },
  dropIcon:  { fontSize: '32px', color: '#3A5A6A', marginBottom: '6px' },
  dropTitle: { fontSize: '14px', fontWeight: 600, color: '#E2E8F0' },
  dropSub:   { fontSize: '12px', color: '#5A7A8A' },
  dropHint:  { fontSize: '11px', color: '#2A4A5A', marginTop: '4px' },

  errorMsg: { fontSize: '12px', color: '#FF4444', textAlign: 'center' },

  btnUpload: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: '#050A0E',
    background: '#00FF88',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.15s',
    width: '100%',
  },

  orDivider: { display: 'flex', alignItems: 'center', gap: '16px' },
  orLine: { flex: 1, height: '1px', background: '#1A2332' },
  orText: { fontSize: '12px', fontWeight: 600, color: '#2A4A5A', letterSpacing: '0.14em' },

  passkeyDesc: { fontSize: '13px', color: '#5A7A8A', textAlign: 'center', lineHeight: 1.6, margin: 0 },
  passkeyIcon: { fontSize: '15px', color: '#3A5A6A', flexShrink: 0 },
  passkeyInput: {
    fontFamily: "'Jost', sans-serif",
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#E2E8F0',
    fontSize: '13px',
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  passkeyNote: { fontSize: '11px', color: '#2A4A5A', textAlign: 'center', lineHeight: 1.5 },

  settingsHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  settingsIcon:   { fontSize: '18px', color: '#00FF88', flexShrink: 0 },
  settingsTitle:  { fontSize: '15px', fontWeight: 700, color: '#E2E8F0' },
  settingsSub:    { fontSize: '12px', color: '#3A5A6A', marginTop: '1px' },

  settingField: { display: 'flex', flexDirection: 'column', gap: '7px' },
  settingLabel: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2A4A5A' },
  settingInput: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '14px',
    color: '#E2E8F0',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '8px',
    padding: '10px 12px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  settingSelect: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '13px',
    color: '#E2E8F0',
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '8px',
    padding: '10px 32px 10px 12px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%233A5A6A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '40px 20px',
  },
  emptyIcon:  { fontSize: '36px', opacity: 0.25, marginBottom: '4px' },
  emptyTitle: { fontSize: '14px', fontWeight: 600, color: '#3A5A6A' },
  emptySub:   { fontSize: '12px', color: '#1A3A4A', textAlign: 'center', maxWidth: '300px' },

  botCard: {
    background: '#111827',
    border: '1px solid #1A2332',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  botCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  botIconWrap: {
    width: '36px', height: '36px',
    borderRadius: '10px',
    background: 'rgba(0,255,136,0.08)',
    border: '1px solid rgba(0,255,136,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  botIcon:  { fontSize: '16px', color: '#00FF88' },
  botName:  { fontSize: '13px', fontWeight: 700, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  botAsset: { fontSize: '11px', color: '#3A5A6A', marginTop: '1px' },

  botStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  chip: {
    background: '#0D1117',
    border: '1px solid #1A2332',
    borderRadius: '8px',
    padding: '8px 4px',
    textAlign: 'center',
    minWidth: 0,
  },
  chipLabel: { fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2A4A5A', marginBottom: '4px' },
  chipVal:   { fontSize: '12px', fontWeight: 700 },

  botCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    paddingTop: '10px',
    borderTop: '1px solid #1A2332',
  },
  botDate:    { fontSize: '10px', color: '#2A4A5A' },
  botActions: { display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' },
  confirmRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  actionBtn: {
    fontFamily: "'Jost', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.15s',
  },
};

export default Bots;