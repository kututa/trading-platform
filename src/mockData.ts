// ── Mock assets ─────────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  sym: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  color: string;
  sparkline: number[];
}

function spark(base: number, len = 20): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = Math.max(v + (Math.random() - 0.48) * base * 0.025, 0.0001);
    arr.push(parseFloat(v.toFixed(6)));
  }
  return arr;
}

export const ASSETS: Asset[] = [
  { id: 'btc',  sym: 'BTC',  name: 'Bitcoin',   price: 75186.03, change24h:  2.81, volume24h: 38.4e9, marketCap: 1.48e12, color: '#F7931A', sparkline: spark(75186) },
  { id: 'eth',  sym: 'ETH',  name: 'Ethereum',  price:  2308.92, change24h: -1.07, volume24h: 14.2e9, marketCap: 2.77e11, color: '#627EEA', sparkline: spark(2308)  },
  { id: 'bnb',  sym: 'BNB',  name: 'BNB',       price:   626.25, change24h:  3.81, volume24h:  1.9e9, marketCap: 9.12e10, color: '#F3BA2F', sparkline: spark(626)   },
  { id: 'sol',  sym: 'SOL',  name: 'Solana',    price:    85.07, change24h: -0.30, volume24h:  3.1e9, marketCap: 3.68e10, color: '#9945FF', sparkline: spark(85)    },
  { id: 'xrp',  sym: 'XRP',  name: 'Ripple',    price:     1.42, change24h: -0.01, volume24h:  2.8e9, marketCap: 7.79e10, color: '#00AAE4', sparkline: spark(1.42)  },
  { id: 'doge', sym: 'DOGE', name: 'Dogecoin',  price:   0.0946, change24h:  0.12, volume24h: 0.88e9, marketCap: 1.37e10, color: '#C2A633', sparkline: spark(0.09)  },
  { id: 'ada',  sym: 'ADA',  name: 'Cardano',   price:   0.2466, change24h: -0.08, volume24h: 0.42e9, marketCap: 8.73e9,  color: '#0033AD', sparkline: spark(0.24)  },
  { id: 'trx',  sym: 'TRX',  name: 'TRON',      price:   0.3298, change24h:  0.05, volume24h: 0.57e9, marketCap: 2.86e10, color: '#EF0027', sparkline: spark(0.33)  },
  { id: 'dot',  sym: 'DOT',  name: 'Polkadot',  price:     5.82, change24h:  1.44, volume24h: 0.31e9, marketCap: 8.51e9,  color: '#E6007A', sparkline: spark(5.82)  },
  { id: 'link', sym: 'LINK', name: 'Chainlink', price:    13.74, change24h:  2.11, volume24h: 0.68e9, marketCap: 8.03e9,  color: '#2A5ADA', sparkline: spark(13.74) },
  { id: 'avax', sym: 'AVAX', name: 'Avalanche', price:    27.43, change24h: -2.64, volume24h: 0.54e9, marketCap: 1.13e10, color: '#E84142', sparkline: spark(27.43) },
  { id: 'matic',sym: 'MATIC',name: 'Polygon',   price:    0.571, change24h: -1.20, volume24h: 0.29e9, marketCap: 5.29e9,  color: '#8247E5', sparkline: spark(0.57)  },
];

export const GAINERS = [...ASSETS].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
export const LOSERS  = [...ASSETS].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

// ── Deposit history ────────────────────────────────────────────────────────
export interface DepositRecord {
  id: string;
  amount: number;
  address: string;
  cryptoAmount: string;
  sym: string;
  status: 'waiting' | 'completed' | 'expired';
  date: string;
}

export const DEPOSIT_HISTORY: DepositRecord[] = [
  { id: '1', amount: 500,  address: '0x3f2a9c1b4d8e7f23a56b', cryptoAmount: '500 USDT',    sym: 'USDT', status: 'completed', date: '2025-04-20' },
  { id: '2', amount: 200,  address: '0x8d7cf34a1b29e56c7d8f', cryptoAmount: '0.00265 BTC', sym: 'BTC',  status: 'waiting',   date: '2025-04-22' },
  { id: '3', amount: 1000, address: '0x1a9be72c3f45d87b6c21', cryptoAmount: '1000 USDT',   sym: 'USDT', status: 'completed', date: '2025-04-15' },
  { id: '4', amount: 150,  address: '0xf84da2191c37e65b8d4a', cryptoAmount: '0.065 ETH',   sym: 'ETH',  status: 'expired',   date: '2025-04-10' },
];

// ── Candle generator ───────────────────────────────────────────────────────
export interface Candle { t: number; o: number; h: number; l: number; c: number }

export function genCandles(basePrice: number, count = 60): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.92;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open  = price;
    const move  = Math.sin(i * 0.4) * basePrice * 0.005 + (Math.random() - 0.47) * basePrice * 0.009;
    const close = Math.max(open + move, 0.0001);
    const high  = Math.max(open, close) + Math.random() * basePrice * 0.003;
    const low   = Math.min(open, close) - Math.random() * basePrice * 0.003;
    candles.push({ t: now - i * 3600000, o: open, h: high, l: Math.max(low, 0.0001), c: close });
    price = close;
  }
  return candles;
}

// ── Order book generator ───────────────────────────────────────────────────
export function genOrderBook(mid: number) {
  const asks = Array.from({ length: 14 }, (_, i) => ({
    price: mid + (i + 1) * mid * 0.00025,
    amount: parseFloat((Math.random() * 2 + 0.05).toFixed(4)),
  })).reverse();
  const bids = Array.from({ length: 14 }, (_, i) => ({
    price: mid - (i + 1) * mid * 0.00025,
    amount: parseFloat((Math.random() * 2 + 0.05).toFixed(4)),
  }));
  return { asks, bids };
}

// ── Formatters ─────────────────────────────────────────────────────────────
export const fmt = {
  price: (n: number) =>
    n >= 1000
      ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${n.toFixed(n < 0.01 ? 6 : n < 1 ? 4 : 2)}`,
  pct:  (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`,
  vol:  (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${(n / 1e6).toFixed(2)}M`,
  cap:  (n: number) =>
    n >= 1e12 ? `$${(n / 1e12).toFixed(2)}T`
    : n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B`
    : `$${(n / 1e6).toFixed(2)}M`,
  addr: (a: string) => `${a.slice(0, 8)}...${a.slice(-6)}`,
};

// ── CRYPTO list for deposit/withdraw ──────────────────────────────────────
export const CRYPTO_OPTIONS = [
  { sym: 'USDT', name: 'Tether',   network: 'TRC-20' },
  { sym: 'BTC',  name: 'Bitcoin',  network: 'Bitcoin' },
  { sym: 'ETH',  name: 'Ethereum', network: 'ERC-20' },
  { sym: 'BNB',  name: 'BNB',      network: 'BEP-20' },
  { sym: 'SOL',  name: 'Solana',   network: 'Solana' },
  { sym: 'XRP',  name: 'Ripple',   network: 'XRP Ledger' },
];