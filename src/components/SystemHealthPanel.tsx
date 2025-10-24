import { useQuery } from "@tanstack/react-query";
import { SystemAPI } from "@/lib/api";

export default function SystemHealthPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["system-health"],
    queryFn: () => SystemAPI.health(),
    retry: 0,
    refetchInterval: 15000, // كل 15 ثانية
  });

  // آخر وقت فُحص فيه السيرفر
  const lastUpdate = new Date().toLocaleTimeString();

  if (isLoading)
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Checking health…</span>
        <span className="text-[10px] text-muted-foreground">Last update: {lastUpdate}</span>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span className="text-destructive text-sm font-medium">API Offline</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Last update: {lastUpdate}</span>
      </div>
    );

  const healthy = data?.data?.status === "healthy";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            healthy ? "bg-green-500" : "bg-yellow-500"
          }`}
        />
        <span className="text-sm font-medium">
          {healthy ? "Active" : "Degraded"}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        Last update: {lastUpdate}
      </span>
    </div>
  );
}
