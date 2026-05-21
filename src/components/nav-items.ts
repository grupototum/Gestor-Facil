import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Calendar,
  Wallet,
  ExternalLink,
  Globe,
  BookOpen,
  Settings,
  Sparkles,
  Gift,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  mobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard, mobile: true },
  { to: "/clientes", label: "Clientes", icon: Users, mobile: true },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText, mobile: true },
  { to: "/ordens", label: "Ordens de Serviço", icon: Wrench, mobile: false },
  { to: "/agenda", label: "Agenda", icon: Calendar, mobile: true },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/portal", label: "Portal do Cliente", icon: ExternalLink },
  { to: "/indicacoes", label: "Indicações", icon: Gift },
  { to: "/meu-site", label: "Página Institucional", icon: Globe },
  { to: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
  { to: "/modulos-futuros", label: "Módulos Futuros", icon: Sparkles },
];
