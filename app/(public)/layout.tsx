"use client";

import React from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mews-page flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-[104px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
