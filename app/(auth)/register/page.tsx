"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, HandHelping, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'volunteer' | 'organization' | null;

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams?.get('role') as Role || null;

    const { signUp } = useAuth();
    const [step, setStep] = useState(initialRole ? 2 : 1);
    const [role, setRole] = useState<Role>(initialRole);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(formData.email, formData.password, {
            role: role || 'volunteer',
            full_name: formData.fullName
        });
        setIsLoading(false);

        if (error) {
            toast.error(error);
        } else {
            toast.success("Account created successfully!");
            setStep(3); // Success step
            setTimeout(() => {
                router.push(role === 'organization' ? '/organization/dashboard' : '/volunteer/dashboard');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-forest-beige mb-2">
                        <Sparkles className="w-6 h-6 text-forest-accent" />
                        JALA VIVE
                    </Link>
                    <p className="text-forest-muted">Join our collaborative ecosystem</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-0 shadow-xl shadow-emerald-900/5">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-center">Choose your role</CardTitle>
                                    <CardDescription className="text-center">
                                        How would you like to participate in JALA VIVE?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <button
                                        onClick={() => handleRoleSelect('volunteer')}
                                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${role === 'volunteer'
                                                ? 'border-forest-accent bg-[#21261B]'
                                                : 'border-forest-border hover:border-emerald-300 hover:bg-[#181A15]'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${role === 'volunteer' ? 'bg-forest-accent text-white' : 'bg-[#1E211A] text-forest-muted'}`}>
                                            <HandHelping className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-forest-beige">Volunteer</h3>
                                            <p className="text-sm text-forest-muted">I want to join projects and create impact</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleRoleSelect('organization')}
                                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${role === 'organization'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-forest-border hover:border-blue-300 hover:bg-[#181A15]'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${role === 'organization' ? 'bg-blue-500 text-white' : 'bg-[#1E211A] text-forest-muted'}`}>
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-forest-beige">Organization</h3>
                                            <p className="text-sm text-forest-muted">We want to create and manage projects</p>
                                        </div>
                                    </button>
                                </CardContent>
                                <CardFooter className="flex justify-center border-t border-forest-border pt-6">
                                    <p className="text-sm text-forest-muted">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-[#829661] hover:text-[#829661] font-medium">
                                            Sign In
                                        </Link>
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-0 shadow-xl shadow-emerald-900/5">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-[#7A8072] hover:text-forest-muted transition-colors"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <Badge variant="outline" className="capitalize">
                                            {role} Registration
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl">Create Account</CardTitle>
                                    <CardDescription>
                                        Fill in your details to get started.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">{role === 'organization' ? 'Organization Name' : 'Full Name'}</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder={role === 'organization' ? "e.g. Yayasan Peduli" : "John Doe"}
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="focus-ring"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="focus-ring"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                                className="focus-ring"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className="focus-ring"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className={`w-full h-12 text-base mt-2 ${role === 'organization' ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500' : 'btn-primary'}`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-20 h-20 bg-[#2C3322] text-forest-accent rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 className="w-10 h-10" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-forest-beige mb-2">Registration Complete!</h2>
                            <p className="text-forest-muted mb-6">
                                Redirecting you to your dashboard...
                            </p>
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest-accent" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
