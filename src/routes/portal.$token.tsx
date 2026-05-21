import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/timeline";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { findQuoteByToken, findWorkOrderByToken, findCustomer, findService, mockCompany } from "@/data";
import { brl, dateBR } from "@/lib/format";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Star, UserPlus, ShieldCheck } from "lucide-react";
import { BRAND } from "@/config/brand";

export const Route = createFileRoute("/portal/$token")({
  head: () => ({ meta: [{ title: "Acompanhamento · CampoOS" }] }),
  loader: ({ params }) => {
    const quote = findQuoteByToken(params.token);
    const order = findWorkOrderByToken(params.token);
    if (!quote && !order) throw notFound();
    return { quote, order };
  },
  component: PortalPage,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Link inválido.</div>,
});

function PortalPage() {
  const { quote, order } = Route.useLoaderData();
  const item: any = order ?? quote;
  const customer = findCustomer(item.customerId);
  const service = findService(item.serviceId);
  const value = order ? order.value : quote!.finalValue;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <img src={BRAND.logoIcon} className="h-10 w-10 rounded-lg object-contain" alt="" />
          <div>
            <p className="font-semibold">{mockCompany.name}</p>
            <p className="text-xs text-muted-foreground">{mockCompany.region}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-muted-foreground">{order ? "Ordem de serviço" : "Orçamento"}</p>
            <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>
          </div>
          <h1 className="text-xl font-semibold">Olá, {customer?.name?.split(" ")[0]}!</h1>
          <p className="text-sm text-muted-foreground">{service?.name}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Valor:</span> <b>{brl(value)}</b></div>
            <div><span className="text-muted-foreground">Data:</span> <b>{dateBR(order ? order.scheduledAt : quote!.validityDate)}</b></div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>Garantia de {order ? "90" : quote!.warranty.days} dias inclusa</span>
          </div>
        </Card>

        {order && (
          <Card className="p-5">
            <p className="mb-3 text-sm font-semibold">Andamento</p>
            <Timeline items={order.timeline} />
          </Card>
        )}

        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold">O que você pode fazer agora</p>
          <div className="grid gap-2">
            <WhatsAppButton phone={mockCompany.whatsapp} message="Olá! Quero falar sobre meu atendimento." label="Falar no WhatsApp" variant="default" />
            <Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" /> Indicar um amigo</Button>
            <Button variant="outline" className="gap-2"><Star className="h-4 w-4" /> Avaliar atendimento</Button>
          </div>
        </Card>

        <p className="pb-8 text-center text-xs text-muted-foreground">Acompanhamento via {BRAND.name}</p>
      </main>
    </div>
  );
}
