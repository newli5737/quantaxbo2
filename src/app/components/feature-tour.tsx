import React from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import * as Dialog from '@radix-ui/react-dialog';

interface FeatureTourProps {
  onNavigate: (page: string) => void;
}

export const FeatureTour: React.FC<FeatureTourProps> = ({ onNavigate }) => {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    {
      title: 'Chào mừng đến Binary DEX!',
      description: 'Nền tảng Binary Options',
      features: [
        'Giao dịch nhanh chóng với timeframe linh hoạt',
        'Tỷ lệ thanh toán lên đến 85%',
        'Thanh toán on-chain minh bạch',
      ],
      action: { label: 'Bắt đầu tour', page: null },
    },
    {
      title: 'Trading Terminal',
      description: 'Đặt lệnh UP/DOWN với chart real-time và countdown timer',
      features: [
        'Chart giá real-time',
        'Chọn cặp và timeframe linh hoạt',
        'Nút UP/DOWN trực quan',
        'Theo dõi lệnh real-time',
      ],
      action: { label: 'Xem Trading', page: 'trading' },
    },
    {
      title: 'Copy Trade',
      description: 'Sao chép giao dịch từ các trader hàng đầu',
      features: [
        'Danh sách top traders',
        'Win rate & ROI minh bạch',
        'Performance charts',
        'Cài đặt copy tùy chỉnh',
      ],
      action: { label: 'Xem Copy Trade', page: 'copy-trade' },
    },
    {
      title: 'Portfolio & Analytics',
      description: 'Phân tích hiệu suất giao dịch của bạn',
      features: [
        'PnL charts',
        'Win/Lose statistics',
        'Phân bổ theo pair',
        'Trading history',
      ],
      action: { label: 'Xem Portfolio', page: 'portfolio' },
    },
    {
      title: 'Admin Dashboard',
      description: 'Quản lý và giám sát toàn bộ nền tảng',
      features: [
        'Dashboard với KPIs',
        'Real-time trade monitoring',
        'Pair configuration',
        'Risk management',
        'Analytics & Reports',
      ],
      action: { label: 'Xem Admin (demo: admin/admin)', page: 'admin-login' },
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      setCurrentStep(0);
    }
  };

  const handleNavigate = (page: string | null) => {
    if (page) {
      onNavigate(page);
      setOpen(false);
      setCurrentStep(0);
    }
  };

  const step = steps[currentStep];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        🎯 Feature Tour
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Bước {currentStep + 1} / {steps.length}
                    </div>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                  </div>
                  <Dialog.Close asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <p className="text-muted-foreground mb-6">{step.description}</p>

                <div className="space-y-3 mb-8">
                  {step.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className="h-5 w-5 text-success" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {step.action.page && (
                    <Button
                      variant="outline"
                      onClick={() => handleNavigate(step.action.page)}
                      className="gap-2"
                    >
                      {step.action.label}
                    </Button>
                  )}
                  <Button onClick={handleNext} className="gap-2 flex-1">
                    {currentStep < steps.length - 1 ? (
                      <>
                        Tiếp theo
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      'Hoàn thành'
                    )}
                  </Button>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${i === currentStep
                        ? 'w-8 bg-primary'
                        : i < currentStep
                          ? 'w-2 bg-success'
                          : 'w-2 bg-muted'
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
