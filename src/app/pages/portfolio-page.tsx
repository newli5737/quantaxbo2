import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Layers, PieChart as PieIcon, History as HistoryIcon, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';
import { useTradingStore } from '@/stores/trading-store';
import { useWalletStore } from '@/stores/wallet-store';
import { useAuthStore } from '@/stores/auth-store';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Helper to format USDT
const formatUSDT = (val: number) => {
  const formatted = formatCurrency(val);
  return formatted.replace('$', '') + ' USDT';
};

export const PortfolioPage: React.FC = () => {
  const { closedOrders, totalTrades, fetchMyTrades } = useTradingStore();
  const { balance, lockedBalance, fetchWallet } = useWalletStore();
  const { isAuthenticated } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchMyTrades((currentPage - 1) * pageSize, pageSize);
      fetchWallet();
    }
  }, [isAuthenticated, fetchMyTrades, fetchWallet, currentPage]);

  // Use useMemo for heavy calculations
  const analytics = useMemo(() => {
    if (!closedOrders.length) return null;

    let totalProfit = 0;
    let winTrades = 0;
    let loseTrades = 0;
    let totalInvested = 0;
    const pnlHistory: { date: string; value: number }[] = [];
    const tradesByPair: Record<string, number> = {};

    // Sort by openTime to calculate running PnL
    const sortedOrders = [...closedOrders].sort(
      (a, b) => new Date(a.openTime).getTime() - new Date(b.openTime).getTime()
    );

    let runningPnl = 0;

    sortedOrders.forEach((order) => {
      const profit = Number(order.result?.profit || 0);
      const amount = Number(order.amount || 0);
      const isWin = order.result?.result === 'WIN';

      totalProfit += profit;
      totalInvested += amount;
      if (isWin) winTrades++;
      else loseTrades++;

      runningPnl += profit;
      pnlHistory.push({
        date: new Date(order.openTime).toLocaleDateString('vi-VN'),
        value: runningPnl
      });

      const pairName = order.pair?.symbol || 'Unknown';
      tradesByPair[pairName] = (tradesByPair[pairName] || 0) + 1;
    });

    const winRate = (winTrades / closedOrders.length) * 100;
    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const pairData = Object.entries(tradesByPair).map(([name, value]) => ({
      name,
      value
    }));

    return {
      totalProfit,
      winTrades,
      loseTrades,
      totalLoaded: closedOrders.length,
      winRate,
      roi,
      pnlHistory,
      pairData
    };
  }, [closedOrders]);

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#22d3ee', '#10b981'];

  const totalPages = Math.ceil(totalTrades / pageSize);

  if (!isAuthenticated) return (
    <div className="flex items-center justify-center p-20 text-muted-foreground">
      Vui lòng đăng nhập để xem danh mục đầu tư.
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục đầu tư</h1>
          <p className="text-muted-foreground">Theo dõi hiệu suất giao dịch và phân bổ tài sản của bạn.</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg border">
          <div className="px-4 py-2 text-sm font-medium">Tự động cập nhật: BẬT</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover-lift border-primary/10 transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Số dư khả dụng</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{formatUSDT(balance)}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
              Đang khóa: {formatUSDT(lockedBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-primary/10 transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Net PnL</span>
              {(analytics?.totalProfit || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${(analytics?.totalProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(analytics?.totalProfit || 0) >= 0 ? '+' : ''}
              {formatUSDT(analytics?.totalProfit || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Lợi nhuận từ {analytics?.totalLoaded || 0} lệnh</div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-primary/10 transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{formatPercent(analytics?.winRate || 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics?.winTrades || 0} Thắng / {analytics?.loseTrades || 0} Thua
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-primary/10 transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">ROI</span>
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <div className={`text-2xl font-bold ${(analytics?.roi || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(analytics?.roi || 0) >= 0 ? '+' : ''}
              {formatPercent(analytics?.roi || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Tỷ lệ lợi nhuận trang này</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieIcon className="h-4 w-4" />
            Tổng quan (Biểu đồ)
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lịch sử lệnh (Toàn bộ)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HistoryIcon className="h-5 w-5 text-primary" />
                  Phân tích PnL (Trang hiện tại)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && analytics.pnlHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={analytics.pnlHistory}>
                      <defs>
                        <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        stroke="#888"
                        fontSize={12}
                        tickFormatter={(value: string) => value.split('/')[0]}
                      />
                      <YAxis
                        stroke="#888"
                        fontSize={12}
                        tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(value: number) => [formatUSDT(value), 'PnL']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#colorPnl)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-muted/5 rounded-lg border border-dashed border-white/10">
                    Chưa có dữ liệu giao dịch
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieIcon className="h-5 w-5 text-primary" />
                  Phân bổ Pairs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && analytics.pairData.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics.pairData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analytics.pairData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#fff',
                            }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-3">
                      {analytics.pairData.map((pair, i) => (
                        <div key={pair.name} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <span className="font-medium">{pair.name}</span>
                          </div>
                          <span className="text-muted-foreground font-mono">{pair.value} lệnh</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/5 rounded-lg border border-dashed border-white/10">
                    Chưa có dữ liệu Pairs
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Chi tiết lịch sử lệnh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-white/5 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[150px]">Cặp tiền</TableHead>
                      <TableHead>Hướng</TableHead>
                      <TableHead>Số vốn</TableHead>
                      <TableHead>Giá vào</TableHead>
                      <TableHead>Giá đóng</TableHead>
                      <TableHead>Kết quả (PnL)</TableHead>
                      <TableHead className="text-right">Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closedOrders.length > 0 ? (
                      closedOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-white/[0.02] border-white/5">
                          <TableCell className="font-bold">{order.pair?.symbol || 'Unknown'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.direction === 'UP' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                              {order.direction}
                            </span>
                          </TableCell>
                          <TableCell>{formatUSDT(order.amount)}</TableCell>
                          <TableCell className="font-mono text-xs">{Number(order.entryPrice).toFixed(2)}</TableCell>
                          <TableCell className="font-mono text-xs">{Number(order.result?.settlePrice).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`font-bold flex items-center gap-1 ${order.result?.result === 'WIN' ? 'text-green-500' : 'text-red-500'
                              }`}>
                              {order.result?.result === 'WIN' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {order.result?.result === 'WIN' ? '+' : ''}
                              {formatUSDT(Number(order.result?.profit) || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {new Date(order.openTime).toLocaleString('vi-VN')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                          Không tìm thấy lệnh nào.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (totalPages > 7 && (pageNum > 2 && pageNum < totalPages - 1 && Math.abs(pageNum - currentPage) > 1)) {
                          if (pageNum === 3 || pageNum === totalPages - 2) return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>;
                          return null;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNum);
                              }}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
