import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  label: string;
  at?: string;
  done: boolean;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-4 pl-6">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-border" aria-hidden />
      {items.map((it, i) => (
        <li key={i} className="relative">
          <div
            className={cn(
              "absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full border",
              it.done ? "border-success bg-success text-white" : "border-border bg-card",
            )}
          >
            {it.done && <Check className="h-3 w-3" strokeWidth={3} />}
          </div>
          <p className={cn("text-sm font-medium", it.done ? "text-foreground" : "text-muted-foreground")}>
            {it.label}
          </p>
          {it.at && it.done && (
            <p className="text-xs text-muted-foreground">{new Date(it.at).toLocaleString("pt-BR")}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
