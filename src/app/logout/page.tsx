"use client";

import { useEffect, useState } from "react";
import { createClient, resetClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const [status, setStatus] = useState("Sedang logout...");

  useEffect(() => {
    async function doLogout() {
      try {
        // 1. Supabase client signout
        const supabase = createClient();
        await supabase.auth.signOut({ scope: "local" }).catch(() => {});

        // 2. Server-side cookie cleanup
        await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});

        // 3. Clear ALL localStorage
        if (typeof window !== "undefined") {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
              key &&
              (key.includes("supabase") ||
                key.includes("sb-") ||
                key.includes("auth"))
            ) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));

          // Clear sessionStorage
          const ssKeys: string[] = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (
              key &&
              (key.includes("supabase") ||
                key.includes("sb-") ||
                key.includes("auth"))
            ) {
              ssKeys.push(key);
            }
          }
          ssKeys.forEach((k) => sessionStorage.removeItem(k));
        }

        // 4. Reset singleton client
        resetClient();

        setStatus("Berhasil logout! Mengalihkan...");

        // 5. Redirect with full reload
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } catch (err) {
        console.error("Logout error:", err);
        setStatus("Logout gagal. Mengalihkan...");
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      }
    }

    doLogout();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
}
