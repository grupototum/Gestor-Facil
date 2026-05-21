# Plano — CampoOS MVP

Micro-SaaS para prestadores de serviços técnicos. Frontend completo, dados mockados, pronto para Supabase depois.

## Stack e fundações

- TanStack Start (já no template) + React + TypeScript + Tailwind v4.
- Fonte **Sora** (Google Fonts) como família principal, casando com o logo.
- Logos AZL copiados para `src/assets/` (usados como referência visual e como exemplo de "empresa configurada" nos mocks; nome do produto = **CampoOS**, fácil de trocar via constante `BRAND` em `src/config/brand.ts`).
- PWA leve: `manifest.webmanifest` + ícones + meta tags (sem service worker, conforme regra da plataforma — instalável, sem cache problemático).
- Design tokens em `src/styles.css`: azul profundo (do logo) como primary, verde sucesso, laranja alerta, vermelho erro, cinza rascunho. Cards suaves, sombras leves, bordas arredondadas.
- Acessibilidade: contexto `FontScaleProvider` (normal / grande / extra grande) com `localStorage`, aplicando classe no `<html>` que escala tipografia base.

## Arquitetura de dados (mock → Supabase)

Pasta `src/data/` com tipos + mocks espelhando as futuras tabelas:

```
src/
  types/                # Company, User, Customer, Service, PricingSettings,
                        # Quote, WorkOrder, Payment, Expense, Protocol,
                        # Checklist, Referral, Followup
  data/
    mock-company.ts
    mock-customers.ts
    mock-services.ts
    mock-pricing.ts
    mock-quotes.ts
    mock-work-orders.ts
    mock-agenda.ts
    mock-finance.ts
    mock-protocols.ts
    mock-checklists.ts
    mock-pops.ts
    mock-slas.ts
    mock-messages.ts
    mock-referrals.ts
    mock-followups.ts
  stores/               # Zustand stores (pricing settings, font scale,
                        # company config) — fácil trocar por chamadas Supabase
  lib/
    pricing.ts          # função pura calcQuote() + alertas
    whatsapp.ts         # gera links wa.me e textos prontos
    format.ts           # moeda BRL, datas pt-BR
```

Cada store/serviço expõe funções (`listCustomers`, `getQuote`, etc.) — depois trocadas por queries Supabase sem mexer nas telas.

## Layout e navegação

- `src/routes/_app.tsx` — layout autenticado com **Sidebar desktop** + **Bottom nav mobile** + **Topbar** (nome empresa, botão tamanho de fonte, avatar).
- `src/routes/_public.tsx` — layout para Portal do Cliente e Página Institucional (sem sidebar).
- Rotas (uma por arquivo, cada uma com `head()` próprio para SEO):

```
/                          → redireciona para /dashboard
/dashboard
/clientes  /clientes/$id
/orcamentos  /orcamentos/novo  /orcamentos/$id
/ordens  /ordens/$id
/agenda
/financeiro
/portal/$token             (público — Portal do Cliente)
/site                      (público — Página Institucional)
/biblioteca                (abas: protocolos, checklists, pops, slas, mensagens)
/configuracoes
/modulos-futuros
```

## Telas principais

**Dashboard** — 8 cards de status + 6 ações rápidas (botões grandes com ícones).

**Clientes** — lista responsiva (cards no mobile, tabela no desktop), busca, filtros por tipo, drawer "novo cliente". Detalhe com histórico, garantias, botões WhatsApp / criar orçamento / criar OS / pedir indicação / pedir avaliação.

**Gerador de Orçamento** (prioridade máxima) — wizard de 10 etapas em `/orcamentos/novo`:
1. Cliente · 2. Problema · 3. Tipo de cobrança · 4. Complexidade · 5. Urgência · 6. Deslocamento · 7. Tempo · 8. Peças · 9. Garantia · 10. Resultado.
- Barra de progresso, botões grandes, linguagem simples, card "Histórico do cliente".
- Card de alerta **"Não pague para trabalhar"** que aparece dinamicamente.
- Função `calcQuote()` calcula em tempo real **Mínimo / Recomendado / Premium** seguindo a fórmula especificada.
- Ações finais: usar recomendado, ajustar, aplicar desconto, salvar rascunho, gerar texto WhatsApp, aprovar e criar OS.

