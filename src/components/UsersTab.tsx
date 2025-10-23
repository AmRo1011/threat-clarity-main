import { useState } from "react";
import { Search, MapPin, Laptop, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  fullName: string;
  department: string;
  role: string;
  status: "normal" | "investigating" | "high-risk";
  lastLogin: string;
  location: string;
  device: string;
  anomalies: { today: number; week: number };
  riskScore: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "j.anderson",
    fullName: "Jane Anderson",
    department: "Finance",
    role: "Senior Analyst",
    status: "high-risk",
    lastLogin: "2 min ago",
    location: "Unknown Location",
    device: "Windows Desktop",
    anomalies: { today: 3, week: 8 },
    riskScore: 92,
  },
  {
    id: "2",
    username: "m.chen",
    fullName: "Michael Chen",
    department: "IT Operations",
    role: "Systems Admin",
    status: "investigating",
    lastLogin: "15 min ago",
    location: "New York, US",
    device: "MacBook Pro",
    anomalies: { today: 2, week: 6 },
    riskScore: 87,
  },
  {
    id: "3",
    username: "s.rodriguez",
    fullName: "Sarah Rodriguez",
    department: "HR",
    role: "HR Manager",
    status: "normal",
    lastLogin: "1 hour ago",
    location: "London, UK",
    device: "Windows Laptop",
    anomalies: { today: 1, week: 5 },
    riskScore: 78,
  },
  {
    id: "4",
    username: "a.kumar",
    fullName: "Amit Kumar",
    department: "Engineering",
    role: "Lead Developer",
    status: "normal",
    lastLogin: "3 hours ago",
    location: "San Francisco, US",
    device: "MacBook Pro",
    anomalies: { today: 0, week: 4 },
    riskScore: 75,
  },
  {
    id: "5",
    username: "l.white",
    fullName: "Laura White",
    department: "Sales",
    role: "Sales Director",
    status: "normal",
    lastLogin: "5 hours ago",
    location: "Chicago, US",
    device: "iPad Pro",
    anomalies: { today: 0, week: 2 },
    riskScore: 42,
  },
  {
    id: "6",
    username: "d.martinez",
    fullName: "David Martinez",
    department: "Marketing",
    role: "Marketing Manager",
    status: "normal",
    lastLogin: "6 hours ago",
    location: "Miami, US",
    device: "Windows Desktop",
    anomalies: { today: 0, week: 1 },
    riskScore: 35,
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
  "high-risk": {
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

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = Array.from(new Set(mockUsers.map((u) => u.department)));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-1">2,847</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-success mb-1">2,813</div>
            <div className="text-sm text-muted-foreground">Normal Status</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-warning mb-1">17</div>
            <div className="text-sm text-muted-foreground">Under Investigation</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-destructive mb-1">17</div>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="high-risk">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
              {filteredUsers.map((user) => {
                const statusInfo = statusConfig[user.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <TableRow
                    key={user.id}
                    className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-foreground">{user.department}</div>
                        <div className="text-sm text-muted-foreground">{user.role}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1", statusInfo.badge)}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.device}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">
                        <span className="font-semibold">{user.anomalies.today}</span> today
                        <span className="text-muted-foreground"> / </span>
                        <span className="font-semibold">{user.anomalies.week}</span> week
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn("text-2xl font-bold", getRiskColor(user.riskScore))}>
                        {user.riskScore}
                      </span>
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
