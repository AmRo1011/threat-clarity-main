import { Activity, Database, Server, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const dataSources = [
  { name: "Authentication Logs", status: "active", records: "1.2M", lastUpdate: "2 min ago" },
  { name: "DLP Events", status: "active", records: "845K", lastUpdate: "1 min ago" },
  { name: "Process Data", status: "active", records: "3.4M", lastUpdate: "30 sec ago" },
  { name: "Network Traffic", status: "active", records: "5.1M", lastUpdate: "15 sec ago" },
];

const systemMetrics = [
  { label: "CPU Usage", value: 42, icon: Cpu },
  { label: "Memory", value: 68, icon: Server },
  { label: "Storage", value: 54, icon: Database },
  { label: "API Latency", value: 23, icon: Activity, unit: "ms" },
];

export function SystemHealthPanel() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          System Health & Data Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Data Sources</h4>
          <div className="space-y-3">
            {dataSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{source.name}</div>
                    <div className="text-xs text-muted-foreground">{source.records} records</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{source.lastUpdate}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">System Resources</h4>
          <div className="space-y-3">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {metric.value}{metric.unit || "%"}
                    </span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
