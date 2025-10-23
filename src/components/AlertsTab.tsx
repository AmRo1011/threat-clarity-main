import { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Lock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCard } from "./AlertCard";
import { toast } from "sonner";

interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  user: string;
  timestamp: string;
  location: string;
  confidence: number;
  description: string;
  factors: string[];
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Suspicious Data Exfiltration",
    user: "j.anderson",
    timestamp: "2 min ago",
    location: "Unknown Location",
    confidence: 94,
    description: "Large file transfer to external cloud storage outside business hours",
    factors: ["Geo anomaly", "Data exfiltration", "Off-hours activity"],
  },
  {
    id: "2",
    severity: "high",
    title: "Privilege Escalation Attempt",
    user: "m.chen",
    timestamp: "15 min ago",
    location: "New York, US",
    confidence: 87,
    description: "Unauthorized attempt to access admin credentials",
    factors: ["Privilege misuse", "Unauthorized access"],
  },
  {
    id: "3",
    severity: "medium",
    title: "Unusual Login Pattern",
    user: "s.rodriguez",
    timestamp: "1 hour ago",
    location: "London, UK",
    confidence: 76,
    description: "Login from new device at unusual hour",
    factors: ["New device", "Off-hours activity"],
  },
  {
    id: "4",
    severity: "high",
    title: "Multiple Failed Login Attempts",
    user: "a.kumar",
    timestamp: "2 hours ago",
    location: "San Francisco, US",
    confidence: 82,
    description: "10 failed login attempts within 5 minutes",
    factors: ["Brute force attempt", "Suspicious pattern"],
  },
  {
    id: "5",
    severity: "medium",
    title: "Unusual Data Access Pattern",
    user: "l.white",
    timestamp: "3 hours ago",
    location: "Chicago, US",
    confidence: 71,
    description: "Access to sensitive files outside normal scope",
    factors: ["Data access anomaly", "Scope violation"],
  },
  {
    id: "6",
    severity: "low",
    title: "Geo-location Anomaly",
    user: "d.martinez",
    timestamp: "4 hours ago",
    location: "Tokyo, JP",
    confidence: 65,
    description: "Login from unusual geographic location",
    factors: ["Geo anomaly"],
  },
];

export function AlertsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [alerts, setAlerts] = useState(mockAlerts);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleConfirm = (id: string) => {
    toast.success("Alert confirmed", {
      description: "Alert marked as true positive and logged for analysis",
    });
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleDismiss = (id: string) => {
    toast.info("Alert dismissed", {
      description: "Alert marked as false positive",
    });
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleLockAccount = (user: string) => {
    toast.warning("Account locked", {
      description: `User ${user} has been locked pending investigation`,
    });
  };

  const handleNotifySOC = (alertTitle: string) => {
    toast.info("SOC notified", {
      description: `Security operations team has been notified about: ${alertTitle}`,
    });
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const mediumCount = alerts.filter((a) => a.severity === "medium").length;
  const lowCount = alerts.filter((a) => a.severity === "low").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-destructive mb-1">{criticalCount}</div>
            <div className="text-sm text-muted-foreground">Critical Alerts</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-warning mb-1">{highCount}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-info/10 border-info/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-info mb-1">{mediumCount}</div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-success mb-1">{lowCount}</div>
            <div className="text-sm text-muted-foreground">Low Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Alert Management
            </span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-secondary/50 border-border"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40 bg-secondary/50 border-border">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No alerts matching your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="space-y-3">
                <AlertCard {...alert} />
                
                {/* Alert Details & Actions */}
                <Card className="bg-secondary/30 border-border ml-12">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Why Flagged:</h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.factors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                        <Button
                          onClick={() => handleConfirm(alert.id)}
                          size="sm"
                          className="bg-success/20 hover:bg-success/30 text-success border border-success/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Threat
                        </Button>
                        <Button
                          onClick={() => handleDismiss(alert.id)}
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-secondary/50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Dismiss
                        </Button>
                        <div className="h-4 w-px bg-border" />
                        <Button
                          onClick={() => handleLockAccount(alert.user)}
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 hover:bg-destructive/10 text-destructive"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Lock Account
                        </Button>
                        <Button
                          onClick={() => handleNotifySOC(alert.title)}
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-secondary/50"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Notify SOC
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
