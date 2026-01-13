"use client";

import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

export function NavigationProgressProvider() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress
        color="hsl(var(--primary))"
        height={3}
        showSpinner={true}
      />
    </Suspense>
  );
}
