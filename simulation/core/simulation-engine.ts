import type { ClusterState, PodResource } from "@/types/kubernetes";
import { simulationEventBus } from "@/simulation/events/event-bus";
import { ReconciliationManager } from "@/simulation/reconciler/reconciliation-manager";

export class SimulationEngine {
  private readonly reconciler = new ReconciliationManager();

  tick(state: ClusterState): ClusterState {
    const nextTick = state.tick + 1;
    const advancedPods = state.pods.map((pod) => this.advancePod(pod, nextTick));
    const reconciled = this.reconciler.reconcile({
      ...state,
      pods: advancedPods,
      tick: nextTick,
    });

    simulationEventBus.emit({
      type: "simulation.tick",
      severity: "info",
      message: `Simulation tick ${nextTick}`,
      tick: nextTick,
    });

    return reconciled;
  }

  killPod(state: ClusterState, podId: string): ClusterState {
    const pods = state.pods.map((pod) => {
      if (pod.id !== podId) return pod;
      simulationEventBus.emit({
        type: "pod.killed",
        severity: "warning",
        message: `Killed ${pod.name}; controller will recreate it`,
        resourceRef: {
          kind: "Pod",
          name: pod.name,
          namespace: pod.namespace,
        },
        tick: state.tick,
      });
      return { ...pod, phase: "Failed" as const, updatedAt: new Date().toISOString() };
    });

    return this.reconciler.reconcile({ ...state, pods });
  }

  private advancePod(pod: PodResource, tick: number): PodResource {
    if (pod.phase === "Failed" || pod.phase === "Running") 
      return pod;

    const phase = pod.phase === "Pending" ? "ContainerCreating" : "Running";
    if (phase === "Running") {
      simulationEventBus.emit({
        type: "pod.started",
        severity: "success",
        message: `${pod.name} is Running`,
        resourceRef: {
          kind: "Pod",
          name: pod.name,
          namespace: pod.namespace,
        },
        tick,
      });
    }

    return { ...pod, phase, updatedAt: new Date().toISOString() };
  }
}

export const simulationEngine = new SimulationEngine();