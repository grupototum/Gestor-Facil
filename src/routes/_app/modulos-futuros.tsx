import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Sparkles, FileBadge, CreditCard, MessageSquare, CalendarRange, Bot, Package, Users, Percent, Map, BarChart3 } from "lucide-react";

const modules = [
  { icon: FileBadge, name: "Emissão fiscal", desc: "Geração de nota fiscal de serviço integrada à OS." },
  { icon: CreditCard, name: "Pagamentos online", desc: "Pix e cartão pelo portal do cliente." },
  { icon: MessageSquare, name: "WhatsApp API", desc: "Envio automático de mensagens e status." },
  { icon: CalendarRange, name: "Google Calendar", desc: "Sincronização com sua agenda." },
  { icon: Bot, name: "IA para pré-orçamento", desc: "Análise automática de foto e vídeo." },
  { icon: Package, name: "Estoque", desc: "Controle de peças e materiais." },
  { icon: Users, name: "Técnicos parceiros", desc: "Distribua serviços para sua rede." },
  { icon: Percent, name: "Comissões", desc: "Cálculo automático de comissão por OS." },
  { icon: Map, name: "Rotas otimizadas", desc: "Ordene atendimentos por trajeto." },
  { icon: BarChart3, name: "Relatórios avançados", desc: "Análises detalhadas de receita e desempenho." },
];

export const Route = createFileRoute("/_app/modulos-futuros")({
  head: () => ({ meta: [{ title: "Módulos Futuros · CampoOS" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Módulos Futuros" icon={Sparkles} description="O que está por vir no CampoOS." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Card key={m.name} className="space-y-2 p-4">
            <div className="flex items-center gap-2"><m.icon className="h-5 w-5 text-primary" /><p className="font-semibold">{m.name}</p></div>
            <p className="text-xs text-muted-foreground">{m.desc}</p>
            <StatusBadge tone="info">Em breve</StatusBadge>
          </Card>
        ))}
      </div>
    </div>
  ),
});
