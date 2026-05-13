"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { Boxes, Cloud, Cpu, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ResourceNodeData {
  kind: "Deployment" | "Pod" | "Service" | "Node";
  name: string;
  subtitle?: string;
  status?: string;
}

const icons = {
  Deployment: Boxes,
  Pod: Cpu,
  Service: Cloud,
  Node: Server,
};

export function ResourceNode({ data, selected }: NodeProps<ResourceNodeData>) {
  const Icon = icons[data.kind];
  return (
    <div
      className={cn(
        "min-w-44 rounded-md border bg-card px-3 py-2 shadow-sm",
        selected && "ring-2 ring-ring",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{data.name}</p>
          <p className="truncate text-xs text-muted-foreground">{data.kind}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">
          {data.subtitle ?? "default"}
        </span>
        {data.status && <Badge>{data.status}</Badge>}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}
