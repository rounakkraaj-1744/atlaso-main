"use client";

import { Menu, Moon, Play, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEditorStore } from "@/stores/editor-store";
import { useSimulationStore } from "@/stores/simulation-store";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const parseResult = useEditorStore((state) => state.parseResult);
  const applyManifests = useSimulationStore((state) => state.applyManifests);
  const isRunning = useSimulationStore((state) => state.isRunning);
  const start = useSimulationStore((state) => state.start);
  const pause = useSimulationStore((state) => state.pause);

  const apply = () => {
    if (parseResult.ok) applyManifests(parseResult.manifests);
  };

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a] px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden size-8 text-white/60 hover:text-white">
          <Menu className="size-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-tighter text-white">K8s Sandbox</span>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <span className="hover:text-white cursor-pointer transition-colors">production-cluster.yaml</span>
            <span className="text-white/20">/</span>
            <span className="text-white/90">deployment-v2</span>
          </div>
          <Badge className="ml-2 h-5 border-white/10 bg-white/5 px-1.5 text-[9px] font-bold text-white/40">
            v2.4.1 Stable
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isRunning && (
          <div className="mr-2 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">
              Live
            </span>
          </div>
        )}
        <Button 
          size="sm" 
          onClick={apply} 
          disabled={!parseResult.ok}
          className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-none px-4 rounded-lg font-bold text-[11px]"
        >
          <Play className="mr-1.5 size-3 fill-current" />
          Run simulation
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={isRunning ? pause : start}
          className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-lg px-4 font-bold text-[11px]"
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>
        
        <div className="mx-2 h-4 w-px bg-white/10" />

        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-white/40 hover:text-white hover:bg-white/5"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <Avatar className="size-8 border border-white/10">
          <AvatarFallback className="bg-indigo-900/50 text-[10px] font-bold text-indigo-200">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}