import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/status-badge";
import { useProtocols, useChecklists, usePOPs, useSLAs, useMessageTemplates } from "@/hooks/useData";
import { BookOpen, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_app/biblioteca")({
  head: () => ({ meta: [{ title: "Biblioteca Profissional · CampoOS" }] }),
  component: BibliotecaPage,
});

function BibliotecaPage() {
  const { data: protocols = [] } = useProtocols();
  const { data: checklists = [] } = useChecklists();
  const { data: pops = [] } = usePOPs();
  const { data: slas = [] } = useSLAs();
  const { data: messages = [] } = useMessageTemplates();
  return (
    <div className="space-y-6">
      <PageHeader title="Biblioteca Profissional" icon={BookOpen} description="Protocolos, checklists, POPs, SLAs e mensagens prontas." />
      <Tabs defaultValue="proto">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="proto">Protocolos</TabsTrigger>
          <TabsTrigger value="check">Checklists</TabsTrigger>
          <TabsTrigger value="pop">POPs</TabsTrigger>
          <TabsTrigger value="sla">SLAs</TabsTrigger>
          <TabsTrigger value="msg">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="proto" className="grid gap-3 sm:grid-cols-2">
          {protocols.map((p) => (
            <Card key={p.id} className="p-4">
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {p.steps.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="check" className="space-y-4">
          {checklists.map((c) => <ChecklistCard key={c.id} title={c.title} items={c.items} />)}
        </TabsContent>

        <TabsContent value="pop" className="grid gap-3 sm:grid-cols-2">
          {pops.map((p) => (
            <Card key={p.id} className="p-4"><p className="font-semibold">{p.title}</p><p className="mt-1 text-sm text-muted-foreground">{p.body}</p></Card>
          ))}
        </TabsContent>

        <TabsContent value="sla" className="space-y-2">
          {slas.map((s) => (
            <Card key={s.id} className="flex items-center justify-between p-4">
              <div><p className="font-medium">{s.label}</p><p className="text-xs text-muted-foreground">Meta: {s.target}</p></div>
              <StatusBadge tone={s.status === "ok" ? "success" : s.status === "warn" ? "warning" : "destructive"}>
                {s.status === "ok" ? "Dentro do prazo" : s.status === "warn" ? "Atenção" : "Atrasado"}
              </StatusBadge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="msg" className="grid gap-3 sm:grid-cols-2">
          {messages.map((m) => (
            <Card key={m.id} className="p-4">
              <p className="font-semibold">{m.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
              <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => { copyToClipboard(m.body); toast.success("Copiado"); }}>
                <Copy className="h-3 w-3" /> Copiar
              </Button>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  return (
    <Card className="p-4">
      <p className="mb-3 font-semibold">{title}</p>
      <div className="space-y-2">
        {items.map((it, i) => (
          <label key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
            <Checkbox checked={done.has(i)} onCheckedChange={(v) => {
              const next = new Set(done);
              if (v) next.add(i); else next.delete(i);
              setDone(next);
            }} />
            <span className={done.has(i) ? "text-muted-foreground line-through" : ""}>{it}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}
