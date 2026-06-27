"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { 
  MessageSquare, Heart, Share2, Image as ImageIcon, Send, 
  MoreHorizontal, Flag, MessageCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock Data
const INITIAL_POSTS = [
  {
    id: 1,
    author: { name: "Ocean Care ID", role: "Organization", avatar: "https://i.pravatar.cc/150?u=1", isVerified: true },
    content: "We just wrapped up an amazing Coastal Cleanup in Bali! Over 500kg of plastic waste was collected by our incredible volunteers. Thank you to everyone who participated! 🌊♻️ #JalaVive #OceanCare",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=1200&q=80",
    likes: 128,
    comments: 14,
    time: "2 hours ago",
    isLiked: false,
  },
  {
    id: 2,
    author: { name: "Budi Santoso", role: "Volunteer", avatar: "https://i.pravatar.cc/150?u=2", isVerified: false },
    content: "Had a great time teaching digital literacy to seniors today. It's so rewarding to see them connect with their grandchildren over video calls for the first time! ❤️📱",
    likes: 45,
    comments: 3,
    time: "5 hours ago",
    isLiked: true,
  }
];

export default function CommunityPage() {
  const { user, profile } = useAuth();
  const { socket } = useSocket();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<number, string>>({});
  const [isPosting, setIsPosting] = useState(false);

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    if (!socket) return;
    
    socket.on("new-post", (post: any) => {
      setPosts((prev) => [post, ...prev]);
    });
    
    socket.on("like-post", (data: any) => {
      setPosts((current) => current.map(post => 
        post.id === data.id ? { ...post, likes: data.likes } : post
      ));
    });
    
    return () => {
      socket.off("new-post");
      socket.off("like-post");
    };
  }, [socket]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    // Simulate API call
    setTimeout(() => {
      const post = {
        id: Date.now(),
        author: { name: userName, role: "Volunteer", avatar: "", isVerified: false },
        content: newPost,
        likes: 0,
        comments: 0,
        time: "Just now",
        isLiked: false,
      };
      setPosts([post, ...posts]);
      socket?.emit("new-post", post);
      setNewPost("");
      setIsPosting(false);
      toast.success("Post created successfully!");
    }, 1000);
  };

  const handleLike = (id: number) => {
    setPosts(current => current.map(post => {
      if (post.id === id) {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
        socket?.emit("like-post", { id, likes: newLikes });
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newLikes
        };
      }
      return post;
    }));
  };

  const toggleComments = (id: number) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    const text = commentInput[postId];
    if (!text?.trim()) return;

    // Increment comment count locally for mock
    setPosts(current => current.map(post => 
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
    setCommentInput(prev => ({ ...prev, [postId]: "" }));
    toast.success("Comment added!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
          Community
        </h1>
        <p className="text-forest-muted mt-1">
          Share your impact, connect with others, and get inspired.
        </p>
      </div>

      {/* Create Post */}
      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handlePost}>
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 border border-forest-border">
                <AvatarFallback className="bg-[#2C3322] text-[#829661]">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea 
                  placeholder="Share your volunteer experience or thoughts..." 
                  className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 text-base"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="flex items-center justify-between border-t border-forest-border pt-4">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="text-forest-muted hover:text-[#829661] hover:bg-[#21261B] rounded-full">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-primary rounded-full px-6"
                    disabled={!newPost.trim() || isPosting}
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm shadow-forest-border/20">
                <CardHeader className="p-4 sm:p-6 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-forest-border">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-[#2C3322] text-[#829661]">
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-forest-beige">{post.author.name}</h4>
                          {post.author.isVerified && (
                            <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0 h-5 px-1.5 text-[10px]">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-forest-muted">
                          <span>{post.author.role}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted -mr-2">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem>Share via...</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Flag className="w-4 h-4 mr-2" /> Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-2 pb-4">
                  <p className="text-[#DFD5C2] whitespace-pre-wrap">{post.content}</p>
                  {post.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-forest-border">
                      <img src={post.image} alt="Post image" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0 border-t border-forest-border mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-4 mt-4">
                    <Button 
                      variant="ghost" 
                      className={`gap-2 rounded-full hover:bg-red-500/10 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-forest-muted hover:text-red-500'}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" className="gap-2 text-forest-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-full">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Button variant="ghost" size="icon" className="text-forest-muted hover:text-forest-accent hover:bg-[#21261B] rounded-full">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                
                </CardFooter>
                {/* Comments Section */}
                <AnimatePresence>
                  {expandedComments[post.id] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-forest-border bg-[#181A15]/50 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="bg-[#2C3322] text-xs">{userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex-1 flex gap-2">
                            <Input 
                              value={commentInput[post.id] || ""}
                              onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Write a comment..." 
                              className="h-9 bg-[#131511] border-forest-border focus-visible:ring-forest-accent rounded-full px-4 text-sm"
                            />
                            <Button type="submit" disabled={!commentInput[post.id]?.trim()} className="h-9 w-9 rounded-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige p-0 shrink-0">
                              <Send className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                        {/* Mock existing comment */}
                        {post.comments > 0 && (
                          <div className="flex gap-3 pt-2">
                            <Avatar className="w-8 h-8 shrink-0">
                              <AvatarFallback className="bg-blue-900/50 text-blue-400 text-xs">V</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-[#131511] p-3 rounded-2xl rounded-tl-sm border border-forest-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-forest-beige text-xs">Volunteer User</span>
                                <span className="text-[10px] text-forest-muted">1 hour ago</span>
                              </div>
                              <p className="text-sm text-[#DFD5C2]">This is so inspiring! Can't wait for the next event.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
