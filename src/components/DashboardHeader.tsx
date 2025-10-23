import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Security Dashboard</h2>
        <p className="text-sm text-muted-foreground">Real-time threat monitoring and analysis</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-[10px]">
            12
          </Badge>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">SOC Analyst</div>
            <div className="text-xs text-muted-foreground">Security Operations</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
