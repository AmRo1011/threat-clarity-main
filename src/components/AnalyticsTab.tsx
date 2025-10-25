import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AnalyticsTab() {
  const { data: dist, isLoading: ld1, isError: er1 } = useQuery({
    queryKey: ["analytics_threat_dist"],
    queryFn: AnalyticsAPI.threatDistribution,
  });
  const { data: risk, isLoading: ld2, isError: er2 } = useQuery({
    queryKey: ["analytics_risk_by_department"],
    queryFn: AnalyticsAPI.riskByDepartment,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Threat Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {ld1 ? (
            <div className="text-sm text-muted-foreground">Loading</div>
          ) : er1 ? (
            <div className="text-sm text-destructive">Failed to load.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dist?.threat_types || []).map((t: any) => (
                  <TableRow key={t.type}>
                    <TableCell>{t.label || t.type}</TableCell>
                    <TableCell>{t.count}</TableCell>
                    <TableCell>{t.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {ld2 ? (
            <div className="text-sm text-muted-foreground">Loading</div>
          ) : er2 ? (
            <div className="text-sm text-destructive">Failed to load.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Avg Risk</TableHead>
                  <TableHead>User Count</TableHead>
                  <TableHead>High Risk Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(risk?.departments || []).map((d: any) => (
                  <TableRow key={d.department_id}>
                    <TableCell>{d.department_name}</TableCell>
                    <TableCell>{d.average_risk_score}</TableCell>
                    <TableCell>{d.user_count}</TableCell>
                    <TableCell>{d.high_risk_users}</TableCell>
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
