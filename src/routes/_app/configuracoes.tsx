import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCompany, usePricing, useUpdateCompany, useUpdatePricing } from "@/hooks/useData";
import { useFontScale } from "@/contexts/font-scale";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações · CampoOS" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const { scale, setScale } = useFontScale();
  const { data: company } = useCompany();
  const { data: pricingData } = usePricing();
  const updateCompany = useUpdateCompany();
  const updatePricing = useUpdatePricing();
  const [pricing, setPricing] = useState(pricingData ?? { hourRate: 100, visitFee: 70, defaultMargin: 25, warrantyDays: 90, quoteValidityDays: 7, urgencyFast: 15, urgencyEmergency: 30, urgencyAfterHours: 50 });
  const [companyForm, setCompanyForm] = useState(company ?? { id: "c1", name: "", whatsapp: "", region: "", hours: "", instagram: "", primaryColor: "#2d3aa8" });

  useEffect(() => { if (pricingData) setPricing(pricingData); }, [pricingData]);
  useEffect(() => { if (company) setCompanyForm(company); }, [company]);

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" icon={Settings} description="Ajuste sua empresa, valores e preferências." />
      <Accordion type="multiple" defaultValue={["empresa", "preco"]}>
        <AccordionItem value="empresa">
          <AccordionTrigger>Dados da empresa</AccordionTrigger>
          <AccordionContent>
            <Card className="grid gap-3 p-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Nome</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>WhatsApp</Label><Input value={companyForm.whatsapp} onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Instagram</Label><Input value={companyForm.instagram ?? ""} onChange={(e) => setCompanyForm({ ...companyForm, instagram: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Região</Label><Input value={companyForm.region} onChange={(e) => setCompanyForm({ ...companyForm, region: e.target.value })} /></div>
              <div className="sm:col-span-2"><Button onClick={() => updateCompany.mutate(companyForm, { onSuccess: () => toast.success("Empresa salva") })}>Salvar empresa</Button></div>
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
              <div className="sm:col-span-2"><Button onClick={() => updatePricing.mutate(pricing, { onSuccess: () => toast.success("Valores salvos") })}>Salvar valores</Button></div>
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
