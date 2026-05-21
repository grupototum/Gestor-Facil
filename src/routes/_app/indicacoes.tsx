import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Phone, MessageCircle, FileText, CheckCircle2, XCircle, Copy, CalendarPlus } from "lucide-react";
import { useReferrals, useCustomers, useUpdateReferral, useCreateFollowup, useWorkOrders } from "@/hooks/useData";
import { dateBR } from "@/lib/format";
import { waLink, copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";
import type { Referral, ReferralStatus } from "@/types";

const STATUSES: ReferralStatus[] = [
  "Nova",
  "Contatada",
  "Orçamento enviado",
  "Virou cliente",
  "Perdida",
];

const NEXT_STEP: Record<ReferralStatus, { label: string; icon: any; next: ReferralStatus | null }> = {
  Nova: { label: "Entrar em contato pelo WhatsApp", icon: MessageCircle, next: "Contatada" },
  Contatada: { label: "Enviar orçamento", icon: FileText, next: "Orçamento enviado" },
  "Orçamento enviado": { label: "Confirmar fechamento", icon: CheckCircle2, next: "Virou cliente" },
  "Virou cliente": { label: "Agradecer quem indicou e registrar bônus", icon: Gift, next: null },
  Perdida: { label: "Registrar motivo da perda", icon: XCircle, next: null },
};

export const Route = createFileRoute("/_app/indicacoes")({
  head: () => ({ meta: [{ title: "Indicações · CampoOS" }] }),
  component: IndicacoesPage,
});

function IndicacoesPage() {
  const { data: items = [] } = useReferrals();
  const { data: customers = [] } = useCustomers();
  const { data: workOrders = [] } = useWorkOrders();
  const updateReferral = useUpdateReferral();
  const createFollowup = useCreateFollowup();
  const [filter, setFilter] = useState<"Todas" | ReferralStatus>("Todas");

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todas: items.length };
    STATUSES.forEach((s) => (c[s] = items.filter((i) => i.status === s).length));
    return c;
  }, [items]);

  const conversao = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((counts["Virou cliente"] / items.length) * 100);
  }, [items, counts]);

  const visible = filter === "Todas" ? items : items.filter((i) => i.status === filter);

  const update = (id: string, status: ReferralStatus) => {
    const ref = items.find((i) => i.id === id);
    if (ref) updateReferral.mutate({ ...ref, status });
    toast.success(`Status atualizado para "${status}"`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicações"
        icon={Gift}
        description="Leads que chegaram por clientes satisfeitos. Cada indicação tem um próximo passo claro."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de indicações" value={items.length} icon={Gift} tone="info" />
        <StatCard label="Aguardando contato" value={counts["Nova"] ?? 0} icon={MessageCircle} tone="warning" />
        <StatCard label="Viraram cliente" value={counts["Virou cliente"] ?? 0} icon={CheckCircle2} tone="success" />
        <StatCard label="Taxa de conversão" value={`${conversao}%`} icon={FileText} tone="default" />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="Todas">Todas ({counts.Todas})</TabsTrigger>
          {STATUSES.map((s) => (
            <TabsTrigger key={s} value={s}>
              {s} ({counts[s] ?? 0})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {visible.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma indicação neste filtro.
          </Card>
        )}

        {visible.map((r) => {
          const from = customers.find((c) => c.id === r.fromCustomerId);
          const step = NEXT_STEP[r.status];
          const StepIcon = step.icon;
          const waMsg = `Olá, ${r.name}! Sou da equipe e ${from?.name ?? "um cliente"} indicou seu contato para o serviço de ${r.serviceType}. Posso te ajudar?`;

          return (
            <Card key={r.id} className="space-y-4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{r.name}</h3>
                    <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.serviceType} · Indicado por <span className="font-medium text-foreground">{from?.name ?? "—"}</span> · {dateBR(r.createdAt)}
                  </p>
                  {r.note && <p className="text-sm text-muted-foreground">"{r.note}"</p>}
                </div>

                <Select value={r.status} onValueChange={(v) => update(r.id, v as ReferralStatus)}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <StepIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Próximo passo</p>
                  <p className="text-muted-foreground">{step.label}</p>
                </div>
                {step.next && (
                  <Button size="sm" variant="outline" onClick={() => update(r.id, step.next!)}>
                    Marcar feito
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="gap-2">
                  <a href={waLink(r.whatsapp, waMsg)} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <a href={`tel:+${r.whatsapp.replace(/\D/g, "")}`}>
                    <Phone className="h-4 w-4" /> Ligar
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    await copyToClipboard(r.whatsapp);
                    toast.success("Contato copiado");
                  }}
                >
                  <Copy className="h-4 w-4" /> Copiar contato
                </Button>
                <AgendarAcompanhamentoDialog
                  referral={r}
                  fromCustomer={from}
                  workOrders={workOrders}
                  onSchedule={(payload) => createFollowup.mutate(payload, { onSuccess: () => toast.success("Acompanhamento agendado") })}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AgendarAcompanhamentoDialog({
  referral,
  fromCustomer,
  workOrders,
  onSchedule,
}: {
  referral: Referral;
  fromCustomer: import("@/types").Customer | undefined;
  workOrders: import("@/types").WorkOrder[];
  onSchedule: (payload: { customerId: string; workOrderId: string; kind: "1d" | "7d" | "30d"; dueDate: string; message: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState(`Lembrete: acompanhar indicação de ${referral.name} (${referral.serviceType})`);
  const [kind, setKind] = useState<"1d" | "7d" | "30d">("7d");

  const lastWorkOrder = workOrders.find((w) => w.customerId === referral.fromCustomerId);

  const handleSave = () => {
    onSchedule({
      customerId: referral.fromCustomerId,
      workOrderId: lastWorkOrder?.id ?? "",
      kind,
      dueDate: new Date(dueDate).toISOString(),
      message,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <CalendarPlus className="h-4 w-4" /> Agendar acompanhamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Agendar acompanhamento</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Data</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Tipo</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 dia</SelectItem>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Mensagem</Label><Input value={message} onChange={(e) => setMessage(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
