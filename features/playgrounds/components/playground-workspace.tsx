"use client";

import { useEffect, useRef } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { YamlEditor } from "@/features/manifests/components/yaml-editor";
import { ResourceInspector } from "@/features/resources/components/resource-inspector";
import { SimulationClock } from "@/features/simulation/components/simulation-clock";
import { ClusterGraph } from "@/features/visualization/components/cluster-graph";
import { EventTimeline } from "@/features/timeline/components/event-timeline";
import { useEditorStore } from "@/stores/editor-store";
import { useSimulationStore } from "@/stores/simulation-store";

export function PlaygroundWorkspace() {
  const parseResult = useEditorStore((state) => state.parseResult);
  const applyManifests = useSimulationStore((state) => state.applyManifests);
  const didApplyInitialManifest = useRef(false);

  useEffect(() => {
    if (didApplyInitialManifest.current) return;
    didApplyInitialManifest.current = true;
    if (parseResult.ok) applyManifests(parseResult.manifests);
  }, [applyManifests, parseResult]);

  return (
    <DashboardShell>
      <SimulationClock />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,42%)_1fr]">
          <YamlEditor />
          <div className="flex min-w-0 min-h-0">
            <ClusterGraph />
            <ResourceInspector />
          </div>
        </div>
        <EventTimeline />
      </main>
    </DashboardShell>
  );
}
