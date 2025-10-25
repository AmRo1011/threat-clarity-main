import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Laptop, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UsersAPI } from "@/lib/api"; // تأكد إن عندك UsersAPI.list و UsersAPI.stats زي ما اتفقنا

// ===== Types للرد القادم من الباك =====
type UserRow = {
  user_id: string;
  username: string;
  full_name: string;
  department: { id: string; name: string };
  role: { id: string; title: string };
  status: "normal" | "investigating" | "high_risk";
  risk_score: number;
  last_login?: { timestamp: string; relative?: string };
  location?: { city?: string; country?: string; is_suspicious?: boolean };
  device?: { type?: string; os?: string; browser?: string };
  anomalies?: { today?: number; this_week?: number };
};

type UsersListResp = {
  users: UserRow[];
  pagination?: { page: number; per_page: number; total_pages: number; total_count: number };
};

// ===== Mock fallback لو الـAPI وقع =====
const mockUsers: UserRow[] = [
  {
    user_id: "usr_1",
    username: "j.anderson",
    full_name: "Jane Anderson",
    department: { id: "fin", name: "Finance" },
    role: { id: "sa", title: "Senior Analyst" },
    status: "high_risk",
    risk_score: 92,
    last_login: { timestamp: "2024-07-19T12:34:56Z", relative: "2 min ago" },
    location: { city: "Unknown", country: "Unknown" },
    device: { type: "desktop", os: "Windows" },
    anomalies: { today: 3, this_week: 8 },
  },
  {
    user_id: "usr_2",
    username: "m.chen",
    full_name: "Michael Chen",
    department: { id: "it", name: "IT Ops" },
    role: { id: "sys", title: "Systems Admin" },
    status: "investigating",
    risk_score: 87,
    last_login: { timestamp: "2024-07-19T12:20:56Z", relative: "15 min ago" },
    location: { city: "New York", country: "US" },
    device: { type: "laptop", os: "macOS" },
    anomalies: { today: 2, this_week: 6 },
  },
];

const statusConfig = {
  normal: {
    badge: "bg-success/20 text-success border-success/30",
    icon: CheckCircle,
    label: "Normal",
  },
  investigating: {
    badge: "bg-warning/20 text-warning border-warning/30",
    icon: AlertCircle,
    label: "Investigating",
  },
  high_risk: {
    badge: "bg-destructive/20 text-destructive border-destructive/30",
    icon: Shield,
    label: "High Risk",
  },
};

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive font-bold";
  if (score >= 60) return "text-warning font-semibold";
  if (score >= 40) return "text-info";
  return "text-success";
};

export function UsersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const { data, isLoading, isError } = useQuery<UsersListResp>({
    queryKey: ["users", { page: 1, per_page: 10, status: statusFilter, department: departmentFilter, search: searchTerm }],
    queryFn: () =>
      UsersAPI.list({
        page: 1,
        per_page: 10,
        status: statusFilter,
        department: departmentFilter,
        search: searchTerm,
      }),
    // keepPreviousData: true, // ❌ غير متاحة في v5
    staleTime: 10_000, // اختياري
  });

  const rows: UserRow[] = data?.users ?? mockUsers;

  const filteredUsers = rows.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === (statusFilter as UserRow["status"]);
    const matchesDepartment = departmentFilter === "all" || user.department.name === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // جهّز قائمة الأقسام من الداتا (أياً كانت API أو Mock)
  const departments = Array.from(new Set(rows.map((u) => u.department.name)));

  return (
    <div className="space-y-6">
      {/* Stats Cards (اختياري لاحقًا نربطها بـ UsersAPI.stats) */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-1">{/* total users */} {rows.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-success mb-1">
              {rows.filter((u) => u.status === "normal").length}
            </div>
            <div className="text-sm text-muted-foreground">Normal Status</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-warning mb-1">
              {rows.filter((u) => u.status === "investigating").length}
            </div>
            <div className="text-sm text-muted-foreground">Under Investigation</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-destructive mb-1">
              {rows.filter((u) => u.status === "high_risk").length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User & Entity Overview</span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-secondary/50 border-border"
                />
              </div>

              <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v)}>
                <SelectTrigger className="w-40 bg-secondary/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="high_risk">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={(v: string) => setDepartmentFilter(v)}>
                <SelectTrigger className="w-40 bg-secondary/50 border-border">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading users…</div>
          ) : isError ? (
            <div className="text-sm text-destructive">Failed to load users. Showing mock data.</div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Department / Role</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Last Login</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Device</TableHead>
                <TableHead className="text-muted-foreground">Anomalies</TableHead>
                <TableHead className="text-muted-foreground text-right">Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const statusInfo = statusConfig[u.status] ?? statusConfig.normal;
                const StatusIcon = statusInfo.icon;
                return (
                  <TableRow key={u.user_id} className="border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{u.full_name}</div>
                        <div className="text-sm text-muted-foreground">{u.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-foreground">{u.department.name}</div>
                        <div className="text-sm text-muted-foreground">{u.role.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1", statusInfo.badge)}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u?.last_login?.relative ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {u?.location?.city ?? "-"}{u?.location?.country ? `, ${u.location.country}` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{u?.device?.type ?? "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">
                        <span className="font-semibold">{u?.anomalies?.today ?? 0}</span> today
                        <span className="text-muted-foreground"> / </span>
                        <span className="font-semibold">{u?.anomalies?.this_week ?? 0}</span> week
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn("text-2xl font-bold", getRiskColor(u.risk_score))}>{u.risk_score}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
