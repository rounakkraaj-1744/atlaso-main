import ReactFlow, {
  Background,
  Controls,
  Panel,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ResourceNode, type ResourceNodeData } from "@/features/visualization/components/resource-node";
import { useSimulationStore } from "@/stores/simulation-store";
import type { ClusterState } from "@/types/kubernetes";
import { Maximize2, Layers, Activity } from "lucide-react";
import { useMemo } from "react";

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
          style: { stroke: "rgba(99,102,241,0.2)", strokeWidth: 1.5 },
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
        style: { stroke: "rgba(16,185,129,0.2)", strokeWidth: 1.5 },
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
          labelStyle: { fill: "#fff", fontSize: 8, fontWeight: 700 },
          labelBgStyle: { fill: "#111", fillOpacity: 0.8 },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 2,
          style: { stroke: "rgba(99,102,241,0.3)", strokeDasharray: "4 4" },
        });
      });
  });

  return { nodes, edges };
}

export function ClusterGraph() {
  const cluster = useSimulationStore((state) => state.cluster);
  const selectResource = useSimulationStore((state) => state.selectResource);
  const { nodes, edges } = useMemo(() => toGraph(cluster), [cluster]);

  const runningPods = cluster.pods.filter(p => p.phase === "Running").length;

  return (
    <section className="relative h-full w-full bg-[#050505] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => selectResource(node.id)}
        minZoom={0.2}
        maxZoom={4}
        className="bg-transparent"
      >
        <Background color="#1a1a1a" gap={24} size={1} />
        
        <Panel position="top-left" className="m-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Infrastructure Canvas
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white/90 tracking-tight">cluster-prod-01</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-6 border-t border-white/5 pt-4">
                <StatItem label="Pods" value={`${runningPods}/${cluster.pods.length}`} />
                <StatItem label="Services" value={cluster.services.length} />
                <StatItem label="Simulation Tick" value={cluster.tick} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel position="bottom-left" className="m-6 flex items-center gap-2">
          <Controls 
            showInteractive={false} 
            className="!m-0 !shadow-none !border-none !flex !flex-row !gap-2 [&_button]:!m-0 [&_button]:!h-10 [&_button]:!w-10 [&_button]:!rounded-lg [&_button]:!border [&_button]:!border-white/10 [&_button]:!bg-black/60 [&_button]:!text-white/40 hover:[&_button]:!text-white [&_button]:!backdrop-blur-md hover:[&_button]:!bg-white/10 [&_svg]:!fill-current"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/40 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all shadow-lg">
            <Maximize2 className="size-4" />
          </button>
        </Panel>

        <Panel position="top-right" className="m-6">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
            <Activity className="size-3 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">
              Live Telemetry
            </span>
          </div>
        </Panel>
      </ReactFlow>
      
      {/* Subtle vignette effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-tight text-white/30">{label}</span>
      <span className="text-xs font-bold text-white/80">{value}</span>
    </div>
  );
}
