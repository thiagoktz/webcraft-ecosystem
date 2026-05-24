# WebCraft — Ecossistema Multi-Agente (Completo)

Repositório central com orquestrador, 8 agentes especializados, 17 skills compartilhados e infraestrutura de logging, versionamento e dashboard.

---

## Arquitetura completa

```
Usuário
   ↓
[Memory Agent]  ← recupera contexto do cliente
   ↓
[Orchestrator]  ← lê registry, define pipeline
   ↓
[Design Agent]  ← tokens visuais e brand guide
   ↓
[Content Agent] ← imagens, ícones, mídias
   ↓
[SEO Agent]     ← palavras-chave e meta tags
   ↓
[Copy Agent]    ← textos por seção
   ↓
[WebCraft Agent]← HTML/CSS/JS integrado
   ↓
[QA Agent]      ← validação completa
   ↓
[Feedback Agent]← coleta feedback, alimenta melhoria
   ↓
[Memory Agent]  ← salva contexto e histórico
```

---

## Estrutura do repositório

```
multi-agent-repo/
  ├── README.md
  ├── agent-registry.json
  ├── EXEMPLO-PIPELINE.md
  │
  ├── orchestrator/
  │     ├── system-prompt.md
  │     └── skills/
  │           ├── routing/SKILL.md
  │           └── integration/SKILL.md
  │
  ├── agents/
  │     ├── webcraft/          # Gera HTML/CSS/JS
  │     ├── copy-agent/        # Escreve textos
  │     ├── seo-agent/         # Palavras-chave e meta tags
  │     ├── design-agent/      # Tokens visuais e brand guide
  │     ├── content-agent/     # Imagens, ícones, mídias
  │     ├── qa-agent/          # Validação de qualidade
  │     ├── feedback-agent/    # Coleta e analisa feedback
  │     └── memory-agent/      # Contexto entre sessões
  │
  ├── shared-skills/
  │     ├── frontend-design/   # UI de qualidade
  │     ├── acessibilidade/    # WCAG 2.1 AA
  │     ├── seo/               # SEO on-page
  │     ├── analytics/         # GA4 e eventos
  │     ├── performance/       # Core Web Vitals
  │     ├── error-handling/    # Erros e fallbacks
  │     ├── output-validation/ # Schemas JSON entre agentes
  │     ├── brand-guide/       # Identidade de marca
  │     ├── content-strategy/  # Hierarquia de mensagens
  │     ├── ab-testing/        # Testes de conversão
  │     ├── security/          # Headers e sanitização
  │     ├── forms-backend/     # Netlify/Formspree/EmailJS
  │     └── rate-limiting/     # Circuit breaker e throttle
  │
  └── infra/
        ├── logging/           # Formato padrão de logs
        ├── versioning/        # Histórico de outputs
        └── dashboard/         # Saúde dos agentes
```

---

## Pipelines disponíveis

| Pipeline | Agentes | Resultado |
|---|---|---|
| `site-premium` | Memory→Design→Content→SEO→Copy→WebCraft→QA→Feedback | Máxima qualidade |
| `site-completo` | Memory→SEO→Copy→WebCraft→QA | Qualidade alta, mais rápido |
| `site-rapido` | WebCraft→QA | Protótipo em minutos |
| `redesign-textos` | Copy→WebCraft→QA | Novos textos em site existente |
| `auditoria-seo` | SEO | Análise de site existente |

---

## Shared skills — quem usa cada um

| Skill | Agentes que usam |
|---|---|
| `frontend-design` | WebCraft |
| `acessibilidade` | WebCraft, QA |
| `seo` | SEO Agent, WebCraft |
| `analytics` | WebCraft |
| `performance` | WebCraft, QA |
| `error-handling` | Todos |
| `output-validation` | Orchestrator, QA |
| `brand-guide` | Design, Copy |
| `content-strategy` | Copy |
| `ab-testing` | WebCraft, Analytics |
| `security` | WebCraft, QA |
| `forms-backend` | WebCraft |
| `rate-limiting` | Orchestrator |

---

## Versão

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | Mai 2026 | Orquestrador + WebCraft + Copy + SEO |
| 2.0 | Mai 2026 | Ecossistema completo — 8 agentes, 17 skills, infra completa |
