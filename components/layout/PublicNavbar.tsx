"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Bell, User, ChevronRight,
    Heart, Calendar, MapPin, Shield, LogIn, ArrowRight
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

const publicNavItems = [
    { name: 'Explore', href: '/explore' },
    { name: 'Communities', href: '/communities' },
    { name: 'Events', href: '/events' },
    { name: 'About', href: '/about' },
    { name: 'Partnership', href: '/partnership' },
];

export function PublicNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, signOut } = useAuth();

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
            <header className="fixed top-0 left-0 right-0 z-50">
                {/* Announcement bar */}
                <Link
                    href="/impact"
                    className="group flex h-9 w-full items-center justify-center gap-2 bg-cotton px-4 text-center text-ink"
                >
                    <span className="text-[13px] font-medium tracking-tight">
                        New impact report — see what our community achieved this year
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Main navigation */}
                <nav className="h-[68px] w-full border-b border-mist bg-canvas/90 backdrop-blur-md">
                    <div className="container-custom flex h-full items-center justify-between gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex shrink-0 items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded bg-bubblegum">
                                <Heart className="h-4 w-4 text-ink" fill="currentColor" />
                            </span>
                            <span className="text-[20px] font-black tracking-[-0.02em] text-ink">
                                JALA<span className="text-bubblegum">VIVE</span>
                            </span>
                        </Link>

                        {/* Center nav */}
                        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                                        isActive(item.href)
                                            ? "bg-blush text-ink"
                                            : "text-charcoal hover:bg-cream hover:text-ink"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right actions */}
                        <div className="flex shrink-0 items-center gap-3">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Search"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream hover:text-ink"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </button>

                            {user ? (
                                <>
                                    <button
                                        onClick={handleNotification}
                                        aria-label="Notifications"
                                        className="relative hidden h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream hover:text-ink sm:flex"
                                    >
                                        <Bell className="h-[18px] w-[18px]" />
                                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bubblegum" />
                                    </button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center rounded-full transition-transform hover:scale-105">
                                                <Avatar className="h-9 w-9 rounded border border-lilac">
                                                    <AvatarImage src={profile?.avatar_url || ''} />
                                                    <AvatarFallback className="rounded bg-blush text-sm font-bold text-ink">
                                                        {profile?.full_name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="mt-2 w-56 rounded border-lilac bg-canvas">
                                            <DropdownMenuItem asChild>
                                                <Link href={getDashboardLink()} className="flex cursor-pointer items-center gap-2 text-ink">
                                                    <Shield className="h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={signOut}
                                                className="flex cursor-pointer items-center gap-2 text-bubblegum focus:text-bubblegum"
                                            >
                                                <LogIn className="h-4 w-4 rotate-180" />
                                                Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="hidden items-center gap-4 sm:flex">
                                    <Link
                                        href="/login"
                                        className="text-[14px] font-semibold text-ink transition-colors hover:text-bubblegum"
                                    >
                                        Log in
                                    </Link>
                                    <Link href="/register" className="mews-cta">
                                        Get started
                                    </Link>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Menu"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream lg:hidden"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-0 right-0 top-[104px] z-40 border-b border-mist bg-canvas lg:hidden"
                    >
                        <div className="container-custom space-y-1 py-4">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between rounded px-4 py-3 text-[15px] font-medium transition-colors",
                                        isActive(item.href)
                                            ? "bg-blush text-ink"
                                            : "text-charcoal hover:bg-cream hover:text-ink"
                                    )}
                                >
                                    {item.name}
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ))}
                            <div className="space-y-2 border-t border-mist pt-4">
                                {user ? (
                                    <>
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block rounded px-4 py-3 text-[15px] font-medium text-charcoal hover:bg-cream hover:text-ink"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full rounded px-4 py-3 text-left text-[15px] font-medium text-bubblegum hover:bg-blush/40"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3 px-1 pt-1">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="mews-ghost w-full"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="mews-cta w-full"
                                        >
                                            Get started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: -16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: -16 }}
                            className="fixed left-1/2 top-24 w-full max-w-2xl -translate-x-1/2 px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="overflow-hidden rounded border border-lilac bg-canvas">
                                <form onSubmit={handleSearch} className="relative p-4">
                                    <Search className="absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-fog" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search projects, organizations, events..."
                                        className="h-12 border-0 bg-transparent pl-10 text-base text-ink focus-visible:ring-0"
                                        autoFocus
                                    />
                                </form>
                                <div className="border-t border-mist p-4">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-fog">Quick links</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link href="/explore?category=education" onClick={() => setIsSearchOpen(false)} className="inline-flex items-center gap-1.5 rounded-full border border-lilac bg-cream px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-blush">
                                            <Heart className="h-3.5 w-3.5" /> Education
                                        </Link>
                                        <Link href="/explore?q=Jakarta" onClick={() => setIsSearchOpen(false)} className="inline-flex items-center gap-1.5 rounded-full border border-lilac bg-cream px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-blush">
                                            <MapPin className="h-3.5 w-3.5" /> Jakarta
                                        </Link>
                                        <Link href="/events" onClick={() => setIsSearchOpen(false)} className="inline-flex items-center gap-1.5 rounded-full border border-lilac bg-cream px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-blush">
                                            <Calendar className="h-3.5 w-3.5" /> This week
                                        </Link>
                                    </div>
                                </div>
                                <div className="border-t border-mist bg-cream px-4 py-3 text-xs text-fog">
                                    Press <kbd className="rounded border border-mist bg-canvas px-1.5 py-0.5 font-mono">ESC</kbd> to close
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
