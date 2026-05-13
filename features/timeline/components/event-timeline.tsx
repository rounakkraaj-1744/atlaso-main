import { formatDistanceToNow } from "date-fns";
import { CircleCheck, Info, AlertTriangle, Clock, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulationStore } from "@/stores/simulation-store";
import type { ClusterEventSeverity } from "@/types/events";
import { cn } from "@/lib/utils";

const severityIcon: Record<ClusterEventSeverity, any> = {
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CircleCheck,
};

export function EventTimeline() {
  const events = useSimulationStore((state) => state.events);

  return (
    <section className="flex h-full flex-col bg-[#050505]">
      <Tabs defaultValue="timeline" className="flex h-full flex-col">
        <div className="flex h-10 items-center justify-between border-b border-white/5 bg-white/[0.02] px-4">
          <TabsList className="h-8 bg-transparent p-0 gap-2">
            <TabTrigger value="timeline" label="Timeline" />
            <TabTrigger value="logs" label="Container Logs" />
            <TabTrigger value="events" label="Cluster Events" />
          </TabsList>
          
          <div className={cn(
            "flex items-center gap-2 rounded-full border px-2.5 py-1 transition-all",
            events.length > 0 
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" 
              : "border-white/5 bg-white/[0.02] text-white/20"
          )}>
            <CircleCheck className={cn("size-3.5", events.length > 0 && "animate-pulse")} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {events.length} Emitted Events
            </span>
          </div>
        </div>

        <TabsContent value="timeline" className="m-0 min-h-0 flex-1 overflow-auto focus-visible:ring-0">
          <EventList />
        </TabsContent>
        <TabsContent value="logs" className="m-0 min-h-0 flex-1 overflow-auto bg-[#030303] focus-visible:ring-0">
          <div className="p-8 font-mono text-xs leading-relaxed">
            <div className="flex gap-3 text-white/30">
              <span className="shrink-0">$</span>
              <span>kubectl logs deployment/web -f</span>
            </div>
            <div className="mt-4 flex items-center gap-3 text-white/10">
              <span className="animate-pulse">_</span>
              <span className="italic">Waiting for simulation stream...</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="events" className="m-0 min-h-0 flex-1 overflow-auto focus-visible:ring-0">
          <EventList />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function TabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="relative h-8 rounded-none border-b-2 border-transparent px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 transition-all data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-white hover:text-white/70"
    >
      {label}
    </TabsTrigger>
  );
}

function EventList() {
  const events = useSimulationStore((state) => state.events);

  if (events.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center space-y-4 opacity-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5">
          <Clock className="size-8" />
        </div>
        <div className="max-w-[200px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">No Simulation Events</p>
          <p className="mt-1 text-[10px] leading-relaxed text-white/60 font-medium">
            Simulation timeline is empty. Start the simulation to see events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.02]">
      {[...events].reverse().map((event) => {
        const Icon = severityIcon[event.severity];
        return (
          <article className="group grid grid-cols-[64px_1fr_auto] gap-4 px-6 py-5 transition-colors hover:bg-white/[0.01]" key={event.id}>
            <div className="flex justify-center pt-0.5">
              <div className={cn(
                "flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] transition-all group-hover:scale-110 group-hover:bg-white/[0.05]",
                event.severity === "success" && "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                event.severity === "warning" && "border-amber-500/20 bg-amber-500/5 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
                event.severity === "error" && "border-red-500/20 bg-red-500/5 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              )}>
                <Icon className="size-4" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-white/90 tracking-tight">
                  {event.message}
                </p>
                <span className="text-[10px] font-bold text-white/20 tabular-nums">
                  T-{event.tick}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {event.resourceRef && (
                  <span className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] font-bold text-white/50 group-hover:border-white/10 group-hover:text-white/70 transition-colors">
                    <span className="text-indigo-400/70">{event.resourceRef.kind}</span>
                    <span className="h-2.5 w-px bg-white/10" />
                    <span>{event.resourceRef.name}</span>
                  </span>
                )}
                {event.type === "deployment.reconciled" && (
                  <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/10 bg-emerald-500/[0.02] px-2 py-0.5 text-[9px] font-bold text-emerald-500/60">
                    <Activity className="size-3" />
                    Scale Operation Successful
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 pt-1">
              <time className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
              </time>
            </div>
          </article>
        );
      })}
    </div>
  );
}
