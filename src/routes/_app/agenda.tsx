import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useWorkOrders, useCustomers } from "@/hooks/useData";
import { brl, timeBR, dateBR } from "@/lib/format";
import { Calendar, Play } from "lucide-react";

export const Route = createFileRoute("/_app/agenda")({
  head: () => ({ meta: [{ title: "Agenda · CampoOS" }] }),
  component: AgendaPage,
});

function AgendaPage() {
  const { data: workOrders = [] } = useWorkOrders();
  const { data: customers = [] } = useCustomers();
  const findCustomer = (id?: string) => customers.find((c) => c.id === id);

  const today = new Date().toDateString();
  const todays = workOrders.filter((o) => new Date(o.scheduledAt).toDateString() === today);
  const week = workOrders.filter((o) => {
    const d = new Date(o.scheduledAt);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= -1 && diff <= 7;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Agenda" icon={Calendar} description="Seus atendimentos por período." />
      <Tabs defaultValue="hoje">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mês</TabsTrigger>
          <TabsTrigger value="aguardando">Aguardando</TabsTrigger>
        </TabsList>
        <TabsContent value="hoje" className="space-y-2"><List items={todays} /></TabsContent>
        <TabsContent value="semana" className="space-y-2"><List items={week} /></TabsContent>
        <TabsContent value="mes" className="space-y-2"><List items={workOrders} /></TabsContent>
        <TabsContent value="aguardando" className="space-y-2"><List items={workOrders.filter((o) => o.status === "Nova")} /></TabsContent>
      </Tabs>
    </div>
  );
}

function List({ items }: { items: import("@/types").WorkOrder[] }) {
  if (items.length === 0) return <Card className="p-6 text-center text-sm text-muted-foreground">Nada por aqui.</Card>;
  return (
    <>
      {items.map((o) => {
        const c = findCustomer(o.customerId);
        return (
          <Card key={o.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{timeBR(o.scheduledAt)} · {dateBR(o.scheduledAt)}</p>
                <p className="text-sm">{c?.name} · {c?.neighborhood}</p>
                <p className="text-xs text-muted-foreground">{o.address}</p>
              </div>
              <div className="text-right">
                <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                <p className="mt-1 font-semibold">{brl(o.value)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {c && <WhatsAppButton phone={c.whatsapp} />}
              <Button asChild size="sm" variant="outline" className="gap-2"><Link to="/ordens/$id" params={{ id: o.id }}><Play className="h-3 w-3" /> Abrir OS</Link></Button>
            </div>
          </Card>
        );
      })}
    </>
  );
}
