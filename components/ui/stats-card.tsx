"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-forest-muted">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-forest-beige tabular-nums tracking-tight">
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    trend.isPositive
                      ? "text-[#829661] bg-[#2C3322]"
                      : "text-red-700 bg-red-100"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
              iconClassName || "bg-[#1E211A] text-forest-muted"
            )}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
