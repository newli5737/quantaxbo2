import React from 'react';
import { LayoutDashboard, Settings, TrendingUp, Users, Shield, LogOut, Activity, FileText, Sliders, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAdminStore } from '@/stores/admin-store';

interface AdminLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPage, onNavigate, children }) => {
  const { logout, userRole } = useAdminStore();

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-trades', label: 'Giám sát lệnh', icon: Activity },
    { id: 'admin-traders', label: 'Quản lý Traders', icon: Users },
    { id: 'admin-banks', label: 'Quản lý Ngân hàng', icon: CreditCard }, // New item
    { id: 'admin-pairs', label: 'Cấu hình Pairs', icon: Sliders },
    { id: 'admin-prices', label: 'Điều chỉnh Giá', icon: DollarSign },
    { id: 'admin-transactions', label: 'Quản lý Nạp/Rút', icon: Activity }, // Added Transactions menu item
    { id: 'admin-risk', label: 'Rủi ro & Pool', icon: Shield },
    { id: 'admin-analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'admin-security', label: 'Bảo mật & Kiểm soát', icon: Shield },
    { id: 'admin-settings', label: 'Cài đặt hệ thống', icon: Settings },
    { id: 'admin-logs', label: 'Logs & Audit', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className="flex h-screen bg-background dark">
      <aside className="w-72 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/logo-optimized.webp"
              alt="Quantax"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <div>
              <span className="text-xl font-bold gradient-text">Quantax</span>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-primary/10 text-sm">
            Role: <span className="font-semibold text-primary capitalize">{userRole}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="container mx-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};
