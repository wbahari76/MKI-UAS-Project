"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<{ error: string | null; role?: string | null }>;
    signUp: (email: string, password: string, metadata?: { role?: string; full_name?: string }) => Promise<{ error: string | null; session?: any | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    };

    const refreshProfile = async () => {
        if (user?.id) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
        }
    };

    useEffect(() => {
        const getInitialSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    const profileData = await fetchProfile(initialSession.user.id);
                    setProfile(profileData);
                }
            } catch (err) {
                console.error('Error getting session:', err);
                setError('Failed to get session');
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === 'SIGNED_IN' && newSession?.user) {
                (async () => {
                    let profileData = await fetchProfile(newSession.user.id);
                    if (!profileData) {
                        const role = newSession.user.user_metadata?.role || 'volunteer';
                        const fullName = newSession.user.user_metadata?.full_name || '';
                        
                        const { data: newProfile, error: insertError } = await supabase
                            .from('profiles')
                            .insert({
                                user_id: newSession.user.id,
                                role,
                                full_name: fullName,
                                is_verified: false,
                            })
                            .select()
                            .single();
                        
                        if (insertError) {
                            console.error('Error creating profile on login/sign-in:', insertError);
                            profileData = {
                                id: newSession.user.id,
                                user_id: newSession.user.id,
                                role,
                                full_name: fullName,
                                is_verified: false,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            } as any;
                        } else {
                            profileData = newProfile;
                        }
                    }
                    setProfile(profileData);
                })();
            } else if (event === 'SIGNED_OUT') {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                return { error: signInError.message, role: null };
            }

            const user = data?.user;
            let role = user?.user_metadata?.role || 'volunteer';
            
            if (user) {
                const profileData = await fetchProfile(user.id);
                if (profileData) {
                    role = profileData.role;
                } else {
                    const fullName = user.user_metadata?.full_name || '';
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            user_id: user.id,
                            role,
                            full_name: fullName,
                            is_verified: false,
                        })
                        .select()
                        .single();
                    if (!insertError && newProfile) {
                        role = newProfile.role;
                    }
                }
            }

            return { error: null, role };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            return { error: message, role: null };
        }
    };

    const signUp = async (
        email: string,
        password: string,
        metadata?: { role?: string; full_name?: string }
    ) => {
        try {
            setError(null);
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: metadata?.role || 'volunteer',
                        full_name: metadata?.full_name,
                    },
                },
            });

            if (signUpError) {
                return { error: signUpError.message, session: null };
            }

            return { error: null, session: data.session };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            return { error: message, session: null };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setSession(null);
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user?.id) return { error: 'Not logged in' };
        
        // Optimistic update for UI speed
        const role = user.user_metadata?.role || 'volunteer';
        setProfile(prev => prev ? { ...prev, ...updates } as Profile : { id: user.id, user_id: user.id, role, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...updates } as Profile);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({ user_id: user.id, ...updates }, { onConflict: 'user_id' });
                
            if (error) {
                // Revert on error
                await refreshProfile();
                return { error: error.message };
            }
            
            await refreshProfile();
            return { error: null };
        } catch (err) {
            await refreshProfile();
            const message = err instanceof Error ? err.message : 'An error occurred';
            return { error: message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                session,
                loading,
                error,
                signIn,
                signUp,
                signOut,
                refreshProfile,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
