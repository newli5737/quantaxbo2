import { create } from 'zustand';
import { api } from '@/lib/api';
import { useAuthStore } from './auth-store';

export interface Trader {
  id: string;
  userId: string;
  isEnabled: boolean;
  riskScore: number;
  user: {
    id: string;
    nickname?: string;
    avatarUrl?: string;
    stats?: {
      winRate: number;
      totalTrades: number;
      totalPnl: number;
    };
  };
}

export interface CopyFollowing {
  id: string;
  traderId: string;
  copyType: 'FIXED' | 'PERCENT';
  copyValue: number;
  maxAmount: number;
  isActive: boolean;
  trader: {
    id: string;
    nickname?: string;
    avatarUrl?: string;
    stats?: {
      winRate: number;
      totalTrades: number;
    };
  };
}

export interface CopyTradeState {
  traders: Trader[];
  following: CopyFollowing[];
  isLoading: boolean;

  fetchTraders: () => Promise<void>;
  fetchFollowing: () => Promise<void>;
  followTrader: (traderId: string, copyType: 'FIXED' | 'PERCENT', value: number, maxAmount: number) => Promise<void>;
  unfollowTrader: (traderId: string) => Promise<void>;
}

export const useCopyTradeStore = create<CopyTradeState>((set, get) => ({
  traders: [],
  following: [],
  isLoading: false,

  fetchTraders: async () => {
    try {
      const traders = await api.get<Trader[]>('/copy-trade/traders');
      set({ traders });
    } catch (e) {
      console.error('Failed to fetch traders', e);
    }
  },

  fetchFollowing: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const following = await api.get<CopyFollowing[]>('/copy-trade/following', token);
      set({ following });
    } catch (e) {
      console.error('Failed to fetch following', e);
    }
  },

  followTrader: async (traderId, copyType, value, maxAmount) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ isLoading: true });
    try {
      await api.post('/copy-trade/follow', { traderId, copyType, value, maxAmount }, token);
      await get().fetchFollowing();
    } finally {
      set({ isLoading: false });
    }
  },

  unfollowTrader: async (traderId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ isLoading: true });
    try {
      await api.post('/copy-trade/unfollow', { traderId }, token);
      await get().fetchFollowing();
    } finally {
      set({ isLoading: false });
    }
  },
}));
