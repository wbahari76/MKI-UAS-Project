import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 min-h-[300px]",
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-slate-500">{description}</p>
      
      <div className="flex items-center gap-3">
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
