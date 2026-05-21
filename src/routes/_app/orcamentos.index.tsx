import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { mockQuotes, findCustomer, findService } from "@/data";
import { brl, dateBR } from "@/lib/format";
import { FileText, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/orcamentos/")({
  head: () => ({ meta: [{ title: "Orçamentos · CampoOS" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Orçamentos" icon={FileText} description="Acompanhe o status de cada proposta enviada." actions={
        <Button asChild className="gap-2"><Link to="/orcamentos/novo"><Plus className="h-4 w-4" /> Novo orçamento</Link></Button>
      } />
      <div className="space-y-2">
        {mockQuotes.map((q) => {
          const c = findCustomer(q.customerId);
          const s = findService(q.serviceId);
          return (
            <Link key={q.id} to="/orcamentos/$id" params={{ id: q.id }}>
              <Card className="flex flex-col gap-2 p-4 transition hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{q.number} · {c?.name}</p>
                  <p className="text-xs text-muted-foreground">{s?.name} · {q.problem}</p>
                  <p className="text-xs text-muted-foreground">Válido até {dateBR(q.validityDate)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <StatusBadge tone={statusTone(q.status)}>{q.status}</StatusBadge>
                  <span className="text-lg font-semibold">{brl(q.finalValue)}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  ),
});
