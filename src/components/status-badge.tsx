import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info" | "draft";

const toneClasses: Record<Tone, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  draft: "bg-draft text-draft-foreground border-draft",
};

export function StatusBadge({ children, tone = "default", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

// Mapeia status do sistema para tom visual
export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["aprovado", "concluída", "recebida", "garantia ativa", "virou cliente", "recebido"].some((x) => s.includes(x))) return "success";
  if (["aguardando", "em execução", "em deslocamento", "agendada", "enviado", "visualizado", "contatada", "orçamento enviado"].some((x) => s.includes(x))) return "info";
  if (["pausada", "aguardando peça", "vencido", "atenção"].some((x) => s.includes(x))) return "warning";
  if (["recusado", "cancelada", "perdida", "atrasado"].some((x) => s.includes(x))) return "destructive";
  if (["rascunho", "nova"].some((x) => s.includes(x))) return "draft";
  return "default";
}
