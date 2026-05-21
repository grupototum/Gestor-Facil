import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPayments, mockExpenses, mockQuotes, findCustomer } from "@/data";
import { brl, dateBR } from "@/lib/format";
import { Wallet, TrendingUp, TrendingDown, BadgeDollarSign } from "lucide-react";

export const Route = createFileRoute("/_app/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · CampoOS" }] }),
  component: Financeiro,
});

function Financeiro() {
  const totalIn = mockPayments.reduce((s, p) => s + p.amount, 0);
  const totalOut = mockExpenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalIn - totalOut;
  const ticket = totalIn / Math.max(mockPayments.length, 1);
  const approved = mockQuotes.filter((q) => q.status === "Aprovado" || q.status === "Convertido em OS").length;
  const refused = mockQuotes.filter((q) => q.status === "Recusado").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" icon={Wallet} description="Visão simples de entradas, saídas e lucro." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Faturamento" value={brl(totalIn)} icon={TrendingUp} tone="success" />
        <StatCard label="Despesas" value={brl(totalOut)} icon={TrendingDown} tone="destructive" />
        <StatCard label="Lucro" value={brl(profit)} icon={BadgeDollarSign} tone="info" />
        <StatCard label="Ticket médio" value={brl(ticket)} icon={Wallet} />
      </div>
      <Card className="p-4 text-sm">
        <p className="font-semibold">Orçamentos aprovados vs recusados</p>
        <p className="mt-1 text-muted-foreground">{approved} aprovados · {refused} recusados</p>
      </Card>
      <Tabs defaultValue="in">
        <TabsList className="grid grid-cols-2"><TabsTrigger value="in">Entradas</TabsTrigger><TabsTrigger value="out">Saídas</TabsTrigger></TabsList>
        <TabsContent value="in" className="space-y-2">
          {mockPayments.map((p) => (
            <Card key={p.id} className="flex justify-between p-3 text-sm">
              <div><p className="font-medium">{findCustomer(p.customerId)?.name}</p><p className="text-xs text-muted-foreground">{p.method} · {dateBR(p.date)}</p></div>
              <span className="font-semibold text-success">+ {brl(p.amount)}</span>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="out" className="space-y-2">
          {mockExpenses.map((e) => (
            <Card key={e.id} className="flex justify-between p-3 text-sm">
              <div><p className="font-medium">{e.description}</p><p className="text-xs text-muted-foreground">{e.category} · {dateBR(e.date)}</p></div>
              <span className="font-semibold text-destructive">- {brl(e.amount)}</span>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
