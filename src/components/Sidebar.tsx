import { Shield, Users, AlertTriangle, Activity, BarChart3, Settings, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import SystemHealthPanel from "@/components/SystemHealthPanel"; // ✅ استدعاء مكون الحالة الحقيقي

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "users", label: "Users & Entities", icon: Users },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "data", label: "Data Sources", icon: Database },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* ===== Logo Section ===== */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">UEBA</h1>
            <p className="text-xs text-muted-foreground">Security Analytics</p>
          </div>
        </div>
      </div>

      {/* ===== Navigation Menu ===== */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-secondary/50",
                isActive && "bg-primary/10 text-primary border border-primary/20 glow-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ===== System Health Section ===== */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          <span className="text-xs text-muted-foreground">System Status</span>
          {/* ✅ الحالة الفعلية من الباك */}
          <SystemHealthPanel />
        </div>
      </div>
    </aside>
  );
}
