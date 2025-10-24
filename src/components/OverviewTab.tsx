import { Users, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskScoreCard } from "./RiskScoreCard";
import { AlertCard } from "./AlertCard";
import SystemHealthPanel from "@/components/SystemHealthPanel";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const highRiskUsers = [
  { username: "j.anderson", department: "Finance", score: 92, trend: "up" as const, anomalyCount: 8 },
  { username: "m.chen", department: "IT Operations", score: 87, trend: "up" as const, anomalyCount: 6 },
  { username: "s.rodriguez", department: "HR", score: 78, trend: "down" as const, anomalyCount: 5 },
  { username: "a.kumar", department: "Engineering", score: 75, trend: "up" as const, anomalyCount: 4 },
];

const recentAlerts = [
  {
    severity: "critical" as const,
    title: "Suspicious Data Exfiltration",
    user: "j.anderson",
    timestamp: "2 min ago",
    location: "Unknown Location",
    confidence: 94,
    description: "Large file transfer to external cloud storage outside business hours",
  },
  {
    severity: "high" as const,
    title: "Privilege Escalation Attempt",
    user: "m.chen",
    timestamp: "15 min ago",
    location: "New York, US",
    confidence: 87,
    description: "Unauthorized attempt to access admin credentials",
  },
  {
    severity: "medium" as const,
    title: "Unusual Login Pattern",
    user: "s.rodriguez",
    timestamp: "1 hour ago",
    location: "London, UK",
    confidence: 76,
    description: "Login from new device at unusual hour",
  },
];

const riskDistributionData = [
  { department: "Finance", risk: 85 },
  { department: "IT Ops", risk: 72 },
  { department: "HR", risk: 58 },
  { department: "Engineering", risk: 45 },
  { department: "Sales", risk: 38 },
];

const threatTypeData = [
  { name: "Data Exfiltration", value: 35, color: "hsl(var(--destructive))" },
  { name: "Privilege Abuse", value: 28, color: "hsl(var(--warning))" },
  { name: "Geo Anomaly", value: 22, color: "hsl(var(--info))" },
  { name: "Off-hours Activity", value: 15, color: "hsl(var(--accent))" },
];

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, trend: "+12%", color: "text-primary" },
  { label: "Active Alerts", value: "23", icon: AlertTriangle, trend: "-8%", color: "text-destructive" },
  { label: "High Risk", value: "17", icon: Shield, trend: "+5%", color: "text-warning" },
  { label: "Resolved Today", value: "156", icon: TrendingUp, trend: "+23%", color: "text-success" },
];

export function OverviewTab() {
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
                  <span className="text-sm text-success font-medium">{stat.trend}</span>
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
            {highRiskUsers.map((user) => (
              <RiskScoreCard key={user.username} {...user} />
            ))}
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
              {recentAlerts.map((alert, idx) => (
                <AlertCard key={idx} {...alert} />
              ))}
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
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
