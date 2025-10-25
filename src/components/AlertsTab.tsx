import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnomaliesAPI, DetectionAPI, type Anomaly } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AlertsTab() {
  const q = "status=open&limit=20";
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["anomalies", q],
    queryFn: () => AnomaliesAPI.list(q),
    refetchInterval: 15000, // refresh ?? 15 ?????
  });

  const rows: Anomaly[] = data?.data?.items ?? [];

  const onRun = async () => {
    await DetectionAPI.run("impossible_travel,model_ueba");
    await refetch();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Open Anomalies</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => refetch()}>Refresh</Button>
            <Button onClick={onRun}>Run Detection</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">Loading</div>
          ) : rows.length === 0 ? (
            <div className="text-muted-foreground">No open anomalies.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.uid}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.score.toFixed(3)}</TableCell>
                    <TableCell>{r.risk.toFixed(2)}</TableCell>
                    <TableCell>{new Date(r.detected_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
