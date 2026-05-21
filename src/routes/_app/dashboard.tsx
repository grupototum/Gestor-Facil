import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { QuickAction } from "@/components/quick-action";
import { Card } from "@/components/ui/card";
import { StatusBadge, statusTone } from "@/components/status-badge";
import {
  LayoutDashboard,
  CalendarClock,
  FileText,
  Users,
  Wallet,
  HeartHandshake,
  Star,
  ShieldCheck,
  TrendingUp,
  Plus,
  Wrench,
  UserPlus,
  Calendar,
  CreditCard,
  Link2,
} from "lucide-react";
import { mockQuotes, mockWorkOrders, mockReferrals, mockFollowups, mockPayments, findCustomer } from "@/data";
import { brl, timeBR } from "@/lib/format";
import { copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Início · CampoOS" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const todayOrders = mockWorkOrders.filter((o) => {
    const d = new Date(o.scheduledAt);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  });

  const pendingQuotes = mockQuotes.filter((q) =>
    ["Enviado", "Visualizado", "Aguardando resposta"].includes(q.status),
  );
  const waitingResponse = mockQuotes.filter((q) => q.status === "Aguardando resposta");
  const receivables = mockWorkOrders.filter((o) => o.paymentStatus === "Pendente" && o.status === "Concluída");
  const pendingFollowups = mockFollowups.filter((f) => !f.done);
  const newReferrals = mockReferrals.filter((r) => r.status === "Nova");
  const activeWarranties = mockWorkOrders.filter((o) => o.warranty.active);
  const monthRevenue = mockPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Olá, bem-vindo de volta"
        description="Tudo que importa hoje em um só lugar."
        icon={LayoutDashboard}
      />

      {/* Ações rápidas */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Ações rápidas</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <QuickAction to="/orcamentos/novo" label="Novo orçamento" icon={Plus} />
          <QuickAction to="/ordens" label="Nova OS" icon={Wrench} />
          <QuickAction to="/clientes" label="Novo cliente" icon={UserPlus} />
          <QuickAction to="/agenda" label="Ver agenda" icon={Calendar} />
          <QuickAction to="/financeiro" label="Registrar pagamento" icon={CreditCard} />
          <button
            onClick={() => {
              copyToClipboard(window.location.origin + "/site");
              toast.success("Link copiado");
            }}
            className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium leading-tight">Copiar link do site</span>
          </button>
        </div>
      </section>

      {/* Cards de status */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Serviços de hoje" value={todayOrders.length} icon={CalendarClock} hint={`${todayOrders.length} agendados`} />
        <StatCard label="Orçamentos pendentes" value={pendingQuotes.length} icon={FileText} tone="info" />
        <StatCard label="Aguardando cliente" value={waitingResponse.length} icon={Users} tone="warning" />
        <StatCard label="A receber" value={brl(receivables.reduce((s, o) => s + o.value, 0))} icon={Wallet} tone="info" />
        <StatCard label="Pós-vendas pendentes" value={pendingFollowups.length} icon={HeartHandshake} tone="warning" />
        <StatCard label="Indicações novas" value={newReferrals.length} icon={Star} tone="success" />
        <StatCard label="Garantias ativas" value={activeWarranties.length} icon={ShieldCheck} />
        <StatCard label="Faturamento do mês" value={brl(monthRevenue)} icon={TrendingUp} tone="success" />
      </section>

      {/* Próximos atendimentos */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Próximos atendimentos</h2>
          <Link to="/agenda" className="text-xs font-medium text-primary hover:underline">
            Ver agenda
          </Link>
        </div>
        <div className="space-y-2">
          {todayOrders.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">Sem atendimentos para hoje.</Card>
          )}
          {todayOrders.map((o) => {
            const c = findCustomer(o.customerId);
            return (
              <Link key={o.id} to="/ordens/$id" params={{ id: o.id }}>
                <Card className="flex items-center justify-between gap-3 p-4 transition hover:border-primary/40">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{timeBR(o.scheduledAt)} · {c?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                    <span className="text-sm font-semibold">{brl(o.value)}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
