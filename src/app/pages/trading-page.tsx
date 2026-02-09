import React from 'react';
import { useTradingStore } from '@/stores/trading-store';
import { useAuthStore } from '@/stores/auth-store';
import { CandlestickChart } from '@/app/components/candlestick-chart';
import { TradingPanel } from '@/app/components/trading-panel';
import { OrderList } from '@/app/components/order-list';
import { socketService } from '@/lib/socket';
import * as Tabs from '@radix-ui/react-tabs';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const TradingPage: React.FC = () => {
  const {
    currentPrice,
    openOrders,
    closedOrders,
    timeframe,
    updatePrice,
    fetchPairs,
    fetchMyTrades,
    selectedPair,
  } = useTradingStore();
  const { isAuthenticated } = useAuthStore();

  const [candleData, setCandleData] = React.useState<CandleData[]>([]);
  const lastCandleTimeRef = React.useRef<number>(0);

  // Use BTC/USD as default - matches BE oracle symbol
  const currentSymbol = selectedPair?.symbol || 'BTC/USD';

  // Initialize candle data
  React.useEffect(() => {
    setCandleData([]);

    const loadCandles = async () => {
      const candles = await useTradingStore.getState().fetchCandles(currentSymbol);
      if (candles && candles.length > 0) {
        setCandleData(candles);
        const lastCandle = candles[candles.length - 1];
        lastCandleTimeRef.current = lastCandle.time;
      }
    };

    loadCandles();
  }, [currentSymbol]);

  React.useEffect(() => {
    socketService.connect();

    const handlePriceUpdate = (data: { pair: string; price: number; timestamp?: number }) => {
      // console.log('🔥 Socket Price Update:', data);

      if (data.pair === currentSymbol) {
        updatePrice(data.price);

        const time = data.timestamp || Date.now();
        const currentMinute = Math.floor(time / 60000) * 60000;

        setCandleData((prev) => {
          if (prev.length === 0) {
            lastCandleTimeRef.current = currentMinute;
            return [{
              time: currentMinute,
              open: data.price,
              high: data.price,
              low: data.price,
              close: data.price,
            }];
          }

          // Important: Only process if time is >= last candle time
          const lastIndex = prev.length - 1;
          const lastCandle = prev[lastIndex];

          if (currentMinute < lastCandle.time) {
            // Ignore out-of-order old packets
            return prev;
          }

          // ... rest of logic ...
          const newData = [...prev];
          const incomingPrice = Number(data.price);

          if (currentMinute > lastCandle.time) {
            // New Candle
            lastCandleTimeRef.current = currentMinute;
            newData.push({
              time: currentMinute,
              open: incomingPrice,
              high: incomingPrice,
              low: incomingPrice,
              close: incomingPrice,
            });
            if (newData.length > 200) newData.shift();
          } else {
            // Update Existing Candle
            const updatedCandle = { ...lastCandle };
            updatedCandle.close = incomingPrice;
            updatedCandle.high = Math.max(Number(updatedCandle.high), incomingPrice);
            updatedCandle.low = Math.min(Number(updatedCandle.low), incomingPrice);
            // updatedCandle.time is already correct
            newData[lastIndex] = updatedCandle;
          }
          return newData;
        });
      }
    };

    socketService.onPriceUpdate(handlePriceUpdate);

    return () => {
      socketService.offPriceUpdate(handlePriceUpdate);
    };
  }, [updatePrice, currentSymbol]);

  React.useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchMyTrades(0, 10);
      const interval = setInterval(() => fetchMyTrades(0, 10), 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchMyTrades]);

  const activeOrders = openOrders.map((order) => ({
    id: order.id,
    entryPrice: order.entryPrice,
    direction: order.direction as 'UP' | 'DOWN',
    timeframe: order.timeframe || timeframe || 60,
    placedAt: order.openTime ? new Date(order.openTime).getTime() : (order.createdAt ? new Date(order.createdAt).getTime() : Date.now()),
  }));

  return (
    <div className="container mx-auto px-4 py-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6 h-[550px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{currentSymbol}</h2>
              </div>
            </div>
            <div className="h-[calc(100%-60px)]">
              <div className="h-[calc(100%-60px)]">
                <CandlestickChart
                  key={currentSymbol}
                  symbol={currentSymbol}
                  data={candleData}
                  currentPrice={currentPrice}
                  activeOrders={activeOrders}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <TradingPanel />
        </div>
      </div>

      <div className="mt-6">
        <Tabs.Root defaultValue="open">
          <Tabs.List className="flex gap-2 border-b border-border mb-4">
            <Tabs.Trigger
              value="open"
              className="px-4 py-2 rounded-t-xl data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
            >
              Lệnh đang mở ({openOrders.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="closed"
              className="px-4 py-2 rounded-t-xl data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
            >
              Lịch sử (Gần đây)
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="open">
            <OrderList orders={openOrders} title="Lệnh đang mở" type="open" />
          </Tabs.Content>

          <Tabs.Content value="closed">
            <OrderList orders={closedOrders.slice(0, 10)} title="Lịch sử giao dịch" type="closed" />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
