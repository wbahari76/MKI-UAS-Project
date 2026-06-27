"use client";

import React, { useState } from "react";
import { Menu, Bell, Search, MessageSquare, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function DashboardHeader({
  setMobileOpen,
}: {
  setMobileOpen: (open: boolean) => void;
}) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User Name";
  const userRole = profile?.role || "Volunteer";
  const userInitials = userName.substring(0, 2).toUpperCase();
  
  const basePath = userRole.toLowerCase() === 'organization' ? '/organization' : 
                   userRole.toLowerCase() === 'admin' ? '/admin' : '/volunteer';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, redirect to explore page with search query
      router.push(`/volunteer/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleNotification = () => {
    toast("No new notifications at this time.");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-forest-border bg-forest-card/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-forest-muted hover:bg-[#1E211A] transition-colors"
        >
          <Menu size={24} />
        </button>

        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 rounded-full border border-forest-border bg-[#181A15] px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-forest-accent transition-all w-64 lg:w-80">
          <Search size={18} className="text-[#7A8072]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, communities..."
            className="w-full bg-transparent text-sm text-forest-beige outline-none placeholder:text-[#7A8072]"
          />
          <div className="hidden lg:flex items-center gap-1 rounded bg-slate-200 px-1.5 text-[10px] font-medium text-forest-muted">
            <span>⌘</span>
            <span>K</span>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link href={`${basePath}/messages`}>
          <button className="relative rounded-full p-2 text-forest-muted hover:bg-[#1E211A] transition-colors">
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-forest-accent ring-2 ring-white"></span>
          </button>
        </Link>
        <button onClick={handleNotification} className="relative rounded-full p-2 text-forest-muted hover:bg-[#1E211A] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-[#1E211A] transition-colors border border-transparent hover:border-forest-border outline-none">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[#2C3322] flex items-center justify-center text-[#829661] font-medium text-sm shrink-0">
                {userInitials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-forest-beige leading-none truncate max-w-[120px]">{userName}</p>
                <p className="text-xs text-forest-muted mt-1 capitalize">{userRole}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
            {userRole.toLowerCase() === 'volunteer' && (
              <Link href="/volunteer/profile">
                <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={`${basePath}/settings`}>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg px-3 py-2 mt-1">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
