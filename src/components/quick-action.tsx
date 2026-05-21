import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  to: string;
  params?: Record<string, string>;
  label: string;
  icon: LucideIcon;
  className?: string;
}

export function QuickAction({ to, label, icon: Icon, className }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        "flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium leading-tight text-foreground">{label}</span>
    </Link>
  );
}
