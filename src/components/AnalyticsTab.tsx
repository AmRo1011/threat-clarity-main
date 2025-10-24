import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnomaliesAPI, Anomaly } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Dist = Record<string, number>;

export default function AnalyticsTab() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["anomalies", "open", 100],
    queryFn: () => AnomaliesAPI.list("status=open&limit=100"),
    refetchOnWindowFocus: false,
  });

  const items: Anomaly[] = data?.data?.items ?? [];

  const byType: Dist = items.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Dist);

  const byRiskBand: Dist = items.reduce((acc, a) => {
    // ????? ????: 0-39=low, 40-69=med, 70+=high
    const band = a.risk >= 70 ? "high" : a.risk >= 40 ? "medium" : "low";
    acc[band] = (acc[band] || 0) + 1;
    return acc;
  }, {} as Dist);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Anomalies (live)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-muted-foreground">Loading</div>}
          {error && <div className="text-sm text-destructive">Failed to load</div>}
          {!isLoading && !error && (
            <div className="text-sm">
              <div className="mb-2">Total: <b>{items.length}</b></div>
              <Separator className="my-3" />
              <div className="mb-2 font-medium">By Type</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(byType).map(([t, n]) => (
                  <Badge key={t} variant="secondary">{t}: {n}</Badge>
                ))}
                {Object.keys(byType).length === 0 && <div className="text-muted-foreground">No data</div>}
              </div>

              <div className="mb-2 font-medium">By Risk Band</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(byRiskBand).map(([b, n]) => (
                  <Badge key={b} className={
                    b === "high" ? "bg-destructive/15 text-destructive"
                    : b === "medium" ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success"
                  }>
                    {b}: {n}
                  </Badge>
                ))}
                {Object.keys(byRiskBand).length === 0 && <div className="text-muted-foreground">No data</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last 20 (quick view)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.slice(0, 20).map((a) => (
            <div key={a.id} className="flex justify-between text-sm border-b border-border/50 py-2">
              <div className="truncate">
                <span className="font-medium">{a.type}</span>
                <span className="text-muted-foreground">  {a.uid}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{Math.round(a.risk)}</Badge>
                <span className="text-muted-foreground">{new Date(a.detected_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">No anomalies</div>}
        </CardContent>
      </Card>
    </div>
  );
}