**Orçamentos** — lista com badges de status (8 estados), detalhe com resumo do cálculo, link público mock, botão copiar WhatsApp.

**Ordens de Serviço** — lista por status (11 estados), detalhe com **timeline vertical** de 7 passos, checklist interativo, fotos antes/depois (placeholders), peças, pagamento, garantia.

**Agenda** — abas Hoje / Semana / Mês / Aguardando. Cards de horário com cliente, bairro, serviço, valor, WhatsApp, iniciar OS.

**Financeiro** — entradas/saídas, KPIs (faturamento, lucro estimado, ticket médio), top serviços, aprovados vs recusados (gráficos simples via Recharts já disponível).

**Portal do Cliente** (`/portal/$token`, prioridade alta) — público, branded, mostra status com timeline visual, botões WhatsApp / indicar amigo / avaliar.

**Indicações** — fluxo no portal + painel interno com kanban simples de status.

**Pós-venda** — lista de tarefas (1d / 7d / 30d) com mensagens prontas, copiar, abrir WhatsApp, marcar feito.

**Página Institucional** (`/site`) — hero + serviços + como funciona + diferenciais + prova social + contatos. Branded e responsiva.

**Biblioteca Profissional** (prioridade alta) — `/biblioteca` com 5 abas:
- Protocolos (10 cards conforme briefing)
- Checklists (3 interativos: chegada, execução, encerramento — estado local com toggles)
- POPs (10 documentos curtos)
- SLAs (lista editável de prazos + indicadores verde/amarelo/vermelho)
- Modelos de mensagem (cards "copiar")

**Configurações** — 13 seções em accordion/tabs: empresa, logo, cor, contatos, região, serviços, **valores de precificação editáveis** (persistidos em `localStorage`), garantia padrão, mensagens, SLA, fonte, página institucional.

**Módulos Futuros** — grid de cards com badge "Em breve" (Emissão fiscal em destaque, conforme pedido).

## Componentes compartilhados

`StatusBadge`, `StatCard`, `QuickAction`, `Timeline`, `WizardStep`, `WhatsAppButton`, `EmptyState`, `PageHeader`, `MobileBottomNav`, `AppSidebar`, `FontScaleToggle`, `BrandLogo`.

Tudo usando shadcn já presente (Card, Button, Tabs, Dialog, Drawer, Accordion, Checkbox, Input, Select, Sheet, Progress, Badge).

## Marca e personalização

- `src/config/brand.ts` exporta `{ name: "CampoOS", logo, primaryColor }` — trocar nome/logo em um único lugar.
- Logos AZL ficam disponíveis como exemplo no mock da empresa.

## PWA

- `public/manifest.webmanifest` + ícones gerados a partir do logo.
- `<link rel="manifest">` e meta theme-color no `__root.tsx`.
- `display: "standalone"`, mobile-first, instalável. Sem service worker (regra da plataforma).

## Qualidade — critérios atendidos

Todos os 15 critérios do briefing cobertos: criar cliente, gerar orçamento com cálculo real, alertas de preço, copiar WhatsApp, converter em OS, agenda, registrar pagamento, portal, página institucional, indicações, pós-venda, biblioteca, fonte ajustável, mobile excelente, sensação de produto real.

## Entrega

Implementação em uma única passada após aprovação, priorizando visualmente: **Gerador de Orçamento → Portal do Cliente → Biblioteca Profissional → Dashboard → resto**. Todas as telas navegáveis com mocks ricos e coerentes entre si (mesmo cliente aparece em orçamento, OS, agenda, financeiro e portal).
