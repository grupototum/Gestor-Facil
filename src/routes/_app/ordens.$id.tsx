import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Timeline } from "@/components/timeline";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useWorkOrder, useCustomers, useServices, useUpdateWorkOrder } from "@/hooks/useData";
import { brl, dateTimeBR } from "@/lib/format";
import { Wrench } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/ordens/$id")({
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { data: order } = useWorkOrder(id);
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();
  const updateOrder = useUpdateWorkOrder();
  const customer = customers.find((c) => c.id === order?.customerId);
  const service = services.find((s) => s.id === order?.serviceId);
  const [checklist, setChecklist] = useState(order?.checklist ?? []);

  if (!order) return <div className="p-8 text-center text-muted-foreground">OS não encontrada.</div>;

  const handleChecklistChange = (i: number, done: boolean) => {
    if (!order) return;
    const next = [...checklist];
    next[i] = { ...next[i], done };
    setChecklist(next);
    updateOrder.mutate({ ...order, checklist: next });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.number}
        description={`${customer?.name} · ${service?.name}`}
        icon={Wrench}
        actions={<StatusBadge tone={statusTone(order.status)}>{order.status}</StatusBadge>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <p className="mb-3 text-sm font-semibold">Linha do tempo</p>
          <Timeline items={order.timeline} />
        </Card>

        <div className="space-y-4">
          <Card className="space-y-2 p-4 text-sm">
            <p><b>Endereço:</b> {order.address}</p>
            <p><b>Quando:</b> {dateTimeBR(order.scheduledAt)}</p>
            <p><b>Técnico:</b> {order.technician}</p>
            <p><b>Valor:</b> {brl(order.value)}</p>
            <p><b>Pagamento:</b> <StatusBadge tone={statusTone(order.paymentStatus)}>{order.paymentStatus}</StatusBadge></p>
            {customer && <WhatsAppButton phone={customer.whatsapp} label="Falar com cliente" variant="default" />}
          </Card>

          {order.parts.length > 0 && (
            <Card className="p-4">
              <p className="mb-2 text-sm font-semibold">Peças</p>
              {order.parts.map((p: { name: string; quantity: number; price: number }, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.quantity}× {p.name}</span>
                  <span>{brl(p.price * p.quantity)}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold">Checklist</p>
        <div className="space-y-2">
          {checklist.map((item: { item: string; done: boolean }, i: number) => (
            <label key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
              <Checkbox
                checked={item.done}
                onCheckedChange={(v) => handleChecklistChange(i, !!v)}
              />
              <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.item}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Fotos antes</p>
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground">Sem fotos</div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Fotos depois</p>
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground">Sem fotos</div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button>Marcar a caminho</Button>
        <Button variant="outline">Iniciar execução</Button>
        <Button variant="outline">Registrar pagamento</Button>
        <Button className="bg-success text-success-foreground hover:bg-success/90">Concluir OS</Button>
      </div>
    </div>
  );
}
