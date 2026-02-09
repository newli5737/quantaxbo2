import React from 'react';
import { TrendingUp, Users, Copy, Trophy, ArrowRight, Zap, Shield, Globe, ChevronRight, Star, Clock, User, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { QuickStartGuide } from '@/app/components/quick-start-guide';
import { StatsTicker } from '@/app/components/stats-ticker';
import { AuthDrawer } from '@/app/components/auth-drawer';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuthStore();
  const [showAuthDrawer, setShowAuthDrawer] = React.useState(false);

  const stats = [
    { label: 'Khối lượng 24h', value: formatCurrency(15420350.75), icon: TrendingUp, color: 'from-indigo-500 to-purple-600' },
    { label: 'Tổng lệnh', value: formatNumber(45678, 0), icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
    { label: 'Trader hoạt động', value: formatNumber(3456, 0), icon: Users, color: 'from-emerald-500 to-teal-600' },
    { label: 'Tỷ lệ thanh toán', value: '85%', icon: Trophy, color: 'from-amber-500 to-orange-600' },
  ];

  const features = [
    {
      title: 'Giao dịch siêu tốc',
      description: 'Đặt lệnh trong vài giây với khung thời gian từ 1-15 phút. Giao diện tối ưu cho trải nghiệm mượt mà.',
      image: '/images/feature_fast_trading.webp',
      gradient: 'from-amber-500/20 to-orange-600/20',
      iconBg: 'from-amber-500 to-orange-600',
      icon: Zap,
    },
    {
      title: 'Copy Trade thông minh',
      description: 'Sao chép giao dịch từ top trader với tỷ lệ thắng cao. Kiếm lợi nhuận tự động 24/7.',
      image: '/images/feature_copy_trade.webp',
      gradient: 'from-purple-500/20 to-pink-600/20',
      iconBg: 'from-purple-500 to-pink-600',
      icon: Copy,
    },
    {
      title: 'An toàn & Minh bạch',
      description: 'Thanh toán on-chain, Oracle đáng tin cậy. Mọi giao dịch được ghi lại trên blockchain.',
      image: '/images/feature_security.webp',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      iconBg: 'from-cyan-500 to-blue-600',
      icon: Shield,
    },
  ];

  const topTraders = [
    { name: 'CryptoKing', winRate: 87.5, profit: 125000, followers: 1234 },
    { name: 'BitMaster', winRate: 82.3, profit: 98500, followers: 987 },
    { name: 'TradeGuru', winRate: 79.8, profit: 76200, followers: 756 },
  ];

  return (
    <div className="relative overflow-hidden">
      <StatsTicker />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Nền tảng giao dịch thế hệ mới
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  Quantax
                </span>
                <br />
                <span className="text-foreground">Binary Trading</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Nền tảng giao dịch Binary Option <span className="text-primary font-semibold">phi tập trung</span> với thanh toán on-chain,
                minh bạch và <span className="text-primary font-semibold">an toàn tuyệt đối</span>
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                {!isAuthenticated ? (
                  <Button size="lg" onClick={() => setShowAuthDrawer(true)} className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                    <User className="h-5 w-5" />
                    Đăng nhập để bắt đầu
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => onNavigate('trading')} className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                    Bắt đầu giao dịch
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => onNavigate('copy-trade')} className="gap-2 px-8 py-6 text-lg border-2 hover:bg-primary/10">
                  <Copy className="h-5 w-5" />
                  Copy Trade
                </Button>
              </div>

              {/* Mini Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-muted-foreground">3,456 trader online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Thanh toán tức thì</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">4.9/5 đánh giá</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl shadow-primary/20">
                  <img
                    src="/images/hero_trading_dashboard.webp"
                    alt="Trading Dashboard"
                    width={600}
                    height={400}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-4 -left-4 p-4 rounded-xl bg-card/80 backdrop-blur-xl border shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Lợi nhuận hôm nay</div>
                      <div className="text-xl font-bold text-success">+$12,450</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-card/80 backdrop-blur-xl border shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tỷ lệ thắng</div>
                      <div className="text-xl font-bold">85.7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="hover:scale-105 transition-all duration-300 border-0 bg-card/50 backdrop-blur-xl overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <CardContent className="p-6 relative">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Tính năng nổi bật
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trải nghiệm giao dịch đỉnh cao với công nghệ tiên tiến nhất
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-2xl group-hover:blur-3xl transition-all`} />
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="relative w-full h-auto rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.iconBg} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <Button variant="outline" className="gap-2 group">
                      Tìm hiểu thêm
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Traders Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-600/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Top Trader
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Theo dõi và copy trade từ những trader xuất sắc nhất
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {topTraders.map((trader, i) => (
              <Card key={i} className="hover:scale-105 transition-all duration-300 overflow-hidden group">
                <div className="absolute top-0 right-0 p-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${i === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' :
                    i === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-300 text-black' :
                      'bg-gradient-to-r from-amber-700 to-amber-600 text-white'
                    }`}>
                    #{i + 1}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${i === 0 ? 'from-amber-500 to-yellow-500' :
                      i === 1 ? 'from-slate-400 to-slate-500' :
                        'from-amber-700 to-amber-800'
                      } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                      {trader.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{trader.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {trader.followers} followers
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-success/10">
                      <div className="text-sm text-muted-foreground">Tỷ lệ thắng</div>
                      <div className="text-xl font-bold text-success">{trader.winRate}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10">
                      <div className="text-sm text-muted-foreground">Lợi nhuận</div>
                      <div className="text-xl font-bold text-primary">+${formatNumber(trader.profit, 0)}</div>
                    </div>
                  </div>
                  <Button className="w-full gap-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600" onClick={() => onNavigate('copy-trade')}>
                    <Copy className="h-4 w-4" />
                    Copy Trade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => onNavigate('leaderboard')} className="gap-2">
              Xem tất cả trader
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Cách hoạt động
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Đơn giản chỉ với 3 bước
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

            {[
              { step: 1, title: 'Chọn tài sản & thời gian', desc: 'Chọn cặp giao dịch BTC, ETH, v.v. và khung thời gian từ 1-15 phút', icon: BarChart3 },
              { step: 2, title: 'Dự đoán TĂNG hoặc GIẢM', desc: 'Phân tích biểu đồ và chọn hướng giá bạn tin tưởng', icon: TrendingUp },
              { step: 3, title: 'Nhận kết quả & lợi nhuận', desc: 'Đúng dự đoán? Nhận tới 85% lợi nhuận ngay lập tức!', icon: Trophy },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative text-center group">
                  <div className="mb-6 relative inline-block">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:shadow-primary/50 transition-all">
                      <Icon className="h-10 w-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Bắt đầu nhanh chóng
              </span>
            </h2>
          </div>
          <QuickStartGuide />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng để bắt đầu?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn trader đang kiếm lợi nhuận mỗi ngày trên Quantax
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <Button size="lg" onClick={() => setShowAuthDrawer(true)} className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/30">
                <User className="h-5 w-5" />
                Đăng nhập ngay
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => onNavigate('trading')} className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/30">
                Giao dịch ngay
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer Icons */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            {[
              // { icon: Globe, label: 'Phi tập trung' },
              { icon: Shield, label: 'An toàn tuyệt đối' },
              { icon: Zap, label: 'Nhanh chóng' },
              { icon: Star, label: 'Đánh giá cao' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={showAuthDrawer}
        onClose={() => setShowAuthDrawer(false)}
      />
    </div>
  );
};
