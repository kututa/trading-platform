import React, { useState } from 'react';

interface Bot {
  id: string;
  name: string;
  asset: string;
  status: 'active' | 'paused' | 'completed';
  profitLoss: number;
  runTime: string;
  trades: number;
  winRate: number;
}

const Bots: React.FC = () => {
  const [bots] = useState<Bot[]>([
    {
      id: '1',
      name: 'Bitcoin Scalper',
      asset: 'BTC',
      status: 'active',
      profitLoss: 1250.5,
      runTime: '5 days',
      trades: 45,
      winRate: 68.9,
    },
    {
      id: '2',
      name: 'Ethereum Grid',
      asset: 'ETH',
      status: 'active',
      profitLoss: 450.25,
      runTime: '3 days',
      trades: 28,
      winRate: 64.3,
    },
    {
      id: '3',
      name: 'XRP DCA Bot',
      asset: 'XRP',
      status: 'paused',
      profitLoss: -150.0,
      runTime: '7 days',
      trades: 15,
      winRate: 40.0,
    },
    {
      id: '4',
      name: 'Solana Momentum',
      asset: 'SOL',
      status: 'completed',
      profitLoss: 890.75,
      runTime: '2 days',
      trades: 22,
      winRate: 77.3,
    },
  ]);

  const botTemplates = [
    {
      name: 'Scalping Bot',
      description: 'High-frequency short-term trades',
      strategy: 'Technical Analysis',
      riskLevel: 'High',
      icon: '⚡',
    },
    {
      name: 'DCA Bot',
      description: 'Dollar-Cost Averaging strategy',
      strategy: 'Long-term',
      riskLevel: 'Low',
      icon: '📈',
    },
    {
      name: 'Grid Bot',
      description: 'Profit from volatility swings',
      strategy: 'Range Trading',
      riskLevel: 'Medium',
      icon: '📊',
    },
    {
      name: 'Momentum Bot',
      description: 'Follow market trends and momentum',
      strategy: 'Trend Following',
      riskLevel: 'Medium',
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Automated Trading Bots</h1>
        <p className="text-[var(--text-secondary)]">Manage and create trading bots for automated strategies</p>
      </div>

      {/* Active Bots */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Your Active Bots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--gold)] transition-all cursor-pointer"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{bot.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      bot.status === 'active'
                        ? 'bg-[var(--green)] bg-opacity-20 text-[var(--green)]'
                        : bot.status === 'paused'
                        ? 'bg-[var(--gold)] bg-opacity-20 text-[var(--gold)]'
                        : 'bg-[var(--slate)] text-[var(--text-muted)]'
                    }`}
                  >
                    {bot.status.toUpperCase()}
                  </span>
                </div>

                {/* Asset & Profit */}
                <div className="mb-4 pb-4 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Asset: {bot.asset}</p>
                  <p
                    className={`text-lg font-bold ${
                      bot.profitLoss >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                    }`}
                  >
                    ${bot.profitLoss.toFixed(2)}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Trades:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{bot.trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Win Rate:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{bot.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Running:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{bot.runTime}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 py-2 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded hover:opacity-90 transition-opacity text-xs">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Bot Section */}
      <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Create New Bot</h2>
        <p className="text-[var(--text-secondary)] mb-6">Choose a bot template to get started with automated trading</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {botTemplates.map((template, idx) => (
            <div
              key={idx}
              className="bg-[var(--navy-light)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--gold)] hover:bg-[var(--slate)] transition-all cursor-pointer group"
            >
              <p className="text-3xl mb-3 group-hover:scale-110 transition-transform">{template.icon}</p>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{template.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">{template.description}</p>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Strategy:</span>
                  <span className="text-[var(--gold)] font-semibold">{template.strategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Risk Level:</span>
                  <span
                    className={`font-semibold ${
                      template.riskLevel === 'High'
                        ? 'text-[var(--red)]'
                        : template.riskLevel === 'Medium'
                        ? 'text-[var(--gold)]'
                        : 'text-[var(--green)]'
                    }`}
                  >
                    {template.riskLevel}
                  </span>
                </div>
              </div>

              <button className="w-full py-2 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded hover:opacity-90 transition-opacity text-xs">
                Create Bot
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bot Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-2">Total Bots</p>
          <p className="text-3xl font-bold text-[var(--gold)]">{bots.length}</p>
        </div>
        <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-2">Active Bots</p>
          <p className="text-3xl font-bold text-[var(--green)]">{bots.filter((b) => b.status === 'active').length}</p>
        </div>
        <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-2">Total P&L</p>
          <p className="text-3xl font-bold text-[var(--green)]">
            ${bots.reduce((sum, bot) => sum + bot.profitLoss, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-2">Avg Win Rate</p>
          <p className="text-3xl font-bold text-[var(--gold)]">
            {(bots.reduce((sum, bot) => sum + bot.winRate, 0) / bots.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Bot Features */}
      <div className="bg-[var(--navy-mid)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">🤖 Bot Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--navy-light)] rounded-lg border border-[var(--border)]">
            <p className="font-semibold text-[var(--gold)] mb-2">⚙️ Customizable Strategies</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Set your own parameters, entry/exit points, and risk management rules
            </p>
          </div>
          <div className="p-4 bg-[var(--navy-light)] rounded-lg border border-[var(--border)]">
            <p className="font-semibold text-[var(--gold)] mb-2">📊 Real-time Monitoring</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Track bot performance, trades, and P&L in real-time
            </p>
          </div>
          <div className="p-4 bg-[var(--navy-light)] rounded-lg border border-[var(--border)]">
            <p className="font-semibold text-[var(--gold)] mb-2">🔒 Automated Safety</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Built-in stop-loss and take-profit to protect your capital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bots;
