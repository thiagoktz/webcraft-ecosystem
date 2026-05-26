# WebCraft — Ecossistema Multi-Agente

Repositório central com Orchestrator, **14 agentes especializados**, **16 shared-skills** e infraestrutura completa de logging, versionamento, dashboard e CI/CD.

**Versão:** 2.3.0 · **Atualizado:** 26 de maio de 2026

---

## Arquitetura

```
Usuário
   ↓
[Memory Agent]     ← recupera contexto do cliente
   ↓
[Orchestrator]     ← lê registry, escolhe pipeline
   ↓
[Design Agent]     ← tokens visuais, TASTE.md, dark mode
   ↓
[Content Agent]    ← imagens, ícones, mídias
   ↓
[SEO Agent]        ← palavras-chave, meta tags, schema.org
   ↓
[Copy Agent]       ← textos por seção em JSON
   ↓
[WebCraft Agent]   ← HTML/CSS/JS final
   ↓
[Backend Agent]    ← API REST, auth, banco (quando aplicável)
   ↓
[E-commerce Agent] ← Stripe/Mercado Pago/PIX (quando aplicável)
   ↓
[CMS Agent]        ← painel admin (quando aplicável)
   ↓
[QA Agent]         ← validação 7 camadas (sempre)
   ↓
[Feedback Agent]   ← coleta feedback, melhoria contínua
   ↓
[Memory Agent]     ← persiste histórico no Supabase
```

---

## Os 14 agentes

| Agente | Papel | Skills próprios |
|---|---|---|
| `orchestrator` | Coordena todos, decide pipelines | routing, integration |
| `memory-agent` | Contexto entre sessões (Supabase) | — |
| `design-agent` | Tokens visuais, TASTE.md, dark mode | visual-direction, token-system, typography, uiux-pro, taste |
| `content-agent` | Imagens, ícones, mídias | — |
| `seo-agent` | Keywords, meta tags, schema.org | keyword-research, schema |
| `buscador-agent` | Reviews e score reais via Google Places | — |
| `copy-agent` | Textos por seção em JSON | copywriting, cta, tone-of-voice |
| `webcraft-agent` | HTML/CSS/JS final | motion, components, impeccable, intake, deploy, ecommerce-lite, multilingual, performance, feedback-loop |
| `analytics-agent` | GA4 + GTM, mapeamento de conversões, docs do cliente | — |
| `qa-agent` | Valida 7 camadas antes da entrega | checklist |
| `feedback-agent` | Classifica feedback, melhoria contínua | — |
| `backend-agent` | API REST, auth, banco | auth, database-schema |
| `ecommerce-agent` | Stripe, Mercado Pago, PagSeguro, PIX | payment-gateway |
| `cms-agent` | Painel admin para o cliente editar | admin-ui |

---

## Estrutura do repositório

