"use client";

import { useEffect, useRef, useState } from "react";
import { PanelImperativeHandle, Group as ResizablePanelGroup, Panel as ResizablePanel, Separator as ResizableHandle } from "react-resizable-panels";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { YamlEditor } from "@/features/manifests/components/yaml-editor";
import { ResourceInspector } from "@/features/resources/components/resource-inspector";
import { ClusterGraph } from "@/features/visualization/components/cluster-graph";
import { EventTimeline } from "@/features/timeline/components/event-timeline";
import { useEditorStore } from "@/stores/editor-store";
import { useSimulationStore } from "@/stores/simulation-store";
import { cn } from "@/lib/utils";

export function PlaygroundWorkspace() {
  const parseResult = useEditorStore((state) => state.parseResult);
  const applyManifests = useSimulationStore((state) => state.applyManifests);
  const didApplyInitialManifest = useRef(false);
  const yamlPanelRef = useRef<PanelImperativeHandle>(null);
  const inspectorPanelRef = useRef<PanelImperativeHandle>(null);
  const timelinePanelRef = useRef<PanelImperativeHandle>(null);
  const [isYamlCollapsed, setIsYamlCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (didApplyInitialManifest.current)
      return;
    didApplyInitialManifest.current = true;
    if (parseResult.ok)
      applyManifests(parseResult.manifests);
  }, [applyManifests, parseResult]);

  const toggleYaml = () => {
    const panel = yamlPanelRef.current;
    if (panel) {
      if (isYamlCollapsed) panel.expand();
      else panel.collapse();
    }
  };

  const toggleInspector = () => {
    const panel = inspectorPanelRef.current;
    if (panel) {
      if (isInspectorCollapsed) panel.expand();
      else panel.collapse();
    }
  };

  return (
    <DashboardShell>
      <main className="flex h-full w-full flex-col overflow-hidden bg-background">
        <ResizablePanelGroup orientation="vertical" className="flex-1">
          <ResizablePanel defaultSize={75} minSize={30}>
            <ResizablePanelGroup orientation={isMobile ? "vertical" : "horizontal"}>
              <ResizablePanel panelRef={yamlPanelRef} defaultSize={25} minSize={15} collapsible
                onResize={(size) => setIsYamlCollapsed(size.asPercentage === 0)}
                className={cn(
                  "flex flex-col border-r bg-card/30 transition-all duration-300",
                  isYamlCollapsed && "min-w-[40px] max-w-[40px]"
                )} >
                <YamlEditor isCollapsed={isYamlCollapsed} onToggleCollapse={toggleYaml} />
              </ResizablePanel>

              <ResizableHandle className="bg-white/5 hover:bg-white/10" />

              <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-[#050505]">
                <ClusterGraph />
              </ResizablePanel>

              <ResizableHandle className="bg-white/5 hover:bg-white/10" />

              <ResizablePanel panelRef={inspectorPanelRef} defaultSize={25} minSize={15} collapsible 
                onResize={(size) => setIsInspectorCollapsed(size.asPercentage === 0)}
                className={cn(
                  "flex flex-col border-l bg-card/30 transition-all duration-300",
                  isInspectorCollapsed && "min-w-[40px] max-w-[40px]"
                )}>
                <ResourceInspector isCollapsed={isInspectorCollapsed} onToggleCollapse={toggleInspector} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle className="bg-white/5 hover:bg-white/10" />

          <ResizablePanel panelRef={timelinePanelRef} defaultSize={25} minSize={5} collapsible
            onResize={(size) => setIsTimelineCollapsed(size.asPercentage === 0)}
            className={cn(
              "flex flex-col border-t bg-black/40 transition-all duration-300",
              isTimelineCollapsed && "min-h-[40px] max-h-[40px]"
            )}
          >
            <EventTimeline />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </DashboardShell>
  );
}