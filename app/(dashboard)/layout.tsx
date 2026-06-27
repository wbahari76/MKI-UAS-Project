"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DashboardSidebar
        isMobileOpen={isMobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
