import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { useWorkOrders, useCustomers, useServices } from "@/hooks/useData";
import { brl, dateTimeBR } from "@/lib/format";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/_app/ordens/")({
  head: () => ({ meta: [{ title: "Ordens de Serviço · CampoOS" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { data: workOrders = [] } = useWorkOrders();
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();
  const findCustomer = (id?: string) => customers.find((c) => c.id === id);
  const findService = (id?: string) => services.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      <PageHeader title="Ordens de Serviço" icon={Wrench} description="Acompanhe cada serviço da chegada até a garantia." />
      <div className="space-y-2">
        {workOrders.map((o) => {
          const c = findCustomer(o.customerId);
          const s = findService(o.serviceId);
          return (
            <Link key={o.id} to="/ordens/$id" params={{ id: o.id }}>
              <Card className="flex flex-col gap-2 p-4 transition hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{o.number} · {c?.name}</p>
                  <p className="text-xs text-muted-foreground">{s?.name} · {o.address}</p>
                  <p className="text-xs text-muted-foreground">{dateTimeBR(o.scheduledAt)} · Técnico: {o.technician}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                  <span className="text-lg font-semibold">{brl(o.value)}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
