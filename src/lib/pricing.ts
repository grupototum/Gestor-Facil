import type { Complexity, PricingSettings, Urgency } from "@/types";

const COMPLEXITY_MULT: Record<Complexity, number> = {
  Simples: 1.0,
  Médio: 1.2,
  Chato: 1.5,
  Especial: 1.5,
};

export interface PricingInput {
  estimatedMinutes: number;
  complexity: Complexity;
  urgency: Urgency;
  travelFee: number;
  partsCost: number;
  partsMargin: number; // %
  discount: number; // R$
  settings: PricingSettings;
}

export interface PricingResult {
  labor: number;
  travel: number;
  parts: number;
  urgencyAmount: number;
  marginAmount: number;
  subtotal: number;
  discount: number;
  values: { min: number; recommended: number; premium: number };
  alerts: string[];
}

function urgencyPct(u: Urgency, s: PricingSettings) {
  switch (u) {
    case "Hoje ou amanhã":
      return s.urgencyFast / 100;
    case "Agora ou emergência":
      return s.urgencyEmergency / 100;
    case "Noite, domingo ou feriado":
      return s.urgencyAfterHours / 100;
    default:
      return 0;
  }
}

export function calcQuote(input: PricingInput): PricingResult {
  const { estimatedMinutes, complexity, urgency, travelFee, partsCost, partsMargin, discount, settings } = input;
  const hours = estimatedMinutes / 60;
  const baseLabor = hours * settings.hourRate;
  const labor = baseLabor * COMPLEXITY_MULT[complexity];
  const parts = partsCost * (1 + partsMargin / 100);
  const baseTotal = labor + travelFee + parts;
  const urgencyAmount = baseTotal * urgencyPct(urgency, settings);
  const subtotal = baseTotal + urgencyAmount;
  const marginAmount = subtotal * (settings.defaultMargin / 100);

  const recommended = subtotal + marginAmount - discount;
  const min = subtotal - discount;
  const premium = subtotal + marginAmount * 1.6 - discount;

  const alerts: string[] = [];
  if (partsCost === 0 && input.estimatedMinutes > 0 && (input.travelFee === 0)) {
    alerts.push("Deslocamento está zerado — confirme se está incluso.");
  }
  if (urgency !== "Normal" && urgencyAmount === 0) {
    alerts.push("Urgência selecionada não está sendo precificada.");
  }
  if (partsCost > 0 && partsMargin === 0) {
    alerts.push("Peça sem margem — você está comprando pelo cliente sem ganhar nada.");
  }
  if (recommended < min) {
    alerts.push("O desconto deixou o preço abaixo do mínimo.");
  }

  return {
    labor: round(labor),
    travel: round(travelFee),
    parts: round(parts),
    urgencyAmount: round(urgencyAmount),
    marginAmount: round(marginAmount),
    subtotal: round(subtotal),
    discount,
    values: {
      min: round(min),
      recommended: round(recommended),
      premium: round(premium),
    },
    alerts,
  };
}

function round(n: number) {
  return Math.round(n);
}
