import React from 'react';
import { Shield, AlertTriangle, Activity, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useAdminStore } from '@/stores/admin-store';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export const RiskManagementPage: React.FC = () => {
    const { riskData } = useAdminStore();
    const [limits, setLimits] = React.useState({
        maxExposure: 50000,
        maxCopyPerOrder: 1000,
        poolReserve: 100000
    });

    const handleUpdateLimits = () => {
        toast.success('Đã cập nhật hạn mức rủi ro thành công');
    };

    const exposureData = riskData.exposureByPair.map(item => ({
        name: item.pair,
        exposure: item.amount,
        limit: limits.maxExposure
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Quản lý Rủi ro & Pool</span>
                    </h1>
                    <p className="text-muted-foreground">Theo dõi và điều chỉnh các thông số rủi ro hệ thống.</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Pool Balance</span>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(riskData.poolBalance)}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                            Khả dụng để thanh toán
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${riskData.totalExposure > limits.poolReserve ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Exposure</span>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-3xl font-bold text-warning">{formatCurrency(riskData.totalExposure)}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {formatPercent((riskData.totalExposure / riskData.poolBalance) * 100)} của Pool
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${riskData.riskLevel === 'high' ? 'border-l-red-500' : 'border-l-green-500'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Trạng thái rủi ro</span>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold uppercase flex items-center gap-2">
                            {riskData.riskLevel}
                            <Badge variant={riskData.riskLevel === 'high' ? 'danger' : 'success'}>
                                {riskData.riskLevel === 'high' ? 'Nguy hiểm' : 'An toàn'}
                            </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            Dựa trên biến động & exposure
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exposure Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exposure theo Cặp giao dịch</CardTitle>
                        <CardDescription>So sánh với hạn mức tối đa cho phép</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={exposureData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                    }}
                                    formatter={(value: number) => [formatCurrency(value), 'Exposure']}
                                />
                                <Bar dataKey="exposure" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình Hạn mức</CardTitle>
                        <CardDescription>Thiết lập các giới hạn an toàn cho hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Exposure per Pair (USDT)</label>
                            <Input
                                type="number"
                                value={limits.maxExposure}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimits({ ...limits, maxExposure: Number(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">Tổng giá trị lệnh mở tối đa cho một cặp tiền</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Copy Order Size (USDT)</label>
                            <Input
                                type="number"
                                value={limits.maxCopyPerOrder}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimits({ ...limits, maxCopyPerOrder: Number(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">Giá trị tối đa cho một lệnh copy trade</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pool Reserve Warning Level (USDT)</label>
                            <Input
                                type="number"
                                value={limits.poolReserve}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimits({ ...limits, poolReserve: Number(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">Cảnh báo khi Pool xuống dưới mức này</p>
                        </div>

                        <div className="pt-4">
                            <Button onClick={handleUpdateLimits} className="w-full">
                                Lưu cấu hình
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Real-time Alerts */}
            <Card className="border-warning/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        Cảnh báo rủi ro hiện tại
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
                                <Activity className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-semibold text-warning">
                                        {i === 1 ? 'High Volatility Detected' : 'Large Order Volume'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {i === 1 ? 'BTC/USDT biến động > 5% trong 5 phút qua.' : 'Phát hiện lượng lớn lệnh Short trên ETH/USDT.'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{i * 5} phút trước</div>
                                </div>
                                <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                                    Chi tiết
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
