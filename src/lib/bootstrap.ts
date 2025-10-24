import { SystemAPI } from "./api";

export async function ensureDevToken(uid="demo", role="admin") {
  const existing = localStorage.getItem("uebatoken");
  if (existing) return existing;
  const r = await SystemAPI.devToken(uid, role);
  const bearer = "Bearer " + r.data.access_token;
  localStorage.setItem("uebatoken", bearer);
  return bearer;
}
