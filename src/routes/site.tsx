import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCompany, useServices } from "@/hooks/useData";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BRAND } from "@/config/brand";
import { ShieldCheck, MessageCircle, ClipboardList, Clock, MapPin, Instagram } from "lucide-react";

export const Route = createFileRoute("/site")({
  head: () => ({
    meta: [
      { title: `Serviços técnicos` },
      { name: "description", content: "" },
    ],
  }),
  component: SitePage,
});

function SitePage() {
  const { data: company } = useCompany();
  const { data: services = [] } = useServices();
  const c = company ?? { name: "Empresa", region: "", whatsapp: "", instagram: "", hours: "" };
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={BRAND.logoIcon} className="h-10 w-10 rounded-lg object-contain" alt="" />
            <div><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.region}</p></div>
          </div>
          <WhatsAppButton phone={c.whatsapp} label="WhatsApp" variant="default" />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Serviços de manutenção com atendimento rápido, organizado e profissional.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Orçamentos pelo WhatsApp, execução com checklist e acompanhamento do serviço em tempo real.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <WhatsAppButton phone={c.whatsapp} message="Olá! Quero um orçamento." label="Pedir orçamento" variant="default" size="lg" />
          <Button size="lg" variant="outline" asChild><a href="#servicos">Ver serviços</a></Button>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Serviços</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <Card key={s.id} className="p-5">
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.category}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.customerMessage}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Como funciona</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Você chama pelo WhatsApp", "Envia foto ou vídeo", "Recebe um orçamento", "Agenda o serviço", "Acompanha o status", "Recebe garantia e pós-venda"].map((s, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">{i + 1}</span>
              <span className="text-sm font-medium">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Diferenciais</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ClipboardList, t: "Orçamento claro" },
            { icon: Clock, t: "Status em tempo real" },
            { icon: ShieldCheck, t: "Garantia registrada" },
            { icon: MessageCircle, t: "Canal direto no WhatsApp" },
          ].map((d, i) => (
            <Card key={i} className="p-4 text-center">
              <d.icon className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-medium">{d.t}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Contatos</h2>
        <Card className="grid gap-3 p-5 sm:grid-cols-2 text-sm">
          <p><MessageCircle className="mr-2 inline h-4 w-4" />WhatsApp: {c.whatsapp}</p>
          <p><Instagram className="mr-2 inline h-4 w-4" />{c.instagram}</p>
          <p><MapPin className="mr-2 inline h-4 w-4" />{c.region}</p>
          <p><Clock className="mr-2 inline h-4 w-4" />{c.hours}</p>
        </Card>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Powered by {BRAND.name}
      </footer>
    </div>
  );
}
