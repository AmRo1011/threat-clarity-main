import { useState } from "react";
import { useUploadLogs } from "@/hooks/use-ueba";
import { Button } from "@/components/ui/button";

export default function UploadLogsCard() {
  const [file, setFile] = useState(null);
  const { mutateAsync, isPending } = useUploadLogs();
  return (
    <div className="border rounded-2xl p-4 space-y-2">
      <div className="font-semibold">Upload CSV Logs</div>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={() => file && mutateAsync(file)} disabled={!file || isPending}>
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
