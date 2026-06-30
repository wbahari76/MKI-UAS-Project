"use client";

import React, { useState, useEffect } from "react";
import {
  Search, MoreHorizontal, ShieldCheck, ShieldAlert,
  UserX, Building2, User, RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Volunteers from Profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'volunteer');

      // Fetch Organizations from Organizations
      const { data: organizations } = await supabase
        .from('organizations')
        .select('*');

      const combined: any[] = [];
      if (profiles) {
        profiles.forEach(p => {
          combined.push({
            id: p.id,
            user_id: p.user_id, // used for suspend
            name: p.full_name || 'Unnamed Volunteer',
            email: 'Private', // Email not stored in public.profiles
            role: 'Volunteer',
            status: p.is_active ? 'Active' : 'Suspended',
            joinDate: new Date(p.created_at).toISOString().split('T')[0]
          });
        });
      }
      if (organizations) {
        organizations.forEach(o => {
          combined.push({
            id: o.id,
            name: o.name,
            email: o.email || 'No Email',
            role: 'Organization',
            status: o.is_verified ? 'Verified' : 'Pending',
            joinDate: new Date(o.created_at).toISOString().split('T')[0]
          });
        });
      }

      setUsers(combined);
    };

    fetchData();

    const profilesSub = supabase.channel('admin-users-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchData();
      }).subscribe();

    const orgsSub = supabase.channel('admin-users-orgs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, () => {
        fetchData();
      }).subscribe();

    return () => {
      supabase.removeChannel(profilesSub);
      supabase.removeChannel(orgsSub);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'volunteer');

    const { data: organizations } = await supabase
      .from('organizations')
      .select('*');

    const combined: any[] = [];
    if (profiles) {
      profiles.forEach(p => {
        combined.push({
          id: p.id,
          user_id: p.user_id,
          name: p.full_name || 'Unnamed Volunteer',
          email: 'Private',
          role: 'Volunteer',
          status: p.is_active ? 'Active' : 'Suspended',
          joinDate: new Date(p.created_at).toISOString().split('T')[0]
        });
      });
    }
    if (organizations) {
      organizations.forEach(o => {
        combined.push({
          id: o.id,
          name: o.name,
          email: o.email || 'No Email',
          role: 'Organization',
          status: o.is_verified ? 'Verified' : 'Pending',
          joinDate: new Date(o.created_at).toISOString().split('T')[0]
        });
      });
    }

    setUsers(combined);

    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data synchronized successfully.");
    }, 500);
  };

  const handleVerify = async (id: string, role: string) => {
    if (role === 'Organization') {
      const { error } = await supabase
        .from('organizations')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) {
        toast.error("Failed to verify organization.");
      } else {
        toast.success("Organization verified successfully.");
      }
    }
  };

  const handleSuspend = async (user_id: string, role: string) => {
    if (role === 'Volunteer') {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', user_id);

      if (error) {
        toast.error("Failed to suspend user.");
      } else {
        toast.success("Account suspended.");
      }
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeTab === 'all' ||
      (activeTab === 'organizations' && u.role === 'Organization') ||
      (activeTab === 'volunteers' && u.role === 'Volunteer'))
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Manage Users</h1>
          <p className="text-forest-muted mt-1">View and manage volunteers and organizations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-forest-card border-forest-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-forest-border bg-forest-card hover:bg-[#21261B] text-forest-beige"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20 overflow-hidden">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-forest-border p-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-forest-muted bg-[#181A15] uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-forest-muted">
                        No users found.
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#181A15]/50 transition-colors bg-forest-card">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={user.role === 'Organization' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#2C3322] text-[#829661]'}>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-forest-beige">{user.name}</p>
                            <p className="text-xs text-forest-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          user.role === 'Organization'
                            ? 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                            : 'border-[#829661]/30 text-[#829661] bg-[#829661]/5'
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          user.status === 'Verified' || user.status === 'Active'
                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                            : user.status === 'Suspended'
                              ? 'border-red-500/30 text-red-500 bg-red-500/5'
                              : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                        }>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-forest-muted">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B]">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#181A15] border-forest-border">
                            {user.role === 'Organization' && user.status === 'Pending' && (
                              <DropdownMenuItem
                                className="text-emerald-500 hover:text-emerald-400 focus:text-emerald-400 focus:bg-[#21261B] cursor-pointer"
                                onSelect={() => handleVerify(user.id, user.role)}
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Verify Organization
                              </DropdownMenuItem>
                            )}
                            {user.role === 'Volunteer' && user.status === 'Active' && (
                              <DropdownMenuItem
                                className="text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#21261B] cursor-pointer"
                                onSelect={() => handleSuspend(user.user_id, user.role)}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Suspend Account
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-forest-beige focus:bg-[#21261B] focus:text-forest-beige cursor-pointer"
                              onSelect={() => setSelectedUser(user)}
                            >
                              View Full Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Tabs>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-forest-beige text-xl">User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={selectedUser.role === 'Organization' ? 'bg-blue-500/10 text-blue-400 text-2xl' : 'bg-[#2C3322] text-[#829661] text-2xl'}>
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-forest-beige">{selectedUser.name}</h3>
                  <Badge variant="outline" className={
                    selectedUser.role === 'Organization'
                      ? 'border-blue-500/30 text-blue-400 bg-blue-500/5 mt-1'
                      : 'border-[#829661]/30 text-[#829661] bg-[#829661]/5 mt-1'
                  }>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#1E211A]">
                <div>
                  <p className="text-sm font-medium text-forest-muted">Email Address</p>
                  <p className="text-forest-beige">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-forest-muted">Status</p>
                  <Badge variant="outline" className={`mt-1 ${
                    selectedUser.status === 'Verified' || selectedUser.status === 'Active'
                      ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                      : selectedUser.status === 'Suspended'
                        ? 'border-red-500/30 text-red-500 bg-red-500/5'
                        : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                  }`}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-forest-muted">Joined Date</p>
                  <p className="text-forest-beige">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-forest-muted">User ID</p>
                  <p className="text-xs text-forest-muted font-mono bg-[#1E211A] p-2 rounded-md mt-1 break-all">
                    {selectedUser.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
