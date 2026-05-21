import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomer, useQuotes, useWorkOrders } from "@/hooks/useData";
import { UserCircle2, Plus, FileText, Wrench, Send, Star, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { brl, dateBR } from "@/lib/format";
import { StatusBadge, statusTone } from "@/components/status-badge";

export const Route = createFileRoute("/_app/clientes/$id")({
  head: () => ({ meta: [{ title: `Cliente · CampoOS` }] }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const { data: customer } = useCustomer(id);
  const { data: quotes = [] } = useQuotes();
  const { data: workOrders = [] } = useWorkOrders();

  if (!customer) return <div className="p-8 text-center text-muted-foreground">Cliente não encontrado.</div>;

  const customerQuotes = quotes.filter((q) => q.customerId === customer.id);
  const orders = workOrders.filter((o) => o.customerId === customer.id);
  const warranties = orders.filter((o) => o.warranty.active);

  return (
    <div className="space-y-6">
      <PageHeader title={customer.name} description={`${customer.type} · ${customer.neighborhood}`} icon={UserCircle2} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total gasto</p>
          <p className="mt-1 text-2xl font-semibold">{brl(customer.totalSpent)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Serviços</p>
          <p className="mt-1 text-2xl font-semibold">{customer.serviceCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Indicações</p>
          <p className="mt-1 text-2xl font-semibold">{customer.referralsMade}</p>
        </Card>
      </div>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Ações rápidas</p>
        <div className="flex flex-wrap gap-2">
          <WhatsAppButton phone={customer.whatsapp} label="Abrir WhatsApp" variant="default" />
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/orcamentos/novo"><Plus className="h-4 w-4" /> Criar orçamento</Link>
          </Button>
          <Button variant="outline" className="gap-2"><Wrench className="h-4 w-4" /> Criar OS</Button>
          <Button variant="outline" className="gap-2"><Send className="h-4 w-4" /> Enviar acompanhamento</Button>
          <Button variant="outline" className="gap-2"><Star className="h-4 w-4" /> Pedir indicação</Button>
          <Button variant="outline" className="gap-2"><MessageCircle className="h-4 w-4" /> Pedir avaliação</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Orçamentos</p>
          <div className="space-y-2">
            {quotes.length === 0 && <p className="text-sm text-muted-foreground">Nenhum orçamento.</p>}
            {quotes.map((q) => (
              <Link key={q.id} to="/orcamentos/$id" params={{ id: q.id }}>
                <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{q.number}</p>
                    <p className="text-xs text-muted-foreground">{q.problem}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge tone={statusTone(q.status)}>{q.status}</StatusBadge>
                    <p className="mt-1 text-sm font-semibold">{brl(q.finalValue)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold flex items-center gap-2"><Wrench className="h-4 w-4" /> Ordens de serviço</p>
          <div className="space-y-2">
            {orders.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma OS.</p>}
            {orders.map((o) => (
              <Link key={o.id} to="/ordens/$id" params={{ id: o.id }}>
                <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{o.number}</p>
                    <p className="text-xs text-muted-foreground">{dateBR(o.scheduledAt)}</p>
                  </div>
                  <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {warranties.length > 0 && (
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold">Garantias ativas</p>
          {warranties.map((o) => (
            <div key={o.id} className="flex items-center justify-between text-sm">
              <span>{o.number}</span>
              <span className="text-muted-foreground">até {dateBR(o.warranty.until)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
