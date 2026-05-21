import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { findQuote, findCustomer, findService, mockPricing } from "@/data";
import { brl, dateBR } from "@/lib/format";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { calcQuote } from "@/lib/pricing";
import { FileText, Copy, Check, Link2 } from "lucide-react";
import { copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/orcamentos/$id")({
  loader: ({ params }) => {
    const quote = findQuote(params.id);
    if (!quote) throw notFound();
    return { quote };
  },
  component: QuoteDetail,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Orçamento não encontrado.</div>,
});

function QuoteDetail() {
  const { quote } = Route.useLoaderData();
  const customer = findCustomer(quote.customerId);
  const service = findService(quote.serviceId);
  const calc = calcQuote({
    estimatedMinutes: quote.estimatedMinutes,
    complexity: quote.complexity,
    urgency: quote.urgency,
    travelFee: quote.travelFee,
    partsCost: quote.partsCost,
    partsMargin: quote.partsMargin,
    discount: quote.discount,
    settings: mockPricing,
  });
  const msg = `Olá ${customer?.name?.split(" ")[0]}! Segue orçamento ${quote.number}: ${brl(quote.finalValue)}. Garantia: ${quote.warranty.days} dias. Posso agendar?`;

  return (
    <div className="space-y-6">
      <PageHeader title={`${quote.number}`} description={`${customer?.name} · ${service?.name}`} icon={FileText}
        actions={<StatusBadge tone={statusTone(quote.status)}>{quote.status}</StatusBadge>} />
      <Card className="p-5">
        <p className="mb-3 text-sm font-semibold">Resumo do cálculo</p>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="text-muted-foreground">Mão de obra</span><span className="text-right">{brl(calc.labor)}</span>
          <span className="text-muted-foreground">Deslocamento</span><span className="text-right">{brl(calc.travel)}</span>
          <span className="text-muted-foreground">Peças</span><span className="text-right">{brl(calc.parts)}</span>
          <span className="text-muted-foreground">Urgência</span><span className="text-right">{brl(calc.urgencyAmount)}</span>
          <span className="text-muted-foreground">Margem</span><span className="text-right">{brl(calc.marginAmount)}</span>
          <span className="text-muted-foreground">Desconto</span><span className="text-right">- {brl(quote.discount)}</span>
          <span className="mt-2 border-t border-border pt-2 font-semibold">Final</span>
          <span className="mt-2 border-t border-border pt-2 text-right text-lg font-bold text-primary">{brl(quote.finalValue)}</span>
        </div>
      </Card>
      <Card className="p-4">
        <p className="text-sm"><b>Problema:</b> {quote.problem}</p>
        <p className="text-sm text-muted-foreground">Válido até {dateBR(quote.validityDate)} · Garantia {quote.warranty.days} dias</p>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => { copyToClipboard(msg); toast.success("Mensagem copiada"); }} className="gap-2"><Copy className="h-4 w-4" /> Copiar WhatsApp</Button>
        <Button variant="outline" onClick={() => { copyToClipboard(`${window.location.origin}/portal/${quote.publicToken}`); toast.success("Link copiado"); }} className="gap-2"><Link2 className="h-4 w-4" /> Gerar link público</Button>
        <Button asChild variant="outline" className="gap-2"><Link to="/portal/$token" params={{ token: quote.publicToken }}>Ver portal do cliente</Link></Button>
        <Button className="gap-2 bg-success text-success-foreground hover:bg-success/90" onClick={() => toast.success("OS criada")}><Check className="h-4 w-4" /> Aprovar e criar OS</Button>
      </div>
    </div>
  );
}
