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

const publicNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'Communities', href: '/communities' },
    { name: 'Events', href: '/events' },
    { name: 'Impact', href: '/impact' },
    { name: 'About', href: '/about' },
    { name: 'Partnership', href: '/partnership' },
];

export function PublicNavbar() {
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
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "pointer-events-auto transition-all duration-300 rounded-[28px] border px-2 sm:px-4 flex items-center justify-between w-full max-w-[1200px]",
                    isScrolled
                        ? "bg-[#131511]/85 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50"
                        : "bg-[#181A15]/60 backdrop-blur-lg border-white/5 shadow-xl"
                )}
            >
                <nav className="flex items-center justify-between h-14 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group pl-2">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.05 }}
                            className="w-9 h-9 bg-forest-accent rounded-xl flex items-center justify-center shadow-lg shadow-forest-accent/25"
                        >
                            <HandHelping className="w-4 h-4 text-forest-beige" />
                        </motion.div>
                        <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                            JALA<span className="text-forest-accent ml-1">VIVE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    isActive(item.href)
                                        ? "text-[#131511] bg-[#829661] shadow-[0_0_15px_rgba(130,150,97,0.3)]"
                                        : "text-forest-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchOpen(true)}
                            className="text-forest-muted hover:text-forest-beige"
                        >
                            <Search className="w-4 h-4" />
                        </Button>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <Button variant="ghost" size="sm" onClick={handleNotification} className="relative rounded-full text-forest-muted hover:text-white group">
                                    <Bell className="w-4 h-4 transition-transform group-hover:scale-105" />
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-red-500/50">
                                        3
                                    </span>
                                </Button>

                                {/* Messages */}
                                <Link href={getMessagesLink()}>
                                    <Button variant="ghost" size="sm" className="relative rounded-full text-forest-muted hover:text-white group">
                                        <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-105" />
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-forest-accent/50">
                                            2
                                        </span>
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 hover:bg-[#181A15]">
                                            <Avatar className="w-8 h-8 border-2 border-[#2C3322]">
                                                <AvatarImage src={profile?.avatar_url || ''} />
                                                <AvatarFallback className="bg-[#2C3322] text-[#829661] text-sm font-medium">
                                                    {profile?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="w-4 h-4 text-[#7A8072]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem asChild>
                                            <Link href={getDashboardLink()} className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={signOut}
                                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                        >
                                            <LogIn className="w-4 h-4 rotate-180" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-forest-muted hover:text-white rounded-full px-4">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-forest-accent hover:bg-[#4A5D23] text-white rounded-full px-5 shadow-lg shadow-forest-accent/20 transition-transform hover:scale-105">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchOpen(true)}
                            className="text-forest-muted"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-forest-muted"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </nav>
            </motion.header>
        </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-forest-card border-t border-forest-border"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive(item.href)
                                            ? "text-[#829661] bg-[#21261B]"
                                            : "text-forest-muted hover:text-forest-beige hover:bg-[#181A15]"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-forest-border space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-forest-muted hover:text-forest-beige hover:bg-[#181A15]"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-forest-muted hover:text-forest-beige hover:bg-[#181A15]"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-500/10"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-forest-accent hover:bg-[#4A5D23]">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
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
                                            placeholder="Search projects, organizations, events..."
                                            className="pl-12 h-12 text-base border-0 focus:ring-0"
                                            autoFocus
                                        />
                                    </form>
                                </div>
                                <div className="border-t border-forest-border p-4">
                                    <p className="text-xs text-forest-muted mb-3">Quick Links</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <Heart className="w-3.5 h-3.5 mr-1.5" />
                                            Education Projects
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            Jakarta
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            This Week
                                        </Button>
                                    </div>
                                </div>
                                <div className="border-t border-forest-border px-4 py-3 bg-[#181A15] text-xs text-forest-muted">
                                    Press <kbd className="px-1.5 py-0.5 bg-forest-card rounded border border-forest-border font-mono">ESC</kbd> to close
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
