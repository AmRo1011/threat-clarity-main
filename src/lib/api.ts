// src/lib/api.ts
export const API = import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1";

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("uebatoken") || "";
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", token);
  const isForm = (init as any).body instanceof FormData;
  if (!isForm) headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? res.json() : res.text()) as any;
}

/** SYSTEM */
export const SystemAPI = {
  health: () => apiFetch<{ success: boolean; data: { status: string } }>("/system/health"),
  devToken: (uid = "demo", role = "admin") =>
    apiFetch<{ data: { access_token: string } }>(`/system/dev-token?uid=${uid}&role=${role}`, { method: "POST" }),
};

/** ANOMALIES => alerts */
export type Anomaly = {
  id: number;
  uid: string;
  type: string;
  score: number;
  risk: number;
  confidence: number;
  status: "open" | "resolved";
  detected_at: string;
  evidence?: any;
};

export type AnomalyListResponse = { success: boolean; data: { count?: number; items: Anomaly[] } };

export const AnomaliesAPI = {
  list: (q = "status=open&limit=20") => apiFetch<AnomalyListResponse>(`/anomalies?${q}`),
  resolve: (id: number) => apiFetch<{ success: boolean }>(`/anomalies/${id}/resolve`, { method: "POST" }),

  // لا تعتمد على status=resolved (بعض السيرفرات لا تدعمه) — فلتر محليًا
  listResolvedToday: async (): Promise<AnomalyListResponse> => {
    // 1) حاول closed (لو الباك بيدعمها)
    try {
      return await apiFetch<AnomalyListResponse>(`/anomalies?status=closed&limit=500`);
    } catch {
      // 2) آخر حل: هات أي أنوماليز كتير وفلتر محليًا
      try {
        return await apiFetch<AnomalyListResponse>(`/anomalies?limit=500`);
      } catch {
        // 3) Fallback مضمون
        return { success: true, data: { items: [], count: 0 } };
      }
    }
  },
};


/** DATA */
export const DataAPI = {
  uploadCsv: async (file: File) => {
    const token = localStorage.getItem("uebatoken") || "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/data/upload-logs`, {
      method: "POST",
      headers: token ? { Authorization: token } : undefined,
      body: fd,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};

/** DETECTION */
export const DetectionAPI = {
  run: (enabled = "impossible_travel,model_ueba") =>
    apiFetch<{ success: boolean }>(`/detection/run?enabled=${encodeURIComponent(enabled)}`, { method: "POST" }),
};

/** USERS + ANALYTICS (اللي ضفناهم في الباك) */
export type UsersListResp = {
  users: Array<{
    user_id: string;
    username: string;
    full_name: string;
    department: { id: string; name: string };
    role: { id: string; title: string };
    status: "normal" | "investigating" | "high_risk";
    risk_score: number;
    last_login?: { timestamp: string; relative?: string };
    anomalies?: { today?: number; this_week?: number };
  }>;
  pagination?: { page: number; per_page: number; total_pages: number; total_count: number };
};

export const UsersAPI = {
  list: (p: { page: number; per_page: number; status: string; department: string; search: string }) =>
    apiFetch<UsersListResp>(
      `/users?page=${p.page}&per_page=${p.per_page}&status=${p.status}&department=${p.department}&search=${encodeURIComponent(
        p.search
      )}`
    ),
  stats: () =>
    apiFetch<{ total_users: number; by_status: { normal: number; investigating: number; high_risk: number } }>(
      "/users/statistics"
    ),
};

export const AnalyticsAPI = {
  threatDistribution: () =>
    apiFetch<{ threat_types: Array<{ type: string; label: string; count: number; percentage: number }> }>(
      "/analytics/threat-distribution"
    ),
  riskByDepartment: () =>
    apiFetch<{ departments: Array<{ department_name: string; average_risk_score: number }> }>(
      "/analytics/risk-by-department"
    ),
};