```
webcraft-ecosystem/
  ├── README.md
  ├── HANDOFF.md
  ├── ACTIVATE.md
  ├── EXEMPLO-PIPELINE.md
  ├── ecosystem.json
  ├── agent-registry.json
  │
  ├── orchestrator/
  │     ├── system-prompt.md
  │     └── skills/
  │           ├── routing/SKILL.md
  │           └── integration/SKILL.md
  │
  ├── agents/
  │     ├── webcraft-agent/      # HTML/CSS/JS, 11 skills incluindo Impeccable
  │     ├── copy-agent/          # Textos persuasivos
  │     ├── seo-agent/           # Keywords e meta tags
  │     ├── design-agent/        # Tokens, Taste Skill, dark mode
  │     ├── content-agent/       # Imagens, ícones, mídias
  │     ├── buscador-agent/      # Reviews e score via Google Places
  │     ├── analytics-agent/     # GA4 + GTM, mapeamento de conversões
  │     ├── qa-agent/            # Validação 7 camadas
  │     ├── feedback-agent/      # Classifica feedback
  │     ├── memory-agent/        # Contexto via Supabase
  │     ├── backend-agent/       # API, auth, database-schema
  │     ├── ecommerce-agent/     # Pagamentos
  │     └── cms-agent/           # Painel admin
  │
  ├── shared-skills/             # 16 skills compartilhados
  │     ├── ab-testing/          # Testes de conversão
  │     ├── acessibilidade/      # WCAG 2.1 AA
  │     ├── analytics/           # GA4 + GTM, eventos, dataLayer
  │     ├── auth-patterns/       # JWT, OAuth, sessions
  │     ├── brand-guide/         # Identidade de marca
  │     ├── cms-integration/     # Sanity, Contentful, Supabase
  │     ├── content-strategy/    # Hierarquia de mensagens
  │     ├── error-handling/      # Erros e fallbacks
  │     ├── forms-backend/       # Netlify/Formspree/EmailJS
  │     ├── frontend-design/     # UI de qualidade
  │     ├── output-validation/   # Schemas JSON entre agentes
  │     ├── payments/            # Patterns de gateway
  │     ├── rate-limiting/       # Circuit breaker e throttle
  │     ├── security/            # Headers e sanitização
  │     ├── seo/                 # SEO on-page
  │     └── social-sharing/      # Open Graph + Twitter Card + WhatsApp preview
  │
  ├── connectors/                # MCPs / APIs ativos
  │     ├── cloudflare/
  │     ├── gmail/
  │     ├── google-analytics/
  │     ├── google-drive/
  │     ├── google-places/
  │     ├── supabase/
  │     ├── unsplash/
  │     └── vercel/
  │
  ├── evals/                     # 312 critérios distribuídos
  │     ├── EVALS.md
  │     ├── agents/              # 11 arquivos, um por agente
  │     ├── pipelines/pipelines.md
  │     └── shared-skills/shared-skills.md
  │
  ├── clients/                   # Templates e exemplos
  │     ├── client-template.json
  │     ├── project-template.json
  │     └── REVISAO-exemplo.md
  │
  ├── scripts/
  │     ├── import-client.mjs
  │     ├── setup-database.sql
  │     ├── health-check.mjs
  │     ├── setup-secrets.sh
  │     └── validate-og.mjs
  │     (new-client.mjs vive no repo irmão webcraft-clients/)
  │
  ├── infra/
  │     ├── logging/
  │     ├── versioning/
  │     └── dashboard/
  │
  └── .github/workflows/evals.yml  # CI/CD do ecossistema
```

---

## Os 10 pipelines

| Pipeline | Sequência | Caso de uso |
|---|---|---|
| `site-completo` | SEO → Copy → WebCraft → QA | Padrão recomendado |
| `site-rapido` | WebCraft → QA | Protótipo em minutos |
| `site-pro-max` | Memory → Design → Content → SEO → Copy → WebCraft → QA → Feedback | Máxima qualidade |
| `site-com-cms` | Memory → SEO → Copy → WebCraft → Backend → CMS → QA | Site com painel admin |
| `ecommerce-completo` | Memory → Design → SEO → Copy → WebCraft → Backend → Ecommerce → CMS → QA → Feedback | Loja completa |
| `redesign-textos` | Copy → WebCraft → QA | Novos textos em site existente |
| `auditoria-seo` | SEO | Análise de site existente |
| `backend-apenas` | Backend → QA | Só API |
| `adicionar-pagamento` | Ecommerce → QA | Pagamento em site existente |
| `adicionar-cms` | CMS → QA | Painel em site existente |

> Todos os pipelines que entregam algo ao cliente terminam em **QA Agent**. A única exceção é `auditoria-seo`, que retorna apenas análise.

---

## Shared-skills — quem usa cada um

| Skill | Agentes que declaram uso |
|---|---|
| `ab-testing` | webcraft-agent |
| `acessibilidade` | webcraft-agent |
| `auth-patterns` | backend-agent |
| `brand-guide` | design-agent |
| `cms-integration` | cms-agent |
| `content-strategy` | copy-agent |
| `error-handling` | todos os 13 |
| `forms-backend` | webcraft-agent |
| `frontend-design` | webcraft-agent |
| `output-validation` | qa-agent |
| `payments` | ecommerce-agent |
| `rate-limiting` | orchestrator |
| `security` | backend-agent, ecommerce-agent, cms-agent, qa-agent |
| `seo` | seo-agent |

