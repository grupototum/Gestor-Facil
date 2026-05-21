import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { useQuotes, useWorkOrders, useCustomers } from "@/hooks/useData";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_app/portal/")({
  head: () => ({ meta: [{ title: "Portal do Cliente · CampoOS" }] }),
  component: PortalIndexPage,
});

function PortalIndexPage() {
  const { data: quotes = [] } = useQuotes();
  const { data: workOrders = [] } = useWorkOrders();
  const { data: customers = [] } = useCustomers();
  const findCustomer = (id?: string) => customers.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      <PageHeader title="Portal do Cliente" icon={ExternalLink} description="Veja como o cliente acompanha o serviço pelo link público." />
      <p className="text-sm text-muted-foreground">Escolha um exemplo para visualizar:</p>
      <div className="grid gap-2 md:grid-cols-2">
        {[...quotes, ...workOrders].map((item: any) => {
          const c = findCustomer(item.customerId);
          return (
            <Link key={item.id} to="/portal/$token" params={{ token: item.publicToken }}>
              <Card className="p-4 transition hover:border-primary/40">
                <p className="font-semibold">{item.number} · {c?.name}</p>
                <p className="text-xs text-muted-foreground">/portal/{item.publicToken}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
