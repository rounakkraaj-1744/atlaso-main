"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background">
      <h1 className="text-lg font-semibold">Sandbox failed to load</h1>
      <p className="text-sm text-muted-foreground">
        The simulation shell hit an unexpected client error.
      </p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
