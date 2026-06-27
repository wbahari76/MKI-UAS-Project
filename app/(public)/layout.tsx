"use client";

import React from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      {/* Footer can be added here later */}
    </div>
  );
}
