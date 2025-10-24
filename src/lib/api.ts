export const API = import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("uebatoken") || "";
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", token);

  // ??? ?? ????? Body ???? JSON
  if (!(init as any).body) {
    headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  }

  const res = await fetch(`${API}${path}`, { ...init, headers, credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  return payload as T;
}

// ---------- System ----------
export const SystemAPI = {
  health: () => apiFetch<ApiEnvelope<{ status: string }>>("/system/health"),
  status: () => apiFetch<ApiEnvelope<Record<string, unknown>>>("/system/status"),
  devToken: (uid = "demo", role = "admin") =>
    apiFetch<ApiEnvelope<{ access_token: string }>>(`/system/dev-token?uid=${uid}&role=${role}`, { method: "POST" }),
};

// ---------- Anomalies (Alerts) ----------
export type Anomaly = {
  id: number;
  uid: string;
  type: string;
  score: number;
  risk: number;
  confidence: number;
  status: "open" | "closed";
  detected_at: string;
  evidence_json?: Record<string, unknown> | null;
  features_used?: string[] | null;
};
export type AnomaliesList = { items: Anomaly[]; count?: number };

export const AnomaliesAPI = {
  list: (q = "status=open&limit=20") =>
    apiFetch<ApiEnvelope<AnomaliesList>>(`/anomalies?${q}`),
  resolve: (id: number) =>
    apiFetch<ApiEnvelope<{ id: number; status: "closed" }>>(`/anomalies/${id}/resolve`, { method: "POST" }),
};

// ---------- Data (Upload) ----------
export const DataAPI = {
  uploadCsv: async (file: File) => {
    const token = localStorage.getItem("uebatoken") || "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/data/upload-logs`, {
      method: "POST",
      headers: token ? { Authorization: token } : undefined,
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as ApiEnvelope<{ inserted: number }>;
  },
};

// ---------- Detection ----------
export const DetectionAPI = {
  run: (enabled = "impossible_travel,model_ueba") =>
    apiFetch<ApiEnvelope<{ created: number }>>(
      `/detection/run?enabled=${encodeURIComponent(enabled)}`,
      { method: "POST" }
    ),
};

// (???????) Helper ??? DevAuthButton
export async function getDevToken(uid = "demo", role = "admin") {
  const r = await SystemAPI.devToken(uid, role);
  const bearer = "Bearer " + r.data.access_token;
  localStorage.setItem("uebatoken", bearer);
  return bearer;
}
