"use client";

import { Box, Clock, FlaskConical, LayoutGrid, Zap, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <aside className="flex h-full w-full flex-col items-center py-4">
      <div className={cn("mb-6 transition-all", isCollapsed ? "mb-4" : "mb-6")}>
        <Button variant="ghost" size="icon" className="size-10 text-muted-foreground hover:bg-white/5 hover:text-white">
          <Menu className="size-5" />
        </Button>
      </div>

      <nav className="flex flex-col gap-4">
        <SidebarIcon icon={LayoutGrid} active label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarIcon icon={Box} label="Resources" isCollapsed={isCollapsed} />
        <SidebarIcon icon={Clock} label="History" isCollapsed={isCollapsed} />
        <SidebarIcon icon={Zap} label="Simulations" isCollapsed={isCollapsed} />
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="relative">
          <SidebarIcon icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          {!isCollapsed && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
        </div>
        <div className="h-px w-8 bg-white/5 mx-auto" />
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-lg hover:opacity-90 transition-opacity">
          JD
        </button>
      </div>
    </aside>
  );
}

function SidebarIcon({ 
  icon: Icon, 
  active, 
  label, 
  isCollapsed 
}: { 
  icon: any; 
  active?: boolean; 
  label: string;
  isCollapsed?: boolean;
}) {
  return (
    <div className="group relative flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-10 transition-all",
          active 
            ? "bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
            : "text-white/40 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className="size-5" />
      </Button>
      {isCollapsed && (
        <div className="absolute left-14 z-50 hidden group-hover:block">
          <div className="rounded bg-black/90 px-2 py-1 text-[10px] font-bold text-white shadow-xl border border-white/10 whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
