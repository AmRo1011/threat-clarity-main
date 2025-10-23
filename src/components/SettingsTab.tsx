import { useState } from "react";
import { Shield, Bell, Database, Brain, Users, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function SettingsTab() {
  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [mlModelEnabled, setMlModelEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState([90]);

  const handleSaveSettings = () => {
    toast.success("Settings saved", {
      description: "Your configuration has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            System Configuration
          </CardTitle>
          <CardDescription>Manage UEBA system settings and preferences</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="detection" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="detection">Detection</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="detection" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Detection Settings
              </CardTitle>
              <CardDescription>Configure anomaly detection thresholds and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ml-model" className="text-base">Enable ML Model</Label>
                    <p className="text-sm text-muted-foreground">Use machine learning for threat detection</p>
                  </div>
                  <Switch
                    id="ml-model"
                    checked={mlModelEnabled}
                    onCheckedChange={setMlModelEnabled}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Risk Score Threshold</Label>
                    <span className="text-sm font-semibold text-primary">{riskThreshold[0]}</span>
                  </div>
                  <Slider
                    value={riskThreshold}
                    onValueChange={setRiskThreshold}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Users above this score will be flagged as high risk
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-lock" className="text-base">Auto-Lock High Risk Accounts</Label>
                    <p className="text-sm text-muted-foreground">Automatically lock accounts exceeding threshold</p>
                  </div>
                  <Switch
                    id="auto-lock"
                    checked={autoLockEnabled}
                    onCheckedChange={setAutoLockEnabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Confidence Threshold (%)</Label>
                    <Input type="number" defaultValue="70" className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Alerts per User</Label>
                    <Input type="number" defaultValue="10" className="bg-secondary/50 border-border" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                {emailNotifications && (
                  <div className="ml-6 space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      defaultValue="soc@company.com"
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="slack-notif" className="text-base">Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                  </div>
                  <Switch
                    id="slack-notif"
                    checked={slackNotifications}
                    onCheckedChange={setSlackNotifications}
                  />
                </div>

                {slackNotifications && (
                  <div className="ml-6 space-y-2">
                    <Label>Slack Webhook URL</Label>
                    <Input
                      type="url"
                      placeholder="https://hooks.slack.com/..."
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Alert Severity Levels</Label>
                  <div className="space-y-2 ml-6">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id="notify-critical" />
                      <Label htmlFor="notify-critical" className="text-destructive">Critical</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id="notify-high" />
                      <Label htmlFor="notify-high" className="text-warning">High</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id="notify-medium" />
                      <Label htmlFor="notify-medium" className="text-info">Medium</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="notify-low" />
                      <Label htmlFor="notify-low" className="text-success">Low</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data sources and retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Data Retention Period (days)</Label>
                    <span className="text-sm font-semibold text-primary">{dataRetention[0]}</span>
                  </div>
                  <Slider
                    value={dataRetention}
                    onValueChange={setDataRetention}
                    min={30}
                    max={365}
                    step={30}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Historical data will be retained for this period
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Data Sources</Label>
                  <div className="space-y-2">
                    {[
                      { name: "Authentication Logs", enabled: true },
                      { name: "DLP Events", enabled: true },
                      { name: "Process Data", enabled: true },
                      { name: "Network Traffic", enabled: true },
                      { name: "File Access Logs", enabled: false },
                    ].map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <span className="text-foreground">{source.name}</span>
                        <Switch defaultChecked={source.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Access Control
              </CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    User Roles
                  </Label>
                  <div className="space-y-2">
                    {[
                      { role: "SOC Analyst", permissions: "View, Investigate, Confirm/Dismiss Alerts", users: 12 },
                      { role: "Admin", permissions: "Full Access to Settings and Configuration", users: 3 },
                      { role: "Executive Viewer", permissions: "Read-Only Dashboard Access", users: 8 },
                    ].map((roleInfo) => (
                      <div key={roleInfo.role} className="p-4 bg-secondary/30 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">{roleInfo.role}</h4>
                          <span className="text-sm text-muted-foreground">{roleInfo.users} users</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{roleInfo.permissions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="30"
                      className="w-24 bg-secondary/50 border-border"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg" className="bg-primary hover:bg-primary/90">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
