import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getDevToken } from "@/lib/api";

export default function DevAuthButton() {
  const [who, setWho] = useState({ uid: "demo", role: "analyst" });
  const [pending, setPending] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="dev-uid" className="text-sm text-muted-foreground">UID</label>
      <input id="dev-uid" name="uid" className="border rounded px-2 py-1"
        placeholder="uid" value={who.uid}
        onChange={(e) => setWho({ ...who, uid: e.target.value })}/>

      <label htmlFor="dev-role" className="text-sm text-muted-foreground">Role</label>
      <select id="dev-role" name="role" className="border rounded px-2 py-1"
        value={who.role} onChange={(e) => setWho({ ...who, role: e.target.value })}>
        <option value="analyst">analyst</option>
        <option value="admin">admin</option>
      </select>

      <Button
        onClick={async () => { setPending(true); try { await getDevToken(who.uid, who.role); } finally { setPending(false); } }}
        disabled={pending}
      >
        {pending ? "Generating..." : "Get Dev Token"}
      </Button>
    </div>
  );
}
