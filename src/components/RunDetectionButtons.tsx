import { useRunDetection } from "@/hooks/use-ueba";
import { Button } from "@/components/ui/button";

export default function RunDetectionButtons() {
  const { mutateAsync, isPending } = useRunDetection();
  const run = (key) => mutateAsync(key);
  return (
    <div className="flex gap-2">
      <Button onClick={() => run("impossible_travel")} disabled={isPending}>Run Impossible Travel</Button>
      <Button onClick={() => run("after_hours")} disabled={isPending}>Run After Hours</Button>
      <Button onClick={() => run("model_ueba")} disabled={isPending}>Run UEBA Model</Button>
    </div>
  );
}
