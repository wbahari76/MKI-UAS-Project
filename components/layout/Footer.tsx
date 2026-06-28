"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
    const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        toast("Feature coming soon!");
    };

    const columns = [
        {
            title: "Quick links",
            links: [
                { label: "Explore Projects", href: "/explore" },
                { label: "Communities", href: "/communities" },
                { label: "Events", href: "/events" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact", soon: true },
            ],
        },
        {
            title: "Volunteer",
            links: [
                { label: "Sign Up as Volunteer", href: "/register" },
                { label: "Find Projects", href: "/explore" },
                { label: "Help Center & FAQ", href: "/help" },
                { label: "Volunteer Guide", href: "/volunteer-guide", soon: true },
            ],
        },
        {
            title: "Organization",
            links: [
                { label: "Create Organization", href: "/register" },
                { label: "Features", href: "/features", soon: true },
                { label: "Resources", href: "/resources", soon: true },
                { label: "Partnership", href: "/partnership" },
            ],
        },
    ];

    return (
        <footer className="bg-panel text-canvas">
            <div className="container-custom py-20">
                {/* Top: brand + CTA */}
                <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end">
                    <div className="max-w-xl">
                        <Link href="/" className="mb-6 flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded bg-bubblegum">
                                <Heart className="h-4 w-4 text-ink" fill="currentColor" />
                            </span>
                            <span className="text-[22px] font-black tracking-[-0.02em]">
                                JALA<span className="text-bubblegum">VIVE</span>
                            </span>
                        </Link>
                        <h2 className="mews-display text-3xl md:text-4xl text-balance">
                            Ready to make an impact?
                        </h2>
                    </div>
                    <Link href="/register" className="mews-cta shrink-0">
                        Get started for free
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Link columns */}
                <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
                    <p className="max-w-xs text-[15px] leading-relaxed text-mist">
                        Connected communities. Sustained lives. A platform for social impact and
                        volunteer collaboration across Indonesia.
                    </p>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.12em] text-fog">
                                {col.title}
                            </h3>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            onClick={link.soon ? handleComingSoon : undefined}
                                            className="text-[15px] text-mist transition-colors hover:text-bubblegum"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-[13px] text-fog">© 2024 JALA VIVE. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
                        <Link href="/guidelines" className="text-mist transition-colors hover:text-bubblegum">Community Guidelines</Link>
                        <Link href="/privacy" className="text-mist transition-colors hover:text-bubblegum">Privacy Policy</Link>
                        <Link href="/terms" className="text-mist transition-colors hover:text-bubblegum">Terms of Service</Link>
                        <Link href="/cookies" onClick={handleComingSoon} className="text-mist transition-colors hover:text-bubblegum">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
