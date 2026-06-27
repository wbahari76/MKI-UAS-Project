"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, FolderKanban, Flag, Settings
} from "lucide-react";
import { Card } from "@/components/ui/card";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
  { icon: Users, label: "Manage Users", href: "/admin/users" },
  { icon: FolderKanban, label: "Manage Projects", href: "/admin/projects" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-100 bg-white hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Platform Admin
          </h2>
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
