"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Bell, MessageCircle, User, ChevronDown,
    Heart, HandHelping, Calendar, MapPin, Shield, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const publicNavItems = [
    { key: 'explore', href: '/explore' },
    { key: 'communities', href: '/communities' },
    { key: 'events', href: '/events' },
    { key: 'about', href: '/about' },
    { key: 'partnership', href: '/partnership' },
];

export function PublicNavbar() {
    const { t } = useTranslation("common");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    const isActive = (path: string) => pathname === path;

    const getDashboardLink = () => {
        if (!profile) return '/login';
        switch (profile.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'organization':
                return '/organization/dashboard';
            default:
                return '/volunteer/dashboard';
        }
    };

    const getMessagesLink = () => {
        if (!profile) return '/login';
        switch (profile.role) {
            case 'admin':
                return '/admin/messages';
            case 'organization':
                return '/organization/messages';
            default:
                return '/volunteer/messages';
        }
    };

    const handleNotification = () => {
        toast("No new notifications at this time.");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <>
            <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={cn(
                        "pointer-events-auto transition-all duration-300 rounded-full border w-full max-w-[1200px] flex items-center justify-between px-6 h-[64px]",
                        isScrolled
                            ? "bg-[#131511]/80 backdrop-blur-xl border-white/10 shadow-2xl"
                            : "bg-[#181A15]/60 backdrop-blur-md border-white/5 shadow-xl"
                    )}
                >
                    {/* Left Zone: Logo */}
                    <div className="flex-1 flex items-center justify-start">
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.05 }}
                                className="w-9 h-9 bg-forest-accent rounded-xl flex items-center justify-center shadow-lg shadow-forest-accent/25"
                            >
                                <HandHelping className="w-4 h-4 text-forest-beige" />
                            </motion.div>
                            <span className="font-extrabold text-[20px] tracking-tight text-white hidden sm:block">
                                JALA<span className="text-forest-accent ml-0.5">VIVE</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center Zone: Navigation */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    "text-[14px] font-medium transition-colors",
                                    isActive(item.href) ? "text-white" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {t(`nav.${item.key}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Right Zone: Actions */}
                    <div className="flex-1 flex items-center justify-end gap-5">
                        <LanguageSwitcher />

                        {/* Search Button (Mobile) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <Button variant="ghost" size="icon" onClick={handleNotification} className="relative rounded-full text-forest-muted hover:text-white group hidden sm:flex">
                                    <Bell className="w-5 h-5 transition-transform group-hover:scale-105" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></span>
                                </Button>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-2 hover:bg-[#181A15] rounded-full h-10">
                                            <Avatar className="w-8 h-8 border border-[#2C3322]">
                                                <AvatarImage src={profile?.avatar_url || ''} />
                                                <AvatarFallback className="bg-[#2C3322] text-[#829661] text-sm font-medium">
                                                    {profile?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-[#181A15] border-white/10 rounded-xl mt-2">
                                        <DropdownMenuItem asChild>
                                            <Link href={getDashboardLink()} className="flex items-center gap-2 cursor-pointer hover:bg-white/5">
                                                <Shield className="w-4 h-4" />
                                                {t("nav.dashboard")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={signOut}
                                            className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer hover:bg-white/5"
                                        >
                                            <LogIn className="w-4 h-4 rotate-180" />
                                            {t("nav.signout", "Sign Out")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="hidden sm:flex items-center gap-5">
                                <Link href="/login" className="text-[14px] font-semibold text-gray-400 hover:text-white transition-colors">
                                    {t("nav.login")}
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-white hover:bg-gray-200 text-black rounded-full px-6 h-10 font-bold transition-transform hover:scale-105 text-[14px]">
                                        {t("nav.register")}
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-gray-400 hover:text-white ml-1"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </motion.header>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[88px] left-4 right-4 sm:left-6 sm:right-6 z-40 lg:hidden bg-[#181A15]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive(item.href)
                                            ? "text-[#829661] bg-[#21261B]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {t(`nav.${item.key}`)}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/10 space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {t("nav.dashboard")}
                                        </Link>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {t("nav.profile", "Profile")}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            {t("nav.signout", "Sign Out")}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3 px-2 py-2">
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white/5 h-12 font-semibold">
                                                {t("nav.login")}
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full rounded-full bg-white text-black hover:bg-gray-200 h-12 font-semibold">
                                                {t("nav.register")}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-forest/50 backdrop-blur-sm"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-forest-card rounded-2xl shadow-2xl overflow-hidden">
                                <div className="p-4">
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={t("nav.search_placeholder", "Search projects, organizations, events...")}
                                            className="pl-12 h-12 text-base border-0 focus:ring-0"
                                            autoFocus
                                        />
                                    </form>
                                </div>
                                <div className="border-t border-forest-border p-4">
                                    <p className="text-xs text-forest-muted mb-3">{t("nav.quick_links", "Quick Links")}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <Heart className="w-3.5 h-3.5 mr-1.5" />
                                            {t("nav.edu_projects", "Education Projects")}
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            Jakarta
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {t("nav.this_week", "This Week")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="border-t border-forest-border px-4 py-3 bg-[#181A15] text-xs text-forest-muted">
                                    {t("nav.press", "Press")} <kbd className="px-1.5 py-0.5 bg-forest-card rounded border border-forest-border font-mono">ESC</kbd> {t("nav.to_close", "to close")}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
