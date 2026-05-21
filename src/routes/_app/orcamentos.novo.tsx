import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Copy, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useCustomers, useServices, usePricing, useCreateQuote } from "@/hooks/useData";
import type { BillingType, Complexity, Urgency } from "@/types";
import { calcQuote } from "@/lib/pricing";
import { brl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/whatsapp";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/orcamentos/novo")({
  head: () => ({ meta: [{ title: "Gerador de Orçamento · CampoOS" }] }),
  component: QuoteWizard,
});

const STEPS = [
  "Cliente",
  "Problema",
  "Cobrança",
  "Complexidade",
  "Urgência",
  "Deslocamento",
  "Tempo",
  "Peças",
  "Garantia",
  "Resultado",
] as const;

const PROBLEMS = ["Chuveiro", "Ventilador", "Tomada", "Interruptor", "Vazamento", "Suporte de TV", "Móvel", "Fechadura", "Diagnóstico", "Outro"];

function QuoteWizard() {
  const navigate = useNavigate();
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();
  const { data: pricing } = usePricing();
  const createQuote = useCreateQuote();
  const [step, setStep] = useState(0);

  // Estado do wizard
  const [customerId, setCustomerId] = useState<string>("");
  const [problem, setProblem] = useState("Chuveiro");
  const [photoStatus, setPhotoStatus] = useState<"sim" | "naoAinda" | "naoPrecisa" | "precisoPedir">("sim");
  const [serviceId, setServiceId] = useState("");
  const [billing, setBilling] = useState<BillingType>("Fixo");
  const [complexity, setComplexity] = useState<Complexity>("Simples");
  const [urgency, setUrgency] = useState<Urgency>("Normal");
  const [neighborhood, setNeighborhood] = useState("Vila Mariana");
  const [travelFee, setTravelFee] = useState(30);
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [partsKind, setPartsKind] = useState<"cliente" | "prestador" | "naoSei" | "naoPrecisa">("prestador");
  const [partsCost, setPartsCost] = useState(0);
  const [partsMargin, setPartsMargin] = useState(20);
  const [warrantyEnabled, setWarrantyEnabled] = useState(true);
  const [warrantyDays, setWarrantyDays] = useState(90);
  const [discount, setDiscount] = useState(0);

  const customer = customers.find((c) => c.id === customerId);
  const service = services.find((s) => s.id === serviceId);
  const settings = pricing ?? { hourRate: 100, visitFee: 70, defaultMargin: 25, warrantyDays: 90, quoteValidityDays: 7, urgencyFast: 15, urgencyEmergency: 30, urgencyAfterHours: 50 };

  const result = useMemo(
    () =>
      calcQuote({
        estimatedMinutes,
        complexity,
        urgency,
        travelFee,
        partsCost,
        partsMargin,
        discount,
        settings,
      }),
    [estimatedMinutes, complexity, urgency, travelFee, partsCost, partsMargin, discount, settings],
  );

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const waMessage = `Olá ${customer?.name?.split(" ")[0] ?? ""}! Segue orçamento para "${problem}":\n\nValor: ${brl(result.values.recommended)}\nPrazo de garantia: ${warrantyDays} dias\nValidade do orçamento: 7 dias\n\nPodemos agendar?`;

  const handleSave = () => {
    if (!customerId || !serviceId) { toast.error("Selecione cliente e serviço"); return; }
    const validity = new Date();
    validity.setDate(validity.getDate() + (pricing?.quoteValidityDays ?? 7));
    createQuote.mutate({
      customerId, serviceId, problem, billing, complexity, urgency, estimatedMinutes, travelFee, partsCost, partsMargin, discount,
      values: result.values, finalValue: result.values.recommended,
      warranty: { enabled: warrantyEnabled, days: warrantyDays, coverage: "Mão de obra" },
      status: "Rascunho", validityDate: validity.toISOString().split("T")[0],
    }, {
      onSuccess: () => { toast.success("Orçamento salvo"); navigate({ to: "/orcamentos" }); },
      onError: () => toast.error("Erro ao salvar orçamento"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerador de Orçamento"
        description="Monte um preço justo, rápido e sem esquecer custos escondidos."
        icon={Sparkles}
      />

      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Passo {step + 1} de {STEPS.length}</span>
          <span className="font-medium text-foreground">{STEPS[step]}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </Card>

      {/* Steps */}
      {step === 0 && (
        <StepCard title="Para quem é esse orçamento?">
          <div className="space-y-3">
            <Label>Cliente existente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {customer && (
              <Card className="border-info/30 bg-info/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-info">Histórico do cliente</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Serviços anteriores:</span> <b>{customer.serviceCount}</b></div>
                  <div><span className="text-muted-foreground">Total gasto:</span> <b>{brl(customer.totalSpent)}</b></div>
                  <div><span className="text-muted-foreground">Indicações:</span> <b>{customer.referralsMade}</b></div>
                  <div><span className="text-muted-foreground">Tipo:</span> <b>{customer.type}</b></div>
                </div>
              </Card>
            )}
          </div>
        </StepCard>
      )}

      {step === 1 && (
        <StepCard title="O que o cliente precisa resolver?">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {PROBLEMS.map((p) => (
              <ChoiceButton key={p} active={problem === p} onClick={() => setProblem(p)}>{p}</ChoiceButton>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <Label>Você recebeu foto ou vídeo?</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ChoiceButton active={photoStatus === "sim"} onClick={() => setPhotoStatus("sim")}>Sim</ChoiceButton>
              <ChoiceButton active={photoStatus === "naoAinda"} onClick={() => setPhotoStatus("naoAinda")}>Ainda não</ChoiceButton>
              <ChoiceButton active={photoStatus === "naoPrecisa"} onClick={() => setPhotoStatus("naoPrecisa")}>Não precisa</ChoiceButton>
              <ChoiceButton active={photoStatus === "precisoPedir"} onClick={() => setPhotoStatus("precisoPedir")}>Preciso pedir</ChoiceButton>
            </div>

            {photoStatus === "naoAinda" && (
              <Card className="bg-warning/10 p-3 text-sm">
                <p className="font-medium">Mensagem pronta:</p>
                <p className="mt-1 text-muted-foreground">"Para eu te passar um orçamento mais justo, pode me enviar uma foto ou vídeo curto do problema e informar seu bairro?"</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 gap-2"
                  onClick={() => {
                    copyToClipboard("Para eu te passar um orçamento mais justo, pode me enviar uma foto ou vídeo curto do problema e informar seu bairro?");
                    toast.success("Mensagem copiada");
                  }}
                >
                  <Copy className="h-3 w-3" /> Copiar mensagem
                </Button>
              </Card>
            )}
          </div>
        </StepCard>
      )}

      {step === 2 && (
        <StepCard title="Como esse serviço deve ser cobrado?">
          <div className="space-y-3">
            <Label>Serviço base</Label>
            <Select value={serviceId} onValueChange={(v) => {
              setServiceId(v);
              const s = services.find((x) => x.id === v);
              if (s) { setBilling(s.billing); setEstimatedMinutes(s.averageMinutes); }
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} · {s.category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(["Fixo", "Por hora", "Visita técnica", "Pacote", "Leva e traz"] as BillingType[]).map((b) => (
              <ChoiceButton key={b} active={billing === b} onClick={() => setBilling(b)}>{b}</ChoiceButton>
            ))}
            <ChoiceButton active={false} onClick={() => toast.info("Definir depois")}>A definir</ChoiceButton>
          </div>
        </StepCard>
      )}

      {step === 3 && (
        <StepCard title="Qual o nível de dificuldade?">
          <div className="space-y-2">
            {([
              ["Simples", "Serviço claro, rápido e com baixo risco.", "× 1.0"],
              ["Médio", "Exige mais tempo, cuidado ou ajuste.", "× 1.2"],
              ["Chato", "Pode ter risco, retrabalho, diagnóstico ou imprevisto.", "× 1.5"],
              ["Especial", "Serviço fora do padrão. Valor personalizado.", "Personalizado"],
            ] as const).map(([k, d, m]) => (
              <button
                key={k}
                onClick={() => setComplexity(k as Complexity)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition",
                  complexity === k ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                )}
              >
                <div>
                  <p className="font-semibold">{k}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <span className="text-xs font-medium text-primary">{m}</span>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {step === 4 && (
        <StepCard title="Quando o cliente precisa?">
          <div className="space-y-2">
            {([
              ["Normal", "Sem acréscimo"],
              ["Hoje ou amanhã", `+${settings.urgencyFast}%`],
              ["Agora ou emergência", `+${settings.urgencyEmergency}%`],
              ["Noite, domingo ou feriado", `+${settings.urgencyAfterHours}%`],
            ] as const).map(([k, d]) => (
              <button
                key={k}
                onClick={() => setUrgency(k as Urgency)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-4 transition",
                  urgency === k ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                )}
              >
                <span className="font-medium">{k}</span>
                <span className="text-sm text-primary">{d}</span>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {step === 5 && (
        <StepCard title="Onde será o atendimento?">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Bairro</Label>
              <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Taxa de deslocamento (R$)</Label>
              <Input type="number" value={travelFee} onChange={(e) => setTravelFee(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {["Incluso", "Taxa fixa", "Por km", "Leva e traz", "Sem deslocamento"].map((o) => (
              <ChoiceButton key={o} active={false} onClick={() => toast.info(o)}>{o}</ChoiceButton>
            ))}
          </div>
        </StepCard>
      )}

      {step === 6 && (
        <StepCard title="Quanto tempo esse serviço deve levar?">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["30 minutos", 30],
              ["1 hora", 60],
              ["1h30", 90],
              ["2 horas", 120],
              ["3 horas", 180],
              ["Meio período", 240],
              ["Dia inteiro", 480],
            ].map(([l, v]) => (
              <ChoiceButton key={l as string} active={estimatedMinutes === v} onClick={() => setEstimatedMinutes(v as number)}>
                {l as string}
              </ChoiceButton>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            <Label>Personalizado (minutos)</Label>
            <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.target.value))} />
          </div>
        </StepCard>
      )}

      {step === 7 && (
        <StepCard title="Vai precisar de peça ou material?">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([
              ["cliente", "Cliente já tem"],
              ["prestador", "Prestador vai comprar"],
              ["naoSei", "Ainda não sei"],
              ["naoPrecisa", "Não precisa"],
            ] as const).map(([k, l]) => (
              <ChoiceButton key={k} active={partsKind === k} onClick={() => setPartsKind(k)}>{l}</ChoiceButton>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Valor estimado da peça (R$)</Label>
              <Input type="number" value={partsCost} onChange={(e) => setPartsCost(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Margem sobre peça (%)</Label>
              <Input type="number" value={partsMargin} onChange={(e) => setPartsMargin(Number(e.target.value))} />
            </div>
          </div>

          {result.alerts.length > 0 && (
            <Card className="mt-4 border-warning/40 bg-warning/10 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
                <AlertTriangle className="h-4 w-4" /> Não pague para trabalhar
              </p>
              <ul className="mt-2 space-y-1 text-sm text-warning-foreground">
                {result.alerts.map((a, i) => <li key={i}>• {a}</li>)}
              </ul>
            </Card>
          )}
        </StepCard>
      )}

      {step === 8 && (
        <StepCard title="Esse serviço terá garantia?">
          <div className="grid grid-cols-3 gap-2">
            <ChoiceButton active={warrantyEnabled && warrantyDays === 90} onClick={() => { setWarrantyEnabled(true); setWarrantyDays(90); }}>Padrão (90 dias)</ChoiceButton>
            <ChoiceButton active={warrantyEnabled && warrantyDays !== 90} onClick={() => { setWarrantyEnabled(true); setWarrantyDays(60); }}>Personalizada</ChoiceButton>
            <ChoiceButton active={!warrantyEnabled} onClick={() => setWarrantyEnabled(false)}>Não se aplica</ChoiceButton>
          </div>
          {warrantyEnabled && (
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label>Prazo (dias)</Label>
                <Input type="number" value={warrantyDays} onChange={(e) => setWarrantyDays(Number(e.target.value))} />
              </div>
              <Textarea
                className="text-sm"
                defaultValue="Garantia válida para a mão de obra executada, não cobrindo mau uso, alterações feitas por terceiros ou defeitos em peças fornecidas pelo cliente."
              />
            </div>
          )}
        </StepCard>
      )}

      {step === 9 && (
        <StepCard title="Resultado">
          <div className="grid gap-3 sm:grid-cols-3">
            <ValueCard label="Mínimo" hint="Não sair no prejuízo" value={result.values.min} />
            <ValueCard label="Recomendado" hint="Melhor preço para cobrar" value={result.values.recommended} highlight />
            <ValueCard label="Premium" hint="Urgência, risco, empresa" value={result.values.premium} />
          </div>

          <Card className="mt-4 p-4 text-sm">
            <p className="mb-2 font-semibold">Resumo do cálculo</p>
            <div className="grid grid-cols-2 gap-y-1">
              <span className="text-muted-foreground">Mão de obra</span><span className="text-right">{brl(result.labor)}</span>
              <span className="text-muted-foreground">Deslocamento</span><span className="text-right">{brl(result.travel)}</span>
              <span className="text-muted-foreground">Peças (com margem)</span><span className="text-right">{brl(result.parts)}</span>
              <span className="text-muted-foreground">Urgência</span><span className="text-right">{brl(result.urgencyAmount)}</span>
              <span className="text-muted-foreground">Margem</span><span className="text-right">{brl(result.marginAmount)}</span>
              <span className="text-muted-foreground">Desconto</span><span className="text-right">- {brl(discount)}</span>
            </div>
          </Card>

          {result.alerts.length > 0 && (
            <Card className="mt-4 border-warning/40 bg-warning/10 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4" /> Atenção
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {result.alerts.map((a, i) => <li key={i}>• {a}</li>)}
              </ul>
            </Card>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Desconto (R$)</Label>
              <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <StatusBadge tone="info">Validade: 7 dias</StatusBadge>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="lg" onClick={handleSave} disabled={createQuote.isPending}>
              Salvar rascunho
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => { copyToClipboard(waMessage); toast.success("Mensagem copiada"); }}>
              <Copy className="h-4 w-4" /> Copiar para WhatsApp
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => toast.success("Enviado ao cliente")}>
              <Send className="h-4 w-4" /> Enviar para cliente
            </Button>
            <Button size="lg" className="gap-2 bg-success text-success-foreground hover:bg-success/90" onClick={() => { toast.success("OS criada"); navigate({ to: "/ordens" }); }}>
              <Check className="h-4 w-4" /> Aprovar e criar OS
            </Button>
          </div>
        </StepCard>
      )}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        {step < STEPS.length - 1 && (
          <Button onClick={next} className="gap-2">
            Próximo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-3 text-sm font-medium transition",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted/50",
      )}
    >
      {children}
    </button>
  );
}

function ValueCard({ label, hint, value, highlight }: { label: string; hint: string; value: number; highlight?: boolean }) {
  return (
    <Card className={cn("p-4 text-center", highlight && "border-primary bg-primary/5")}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-3xl font-bold", highlight && "text-primary")}>{brl(value)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}
