"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PanelHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  status?: "valid" | "invalid" | "pending";
}

export function PanelHeader({
  title,
  className,
  children,
  isCollapsed,
  onToggleCollapse,
  status,
}: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-1",
        isCollapsed && "px-2 justify-center",
        className
      )}
    >
      {!isCollapsed ? (
        <>
          <div className="flex items-center gap-2 overflow-hidden">
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 p-0 hover:bg-white/5"
                onClick={onToggleCollapse}
              >
                <ChevronDown className="size-4" />
              </Button>
            )}
            <h2 className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              {title}
            </h2>
            {status === "valid" && (
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                Valid
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {children}
          </div>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 p-0 hover:bg-white/5"
          onClick={onToggleCollapse}
        >
          <ChevronRight className="size-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
