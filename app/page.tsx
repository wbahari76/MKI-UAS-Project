"use client";

export const dynamic = 'force-dynamic';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
    HandHelping, Users, Building2, FolderKanban, Clock,
    ChevronRight, MapPin, Calendar,
    Award, MessageCircle, ArrowRight, Sparkles,
    Globe, TreeDeciduous, GraduationCap, Stethoscope, PawPrint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from "@/components/layout/Footer";

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

// Section Components
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center bg-forest overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#1B1E16] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '500ms' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#22261C] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>

            <div className="container-custom relative z-10 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-6 bg-[#2C3322] text-[#829661] border-[#4A5D23]">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Social Impact Platform
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-beige mb-6 leading-tight">
                            Connected Communities.
                            <br />
                            <span className="text-gradient">Sustained Lives.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-forest-muted mb-10 max-w-2xl mx-auto">
                            JALA VIVE bridges organizations with volunteers in one collaborative ecosystem.
                            Create impact, join causes, and transform communities together.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register?role=volunteer">
                            <Button size="lg" className="bg-forest-accent hover:bg-[#4A5D23] text-white shadow-lg shadow-emerald-500/25 h-14 px-8 text-base rounded-xl group">
                                <HandHelping className="w-5 h-5 mr-2" />
                                Become a Volunteer
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/register?role=organization">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-2 border-forest-border hover:border-forest-accent hover:text-[#829661]">
                                <Building2 className="w-5 h-5 mr-2" />
                                Create a Project
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-forest-border flex items-start justify-center p-1.5">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-forest-muted rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}

