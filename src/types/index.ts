// Tipos espelhando futuras tabelas do Supabase.
// Quando o backend for plugado, basta substituir as funções em src/data/* por queries.

export type ID = string;

export interface Company {
  id: ID;
  name: string;
  tagline?: string;
  whatsapp: string;
  phone?: string;
  instagram?: string;
  googleProfile?: string;
  region: string;
  hours: string;
  logoUrl?: string;
  primaryColor: string;
}

export type CustomerType = "Residencial" | "Empresa" | "Imobiliária" | "Condomínio";
export type CustomerOrigin =
  | "WhatsApp"
  | "Google"
  | "Indicação"
  | "Instagram"
  | "Cliente antigo"
  | "Outro";

export interface Customer {
  id: ID;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  neighborhood: string;
  address?: string;
  type: CustomerType;
  origin: CustomerOrigin;
  notes?: string;
  totalSpent: number;
  serviceCount: number;
  referralsMade: number;
  createdAt: string;
}

export type ServiceCategory =
  | "Elétrica"
  | "Hidráulica"
  | "Ventiladores"
  | "Marcenaria"
  | "Instalação"
  | "Manutenção geral"
  | "Diagnóstico"
  | "Outros";

export type BillingType = "Fixo" | "Por hora" | "Visita técnica" | "Pacote" | "Leva e traz";
export type Complexity = "Simples" | "Médio" | "Chato" | "Especial";
export type Urgency = "Normal" | "Hoje ou amanhã" | "Agora ou emergência" | "Noite, domingo ou feriado";

export interface Service {
  id: ID;
  name: string;
  category: ServiceCategory;
  billing: BillingType;
  averageMinutes: number;
  basePrice: number;
  defaultComplexity: Complexity;
  needsParts: boolean;
  hasWarranty: boolean;
  warrantyDays: number;
  checklist: string[];
  customerMessage: string;
  active: boolean;
}

export interface PricingSettings {
  hourRate: number;
  visitFee: number;
  defaultMargin: number; // %
  warrantyDays: number;
  quoteValidityDays: number;
  urgencyFast: number; // %
  urgencyEmergency: number; // %
  urgencyAfterHours: number; // %
}

export type QuoteStatus =
  | "Rascunho"
  | "Enviado"
  | "Visualizado"
  | "Aguardando resposta"
  | "Aprovado"
  | "Recusado"
  | "Vencido"
  | "Convertido em OS";

export interface Quote {
  id: ID;
  number: string;
  customerId: ID;
  serviceId: ID;
  problem: string;
  billing: BillingType;
  complexity: Complexity;
  urgency: Urgency;
  estimatedMinutes: number;
  travelFee: number;
  partsCost: number;
  partsMargin: number; // %
  discount: number;
  values: { min: number; recommended: number; premium: number };
  finalValue: number;
  warranty: { enabled: boolean; days: number; coverage: string };
  status: QuoteStatus;
  validityDate: string;
  publicToken: string;
  internalNotes?: string;
  createdAt: string;
}

export type WorkOrderStatus =
  | "Nova"
  | "Agendada"
  | "Em deslocamento"
  | "Em execução"
  | "Aguardando peça"
  | "Pausada"
  | "Concluída"
  | "Aguardando pagamento"
  | "Recebida"
  | "Garantia ativa"
  | "Cancelada";

export interface WorkOrder {
  id: ID;
  number: string;
  customerId: ID;
  serviceId: ID;
  quoteId?: ID;
  address: string;
  scheduledAt: string;
  value: number;
  technician: string;
  checklist: { item: string; done: boolean }[];
  photosBefore: string[];
  photosAfter: string[];
  parts: { name: string; quantity: number; price: number }[];
  technicalNotes?: string;
  paymentMethod?: string;
  paymentStatus: "Pendente" | "Recebido" | "Parcial";
  warranty: { active: boolean; until: string };
  publicToken: string;
  status: WorkOrderStatus;
  timeline: { label: string; at?: string; done: boolean }[];
}

export interface Payment {
  id: ID;
  workOrderId: ID;
  customerId: ID;
  amount: number;
  method: string;
  date: string;
}

export interface Expense {
  id: ID;
  category: "Combustível" | "Peças" | "Ferramentas" | "Alimentação" | "Impostos" | "Outros";
  description: string;
  amount: number;
  date: string;
}

export interface Protocol {
  id: ID;
  title: string;
  description: string;
  steps: string[];
}

export interface ChecklistTemplate {
  id: ID;
  title: string;
  items: string[];
}

export interface POP {
  id: ID;
  title: string;
  body: string;
}

export interface SLA {
  id: ID;
  label: string;
  target: string;
  status: "ok" | "warn" | "late";
}

export interface MessageTemplate {
  id: ID;
  label: string;
  body: string;
}

export type ReferralStatus = "Nova" | "Contatada" | "Orçamento enviado" | "Virou cliente" | "Perdida";
export interface Referral {
  id: ID;
  fromCustomerId: ID;
  name: string;
  whatsapp: string;
  serviceType: string;
  note?: string;
  status: ReferralStatus;
  createdAt: string;
}

export interface Followup {
  id: ID;
  customerId: ID;
  workOrderId: ID;
  kind: "1d" | "7d" | "30d";
  dueDate: string;
  done: boolean;
  message: string;
}
