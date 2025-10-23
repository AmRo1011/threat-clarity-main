import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, Radio, Database, Activity, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogSource {
  id: string;
  name: string;
  type: "upload" | "tail";
  status: "active" | "inactive" | "error";
  lastUpdate: string;
  recordCount: number;
}

export const DataSourcesTab = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [sources, setSources] = useState<LogSource[]>([
    {
      id: "1",
      name: "Windows Event Logs",
      type: "tail",
      status: "active",
      lastUpdate: "2 min ago",
      recordCount: 15420
    },
    {
      id: "2",
      name: "Authentication Logs - Jan 2024",
      type: "upload",
      status: "active",
      lastUpdate: "1 hour ago",
      recordCount: 8932
    }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    const newSource: LogSource = {
      id: Date.now().toString(),
      name: file.name,
      type: "upload",
      status: "active",
      lastUpdate: "Just now",
      recordCount: 0
    };
    setSources([...sources, newSource]);
    
    toast({
      title: "File Uploaded",
      description: `${file.name} has been successfully uploaded and is being processed.`,
    });
  };

  const removeSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
    toast({
      title: "Source Removed",
      description: "Log source has been removed from the system.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Sources</h2>
        <p className="text-muted-foreground">
          Upload log files or configure real-time log streaming
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Log Files
          </CardTitle>
          <CardDescription>
            Upload log files in CSV, JSON, or TXT format for batch analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your log files here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <Input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileInput}
              accept=".csv,.json,.txt,.log"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Log Tailing */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Real-Time Log Tailing
          </CardTitle>
          <CardDescription>
            Configure live log streaming from your systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-name">Source Name</Label>
              <Input
                id="source-name"
                placeholder="e.g., Production Server Logs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Log Stream Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="e.g., syslog://logs.example.com:514"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Authentication Key (Optional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter API key or token"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filters">Log Filters (Optional)</Label>
              <Textarea
                id="filters"
                placeholder="Enter filter rules or regex patterns"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Auto-start streaming</Label>
                <p className="text-sm text-muted-foreground">
                  Begin collecting logs immediately after setup
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Button className="w-full">
            <Activity className="h-4 w-4 mr-2" />
            Connect Log Stream
          </Button>
        </CardContent>
      </Card>

      {/* Active Sources */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Active Log Sources
          </CardTitle>
          <CardDescription>
            Currently connected data sources and uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {source.type === "tail" ? (
                      <Radio className="h-5 w-5 text-primary" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{source.recordCount.toLocaleString()} records</span>
                        <span>•</span>
                        <span>{source.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {source.status === "active" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : source.status === "error" ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Activity className="h-5 w-5 text-warning" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSource(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