function StatsSection() {
    const stats = [
        { label: 'Volunteers', value: 12547, icon: Users, color: 'emerald' },
        { label: 'Organizations', value: 892, icon: Building2, color: 'blue' },
        { label: 'Projects', value: 2341, icon: FolderKanban, color: 'amber' },
        { label: 'Hours Contributed', value: 156789, suffix: '+', icon: Clock, color: 'purple' },
    ];

    return (
        <section className="py-16 md:py-20 bg-forest-card border-y border-forest-border">
            <div className="container-custom">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-[#181A15] border border-forest-border"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center",
                                    stat.color === 'emerald' && "bg-[#2C3322]",
                                    stat.color === 'blue' && "bg-blue-100",
                                    stat.color === 'amber' && "bg-amber-100",
                                    stat.color === 'purple' && "bg-purple-100"
                                )}>
                                    <Icon className={cn(
                                        "w-6 h-6",
                                        stat.color === 'emerald' && "text-[#829661]",
                                        stat.color === 'blue' && "text-blue-600",
                                        stat.color === 'amber' && "text-amber-600",
                                        stat.color === 'purple' && "text-purple-600"
                                    )} />
                                </div>
                                <p className="text-3xl md:text-4xl font-bold text-forest-beige mb-1">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </p>
                                <p className="text-sm text-forest-muted">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
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
        <section className="py-16 md:py-24 bg-[#181A15]">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <Badge className="mb-4 bg-[#2C3322] text-[#829661]">Featured Projects</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-beige mb-4">
                        Make an Impact Today
                    </h2>
                    <p className="text-forest-muted">
                        Discover meaningful volunteer opportunities and start your journey to create lasting change.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="group bg-forest-card rounded-2xl overflow-hidden border border-forest-border shadow-sm hover:shadow-xl hover:shadow-forest-accent/10 transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <Badge className="absolute top-3 left-3 bg-forest-accent text-white">
                                    {project.category}
                                </Badge>
                            </div>

                            <div className="p-5">
                                <p className="text-sm text-forest-muted mb-1">{project.organization}</p>
                                <h3 className="font-semibold text-forest-beige mb-3 line-clamp-2 group-hover:text-[#829661] transition-colors">
                                    {project.title}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-forest-muted mb-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {project.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-forest-muted">Volunteers</span>
                                        <span className="font-medium text-forest-beige">
                                            {project.volunteers.current}/{project.volunteers.needed}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[#1E211A] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(project.volunteers.current / project.volunteers.needed) * 100}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                            className="h-full bg-forest-accent rounded-full"
                                        />
                                    </div>
                                </div>

                                <Link href={`/explore/${project.id}`}>
                                    <Button className="w-full bg-forest-accent hover:bg-[#4A5D23] group/btn">
                                        View Details
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/explore">
                        <Button variant="outline" size="lg" className="rounded-xl">
                            View All Projects
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CategoriesSection() {
    const categories = [
        { name: 'Education', icon: GraduationCap, count: 234, color: 'blue' },
        { name: 'Environment', icon: TreeDeciduous, count: 189, color: 'emerald' },
        { name: 'Health', icon: Stethoscope, count: 156, color: 'red' },
        { name: 'Animal', icon: PawPrint, count: 78, color: 'amber' },
        { name: 'Technology', icon: Globe, count: 123, color: 'purple' },
        { name: 'Community', icon: Users, count: 245, color: 'indigo' },
    ];

    return (
        <section className="py-16 md:py-24 bg-forest-card">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-beige mb-4">
                        Explore by Category
                    </h2>
                    <p className="text-forest-muted">
                        Find volunteer opportunities that match your passion and skills.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/explore?category=${category.name.toLowerCase()}`}>
                                    <Card className="group cursor-pointer border-forest-border hover:border-[#4A5D23] hover:shadow-lg transition-all duration-200">
                                        <CardContent className="p-6 text-center">
                                            <div className={cn(
                                                "w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors",
                                                category.color === 'blue' && "bg-blue-100 text-blue-600",
                                                category.color === 'emerald' && "bg-[#2C3322] text-[#829661]",
                                                category.color === 'red' && "bg-red-100 text-red-600",
                                                category.color === 'amber' && "bg-amber-100 text-amber-600",
                                                category.color === 'purple' && "bg-purple-100 text-purple-600",
                                                category.color === 'indigo' && "bg-indigo-100 text-indigo-600"
                                            )}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="font-semibold text-forest-beige mb-1 group-hover:text-[#829661] transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-forest-muted">{category.count} projects</p>
                                        </CardContent>
                                    </Card>
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
        {
            step: 1,
            title: 'Sign Up',
            description: 'Create your free account as a volunteer or organization',
            icon: Users,
        },
        {
            step: 2,
            title: 'Discover',
            description: 'Explore projects, events, and communities that match your interests',
            icon: Globe,
        },
        {
            step: 3,
            title: 'Connect',
            description: 'Apply to projects or recruit volunteers for your causes',
            icon: MessageCircle,
        },
        {
            step: 4,
            title: 'Impact',
            description: 'Make a difference and earn certificates and achievements',
            icon: Award,
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-[#181A15]">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-700">How It Works</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-beige mb-4">
                        Your Journey Starts Here
                    </h2>
                    <p className="text-forest-muted">
                        Get started in minutes and begin making an impact today.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <Card className="border-forest-border bg-forest-card">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-[#2C3322] text-[#829661] flex items-center justify-center mx-auto mb-4">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-forest-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-forest-accent/25">
                                                {step.step}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-forest-beige text-lg mb-2">{step.title}</h3>
                                        <p className="text-forest-muted text-sm">{step.description}</p>
                                    </CardContent>
                                </Card>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-forest-border">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                )}
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
        <section className="py-16 md:py-24 bg-forest-card">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-beige mb-4">
                        Stories from Our Community
                    </h2>
                    <p className="text-forest-muted">
                        Hear from volunteers and organizations who are making a difference.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-forest-border h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-forest-border"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-forest-beige">{testimonial.name}</h4>
                                            <p className="text-sm text-forest-muted">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-amber-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-forest-muted leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                                </CardContent>
                            </Card>
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
        <section className="py-16 md:py-24 bg-[#181A15]">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <Badge className="mb-4 bg-amber-100 text-amber-700">FAQ</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-beige mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-forest-muted">
                        Everything you need to know about JALA VIVE.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <AccordionItem
                                    value={`item-${index}`}
                                    className="bg-forest-card rounded-2xl border border-forest-border px-6"
                                >
                                    <AccordionTrigger className="text-left font-semibold text-forest-beige hover:text-[#829661] hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-forest-muted pb-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="py-16 md:py-24 bg-forest-card border-y border-forest-border">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Make an Impact?
                    </h2>
                    <p className="text-forest-muted text-lg mb-8">
                        Join thousands of volunteers and organizations creating positive change in communities across Indonesia.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="bg-forest-card text-[#829661] hover:bg-[#21261B] h-14 px-8 text-base rounded-xl shadow-lg">
                                Get Started for Free
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/explore">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-2 border-white text-white hover:bg-forest-card/10">
                                Browse Projects
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}



export default function HomePage() {
    return (
        <main className="min-h-screen">
            <PublicNavbar />
            <div className="pt-16 md:pt-20">
                <HeroSection />
                <StatsSection />
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
