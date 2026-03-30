"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 rounded-full text-xs"
      onClick={() => window.print()}
    >
      <Printer className="h-3.5 w-3.5" />
      Cetak
    </Button>
  );
}
