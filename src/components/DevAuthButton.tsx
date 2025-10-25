import { useDevAuth } from "@/hooks/use-ueba";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DevAuthButton() {
  const [who, setWho] = useState({ uid: "demo", role: "analyst" });
  const { mutateAsync, isPending } = useDevAuth();

  return (
    <div className="flex items-center gap-2">
      {/* label متخفي لتحسين الـa11y وتفادي تحذيرات المتصفح */}
      <label htmlFor="dev-uid" className="sr-only">User ID</label>
      <input
        id="dev-uid"
        name="dev-uid"
        className="border rounded px-2 py-1"
        placeholder="uid"
        value={who.uid}
        onChange={(e) => setWho({ ...who, uid: e.target.value })}
      />

      <label htmlFor="dev-role" className="sr-only">Role</label>
      <select
        id="dev-role"
        name="dev-role"
        className="border rounded px-2 py-1"
        value={who.role}
        onChange={(e) => setWho({ ...who, role: e.target.value })}
      >
        <option value="analyst">analyst</option>
        <option value="admin">admin</option>
      </select>

      <Button onClick={() => mutateAsync(who)} disabled={isPending}>
        {isPending ? "Generating..." : "Get Dev Token"}
      </Button>
    </div>
  );
}
