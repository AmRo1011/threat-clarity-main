import React, { useCallback, useRef, useState } from "react";
import { DataAPI, DetectionAPI, AnomaliesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Upload,
  Radio,
  Database,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

type SourceStatus = "active" | "pending" | "error";
type SourceType = "tail" | "upload";

interface ActiveSource {
  id: string;
  type: SourceType;
  name: string;
  recordCount: number;
  lastUpdate: string;
  status: SourceStatus;
}

export default function DataSourcesTab() {
  // ---------------- CSV Upload + Detection ----------------
  const [dragOver, setDragOver] = useState(false);
  const [statusText, setStatusText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [sources, setSources] = useState<ActiveSource[]>([]);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    let total = 0;
    setStatusText("Uploading...");
    for (const f of Array.from(files)) {
      try {
        const res: any = await DataAPI.uploadCsv(f);
        const inserted = res?.data?.inserted ?? 0;
        total += inserted;

        // Add this upload as an active source item
        setSources((prev) => [
          {
            id: `upload-${Date.now()}-${f.name}`,
            type: "upload",
            name: f.name,
            recordCount: inserted,
            lastUpdate: new Date().toLocaleString(),
            status: "active",
          },
          ...prev,
        ]);
      } catch (e: any) {
        setStatusText(`Upload failed: ${e?.message || e}`);
        return;
      }
    }
    setStatusText(`Uploaded ${total} rows. You can run detection now.`);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      onFiles(e.dataTransfer?.files || null);
    },
    [onFiles]
  );

  const onRunDetection = async () => {
    setStatusText("Running detection...");
    try {
      await DetectionAPI.run("impossible_travel,model_ueba");
      setStatusText("Detection finished. Fetching open anomalies...");
      const list: any = await AnomaliesAPI.list("status=open&limit=20");
      setStatusText(`Detection done. Open anomalies: ${list?.data?.items?.length ?? 0}`);
    } catch (e: any) {
      setStatusText(`Detection failed: ${e?.message || e}`);
    }
  };

  // ---------------- Real-Time Log Tailing form ----------------
  const [tailForm, setTailForm] = useState({
    sourceName: "",
    endpoint: "",
    apiKey: "",
    filters: "",
    autostart: true,
  });

  const connectTail = () => {
    // هنا لسه UI بس. تقدر لاحقاً تبدّل ده بنداء API لبدء الستريم
    const name = tailForm.sourceName.trim() || "Unnamed Stream";
    const id = `tail-${Date.now()}`;
    setSources((prev) => [
      {
        id,
        type: "tail",
        name,
        recordCount: 0,
        lastUpdate: new Date().toLocaleString(),
        status: tailForm.autostart ? "active" : "pending",
      },
      ...prev,
    ]);
    // reset بسيط (اختياري)
    setTailForm((s) => ({ ...s, sourceName: "", endpoint: "", apiKey: "", filters: "" }));
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Log Files (CSV)
          </CardTitle>
          <CardDescription>Upload historical logs to enrich UEBA signals</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
              dragOver ? "border-cyan-400 bg-cyan-400/10" : "border-muted-foreground/30"
            }`}
          >
            <div className="text-muted-foreground mb-4">
              Drag and drop your log files here
            </div>
            <input
              ref={inputRef}
              id="csv-files"
              name="csv-files"
              type="file"
              accept=".csv"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <Button onClick={() => inputRef.current?.click()}>Select Files</Button>
          </div>
          <div className="mt-4 flex gap-3 items-center">
            <Button variant="secondary" onClick={onRunDetection}>
              Run Detection
            </Button>
            {statusText && <div className="text-sm text-muted-foreground">{statusText}</div>}
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
          <CardDescription>Configure live log streaming from your systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-name">Source Name</Label>
              <Input
                id="source-name"
                name="source-name"
                placeholder="e.g., Production Server Logs"
                value={tailForm.sourceName}
                onChange={(e) => setTailForm((s) => ({ ...s, sourceName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Log Stream Endpoint</Label>
              <Input
                id="endpoint"
                name="endpoint"
                placeholder="e.g., syslog://logs.example.com:514"
                value={tailForm.endpoint}
                onChange={(e) => setTailForm((s) => ({ ...s, endpoint: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Authentication Key (Optional)</Label>
              <Input
                id="api-key"
                name="api-key"
                type="password"
                placeholder="Enter API key or token"
                value={tailForm.apiKey}
                onChange={(e) => setTailForm((s) => ({ ...s, apiKey: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filters">Log Filters (Optional)</Label>
              <Textarea
                id="filters"
                name="filters"
                placeholder="Enter filter rules or regex patterns"
                rows={3}
                value={tailForm.filters}
                onChange={(e) => setTailForm((s) => ({ ...s, filters: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="autostart">Auto-start streaming</Label>
                <p className="text-sm text-muted-foreground">
                  Begin collecting logs immediately after setup
                </p>
              </div>
              <Switch
                id="autostart"
                name="autostart"
                checked={tailForm.autostart}
                onCheckedChange={(v: boolean) => setTailForm((s) => ({ ...s, autostart: v }))}
              />
            </div>
          </div>

          <Button className="w-full" onClick={connectTail}>
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
              {sources.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No sources yet. Upload CSVs or connect a live stream to see them here.
                </div>
              )}
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
                      aria-label={`remove-${source.id}`}
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
}
