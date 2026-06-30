"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  FolderHeart,
  Users,
  CalendarDays,
  MessageSquare,
  Bell,
  Award,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Briefcase,
  BarChart,
  ShieldAlert,
  HandHelping,
  Crown,
  Headset,
  Wallet,
} from "lucide-react";

// Definitions based on PRD roles
const volunteerLinks = [
  { key: "dashboard", href: "/volunteer/dashboard", icon: LayoutDashboard },
  { key: "explore", href: "/volunteer/explore", icon: Search },
  { key: "events", href: "/volunteer/events", icon: CalendarDays },
  { key: "wallet", href: "/volunteer/wallet", icon: Wallet },
  { key: "community", href: "/volunteer/community", icon: Users },
  { key: "messages", href: "/volunteer/messages", icon: MessageSquare },
  { key: "profile", href: "/volunteer/profile", icon: User },
];

const organizationLinks = [
  { key: "dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
  { key: "projects", href: "/organization/projects", icon: Briefcase },
  { key: "wallet", href: "/organization/wallet", icon: Wallet },
  { key: "applications", href: "/organization/applications", icon: FolderHeart },
  { key: "volunteers", href: "/organization/volunteers", icon: HandHelping },
  { key: "community", href: "/organization/community", icon: Users },
  { key: "events", href: "/organization/events", icon: CalendarDays },
  { key: "analytics", href: "/organization/analytics", icon: BarChart },
  { key: "messages", href: "/organization/messages", icon: MessageSquare },
  { key: "assistant", href: "/organization/assistant", icon: HandHelping }, // Using HandHelping or we can import Bot
  { key: "subscription", href: "/organization/subscription", icon: Crown },
  { key: "settings", href: "/organization/settings", icon: Settings },
];

const adminLinks = [
  { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "manage_users", href: "/admin/users", icon: Users },
  { key: "manage_projects", href: "/admin/projects", icon: FolderHeart },
  { key: "wallet", href: "/admin/wallet", icon: Wallet },
  { key: "support", href: "/admin/support", icon: Headset },
];

export default function DashboardSidebar({
  isMobileOpen,
  setMobileOpen,
}: {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { profile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-detect role from URL or profile
  let links = volunteerLinks;
  if (pathname?.startsWith("/organization") || profile?.role === "organization") links = organizationLinks;
  if (pathname?.startsWith("/admin") || profile?.role === "admin") links = adminLinks;

  // Handle mobile collapse logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = (
    <div className="flex h-full flex-col bg-forest-card border-r border-forest-border">
      <div className="flex h-16 items-center justify-between px-4 border-b border-forest-border">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-accent text-forest-beige font-bold text-lg">
              J
            </div>
            <span className="font-bold text-xl tracking-tight text-forest-beige">
              JALA <span className="text-forest-accent">VIVE</span>
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-forest-accent text-forest-beige font-bold text-lg">
            J
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1 rounded-md text-[#7A8072] hover:text-forest-muted hover:bg-[#1E211A] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group ${isActive
                    ? "bg-[#21261B] text-[#829661] font-medium"
                    : "text-forest-muted hover:bg-[#181A15] hover:text-forest-beige"
                  }`}
                title={isCollapsed ? t(`nav.${link.key}`) : undefined}
              >
                <link.icon
                  size={20}
                  className={`flex-shrink-0 ${isActive ? "text-[#829661]" : "text-[#7A8072] group-hover:text-forest-muted"
                    }`}
                />
                {!isCollapsed && <span>{t(`nav.${link.key}`)}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-forest-border">
        <button
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-colors hover:bg-red-500/10 ${isCollapsed ? "justify-center" : ""
            }`}
          title={isCollapsed ? t("nav.logout") : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">{t("nav.logout")}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="hidden lg:block h-screen sticky top-0 z-40 bg-forest-card"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {SidebarContent}
      </motion.aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-forest/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-forest-card shadow-xl lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
