"use client";

export const dynamic = 'force-dynamic';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users, Building2, FolderKanban, Clock,
    MapPin, Calendar, Activity,
    Award, MessageCircle, ArrowRight, ArrowUpRight, Heart,
    Globe, TreeDeciduous, GraduationCap, Stethoscope, PawPrint, Plus
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from "@/components/layout/Footer";
import { supabase } from '@/lib/supabase/client';

// pastel accent cycle used for icon tiles + category cards
const PASTELS = ['bg-blush', 'bg-ice', 'bg-lime', 'bg-cotton', 'bg-blush', 'bg-ice'];

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function HeroSection() {
    const floatingPills = [
        { label: 'Volunteers', className: 'left-4 top-6 bg-canvas' },
        { label: 'Projects', className: 'right-5 top-1/3 bg-cotton' },
        { label: 'Communities', className: 'left-6 bottom-10 bg-ice' },
    ];

    return (
        <section className="bg-canvas pt-12 pb-16 md:pt-16 md:pb-20">
            <div className="container-custom">
                <div className="grid items-stretch gap-6 lg:grid-cols-12">
                    {/* Dark text panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-between rounded bg-panel p-8 md:p-12 lg:col-span-6"
                    >
                        <div>
                            <span className="mews-eyebrow text-mist">
                                <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                                Social impact platform
                            </span>
                            <h1 className="mews-display mt-6 text-[44px] text-canvas sm:text-[56px] lg:text-[68px]">
                                Connected
                                <br />
                                communities.
                                <br />
                                <span className="text-bubblegum">Sustained lives.</span>
                            </h1>
                            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mist">
                                JALA VIVE bridges organizations with volunteers in one collaborative
                                ecosystem. Create impact, join causes, and transform communities together.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link href="/register?role=volunteer" className="mews-cta">
                                Become a volunteer
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/register?role=organization"
                                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-[14px] font-semibold text-canvas transition-colors hover:bg-white/10"
                            >
                                <Building2 className="h-4 w-4" />
                                Create a project
                            </Link>
                        </div>
                    </motion.div>

                    {/* Scenic image plate */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="group relative min-h-[340px] overflow-hidden rounded lg:col-span-6"
                    >
                        <img
                            src="/images/forest-hero.jpeg"
                            alt="Sunlit forest valley representing community and environmental impact"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                        {floatingPills.map((pill, i) => (
                            <motion.span
                                key={pill.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.15 }}
                                className={cn(
                                    "absolute inline-flex items-center rounded-full border border-lilac px-3.5 py-1.5 text-[13px] font-semibold text-ink shadow-sm",
                                    pill.className
                                )}
                            >
                                {pill.label}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ImpactKPISection() {
    const [metrics, setMetrics] = useState({
        volunteers: 0,
        organizations: 0,
        projects: 0,
        hours: 0,
        lives: 0,
        successRate: 100
    });

    const [realActivities, setRealActivities] = useState<string[]>(["Loading live activity..."]);
    const [activeFeedIndex, setActiveFeedIndex] = useState(0);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { data: profiles } = await supabase.from('profiles').select('role, volunteer_hours');
                let vols = 0;
                let orgs = 0;
                let totalHours = 0;

                if (profiles) {
                    profiles.forEach(p => {
                        if (p.role === 'volunteer') vols++;
                        if (p.role === 'organization') orgs++;
                        if (p.volunteer_hours) totalHours += p.volunteer_hours;
                    });
                }

                const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });

                setMetrics({
                    volunteers: vols,
                    organizations: orgs,
                    projects: projectsCount || 0,
                    hours: totalHours,
                    lives: totalHours > 0 ? totalHours * 10 : 0,
                    successRate: 100
                });

                const { data: recentProfiles } = await supabase
                    .from('profiles')
                    .select('full_name, role, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5);

                const { data: recentProjects } = await supabase
                    .from('projects')
                    .select('title, category, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5);

                let combined: any[] = [];
                if (recentProfiles) {
                    recentProfiles.forEach(p => {
                        combined.push({
                            time: new Date(p.created_at).getTime(),
                            text: `${p.full_name || 'A new user'} joined as a ${p.role}`
                        });
                    });
                }
                if (recentProjects) {
                    recentProjects.forEach(p => {
                        combined.push({
                            time: new Date(p.created_at).getTime(),
                            text: `New ${p.category} project published: '${p.title}'`
                        });
                    });
                }

                if (combined.length > 0) {
                    combined.sort((a, b) => b.time - a.time);
                    setRealActivities(combined.map(c => c.text));
                } else {
                    setRealActivities(["JALA VIVE platform is live!"]);
                }
            } catch (e) {
                console.error("Failed to fetch real-time metrics", e);
            }
        }
        fetchMetrics();
    }, []);

    const kpis: Array<{ label: string; value: number; suffix: string; icon: any }> = [
        { label: 'Active Volunteers', value: metrics.volunteers, suffix: '', icon: Users },
        { label: 'Verified Organizations', value: metrics.organizations, suffix: '', icon: Building2 },
        { label: 'Platform Projects', value: metrics.projects, suffix: '', icon: FolderKanban },
        { label: 'Volunteer Hours', value: metrics.hours, suffix: '', icon: Clock },
        { label: 'Lives Impacted', value: metrics.lives, suffix: '+', icon: Heart },
        { label: 'Project Success Rate', value: metrics.successRate, suffix: '%', icon: Award },
    ];

    useEffect(() => {
        if (realActivities.length === 0) return;
        const interval = setInterval(() => {
            setActiveFeedIndex((prev) => (prev + 1) % realActivities.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [realActivities.length]);

    return (
        <section className="bg-canvas py-20">
            <div className="container-custom">
                <div className="mb-12 max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="mews-eyebrow">
                            <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                            Live metrics
                        </span>
                        <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                            Our collective impact
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-charcoal">
                            Every connection creates measurable social change, updated in real time.
                        </p>
                    </motion.div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* KPI grid */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:col-span-8">
                        {kpis.map((kpi, index) => {
                            const Icon = kpi.icon;
                            return (
                                <motion.div
                                    key={kpi.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.06 }}
                                    whileHover={{ y: -4 }}
                                    className="mews-card flex flex-col justify-between p-6"
                                >
                                    <span className={cn("mb-8 flex h-10 w-10 items-center justify-center rounded", PASTELS[index % PASTELS.length])}>
                                        <Icon className="h-5 w-5 text-ink" />
                                    </span>
                                    <div>
                                        <p className="mews-display text-3xl text-ink md:text-4xl">
                                            <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
                                        </p>
                                        <p className="mt-1 text-[14px] font-medium text-charcoal">{kpi.label}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Live activity feed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col rounded bg-panel p-8 lg:col-span-4"
                    >
                        <div className="mb-8 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bubblegum opacity-75" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-bubblegum" />
                            </span>
                            <h3 className="text-[18px] font-bold text-canvas">Live activity</h3>
                        </div>
                        <div className="relative min-h-[200px] flex-1 overflow-hidden">
                            <div className="absolute inset-0 flex flex-col justify-center">
                                {realActivities.map((activity, index) => {
                                    const isActive = index === activeFeedIndex;
                                    const isPrev = index === (activeFeedIndex - 1 + realActivities.length) % realActivities.length;
                                    const isNext = index === (activeFeedIndex + 1) % realActivities.length;

                                    let yOffset = 100;
                                    let opacity = 0;
                                    let scale = 0.9;

                                    if (isActive) { yOffset = 0; opacity = 1; scale = 1; }
                                    else if (isPrev) { yOffset = -44; opacity = 0.3; scale = 0.95; }
                                    else if (isNext) { yOffset = 44; opacity = 0.3; scale = 0.95; }

                                    return (
                                        <motion.div
                                            key={index}
                                            className="absolute left-0 right-0 flex w-full items-center gap-4 rounded bg-white/5 p-4"
                                            animate={{ y: yOffset, opacity, scale, zIndex: isActive ? 10 : 5 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bubblegum">
                                                <Activity className="h-4 w-4 text-ink" />
                                            </span>
                                            <p className="line-clamp-2 text-[14px] font-medium text-mist">{activity}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12"
                >
                    <Link href="/impact" className="mews-ghost">
                        View full impact report
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function FeaturedProjectsSection() {
    const projects = [
        {
            id: '1',
            title: 'Clean Water Initiative for Rural Communities',
            organization: 'Water for All Foundation',
            category: 'Environment',
            location: 'East Nusa Tenggara',
            deadline: '2024-02-15',
            volunteers: { current: 24, needed: 50 },
            image: 'https://images.pexels.com/photos/2962362/pexels-photo-2962362.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            id: '2',
            title: 'Digital Literacy Program for Youth',
            organization: 'Tech Edu Initiative',
            category: 'Education',
            location: 'Jakarta',
            deadline: '2024-03-01',
            volunteers: { current: 15, needed: 30 },
            image: 'https://images.pexels.com/photos/5212349/pexels-photo-5212349.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            id: '3',
            title: 'Community Health Camp',
            organization: 'Healing Hands',
            category: 'Health',
            location: 'Surabaya',
            deadline: '2024-02-20',
            volunteers: { current: 8, needed: 20 },
            image: 'https://images.pexels.com/photos/6646901/pexels-photo-6646901.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
    ];

    return (
        <section className="bg-cream py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
                >
                    <div className="max-w-xl">
                        <span className="mews-eyebrow">
                            <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                            Featured projects
                        </span>
                        <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                            Make an impact today
                        </h2>
                    </div>
                    <Link href="/explore" className="mews-arrow-link">
                        View all projects <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="group flex flex-col overflow-hidden rounded border border-lilac bg-canvas"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-canvas px-3 py-1 text-[12px] font-semibold text-ink">
                                    {project.category}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <p className="mb-1 text-[13px] text-fog">{project.organization}</p>
                                <h3 className="mb-3 line-clamp-2 text-[18px] font-bold leading-snug text-ink">
                                    {project.title}
                                </h3>

                                <div className="mb-4 flex items-center gap-4 text-[13px] text-charcoal">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-fog" />
                                        {project.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-fog" />
                                        {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div className="mb-5 mt-auto">
                                    <div className="mb-1.5 flex items-center justify-between text-[13px]">
                                        <span className="text-charcoal">Volunteers</span>
                                        <span className="font-semibold text-ink">
                                            {project.volunteers.current}/{project.volunteers.needed}
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-blush/60">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(project.volunteers.current / project.volunteers.needed) * 100}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                            className="h-full rounded-full bg-bubblegum"
                                        />
                                    </div>
                                </div>

                                <Link href={`/explore/${project.id}`} className="mews-arrow-link text-bubblegum">
                                    View details <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoriesSection() {
    const defaultCategories = [
        { name: 'Education', icon: GraduationCap, count: 0 },
        { name: 'Environment', icon: TreeDeciduous, count: 0 },
        { name: 'Health', icon: Stethoscope, count: 0 },
        { name: 'Animal', icon: PawPrint, count: 0 },
        { name: 'Technology', icon: Globe, count: 0 },
        { name: 'Community', icon: Users, count: 0 },
    ];

    const [categories, setCategories] = useState(defaultCategories);

    useEffect(() => {
        async function fetchCategoryCounts() {
            try {
                const { data, error } = await supabase.from('projects').select('category');
                if (error) throw error;

                if (data) {
                    const counts: Record<string, number> = {};
                    data.forEach(p => {
                        counts[p.category] = (counts[p.category] || 0) + 1;
                    });

                    setCategories(prev => prev.map(c => ({
                        ...c,
                        count: counts[c.name] || 0
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch category counts", err);
            }
        }
        fetchCategoryCounts();
    }, []);

    return (
        <section className="bg-canvas py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-2xl"
                >
                    <span className="mews-eyebrow">
                        <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                        Causes
                    </span>
                    <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                        Explore by category
                    </h2>
                    <p className="mt-4 text-[16px] leading-relaxed text-charcoal">
                        Find volunteer opportunities that match your passion and skills.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link
                                    href={`/explore?category=${category.name.toLowerCase()}`}
                                    className={cn(
                                        "group flex h-full flex-col justify-between rounded border border-lilac p-5 transition-colors",
                                        PASTELS[index % PASTELS.length]
                                    )}
                                >
                                    <span className="mb-8 flex h-11 w-11 items-center justify-center rounded bg-canvas">
                                        <Icon className="h-6 w-6 text-ink" />
                                    </span>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-ink">{category.name}</h3>
                                        <p className="mt-0.5 flex items-center gap-1 text-[13px] text-charcoal">
                                            {category.count} projects
                                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function HowItWorksSection() {
    const steps = [
        { step: 1, title: 'Sign up', description: 'Create your free account as a volunteer or organization.', icon: Users },
        { step: 2, title: 'Discover', description: 'Explore projects, events, and communities that match your interests.', icon: Globe },
        { step: 3, title: 'Connect', description: 'Apply to projects or recruit volunteers for your causes.', icon: MessageCircle },
        { step: 4, title: 'Impact', description: 'Make a difference and earn certificates and achievements.', icon: Award },
    ];

    return (
        <section className="bg-cream py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-2xl"
                >
                    <span className="mews-eyebrow">
                        <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                        How it works
                    </span>
                    <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                        Your journey starts here
                    </h2>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="mews-card flex flex-col bg-canvas p-6"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-[13px] font-bold tracking-[0.06em] text-fog">
                                        0{step.step}
                                    </span>
                                    <span className="flex h-10 w-10 items-center justify-center rounded bg-blush">
                                        <Icon className="h-5 w-5 text-ink" />
                                    </span>
                                </div>
                                <h3 className="mb-2 text-[18px] font-bold text-ink">{step.title}</h3>
                                <p className="text-[14px] leading-relaxed text-charcoal">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Volunteer since 2023',
            content: 'JALA VIVE helped me find meaningful volunteer opportunities that aligned with my passion for education. The platform made it easy to connect with organizations and track my impact.',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        {
            name: 'Ahmad Rizki',
            role: 'Organization Leader',
            content: 'As an NGO, finding committed volunteers was always a challenge. JALA VIVE streamlined our recruitment process and helped us build a reliable volunteer network.',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        {
            name: 'Maya Putri',
            role: 'Impact Hero - 50+ Projects',
            content: 'The certificate and achievement system motivated me to contribute more. I never thought volunteering could be so rewarding and organized!',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
    ];

    return (
        <section className="bg-canvas py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-2xl"
                >
                    <span className="mews-eyebrow">
                        <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                        Community
                    </span>
                    <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                        Stories from our community
                    </h2>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="mews-card flex h-full flex-col p-6"
                        >
                            <div className="mb-4 flex gap-0.5 text-bubblegum">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-lg leading-none">★</span>
                                ))}
                            </div>
                            <p className="mb-6 flex-1 text-[15px] leading-relaxed text-charcoal">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 border-t border-lilac pt-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-11 w-11 rounded object-cover"
                                />
                                <div>
                                    <h4 className="text-[15px] font-bold text-ink">{testimonial.name}</h4>
                                    <p className="text-[13px] text-fog">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const faqs = [
        {
            question: 'How do I sign up as a volunteer?',
            answer: 'Click the "Become a Volunteer" button, create your account with email, complete your profile with skills and interests, and start exploring projects that match your passion.',
        },
        {
            question: 'Is JALA VIVE free to use?',
            answer: 'Yes, JALA VIVE is completely free for volunteers and organizations. There are no hidden fees or premium tiers. Our mission is to make volunteering accessible to everyone.',
        },
        {
            question: 'How do I know if an organization is legitimate?',
            answer: 'All organizations undergo verification. Look for the "Verified" badge on organization profiles. You can also check their past projects and volunteer reviews.',
        },
        {
            question: 'Can I volunteer remotely?',
            answer: 'Absolutely! Many projects offer remote volunteering opportunities. Use the location filter to find "Remote" projects or search for virtual volunteer positions.',
        },
        {
            question: 'How do certificates work?',
            answer: 'Upon completing a project, you receive a digital certificate with a unique verification code. Certificates include project details, hours contributed, and can be shared on LinkedIn.',
        },
        {
            question: 'What if I need to cancel my participation?',
            answer: 'You can cancel your application before it\'s approved. Once approved, please communicate directly with the organization. Early communication helps maintain good relationships.',
        },
    ];

    return (
        <section className="bg-cream py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-2xl"
                >
                    <span className="mews-eyebrow">
                        <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
                        FAQ
                    </span>
                    <h2 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
                        Frequently asked questions
                    </h2>
                </motion.div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="border-t border-mist">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-mist"
                            >
                                <AccordionTrigger className="group py-5 text-left text-[17px] font-semibold text-ink hover:no-underline [&>svg]:hidden">
                                    {faq.question}
                                    <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cotton transition-transform duration-200 group-data-[state=open]:rotate-45">
                                        <Plus className="h-4 w-4 text-ink" />
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-[16px] leading-relaxed text-charcoal">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="bg-canvas pb-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded bg-bubblegum px-6 py-16 text-center md:py-20"
                >
                    <h2 className="mews-display mx-auto max-w-3xl text-4xl text-ink md:text-5xl text-balance">
                        Ready to make an impact?
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-ink/80">
                        Join thousands of volunteers and organizations creating positive change in
                        communities across Indonesia.
                    </p>
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[14px] font-bold text-canvas transition-transform hover:-translate-y-0.5"
                        >
                            Get started for free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/explore"
                            className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-canvas"
                        >
                            Browse projects
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function HomePage() {
    return (
        <main className="mews-page min-h-screen">
            <PublicNavbar />
            <div className="pt-[104px]">
                <HeroSection />
                <ImpactKPISection />
                <FeaturedProjectsSection />
                <CategoriesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <FAQSection />
                <CTASection />
                <Footer />
            </div>
        </main>
    );
}
