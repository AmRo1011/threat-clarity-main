import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  username: string;
  department: string;
  score: number;
  trend: "up" | "down";
  anomalyCount: number;
}

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-info";
  return "text-success";
};

const getRiskBg = (score: number) => {
  if (score >= 80) return "bg-destructive/10 border-destructive/30";
  if (score >= 60) return "bg-warning/10 border-warning/30";
  if (score >= 40) return "bg-info/10 border-info/30";
  return "bg-success/10 border-success/30";
};

export function RiskScoreCard({ username, department, score, trend, anomalyCount }: RiskScoreCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  
  return (
    <Card className={cn("border transition-all hover:scale-105", getRiskBg(score))}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{username}</h3>
            <p className="text-xs text-muted-foreground">{department}</p>
          </div>
          <TrendIcon className={cn("w-4 h-4", trend === "up" ? "text-destructive" : "text-success")} />
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className={cn("text-3xl font-bold", getRiskColor(score))}>{score}</div>
            <div className="text-xs text-muted-foreground">Risk Score</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">{anomalyCount}</div>
            <div className="text-xs text-muted-foreground">Anomalies</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
