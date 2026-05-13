export type ClusterEventType =
  | "manifest.applied"
  | "deployment.reconciled"
  | "pod.scheduled"
  | "pod.started"
  | "pod.killed"
  | "pod.restarted"
  | "service.linked"
  | "simulation.started"
  | "simulation.paused"
  | "simulation.tick"
  | "validation.failed";

export type ClusterEventSeverity = "info" | "warning" | "error" | "success";

export interface ClusterEvent {
  id: string;
  type: ClusterEventType;
  severity: ClusterEventSeverity;
  message: string;
  resourceRef?: {
    kind: string;
    name: string;
    namespace?: string;
  };
  tick: number;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
}
