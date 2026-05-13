import { nanoid } from "nanoid";
import type {
  ClusterState,
  DeploymentResource,
  PodResource,
} from "@/types/kubernetes";
import { simulationEventBus } from "@/simulation/events/event-bus";

function labelsMatch(
  selector: Record<string, string>,
  labels: Record<string, string>,
) {
  return Object.entries(selector).every(([key, value]) => labels[key] === value);
}

function pickNodeName(state: ClusterState) {
  const node = state.nodes[state.pods.length % Math.max(state.nodes.length, 1)];
  return node?.name;
}

function createReplicaPod(
  deployment: DeploymentResource,
  state: ClusterState,
): PodResource {
  const createdAt = new Date().toISOString();
  const podName = `${deployment.name}-${nanoid(6)}`;

  return {
    id: nanoid(),
    kind: "Pod",
    name: podName,
    namespace: deployment.namespace,
    labels: deployment.selector,
    ownerDeploymentName: deployment.name,
    nodeName: pickNodeName(state),
    phase: "Pending",
    restartCount: 0,
    containers: deployment.template.containers,
    createdAt,
    updatedAt: createdAt,
  };
}

export class ReconciliationManager {
  reconcile(state: ClusterState): ClusterState {
    let pods = [...state.pods];

    for (const deployment of state.deployments) {
      const ownedPods = pods.filter(
        (pod) =>
          pod.namespace === deployment.namespace &&
          pod.ownerDeploymentName === deployment.name &&
          pod.phase !== "Failed" &&
          labelsMatch(deployment.selector, pod.labels),
      );

      const missingReplicas = deployment.replicas - ownedPods.length;
      if (missingReplicas > 0) {
        const newPods = Array.from({ length: missingReplicas }, () =>
          createReplicaPod(deployment, { ...state, pods }),
        );
        pods = [...pods, ...newPods];
        newPods.forEach((pod) => {
          simulationEventBus.emit({
            type: "pod.scheduled",
            severity: "success",
            message: `Scheduled ${pod.name} on ${pod.nodeName ?? "pending node"}`,
            resourceRef: {
              kind: "Pod",
              name: pod.name,
              namespace: pod.namespace,
            },
            tick: state.tick,
          });
        });
      }

      simulationEventBus.emit({
        type: "deployment.reconciled",
        severity: "info",
        message: `Reconciled ${deployment.name} to ${deployment.replicas} replicas`,
        resourceRef: {
          kind: "Deployment",
          name: deployment.name,
          namespace: deployment.namespace,
        },
        tick: state.tick,
      });
    }

    return { ...state, pods };
  }
}
