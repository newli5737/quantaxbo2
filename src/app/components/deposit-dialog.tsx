import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Copy, Check, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';


interface BankAccount {
    id: string;
    bankName: string; // Tên ngân hàng
    accountNumber: string; // Số tài khoản
    accountName: string; // Tên chủ tài khoản
    bankCode: string; // Mã ngân hàng (VCB, TCB...)
}

interface DepositResponse {
    id: string;
    codePay: string;
    amount: number;
    expiredAt: string;
    bankAccount: BankAccount;
}

interface DepositDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const DepositDialog: React.FC<DepositDialogProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = React.useState<'amount' | 'payment'>('amount');
    const [amount, setAmount] = React.useState('');
    const [banks, setBanks] = React.useState<BankAccount[]>([]);
    const [selectedBankId, setSelectedBankId] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);
    const [depositData, setDepositData] = React.useState<DepositResponse | null>(null);

    const [copiedField, setCopiedField] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            fetchBanks();
            setStep('amount');
            setAmount('');
            setDepositData(null);
        }
    }, [isOpen]);

    const fetchBanks = async () => {
        try {
            const data = await api.get<BankAccount[]>('/wallet/banks');
            setBanks(data);
            if (data.length > 0) {
                setSelectedBankId(data[0].id);
            }
        } catch (e) {
            console.error('Failed to fetch banks', e);
            // toast.error('Không thể tải danh sách ngân hàng');
        }
    };

    const handleCreateDeposit = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        if (!selectedBankId) {
            toast.error('Vui lòng chọn ngân hàng');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post<DepositResponse>('/wallet/deposit', {
                amount: Number(amount),
                bankAccountId: selectedBankId
            });

            setDepositData(res);
            setStep('payment');
            // Trigger refresh
            if (onSuccess) onSuccess();
        } catch (e) {
            console.error('Create deposit error', e);
            toast.error('Tạo lệnh nạp thất bại');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success('Đã sao chép');
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nạp tiền vào tài khoản</DialogTitle>
                    <DialogDescription>
                        Điền thông tin và chuyển khoản để nạp tiền vào ví.
                    </DialogDescription>
                </DialogHeader>

                {step === 'amount' ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chọn ngân hàng nhận</label>
                            <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ngân hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank.id} value={bank.id}>
                                            {bank.bankCode} - {bank.bankName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số tiền nạp (USDT)</label>
                            <Input
                                type="number"
                                placeholder="Nhập số tiền"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="10"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Tối thiểu 10 USDT</span>
                                <span>Thành tiền: <span className="text-primary font-bold">{formatCurrency((Number(amount) || 0) * 26000)}</span></span>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                            <Button onClick={handleCreateDeposit} disabled={loading} className="gap-2">
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Tạo lệnh nạp
                            </Button>
                        </DialogFooter>
                    </div>
                ) : depositData ? (
                    <div className="space-y-4 py-2">
                        <div className="flex justify-center mb-4">
                            <img
                                src={`https://qr.sepay.vn/img?acc=${depositData.bankAccount.accountNumber}&bank=${depositData.bankAccount.bankCode || depositData.bankAccount.bankName}&amount=${Math.round(depositData.amount * 26000)}&des=${depositData.codePay}`}
                                alt="QR Chuyển khoản"
                                className="max-w-[200px] border rounded-lg shadow-sm"
                            />
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-sm text-yellow-500 text-center">
                            Quét mã QR hoặc chuyển khoản chính xác nội dung bên dưới.
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground">Ngân hàng</div>
                                    <div className="font-semibold">{depositData.bankAccount.bankName}</div>
                                </div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground">Số tài khoản</div>
                                    <div className="font-semibold text-lg">{depositData.bankAccount.accountNumber}</div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(depositData.bankAccount.accountNumber, 'accNum')}>
                                    {copiedField === 'accNum' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground">Chủ tài khoản</div>
                                    <div className="font-semibold">{depositData.bankAccount.accountName}</div>
                                </div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground">Số tiền cần chuyển (VND)</div>
                                    <div className="font-semibold text-lg text-primary">{formatCurrency(Math.round(depositData.amount * 26000))}</div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(Math.round(depositData.amount * 26000)), 'amount')}>
                                    {copiedField === 'amount' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>

                            <div className="p-4 border-2 border-primary/50 bg-primary/5 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-medium text-primary uppercase mb-1">Nội dung chuyển khoản (Bắt buộc)</div>
                                    <div className="font-bold text-2xl tracking-wider">{depositData.codePay}</div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(depositData.codePay, 'code')}>
                                    {copiedField === 'code' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs text-muted-foreground mt-4">
                            Lệnh nạp hết hạn lúc: {new Date(depositData.expiredAt).toLocaleTimeString()}
                        </div>

                        <Button className="w-full mt-4" onClick={onClose}>Đã chuyển tiền / Đóng</Button>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};
