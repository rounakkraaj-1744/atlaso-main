"use client";

import Link from "next/link";
import { Box, ChevronLeft, FlaskConical, User } from "lucide-react";
import { PRIMARY_NAVIGATION } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r bg-card/80 backdrop-blur lg:flex lg:flex-col",
        collapsed ? "w-16" : "w-72",
      )}
    >
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Box className="size-5" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold">K8s Sandbox</p>
            <p className="text-xs text-muted-foreground">Simulation engine</p>
          </div>
        )}
        <Button
          aria-label="Toggle sidebar"
          className="ml-auto"
          size="icon"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("size-4", collapsed && "rotate-180")} />
        </Button>
      </div>
      <Separator />
      <nav className="space-y-1 p-3">
        {PRIMARY_NAVIGATION.map((item) => (
          <Link
            className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            href={item.href}
            key={item.href}
          >
            <item.icon className="size-4" />
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>
      {!collapsed && (
        <>
          <Separator />
          <section className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                Saved playgrounds
              </h2>
            </div>
            {["Nginx rollout", "API canary", "Crash loop lab"].map((name) => (
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary"
                key={name}
              >
                <FlaskConical className="size-4 text-muted-foreground" />
                {name}
              </button>
            ))}
          </section>
          <section className="mt-auto border-t p-4">
            <div className="flex items-center gap-3 rounded-md bg-secondary/70 p-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-background">
                <User className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Local user</p>
                <p className="truncate text-xs text-muted-foreground">
                  developer@example.com
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </aside>
  );
}
