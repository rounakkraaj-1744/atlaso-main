"use client";

import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/stores/simulation-store";
import { PanelHeader } from "@/components/layout/panel-header";
import { Trash2, FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceInspectorProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ResourceInspector({ isCollapsed, onToggleCollapse }: ResourceInspectorProps) {
  const cluster = useSimulationStore((state) => state.cluster);
  const selectedResourceId = useSimulationStore((state) => state.selectedResourceId);
  const killPod = useSimulationStore((state) => state.killPod);

  const resources = [
    ...cluster.deployments.map(d => ({ ...d, kind: "Deployment" })),
    ...cluster.pods.map(p => ({ ...p, kind: "Pod" })),
    ...cluster.services.map(s => ({ ...s, kind: "Service" })),
    ...cluster.nodes.map(n => ({ ...n, kind: "Node" })),
  ];
  const resource = resources.find((item: any) => item.id === selectedResourceId);

  return (
    <div className="flex h-full flex-col bg-card/30">
      <PanelHeader 
        title="Resource Inspector" 
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      
      {resource && !isCollapsed ? (
        <div className="flex flex-1 flex-col p-6 overflow-hidden">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {resource.kind}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-white/90">
              {resource.name}
            </h3>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <DetailItem label="ID" value={resource.id} />
              <DetailItem label="Kind" value={resource.kind} badge />
              <DetailItem label="Namespace" value="default" />
              <DetailItem 
                label="Node" 
                value={(resource as any).nodeName || "unscheduled"} 
                link 
              />
              <DetailItem 
                label="Phase" 
                value={(resource as any).phase || "Active"} 
                status={(resource as any).phase === "Running" ? "success" : "warning"} 
              />
            </div>
          </div>

          <div className="mt-auto pt-6 space-y-3">
            {resource.kind === "Pod" && (resource as any).phase !== "Failed" && (
              <Button
                className="w-full h-11 bg-red-500/80 hover:bg-red-500 text-white font-bold border-none"
                onClick={() => killPod(resource.id)}
              >
                <Trash2 className="mr-2 size-4" />
                Kill Pod
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              <FileText className="mr-2 size-4" />
              View Logs
            </Button>
          </div>
        </div>
      ) : !isCollapsed && (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
            <Layers className="size-8 text-white/10" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/40 tracking-tight">No Resource Selected</p>
            <p className="mt-1 text-[11px] text-white/20 max-w-[180px] leading-relaxed">
              Select a resource from the infrastructure canvas to view its real-time status and logs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ 
  label, 
  value, 
  badge, 
  link, 
  status 
}: { 
  label: string; 
  value: string; 
  badge?: boolean;
  link?: boolean;
  status?: "success" | "warning" | "error";
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2">
        {status && (
          <span className={cn(
            "size-2 rounded-full",
            status === "success" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
          )} />
        )}
        <span className={cn(
          "text-xs font-medium",
          link ? "text-blue-400 underline decoration-blue-400/30 underline-offset-4" : "text-white/80",
          badge && "rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold"
        )}>
          {value}
        </span>
      </dd>
    </div>
  );
}
