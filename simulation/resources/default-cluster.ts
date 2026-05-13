import { DEFAULT_NODE_COUNT } from "@/constants/app";
import type { ClusterState, NodeResource } from "@/types/kubernetes";

const now = () => new Date().toISOString();

export function createDefaultNodes(count = DEFAULT_NODE_COUNT): NodeResource[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    kind: "Node",
    name: `sandbox-node-${index + 1}`,
    status: "Ready",
    capacity: {
      cpu: 4,
      memoryMi: 8192,
      pods: 24,
    },
    createdAt: now(),
    updatedAt: now(),
  }));
}

export function createEmptyClusterState(): ClusterState {
  return {
    deployments: [],
    pods: [],
    services: [],
    nodes: createDefaultNodes(),
    tick: 0,
  };
}
