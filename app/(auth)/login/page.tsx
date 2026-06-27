"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        const { error, role } = await signIn(formData.email, formData.password);
        setIsLoading(false);

        if (error) {
            toast.error(error);
        } else {
            toast.success("Successfully logged in!");
            if (role === 'organization') {
                router.push('/organization/dashboard');
            } else if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/volunteer/dashboard');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900 mb-2">
                        <Sparkles className="w-6 h-6 text-emerald-500" />
                        JALA VIVE
                    </Link>
                    <p className="text-slate-600">Welcome back to the community</p>
                </div>

                <Card className="border-0 shadow-xl shadow-emerald-900/5">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your email and password to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="focus-ring"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full btn-primary h-12 text-base mt-2" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
