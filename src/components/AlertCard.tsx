// src/components/AlertCard.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnomaliesAPI, type Anomaly } from "@/lib/api";

export type Props = { alert: Anomaly };

export default function AlertCard({ alert }: Props) {
  const qc = useQueryClient();
  const { mutateAsync: resolveAsync, isPending } = useMutation({
    mutationFn: () => AnomaliesAPI.resolve(alert.id),
    onSuccess: () => {
      // حدّث قائمة الـalerts المفتوحة
      qc.invalidateQueries({ queryKey: ["anomalies", "open"] });
      // حدّث الـOverview (الكروت والجداول)
      qc.invalidateQueries({ queryKey: ["overview"] });

      // اختياري: زوّد عدّاد "Resolved Today" سيشن-لوكال لو مافيش اندبوينت
      qc.setQueryData(["overview", "resolvedTodayLocal"], (v: number | undefined) => (v ?? 0) + 1);
    },
  });

  const disabled = isPending || alert.status === "resolved";

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{alert.type}</div>
            <div className="text-sm text-muted-foreground">
              User: {alert.uid} | Severity: {alert.risk >= 80 ? "critical" : alert.risk >= 60 ? "high" : "medium"} |{" "}
              {new Date(alert.detected_at).toLocaleString()}
            </div>
          </div>
          <Button variant="secondary" onClick={() => resolveAsync()} disabled={disabled}>
            {isPending ? "Resolving..." : alert.status === "resolved" ? "Resolved" : "Resolve"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
