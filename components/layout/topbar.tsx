"use client";

import { Copy, GitFork, Moon, Pause, Play, Save, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEditorStore } from "@/stores/editor-store";
import { useSimulationStore } from "@/stores/simulation-store";

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card/90 px-3 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button size="sm" onClick={apply} disabled={!parseResult.ok}>
          <Play className="size-4" />
          Run simulation
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={isRunning ? pause : start}
        >
          {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
          {isRunning ? "Pause" : "Resume"}
        </Button>
        <Button size="icon" variant="ghost" aria-label="Save playground">
          <Save className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Fork playground">
          <GitFork className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Copy manifest">
          <Copy className="size-4" />
        </Button>
      </div>
      <Button
        aria-label="Toggle theme"
        size="icon"
        variant="ghost"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="User menu">
            <Avatar>
              <AvatarFallback />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
