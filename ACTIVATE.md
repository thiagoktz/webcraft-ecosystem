# ACTIVATE — WebCraft Ecosystem
**Repo:** github.com/thiagoktz/webcraft-ecosystem  
**Versão:** 2.1 | **Agentes:** 12 | **Pipelines:** 10

---

## Ativação do Orchestrator

Cole este bloco no início de uma conversa com o Claude:

```
Você é o Orchestrator do ecossistema WebCraft.

Leia e siga:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/system-prompt.md

Registro de agentes:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agent-registry.json

Ecosystem manifest:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/ecosystem.json

Skills do Orchestrator:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/routing/SKILL.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/integration/SKILL.md

Carregue o registry e o ecosystem antes de qualquer ação.
Detecte o perfil do usuário e selecione o pipeline correto.
```

---

## Pipelines disponíveis

| Diga ao Claude... | Pipeline acionado | Agentes |
|---|---|---|
| "Cria um site completo" | `site-completo` | SEO → Copy → WebCraft → QA |
| "Protótipo rápido" | `site-rapido` | WebCraft → QA |
| "Site + painel admin" | `site-com-cms` | +Backend +CMS |
| "Loja com pagamento" | `ecommerce-completo` | todos os agentes |
| "Novos textos" | `redesign-textos` | Copy → WebCraft → QA |
| "Analisa meu SEO" | `auditoria-seo` | SEO Agent |
| "Só backend/API" | `backend-apenas` | Backend → QA |
| "Adiciona pagamento" | `adicionar-pagamento` | Ecommerce → QA |
| "Adiciona painel" | `adicionar-cms` | CMS → QA |
| "Máxima qualidade" | `site-pro-max` | Design → Content → SEO → Copy → WebCraft → QA |

---

## Ativar para um cliente específico

Após rodar `new-client.mjs`, copie o bloco do `REVISAO.md` do cliente.
Ou use este template manual:

```
Você é o Orchestrator do ecossistema WebCraft.

Leia e siga:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/system-prompt.md

Registro de agentes:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agent-registry.json

Skills:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/routing/SKILL.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/integration/SKILL.md

CONTEXTO DO CLIENTE:
client_id: [gerado pelo new-client.mjs]
empresa: [nome da empresa]
segmento: [saúde | tech | educação | alimentação | jurídico | outro]
perfil: [pm | dev | designer]
stack: [HTML/CSS/JS | React | Next.js]
deploy: [vercel | netlify | cloudflare]
tom: [acolhedor | profissional | descontraído | técnico | premium]

Carregue o contexto antes de qualquer ação.
```

---

## Mapa de skills por situação

| Situação | Skill carregado automaticamente |
|---|---|
| Toda geração de UI | `shared-skills/frontend-design/SKILL.md` |
| Primeiro briefing | `agents/copy-agent/skills/intake/SKILL.md` |
| Revisão após entrega | `agents/webcraft-agent/skills/feedback-loop/SKILL.md` |
| Deploy solicitado | `agents/webcraft-agent/skills/deploy/SKILL.md` |
| Otimização Google | `agents/seo-agent/skills/keyword-research/SKILL.md` |
| Acessibilidade | `shared-skills/acessibilidade/SKILL.md` |
| Catálogo de produtos | `agents/webcraft-agent/skills/ecommerce-lite/SKILL.md` |
| Múltiplos idiomas | `agents/webcraft-agent/skills/multilingual/SKILL.md` |
| Performance | `agents/webcraft-agent/skills/performance/SKILL.md` |
| Analytics | `shared-skills/analytics/SKILL.md` (via repo standalone) |
| Pagamento real | `agents/ecommerce-agent/skills/payment-gateway/SKILL.md` |
| Painel admin | `agents/cms-agent/skills/admin-ui/SKILL.md` |
| Animações React | `agents/webcraft-agent/skills/motion/SKILL.md` |
| Componentes 21st.dev | `agents/webcraft-agent/skills/components/SKILL.md` |
| Design avançado | `agents/design-agent/skills/uiux-pro/SKILL.md` |
| Auditoria Impeccable | `agents/webcraft-agent/skills/impeccable/SKILL.md` |

---

## URLs de referência rápida

```
Orchestrator:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/system-prompt.md

Registry:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agent-registry.json

Ecosystem:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/ecosystem.json

Agentes (exemplos):
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agents/copy-agent/system-prompt.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agents/seo-agent/system-prompt.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agents/webcraft-agent/system-prompt.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agents/qa-agent/system-prompt.md
```

---

*WebCraft Ecosystem v2.1 — github.com/thiagoktz/webcraft-ecosystem*
