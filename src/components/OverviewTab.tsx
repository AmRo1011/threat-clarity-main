import { Users, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskScoreCard } from "./RiskScoreCard";
import AlertCard from "@/components/AlertCard";
import SystemHealthPanel from "@/components/SystemHealthPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI, AnomaliesAPI, UsersAPI, type UsersListResp } from "@/lib/api";

// Define types for query responses to fix TypeScript errors
type AnomalyListResponse = { success: boolean; data: { count?: number; items: any[] } };
type DeptRiskResponse = { departments: Array<{ department_name: string; average_risk_score: number }> };
type StatsResponse = { total_users: number; by_status: { high_risk: number } };
type ThreatsResponse = { threat_types: Array<{ label: string; percentage: number; type: string }> };

// Define User and UserListResponse types for topUsersQ
type User = {
  user_id: string;
  username: string;
  department?: { name: string };
  risk_score: number;
  anomalies?: { this_week?: number };
};

export default function OverviewTab() {
  // 1) Users statistics
  const statsQ = useQuery<StatsResponse, Error>({
    queryKey: ["overview", "user-stats"],
    queryFn: async (): Promise<StatsResponse> => UsersAPI.stats(),
    staleTime: 10_000,
  });

  // 2) Open anomalies (active alerts)
  const anomaliesQ = useQuery<AnomalyListResponse, Error>({
    queryKey: ["anomalies", "open"],
    queryFn: async (): Promise<AnomalyListResponse> => AnomaliesAPI.list("status=open&limit=50"),
    staleTime: 5_000,
  });

  // 3) Resolved today: جرّب API، وإلا هنستخدم counter محلي
  const resolvedTodayQ = useQuery<AnomalyListResponse, Error>({
    queryKey: ["overview", "resolved-today"],
    queryFn: async (): Promise<AnomalyListResponse> => AnomaliesAPI.listResolvedToday(),
    staleTime: 5_000,
  });
  const resolvedTodayLocalQ = useQuery<number, Error>({
    queryKey: ["overview", "resolvedTodayLocal"],
    queryFn: async () => 0,
    initialData: 0,
  });

  // 4) Top 4 high-risk users
  const topUsersQ = useQuery<UsersListResp, Error, User[]>({
    queryKey: ["overview", "top-users"],
    queryFn: () => UsersAPI.list({ page: 1, per_page: 50, status: "all", department: "all", search: "" }),
    select: (resp) => [...(resp.users || [])].sort((a, b) => b.risk_score - a.risk_score).slice(0, 4),
    staleTime: 10_000,
  });

  // 5) Analytics
  const threatsQ = useQuery<ThreatsResponse, Error>({
    queryKey: ["overview", "threats"],
    queryFn: async (): Promise<ThreatsResponse> => AnalyticsAPI.threatDistribution(),
    staleTime: 30_000,
  });

  const deptQ = useQuery<DeptRiskResponse, Error>({
    queryKey: ["overview", "dept-risk"],
    queryFn: async (): Promise<DeptRiskResponse> => AnalyticsAPI.riskByDepartment(),
    staleTime: 30_000,
  });

  // === Cards values ===
  const totalUsers = statsQ.data?.total_users ?? 0;
  const highRisk = statsQ.data?.by_status?.high_risk ?? 0;
  const activeAlerts = anomaliesQ.data?.data?.count ?? anomaliesQ.data?.data?.items?.length ?? 0;

  const isToday = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };

  // بعد ما تجيب data من useQuery لـ listResolvedToday:
  const resolvedItems = (resolvedTodayQ.data?.data?.items ?? []) as any[];
  // نحاول نلقط أي تايم ستامب منطقي للحل: resolved_at > updated_at > detected_at
  const resolvedTodayCount = resolvedItems.filter(
    (it) => isToday(it.resolved_at || it.updated_at || it.detected_at)
  ).length;

  const resolvedToday = resolvedTodayQ.data?.data?.count ?? resolvedTodayCount;

  const stats = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Active Alerts", value: activeAlerts.toLocaleString(), icon: AlertTriangle, color: "text-destructive" },
    { label: "High Risk", value: highRisk.toLocaleString(), icon: Shield, color: "text-warning" },
    { label: "Resolved Today", value: resolvedToday.toLocaleString(), icon: TrendingUp, color: "text-success" },
  ];

  // === Charts data ===
  const riskDistributionData =
    deptQ.data?.departments?.map((d: any) => ({
      department: d.department_name,
      risk: d.average_risk_score,
    })) ?? [];

  const threatTypeData =
    threatsQ.data?.threat_types?.map((t: any) => ({
      name: t.label,
      value: t.percentage,
      color:
        t.type === "data_exfiltration"
          ? "hsl(var(--destructive))"
          : t.type === "privilege_abuse"
          ? "hsl(var(--warning))"
          : t.type === "geo_anomaly"
          ? "hsl(var(--info))"
          : "hsl(var(--accent))",
    })) ?? [];

  const alerts = anomaliesQ.data?.data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top High-Risk Users */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            Top 4 High-Risk Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {((topUsersQ.data as User[]) ?? []).map((u) => (
              <RiskScoreCard
                key={u.user_id}
                username={u.username}
                department={u.department?.name || "-"}
                score={u.risk_score}
                trend={u.risk_score >= 80 ? ("up" as const) : ("down" as const)}
                anomalyCount={u.anomalies?.this_week ?? 0}
              />
            ))}
            {topUsersQ.data && topUsersQ.data.length === 0 && (
              <div className="text-sm text-muted-foreground">No users found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Alerts - Spans 2 columns */}
        <div className="col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Real-Time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((a: any) => (
                <AlertCard key={a.id} alert={a} />
              ))}
              {alerts.length === 0 && <div className="text-sm text-muted-foreground">No open alerts.</div>}
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <SystemHealthPanel />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Risk Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Threat Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatTypeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
