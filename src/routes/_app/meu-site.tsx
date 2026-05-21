import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meu-site")({
  head: () => ({ meta: [{ title: "Página Institucional · CampoOS" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Página Institucional" icon={Globe} description="Sua vitrine pública para divulgar e captar clientes." />
      <Card className="space-y-3 p-5">
        <p className="text-sm">Sua página fica disponível em: <code className="rounded bg-muted px-2 py-0.5 text-xs">/site</code></p>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2"><Link to="/site"><ExternalLink className="h-4 w-4" /> Abrir página</Link></Button>
          <Button variant="outline" className="gap-2" onClick={() => { copyToClipboard(window.location.origin + "/site"); toast.success("Link copiado"); }}>
            <Copy className="h-4 w-4" /> Copiar link
          </Button>
        </div>
      </Card>
    </div>
  ),
});
