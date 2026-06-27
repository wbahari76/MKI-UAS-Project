"use client";

import React from "react";
import Link from "next/link";
import { HandHelping } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
    const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        toast("Feature coming soon! 🚀");
    };

    return (
        <footer className="bg-forest text-white py-16">
            <div className="container-custom">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-10 h-10 bg-forest-accent rounded-xl flex items-center justify-center">
                                <HandHelping className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">
                                JALA<span className="text-emerald-400">VIVE</span>
                            </span>
                        </Link>
                        <p className="text-[#7A8072] text-sm mb-4">
                            Connected Communities. Sustained Lives. A platform for social impact and volunteer collaboration.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="ghost" size="icon" className="rounded-full text-[#7A8072] hover:text-white hover:bg-forest-card">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-[#7A8072] hover:text-white hover:bg-forest-card">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-[#7A8072] hover:text-white hover:bg-forest-card">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.02c.24-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" /></svg>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/explore" className="text-[#7A8072] hover:text-white transition-colors">Explore Projects</Link></li>
                            <li><Link href="/communities" className="text-[#7A8072] hover:text-white transition-colors">Communities</Link></li>
                            <li><Link href="/events" className="text-[#7A8072] hover:text-white transition-colors">Events</Link></li>
                            <li><Link href="/about" className="text-[#7A8072] hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Volunteer */}
                    <div>
                        <h4 className="font-semibold mb-4">Volunteer</h4>
                        <ul className="space-y-2">
                            <li><Link href="/register" className="text-[#7A8072] hover:text-white transition-colors">Sign Up as Volunteer</Link></li>
                            <li><Link href="/explore" className="text-[#7A8072] hover:text-white transition-colors">Find Projects</Link></li>
                            <li><Link href="/faq" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/volunteer-guide" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">Volunteer Guide</Link></li>
                        </ul>
                    </div>

                    {/* Organization */}
                    <div>
                        <h4 className="font-semibold mb-4">Organization</h4>
                        <ul className="space-y-2">
                            <li><Link href="/register" className="text-[#7A8072] hover:text-white transition-colors">Create Organization</Link></li>
                            <li><Link href="/features" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/resources" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">Resources</Link></li>
                            <li><Link href="/partnership" onClick={handleComingSoon} className="text-[#7A8072] hover:text-white transition-colors">Partnership</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-[#38402D] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-forest-muted text-sm">
                        © 2024 JALA VIVE. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/privacy" onClick={handleComingSoon} className="text-forest-muted hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" onClick={handleComingSoon} className="text-forest-muted hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" onClick={handleComingSoon} className="text-forest-muted hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
