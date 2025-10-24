// src/hooks/use-ueba.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemAPI, AnomaliesAPI, DetectionAPI, DataAPI } from "@/lib/api";

export type DevAuthInput = { uid: string; role: string };

export function useDevAuth() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["dev-auth"],
    mutationFn: async ({ uid, role }: DevAuthInput) => {
      const res = await SystemAPI.devToken(uid, role);
      // API بيرجع { success, data: { access_token }, ... }
      const bearer = "Bearer " + (res as any)?.data?.access_token;
      if (bearer) {
        localStorage.setItem("uebatoken", bearer);
      }
      return res;
    },
    onSuccess: () => {
      // لو عايز نرِفريش داتا بعد التوكن الجديد
      qc.invalidateQueries({ queryKey: ["anomalies-list"] });
      qc.invalidateQueries({ queryKey: ["system-health"] });
    },
  });
}

/* بقيّة الهوكس كما هي لو موجودة عندك */
export function useSystemHealth() {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: () => SystemAPI.health(),
    refetchOnWindowFocus: false,
  });
}

export function useAnomaliesList(q = "status=open&limit=20") {
  return useQuery({
    queryKey: ["anomalies-list", q],
    queryFn: () => AnomaliesAPI.list(q),
    refetchOnWindowFocus: false,
  });
}
