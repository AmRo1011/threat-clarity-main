import { TrendingUp, Users, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const weeklyTrendData = [
  { day: "Mon", anomalies: 45, resolved: 38, highRisk: 12 },
  { day: "Tue", anomalies: 52, resolved: 45, highRisk: 15 },
  { day: "Wed", anomalies: 38, resolved: 35, highRisk: 8 },
  { day: "Thu", anomalies: 65, resolved: 52, highRisk: 18 },
  { day: "Fri", anomalies: 58, resolved: 48, highRisk: 16 },
  { day: "Sat", anomalies: 25, resolved: 22, highRisk: 5 },
  { day: "Sun", anomalies: 18, resolved: 16, highRisk: 3 },
];

const departmentRiskData = [
  { department: "Finance", risk: 85, users: 145 },
  { department: "IT Ops", risk: 72, users: 89 },
  { department: "HR", risk: 58, users: 67 },
  { department: "Engineering", risk: 45, users: 234 },
  { department: "Sales", risk: 38, users: 312 },
  { department: "Marketing", risk: 32, users: 178 },
];

const insiderVsExternalData = [
  { name: "Insider Threats", value: 65, color: "hsl(var(--destructive))" },
  { name: "External Attacks", value: 35, color: "hsl(var(--warning))" },
];

const hourlyActivityData = [
  { hour: "00:00", activity: 12 },
  { hour: "04:00", activity: 8 },
  { hour: "08:00", activity: 45 },
  { hour: "12:00", activity: 78 },
  { hour: "16:00", activity: 92 },
  { hour: "20:00", activity: 35 },
  { hour: "23:00", activity: 18 },
];

const topAnomalyTypes = [
  { type: "Data Exfiltration", count: 145, color: "hsl(var(--destructive))" },
  { type: "Privilege Abuse", count: 112, color: "hsl(var(--warning))" },
  { type: "Geo Anomaly", count: 89, color: "hsl(var(--info))" },
  { type: "Off-hours Activity", count: 67, color: "hsl(var(--accent))" },
  { type: "Failed Login", count: 45, color: "hsl(var(--primary))" },
];

export function AnalyticsTab() {
  const handleExportReport = (format: string) => {
    toast.success(`Exporting report as ${format.toUpperCase()}`, {
      description: "Your report will be downloaded shortly",
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm text-success font-medium">+15%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">301</div>
            <div className="text-sm text-muted-foreground">Weekly Anomalies</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-warning" />
              <span className="text-sm text-success font-medium">-8%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">23</div>
            <div className="text-sm text-muted-foreground">High Risk Users</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm text-success font-medium">+23%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">256</div>
            <div className="text-sm text-muted-foreground">Resolved This Week</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-info" />
              <span className="text-sm text-success font-medium">+5%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">87%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Export Analytics Report</h3>
              <p className="text-sm text-muted-foreground">Generate comprehensive reports for management or compliance</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportReport("pdf")}
                variant="outline"
                className="border-border hover:bg-secondary/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={() => handleExportReport("csv")}
                variant="outline"
                className="border-border hover:bg-secondary/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Weekly Anomaly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={weeklyTrendData}>
              <defs>
                <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="anomalies"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorAnomalies)"
                name="Total Anomalies"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="hsl(var(--success))"
                fillOpacity={1}
                fill="url(#colorResolved)"
                name="Resolved"
              />
              <Area
                type="monotone"
                dataKey="highRisk"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#colorHighRisk)"
                name="High Risk"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Department Risk */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Risk by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentRiskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="department" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insider vs External */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Insider vs External Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={insiderVsExternalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {insiderVsExternalData.map((entry, index) => (
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

      {/* Bottom Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Activity by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Anomaly Types */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Anomaly Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAnomalyTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {topAnomalyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
