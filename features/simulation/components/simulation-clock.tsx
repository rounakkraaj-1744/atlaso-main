"use client";

import { useEffect } from "react";
import {
  bindSimulationEventBus,
  useSimulationClock,
} from "@/stores/simulation-store";

export function SimulationClock() {
  const { isRunning, tick, tickMs } = useSimulationClock();

  useEffect(() => {
    bindSimulationEventBus();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = window.setInterval(tick, tickMs);
    return () => window.clearInterval(intervalId);
  }, [isRunning, tick, tickMs]);

  return null;
}
