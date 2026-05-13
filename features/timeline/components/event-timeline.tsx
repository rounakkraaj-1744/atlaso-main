"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity, CircleAlert, CircleCheck, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulationStore } from "@/stores/simulation-store";
import type { ClusterEventSeverity } from "@/types/events";

const severityIcon: Record<ClusterEventSeverity, typeof Info> = {
  info: Info,
  warning: CircleAlert,
  error: CircleAlert,
  success: CircleCheck,
};

export function EventTimeline() {
  const events = useSimulationStore((state) => state.events);

  return (
    <section className="h-56 shrink-0 border-t bg-card">
      <Tabs defaultValue="timeline" className="flex h-full flex-col">
        <div className="flex h-11 items-center justify-between border-b px-3">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="events">Cluster events</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-4" />
            {events.length} emitted events
          </div>
        </div>
        <TabsContent value="timeline" className="min-h-0 flex-1 overflow-auto">
          <EventList mode="timeline" />
        </TabsContent>
        <TabsContent value="logs" className="min-h-0 flex-1 overflow-auto">
          <EventList mode="logs" />
        </TabsContent>
        <TabsContent value="events" className="min-h-0 flex-1 overflow-auto">
          <EventList mode="events" />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function EventList({ mode }: { mode: "timeline" | "logs" | "events" }) {
  const events = useSimulationStore((state) => state.events);

  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Run the simulation to emit cluster events.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {events.map((event) => {
        const Icon = severityIcon[event.severity];
        return (
          <article className="grid grid-cols-[32px_1fr_auto] gap-3 px-4 py-2" key={event.id}>
            <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {mode === "logs" ? `[${event.type}] ` : ""}
                {event.message}
              </p>
              <p className="text-xs text-muted-foreground">
                Tick {event.tick}
                {event.resourceRef
                  ? ` · ${event.resourceRef.kind}/${event.resourceRef.name}`
                  : ""}
              </p>
            </div>
            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
            </time>
          </article>
        );
      })}
    </div>
  );
}
