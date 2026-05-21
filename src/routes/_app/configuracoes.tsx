import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockCompany, mockPricing } from "@/data";
import { useFontScale } from "@/contexts/font-scale";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações · CampoOS" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const { scale, setScale } = useFontScale();
  const [pricing, setPricing] = useState(mockPricing);

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" icon={Settings} description="Ajuste sua empresa, valores e preferências." />
      <Accordion type="multiple" defaultValue={["empresa", "preco"]}>
        <AccordionItem value="empresa">
          <AccordionTrigger>Dados da empresa</AccordionTrigger>
          <AccordionContent>
            <Card className="grid gap-3 p-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Nome</Label><Input defaultValue={mockCompany.name} /></div>
              <div className="space-y-1.5"><Label>WhatsApp</Label><Input defaultValue={mockCompany.whatsapp} /></div>
              <div className="space-y-1.5"><Label>Instagram</Label><Input defaultValue={mockCompany.instagram} /></div>
              <div className="space-y-1.5"><Label>Região</Label><Input defaultValue={mockCompany.region} /></div>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="preco">
          <AccordionTrigger>Valores de precificação</AccordionTrigger>
          <AccordionContent>
            <Card className="grid gap-3 p-4 sm:grid-cols-2">
              <Field label="Hora técnica (R$)" value={pricing.hourRate} onChange={(v) => setPricing({ ...pricing, hourRate: v })} />
              <Field label="Taxa de visita (R$)" value={pricing.visitFee} onChange={(v) => setPricing({ ...pricing, visitFee: v })} />
              <Field label="Margem padrão (%)" value={pricing.defaultMargin} onChange={(v) => setPricing({ ...pricing, defaultMargin: v })} />
              <Field label="Garantia padrão (dias)" value={pricing.warrantyDays} onChange={(v) => setPricing({ ...pricing, warrantyDays: v })} />
              <Field label="Validade orçamento (dias)" value={pricing.quoteValidityDays} onChange={(v) => setPricing({ ...pricing, quoteValidityDays: v })} />
              <Field label="Urgência rápida (%)" value={pricing.urgencyFast} onChange={(v) => setPricing({ ...pricing, urgencyFast: v })} />
              <Field label="Emergência (%)" value={pricing.urgencyEmergency} onChange={(v) => setPricing({ ...pricing, urgencyEmergency: v })} />
              <Field label="Fora de horário (%)" value={pricing.urgencyAfterHours} onChange={(v) => setPricing({ ...pricing, urgencyAfterHours: v })} />
              <div className="sm:col-span-2"><Button onClick={() => { localStorage.setItem("campoos.pricing", JSON.stringify(pricing)); toast.success("Salvo"); }}>Salvar valores</Button></div>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="font">
          <AccordionTrigger>Tamanho de fonte</AccordionTrigger>
          <AccordionContent>
            <Card className="flex gap-2 p-4">
              {(["normal", "large", "xlarge"] as const).map((s) => (
                <Button key={s} variant={scale === s ? "default" : "outline"} onClick={() => setScale(s)}>
                  {s === "normal" ? "Normal" : s === "large" ? "Grande" : "Extra grande"}
                </Button>
              ))}
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
