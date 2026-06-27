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
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.05 }}
                            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25"
                        >
                            <HandHelping className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="font-bold text-xl text-slate-900">
                            JALA<span className="text-emerald-500">VIVE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive(item.href)
                                        ? "text-emerald-600 bg-emerald-50"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchOpen(true)}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            <Search className="w-4 h-4" />
                        </Button>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <Button variant="ghost" size="sm" onClick={handleNotification} className="relative text-slate-500 hover:text-slate-900">
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        3
                                    </span>
                                </Button>

                                {/* Messages */}
                                <Link href={getMessagesLink()}>
                                    <Button variant="ghost" size="sm" className="relative text-slate-500 hover:text-slate-900">
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                                            2
                                        </span>
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 hover:bg-slate-50">
                                            <Avatar className="w-8 h-8 border-2 border-emerald-100">
                                                <AvatarImage src={profile?.avatar_url || ''} />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-600 text-sm font-medium">
                                                    {profile?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
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
                                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
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
                            className="text-slate-500"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100"
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
                                            ? "text-emerald-600 bg-emerald-50"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
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
                                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
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
                        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="p-4">
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search projects, organizations, events..."
                                            className="pl-12 h-12 text-base border-0 focus:ring-0"
                                            autoFocus
                                        />
                                    </form>
                                </div>
                                <div className="border-t border-slate-100 p-4">
                                    <p className="text-xs text-slate-500 mb-3">Quick Links</p>
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
                                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 text-xs text-slate-500">
                                    Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">ESC</kbd> to close
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
