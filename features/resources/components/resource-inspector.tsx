"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/stores/simulation-store";

export function ResourceInspector() {
  const cluster = useSimulationStore((state) => state.cluster);
  const selectedResourceId = useSimulationStore((state) => state.selectedResourceId);
  const killPod = useSimulationStore((state) => state.killPod);

  const resources = [
    ...cluster.deployments,
    ...cluster.pods,
    ...cluster.services,
    ...cluster.nodes,
  ];
  const resource = resources.find((item) => item.id === selectedResourceId);

  return (
    <aside className="hidden w-80 shrink-0 border-l bg-card xl:block">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Resource inspector</h2>
        <p className="text-xs text-muted-foreground">
          Select a graph node to inspect state.
        </p>
      </div>
      {resource ? (
        <div className="space-y-4 p-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              {resource.kind}
            </p>
            <h3 className="text-lg font-semibold">{resource.name}</h3>
          </div>
          <Separator />
          <dl className="space-y-2 text-sm">
            {Object.entries(resource).map(([key, value]) => (
              <div className="grid grid-cols-2 gap-3" key={key}>
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="truncate text-right">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </dd>
              </div>
            ))}
          </dl>
          {resource.kind === "Pod" && resource.phase !== "Failed" && (
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => killPod(resource.id)}
            >
              Kill pod
            </Button>
          )}
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">
          No resource selected.
        </div>
      )}
    </aside>
  );
}
