"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  BreakingNewsTicker,
  TopBar,
} from "@/components/layout/BreakingNewsTicker";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  // Don't show main site header/footer on admin pages
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Top utility bar with time, location, weather */}
      <TopBar />

      {/* Breaking news ticker (RED) - above header */}
      <BreakingNewsTicker />

      {/* Header with navigation */}
      <Header />

      {/* Main content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  );
}