---

## Connectors

**Ativos (8):** cloudflare, gmail, google-analytics, google-drive, google-places, supabase, unsplash, vercel — cada um com `CONNECTOR.md` documentado.

### Shared-skill destacada — `social-sharing`
Toda página gerada do ecossistema entrega Open Graph + Twitter Card completos (com `og:image` 1200×630, < 300 KB) para que o link colado em WhatsApp/Telegram/LinkedIn/Slack renderize preview rico. O QA Agent valida automaticamente em Camada 4.5. Ícones sociais (WhatsApp, Instagram, Facebook, LinkedIn) entram no footer por padrão.

### Worker de infra — `webcraft-cache-proxy`
Proxy + cache em Cloudflare Workers para Google Places e Unsplash. Esconde as keys do frontend, cacheia respostas em KV (TTL 7 dias) pra economizar chamadas pagas e rate-limitadas. Endpoints: `/health`, `/places/search`, `/places/details`, `/unsplash/search`. Código em `infra/workers/cache-proxy/`, deploy via `npx wrangler deploy` e secrets via `scripts/setup-secrets.sh webcraft-cache-proxy`.

**Disponíveis (8, sem documentação ainda):** calendly, hubspot, jotform, mailerlite, netlify, webflow, wix, wordpress.

---

## Features premium integradas

| Feature | Skill | Quando aciona |
|---|---|---|
| **Framer Motion** | `agents/webcraft-agent/skills/motion/` | Animações React |
| **21st.dev** | `agents/webcraft-agent/skills/components/` | Componentes UI premium |
| **UI/UX Pro Max** | `agents/design-agent/skills/uiux-pro/` | Design avançado, dark mode |
| **Impeccable** | `agents/webcraft-agent/skills/impeccable/` | 23 comandos (/audit, /polish, /animate…) |
| **Taste Skill** | `agents/design-agent/skills/taste/` | Padrão estético anti-slop com dials VARIANCE/MOTION/DENSITY |

---

## Infraestrutura conectada

```
Vercel       → deploy automático de sites e APIs
Supabase     → banco, auth, storage (schema em scripts/setup-database.sql)
Cloudflare   → Workers, D1, KV, R2, Queues
Google Drive → brand guides e referências dos clientes
Gmail        → notificações de entrega e emails transacionais
```

---

## Como usar

```bash
# 1. Onboarding de novo cliente (script vive no repo irmão webcraft-clients/)
node ../webcraft-clients/new-client.mjs

# 2. Copiar o bloco de ativação gerado em clients/{id}/REVISAO.md

# 3. Colar em nova conversa com Claude e descrever o projeto

# 4. Orchestrator escolhe o pipeline e coordena os agentes

# 5. Após aprovação:
git add . && git commit -m "feat: nova entrega" && git push
# → Vercel deploy automático
```

Detalhes em [`ACTIVATE.md`](ACTIVATE.md) e [`HANDOFF.md`](HANDOFF.md).

---

## Versão

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | Mai 2026 | Orquestrador + WebCraft + Copy + SEO |
| 2.0 | Mai 2026 | Ecossistema completo — 8 agentes, infra completa |
| 2.1.0 | Mai 2026 | +3 agentes (backend, ecommerce, cms), +4 pipelines, sincronização registry↔ecosystem.json, CI reescrito |
| 2.2.0 | Mai 2026 | +buscador-agent (Google Places + reviews reais), +2 connectors (Unsplash, Google Places), +shared-skill social-sharing (OG + WhatsApp preview), webcraft-agent renderiza ícones sociais e og:image |
| **2.3.0** | **Mai 2026** | **+analytics-agent (GA4 + GTM, mapeamento de conversões, docs do cliente), +connector google-analytics, +shared-skill analytics, qa-agent ganha Camada 4.6, webcraft-agent passa a marcar `data-cta`/`id` em CTAs/forms** |
