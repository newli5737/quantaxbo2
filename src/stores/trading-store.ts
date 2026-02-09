import { create } from 'zustand';
import { api } from '@/lib/api';
import { useAuthStore } from './auth-store';
import { useWalletStore } from './wallet-store';

export type OrderStatus = 'PENDING' | 'LOCKED' | 'SETTLED';
export type OrderResult = 'WIN' | 'LOSE' | null;
export type OrderDirection = 'UP' | 'DOWN';

export interface Trade {
  id: string;
  pair?: { symbol: string };
  pairId: string;
  direction: OrderDirection;
  amount: number;
  payoutRate: number;
  entryPrice: number;
  openTime: string;
  expireTime: string;
  status: OrderStatus;
  timeframe?: number;
  createdAt?: string;
  result?: { result: 'WIN' | 'LOSE'; profit: number; settlePrice: number };
}

export interface TradingPair {
  id: string;
  symbol: string;
  payoutRate: number;
  isActive: boolean;
}

interface TradingState {
  selectedPair: TradingPair | null;
  pairs: TradingPair[];
  timeframe: number;
  amount: number;
  openOrders: Trade[];
  closedOrders: Trade[];
  totalTrades: number;
  currentPrice: number;
  priceHistory: { time: number; price: number }[];
  isLoading: boolean;

  fetchPairs: () => Promise<void>;
  setSelectedPair: (pair: TradingPair) => void;
  setTimeframe: (timeframe: number) => void;
  setAmount: (amount: number) => void;
  placeTrade: (direction: OrderDirection) => Promise<void>;
  fetchMyTrades: (offset?: number, limit?: number) => Promise<void>;
  updatePrice: (price: number) => void;
  fetchCandles: (symbol: string) => Promise<any[]>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  selectedPair: null,
  pairs: [],
  timeframe: 60,
  amount: 10,
  openOrders: [],
  closedOrders: [],
  totalTrades: 0,
  currentPrice: 43250.5,
  priceHistory: [],
  isLoading: false,

  fetchPairs: async () => {
    try {
      const pairs = await api.get<TradingPair[]>('/trading-pairs');
      const activePairs = pairs.filter((p) => p.isActive);
      const btcPair = activePairs.find((p) => p.symbol === 'BTC/USD');

      set((state) => {
        // Keep current selection if valid
        if (state.selectedPair && activePairs.find(p => p.id === state.selectedPair?.id)) {
          return { pairs: activePairs };
        }
        // Default to BTC or first active
        return {
          pairs: activePairs,
          selectedPair: btcPair || activePairs[0] || null
        };
      });
    } catch (e) {
      console.error('Failed to fetch pairs', e);
    }
  },

  setSelectedPair: (pair) => set({ selectedPair: pair }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setAmount: (amount) => set({ amount }),

  placeTrade: async (direction) => {
    const state = get();
    const { isAuthenticated } = useAuthStore.getState();
    if (!state.selectedPair || !isAuthenticated) return;

    set({ isLoading: true });
    try {
      await api.post(
        '/trades',
        {
          pairId: state.selectedPair.id,
          direction,
          amount: state.amount,
          timeframe: state.timeframe,
        }
      );
      await get().fetchMyTrades();
      await useWalletStore.getState().fetchWallet();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyTrades: async (offset = 0, limit = 20) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;
    try {
      const { trades, total } = await api.get<{ trades: Trade[]; total: number }>(
        `/trades/my?offset=${offset}&limit=${limit}`
      );
      set({
        openOrders: trades.filter((t) => t.status !== 'SETTLED'),
        closedOrders: trades.filter((t) => t.status === 'SETTLED'),
        totalTrades: total,
      });
      await useWalletStore.getState().fetchWallet();
    } catch (e) {
      console.error('Failed to fetch trades', e);
    }
  },

  updatePrice: (price) => {
    set((state) => ({
      currentPrice: price,
      priceHistory: [...state.priceHistory.slice(-100), { time: Date.now(), price }],
    }));
  },

  fetchCandles: async (symbol: string) => {
    try {
      const data = await api.get<any[]>(`/trading-pairs/candles?symbol=${encodeURIComponent(symbol)}&limit=200`);
      // console.log(`[TradingStore] fetchCandles for ${symbol}: Received ${data.length} candles. Last close: ${data[data.length - 1]?.close}`);
      return data;
    } catch (e) {
      console.error('Failed to fetch candles', e);
      return [];
    }
  },
}));
