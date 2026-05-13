"use client";

import { create } from "zustand";
import { DEFAULT_SIMULATION_TICK_MS } from "@/constants/app";
import { simulationEngine } from "@/simulation/core/simulation-engine";
import { simulationEventBus } from "@/simulation/events/event-bus";
import { createEmptyClusterState } from "@/simulation/resources/default-cluster";
import type { ClusterEvent } from "@/types/events";
import type { ClusterState, KubernetesManifest } from "@/types/kubernetes";
import { manifestsToClusterState } from "@/utils/kubernetes-manifest";

interface SimulationStore {
  cluster: ClusterState;
  events: ClusterEvent[];
  isRunning: boolean;
  selectedResourceId?: string;
  applyManifests: (manifests: KubernetesManifest[]) => void;
  tick: () => void;
  start: () => void;
  pause: () => void;
  killPod: (podId: string) => void;
  selectResource: (resourceId?: string) => void;
  pushEvent: (event: ClusterEvent) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  cluster: createEmptyClusterState(),
  events: [],
  isRunning: false,
  selectedResourceId: undefined,
  applyManifests: (manifests) => {
    const cluster = manifestsToClusterState(manifests, createEmptyClusterState());
    const next = simulationEngine.tick(cluster);
    set({ cluster: next });
    simulationEventBus.emit({
      type: "manifest.applied",
      severity: "success",
      message: `Applied ${manifests.length} manifest${manifests.length === 1 ? "" : "s"}`,
      tick: next.tick,
    });
  },
  tick: () => set({ cluster: simulationEngine.tick(get().cluster) }),
  start: () => {
    set({ isRunning: true });
    simulationEventBus.emit({
      type: "simulation.started",
      severity: "success",
      message: "Simulation started",
      tick: get().cluster.tick,
    });
  },
  pause: () => {
    set({ isRunning: false });
    simulationEventBus.emit({
      type: "simulation.paused",
      severity: "info",
      message: "Simulation paused",
      tick: get().cluster.tick,
    });
  },
  killPod: (podId) =>
    set({ cluster: simulationEngine.killPod(get().cluster, podId) }),
  selectResource: (selectedResourceId) => set({ selectedResourceId }),
  pushEvent: (event) =>
    set((state) => ({ events: [event, ...state.events].slice(0, 200) })),
}));

let isEventBusBound = false;

export function bindSimulationEventBus() {
  if (isEventBusBound) return;
  isEventBusBound = true;
  simulationEventBus.subscribe((event) => useSimulationStore.getState().pushEvent(event));
}

export function useSimulationClock() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const tick = useSimulationStore((state) => state.tick);

  return { isRunning, tick, tickMs: DEFAULT_SIMULATION_TICK_MS };
}
