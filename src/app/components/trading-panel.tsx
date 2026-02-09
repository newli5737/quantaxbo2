import React from 'react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { useTradingStore } from '@/stores/trading-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { toast } from 'sonner';

export const TradingPanel: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    selectedPair,
    pairs,
    timeframe,
    amount,
    setSelectedPair,
    setTimeframe,
    setAmount,
    placeTrade,
    fetchPairs,
  } = useTradingStore();

  React.useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  const timeframes = [
    { value: 60, label: '1 phút' },
    { value: 180, label: '3 phút' },
    { value: 300, label: '5 phút' },
    { value: 600, label: '10 phút' },
    { value: 900, label: '15 phút' },
  ];

  const payout = selectedPair?.payoutRate || 0.85;
  const estimatedProfit = amount * payout;

  const handleTrade = async (direction: 'UP' | 'DOWN') => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập trước');
      return;
    }
    if (amount < 1) {
      toast.error('Số tiền tối thiểu là 1 USDT');
      return;
    }
    try {
      await placeTrade(direction);
      toast.success(`Đã đặt lệnh ${direction === 'UP' ? 'TĂNG' : 'GIẢM'} thành công!`);
    } catch (error) {
      toast.error('Đặt lệnh thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đặt lệnh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-muted-foreground">Cặp giao dịch</label>
          <select
            value={selectedPair?.id || ''}
            onChange={(e) => {
              const pair = pairs.find((p) => p.id === e.target.value);
              if (pair) setSelectedPair(pair);
            }}
            className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pairs.map((pair) => (
              <option key={pair.id} value={pair.id}>
                {pair.symbol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2 text-muted-foreground">Thời gian</label>
          <div className="grid grid-cols-3 gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${timeframe === tf.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
              >
                <Clock className="h-3 w-3 inline mr-1" />
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-muted-foreground">Số tiền (USDT)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min={1}
            step={1}
            placeholder="Nhập số tiền"
          />
          <div className="mt-2 flex gap-2">
            {[10, 25, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="px-3 py-1 rounded-md text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tỷ lệ thanh toán</span>
            <span className="font-semibold text-success">{formatPercent(payout * 100, 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lợi nhuận dự kiến</span>
            <span className="font-semibold">{formatCurrency(estimatedProfit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng nhận về</span>
            <span className="font-bold">{formatCurrency(amount + estimatedProfit)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="up"
            size="lg"
            onClick={() => handleTrade('UP')}
            disabled={!isAuthenticated || !selectedPair}
            className="gap-2"
          >
            <ArrowUp className="h-5 w-5" />
            TĂNG
          </Button>
          <Button
            variant="down"
            size="lg"
            onClick={() => handleTrade('DOWN')}
            disabled={!isAuthenticated || !selectedPair}
            className="gap-2"
          >
            <ArrowDown className="h-5 w-5" />
            GIẢM
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-center text-muted-foreground">
            Đăng nhập để bắt đầu giao dịch
          </p>
        )}
      </CardContent>
    </Card>
  );
};
