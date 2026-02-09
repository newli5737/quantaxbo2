import React from 'react';
import { TrendingUp, Users, Copy, XCircle } from 'lucide-react';
import { useCopyTradeStore } from '@/stores/copy-trade-store';
import { useAuthStore } from '@/stores/auth-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { formatPercent, formatNumber, getAvatarUrl } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';

interface CopyTradePageProps {
  onNavigate?: (page: string) => void;
  onOpenLogin?: () => void;
}

export const CopyTradePage: React.FC<CopyTradePageProps> = ({ onNavigate, onOpenLogin }) => {
  const { traders, following, fetchTraders, fetchFollowing, followTrader, unfollowTrader, isLoading } =
    useCopyTradeStore();
  const [selectedTrader, setSelectedTrader] = React.useState<string | null>(null);
  const [copyType, setCopyType] = React.useState<'FIXED' | 'PERCENT'>('PERCENT');
  const [copyValue, setCopyValue] = React.useState(10);
  const [maxAmount, setMaxAmount] = React.useState(100);

  React.useEffect(() => {
    fetchTraders();
    fetchFollowing();
  }, [fetchTraders, fetchFollowing]);

  const { isAuthenticated } = useAuthStore();


  const handleCopy = async (traderId: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      if (onOpenLogin) onOpenLogin();
      return;
    }
    await followTrader(traderId, copyType, copyValue, maxAmount);
    toast.success('Đã bắt đầu copy trader!');
    setSelectedTrader(null);
  };

  const handleStopCopy = async (traderId: string) => {
    await unfollowTrader(traderId);
    toast.success('Đã dừng copy trader');
  };

  const isCopied = (traderId: string) => {
    return following.some((c) => c.traderId === traderId && c.isActive);
  };

  const getRiskBadge = (score: number) => {
    if (score <= 3) return { variant: 'success' as const, label: 'Thấp' };
    if (score <= 6) return { variant: 'warning' as const, label: 'Trung bình' };
    return { variant: 'danger' as const, label: 'Cao' };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Copy Trade</h1>
        <p className="text-muted-foreground">
          Theo dõi và sao chép giao dịch từ các trader hàng đầu
        </p>
      </div>

      {following.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Đang copy ({following.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {following.map((copy) => (
              <Card key={copy.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <a href={`/u/${copy.trader?.nickname}`} className="block relative group">
                        <Avatar className="h-12 w-12 border-2 border-primary/20 transition-transform group-hover:scale-110">
                          <AvatarImage src={getAvatarUrl(copy.trader?.avatarUrl)} alt={copy.trader?.nickname} className="object-cover" />
                          <AvatarFallback className="bg-primary/20">
                            <Users className="h-6 w-6 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      </a>
                      <div>
                        <a href={`/u/${copy.trader?.nickname}`} className="font-semibold hover:text-primary hover:underline transition-colors block">
                          {copy.trader?.nickname || 'Trader'}
                        </a>
                        <div className="text-xs text-muted-foreground">
                          {copy.copyType} - {copy.copyValue}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStopCopy(copy.traderId)}
                      className="text-danger"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loại copy:</span>
                      <span>{copy.copyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá trị:</span>
                      <span>{copy.copyValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max/lệnh:</span>
                      <span>${copy.maxAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Top Traders</h2>
      {traders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có trader nào. Hãy quay lại sau!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traders.map((trader) => {
            const copied = isCopied(trader.userId);
            const risk = getRiskBadge(trader.riskScore);

            return (
              <Card key={trader.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <a href={`/u/${trader.user?.nickname}`} className="block relative group">
                        <Avatar className="h-12 w-12 border-2 border-primary/20 transition-transform group-hover:scale-110">
                          <AvatarImage src={getAvatarUrl(trader.user?.avatarUrl)} alt={trader.user?.nickname} className="object-cover" />
                          <AvatarFallback className="bg-primary/20">
                            <TrendingUp className="h-6 w-6 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      </a>
                      <div>
                        <CardTitle className="text-base">
                          <a href={`/u/${trader.user?.nickname}`} className="hover:text-primary hover:underline transition-colors">
                            {trader.user?.nickname || 'Trader'}
                          </a>
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          Win Rate: {trader.user?.stats?.winRate || 0}%
                        </div>
                      </div>
                    </div>
                    <Badge variant={risk.variant}>Rủi ro: {risk.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tỷ lệ thắng</div>
                      <div className="text-lg font-bold text-success">
                        {formatPercent(trader.user?.stats?.winRate || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tổng PnL</div>
                      <div className="text-lg font-bold text-success">
                        ${formatNumber(trader.user?.stats?.totalPnl || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tổng lệnh</div>
                      <div className="font-semibold">
                        {formatNumber(trader.user?.stats?.totalTrades || 0, 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk Score</div>
                      <div className="font-semibold">{trader.riskScore}/10</div>
                    </div>
                  </div>

                  <Button
                    variant={copied ? 'outline' : 'default'}
                    className="w-full gap-2"
                    disabled={copied || isLoading}
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
                        if (onOpenLogin) onOpenLogin();
                        return;
                      }
                      setSelectedTrader(trader.userId);
                    }}
                  >
                    {copied ? (
                      <>
                        <Copy className="h-4 w-4" />
                        Đang copy
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy trader
                      </>
                    )}
                  </Button>

                  <Dialog.Root
                    open={selectedTrader === trader.userId}
                    onOpenChange={(open) => setSelectedTrader(open ? trader.userId : null)}
                  >

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg p-6 w-full max-w-md z-50">
                        <Dialog.Title className="text-xl font-bold mb-4">
                          Cài đặt Copy Trade
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground mb-4">
                          Tùy chỉnh các thông số để sao chép giao dịch từ trader này. Lưu ý quản lý rủi ro của bạn.
                        </Dialog.Description>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm mb-2">Loại copy</label>
                            <select
                              value={copyType}
                              onChange={(e) => setCopyType(e.target.value as 'FIXED' | 'PERCENT')}
                              className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm"
                            >
                              <option value="PERCENT">Theo %</option>
                              <option value="FIXED">Cố định</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm mb-2">
                              {copyType === 'PERCENT' ? '% vốn copy (1-50%)' : 'Số tiền cố định ($)'}
                            </label>
                            <Input
                              type="number"
                              value={copyValue}
                              onChange={(e) => setCopyValue(Number(e.target.value))}
                              min={1}
                              max={copyType === 'PERCENT' ? 50 : 10000}
                            />
                          </div>

                          <div>
                            <label className="block text-sm mb-2">Số tiền tối đa mỗi lệnh ($)</label>
                            <Input
                              type="number"
                              value={maxAmount}
                              onChange={(e) => setMaxAmount(Number(e.target.value))}
                              min={1}
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Dialog.Close asChild>
                              <Button variant="outline" className="flex-1">
                                Hủy
                              </Button>
                            </Dialog.Close>
                            <Button
                              className="flex-1"
                              onClick={() => handleCopy(trader.userId)}
                              disabled={isLoading}
                            >
                              Xác nhận
                            </Button>
                          </div>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
