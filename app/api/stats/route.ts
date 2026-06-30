import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const [{ count: volunteers }, { count: projects }, { count: orgs }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "volunteer"),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("organizations").select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      volunteers: volunteers || 0,
      projects: projects || 0,
      orgs: orgs || 0,
    });
  } catch (e) {
    return NextResponse.json({ volunteers: 0, projects: 0, orgs: 0 });
  }
}
