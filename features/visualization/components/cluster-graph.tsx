"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
} from "reactflow";
import { ResourceNode, type ResourceNodeData } from "@/features/visualization/components/resource-node";
import { useSimulationStore } from "@/stores/simulation-store";
import type { ClusterState } from "@/types/kubernetes";

const nodeTypes = {
  resource: ResourceNode,
};

function selectorMatches(
  selector: Record<string, string>,
  labels: Record<string, string>,
) {
  return Object.entries(selector).every(([key, value]) => labels[key] === value);
}

function toGraph(state: ClusterState) {
  const nodes: Node<ResourceNodeData>[] = [];
  const edges: Edge[] = [];

  state.nodes.forEach((node, index) => {
    nodes.push({
      id: node.id,
      type: "resource",
      position: { x: 560, y: index * 130 },
      data: {
        kind: "Node",
        name: node.name,
        subtitle: `${node.capacity.cpu} CPU / ${node.capacity.memoryMi}Mi`,
        status: node.status,
      },
    });
  });

  state.deployments.forEach((deployment, index) => {
    nodes.push({
      id: deployment.id,
      type: "resource",
      position: { x: 40, y: index * 150 },
      data: {
        kind: "Deployment",
        name: deployment.name,
        subtitle: `${deployment.replicas} desired replicas`,
        status: "Reconciling",
      },
    });
  });

  state.pods.forEach((pod, index) => {
    nodes.push({
      id: pod.id,
      type: "resource",
      position: { x: 300, y: index * 110 },
      data: {
        kind: "Pod",
        name: pod.name,
        subtitle: pod.nodeName ?? "unscheduled",
        status: pod.phase,
      },
    });

    if (pod.ownerDeploymentName) {
      const deployment = state.deployments.find(
        (candidate) => candidate.name === pod.ownerDeploymentName,
      );
      if (deployment) {
        edges.push({
          id: `${deployment.id}-${pod.id}`,
          source: deployment.id,
          target: pod.id,
          animated: pod.phase !== "Failed",
        });
      }
    }

    const node = state.nodes.find((candidate) => candidate.name === pod.nodeName);
    if (node) {
      edges.push({
        id: `${pod.id}-${node.id}`,
        source: pod.id,
        target: node.id,
        animated: pod.phase === "Running",
      });
    }
  });

  state.services.forEach((service, index) => {
    nodes.push({
      id: service.id,
      type: "resource",
      position: { x: 40, y: 320 + index * 140 },
      data: {
        kind: "Service",
        name: service.name,
        subtitle: service.ports.map((port) => port.port).join(", "),
        status: service.type,
      },
    });

    state.pods
      .filter((pod) => selectorMatches(service.selector, pod.labels))
      .forEach((pod) => {
        edges.push({
          id: `${service.id}-${pod.id}`,
          source: service.id,
          target: pod.id,
          animated: true,
          label: "traffic",
        });
      });
  });

  return { nodes, edges };
}

export function ClusterGraph() {
  const cluster = useSimulationStore((state) => state.cluster);
  const selectResource = useSimulationStore((state) => state.selectResource);
  const { nodes, edges } = useMemo(() => toGraph(cluster), [cluster]);

  return (
    <section className="relative min-h-0 flex-1 bg-background">
      <div className="absolute left-3 top-3 z-10 rounded-md border bg-card/90 px-3 py-2 shadow-sm">
        <p className="text-sm font-semibold">Infrastructure canvas</p>
        <p className="text-xs text-muted-foreground">
          Tick {cluster.tick} · {cluster.pods.length} pods ·{" "}
          {cluster.services.length} services
        </p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => selectResource(node.id)}
      >
        <Background gap={18} />
        <Controls position="bottom-left" />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </section>
  );
}
