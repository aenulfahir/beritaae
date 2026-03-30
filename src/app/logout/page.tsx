"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function clearAllAuthData() {
  // Clear localStorage
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    // Remove ALL supabase/auth related keys
    keys.forEach((k) => {
      if (k.includes("supabase") || k.includes("sb-") || k.includes("auth")) {
        localStorage.removeItem(k);
      }
    });
  } catch {}

  // Clear sessionStorage
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k) keys.push(k);
    }
    keys.forEach((k) => {
      if (k.includes("supabase") || k.includes("sb-") || k.includes("auth")) {
        sessionStorage.removeItem(k);
      }
    });
  } catch {}

  // Clear cookies client-side
  try {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (
        name.includes("supabase") ||
        name.includes("sb-") ||
        name.includes("auth")
      ) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    });
  } catch {}
}

export default function LogoutPage() {
  useEffect(() => {
    // Immediately clear all auth data
    clearAllAuthData();

    // Try server-side cleanup with a short timeout, don't wait
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    fetch("/api/auth/signout", {
      method: "POST",
      signal: controller.signal,
    })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
      });

    // Redirect after a brief moment regardless
    setTimeout(() => {
      window.location.replace("/");
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Sedang logout...</p>
    </div>
  );
}
