import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  user: string;
  timestamp: string;
  location: string;
  confidence: number;
  description: string;
}

const severityConfig = {
  low: {
    bg: "bg-success/10 border-success/30",
    badge: "bg-success/20 text-success border-success/30",
    glow: "glow-success",
  },
  medium: {
    bg: "bg-warning/10 border-warning/30",
    badge: "bg-warning/20 text-warning border-warning/30",
    glow: "glow-warning",
  },
  high: {
    bg: "bg-destructive/10 border-destructive/30",
    badge: "bg-destructive/20 text-destructive border-destructive/30",
    glow: "glow-destructive",
  },
  critical: {
    bg: "bg-destructive/20 border-destructive/50",
    badge: "bg-destructive/30 text-destructive border-destructive/50 animate-pulse-glow",
    glow: "glow-destructive",
  },
};

export function AlertCard({ severity, title, user, timestamp, location, confidence, description }: AlertCardProps) {
  const config = severityConfig[severity];
  
  return (
    <Card className={cn("border transition-all hover:scale-[1.02]", config.bg, config.glow)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn("w-5 h-5 mt-0.5", severity === "critical" ? "text-destructive animate-pulse" : "")} />
            <div>
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge className={cn("capitalize", config.badge)}>{severity}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground mb-1">User</div>
            <div className="text-sm font-medium text-foreground">{user}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Confidence</div>
            <div className="text-sm font-medium text-foreground">{confidence}%</div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">{timestamp}</div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">{location}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
