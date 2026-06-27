"use client";

import React, { useState } from "react";
import { 
  Search, MoreHorizontal, ShieldCheck, ShieldAlert, 
  UserX, Building2, User 
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const MOCK_USERS = [
  { id: 1, name: "Budi Santoso", email: "budi@example.com", role: "Volunteer", status: "Active", joinDate: "2026-01-15" },
  { id: 2, name: "Ocean Care ID", email: "contact@oceancare.id", role: "Organization", status: "Verified", joinDate: "2026-02-20" },
  { id: 3, name: "Tech for All", email: "hello@techforall.org", role: "Organization", status: "Pending", joinDate: "2026-06-10" },
  { id: 4, name: "Siti Aminah", email: "siti@example.com", role: "Volunteer", status: "Suspended", joinDate: "2025-11-05" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleVerify = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Verified" } : u));
    toast.success("Organization verified successfully.");
  };

  const handleSuspend = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Suspended" } : u));
    toast.error("Account suspended.");
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Users</h1>
          <p className="text-slate-500 mt-1">View and manage volunteers and organizations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200 overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-slate-100 p-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={user.role === 'Organization' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          {user.role === 'Organization' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${user.status === 'Active' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}
                          ${user.status === 'Verified' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                          ${user.status === 'Pending' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''}
                          ${user.status === 'Suspended' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                        `}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {user.role === 'Organization' && user.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleVerify(user.id)} className="text-blue-600">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Verify Org
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {user.status !== 'Suspended' ? (
                              <DropdownMenuItem onClick={() => handleSuspend(user.id)} className="text-red-600">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleVerify(user.id)} className="text-emerald-600">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Reactivate
                              </DropdownMenuItem>
                            )}
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
    </div>
  );
}
