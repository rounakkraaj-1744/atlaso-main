import { nanoid } from "nanoid";
import type { ClusterEvent, ClusterEventType } from "@/types/events";

type EventListener = (event: ClusterEvent) => void;

export class SimulationEventBus {
  private listeners = new Set<EventListener>();

  subscribe(listener: EventListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(input: Omit<ClusterEvent, "id" | "createdAt">) {
    const event: ClusterEvent = {
      ...input,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };

    this.listeners.forEach((listener) => listener(event));
    return event;
  }

  info(type: ClusterEventType, message: string, tick: number) {
    return this.emit({ type, message, tick, severity: "info" });
  }
}

export const simulationEventBus = new SimulationEventBus();
