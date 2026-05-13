"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Group as ResizablePanelGroup, Panel as ResizablePanel, Separator as ResizableHandle } from "react-resizable-panels";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={4}
          minSize={3}
          collapsible
          onResize={(size) => setIsSidebarCollapsed(size.asPercentage < 4)}
          className={cn(
            "hidden lg:flex flex-col bg-[#0a0a0a] transition-all duration-300",
            isSidebarCollapsed && "min-w-[60px] max-w-[60px]"
          )}
        >
          <AppSidebar isCollapsed={isSidebarCollapsed} />
        </ResizablePanel>

        <ResizableHandle className="hidden lg:flex w-px bg-white/5 hover:bg-white/10" />

        <ResizablePanel defaultSize={96}>
          <div className="flex h-full min-w-0 flex-1 flex-col">
            <Topbar />
            <div className="flex-1 min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
