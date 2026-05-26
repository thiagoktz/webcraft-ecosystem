# WebCraft — Handoff para Novo Claude
**Projeto:** Ecossistema multi-agente para desenvolvimento de websites
**Dono:** thiagoktz
**Status:** Produção — 3 repos no ar, 12 agentes, 10 pipelines, 312 critérios de EVALS
**Versão:** 2.4.0
**Data:** Maio 2026

---

## O que é este projeto

Um ecossistema completo de agentes de IA para criar sites profissionais. O thiagoktz descreve um projeto em linguagem natural — o ecossistema cuida de SEO, textos, design, código, qualidade e deploy automaticamente.

---

## Repositórios no ar

| Repo | URL | Visibilidade | Arquivos |
|---|---|---|---|
| webcraft-standalone | github.com/thiagoktz/webcraft-standalone | Public | 16 |
| webcraft-ecosystem | github.com/thiagoktz/webcraft-ecosystem | Public | 88 |
| webcraft-clients | github.com/thiagoktz/webcraft-clients | Private | ~6 |

**Como verificar:**
```bash
curl https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/ecosystem.json
# → Deve retornar o JSON do ecossistema sem erro
```

---

## Arquitetura em uma frase

O **Orchestrator** recebe o pedido, detecta o perfil do usuário, escolhe o pipeline e coordena os agentes em sequência. Cada agente entrega um JSON que o próximo consome. O **QA Agent** valida antes de qualquer entrega. O **Memory Agent** persiste tudo no Supabase.

---

## Os 12 agentes

| Agente | Papel | Skills próprios |
|---|---|---|
| Orchestrator | Coordena tudo, decide pipelines | routing, integration |
| Memory Agent | Contexto entre sessões (Supabase) | — |
| Design Agent | Tokens visuais, TASTE.md, dark mode | visual-direction, token-system, typography, uiux-pro, taste |
| Content Agent | Imagens, ícones, mídias | — |
| SEO Agent | Keywords, meta tags, schema.org | keyword-research, schema |
| Copy Agent | Textos por seção em JSON | copywriting, cta, tone-of-voice |
| WebCraft Agent | HTML/CSS/JS final | motion, components, impeccable + 8 outros |
| QA Agent | Valida 7 camadas antes da entrega | checklist |
| Feedback Agent | Classifica feedback, melhoria contínua | — |
| Backend Agent | API REST, auth, banco de dados | auth, database-schema |
| E-commerce Agent | Stripe, Mercado Pago, PagSeguro, PIX | payment-gateway |
| CMS Agent | Painel admin para o cliente editar | admin-ui |

---

## Os 10 pipelines

```
site-completo       → SEO→Copy→WebCraft→QA              padrão
site-rapido         → WebCraft→QA                        protótipo
site-com-cms        → +Backend+CMS                       com painel admin
ecommerce-completo  → todos os agentes                   loja completa
redesign-textos     → Copy→WebCraft→QA                   novos textos
auditoria-seo       → SEO                                análise
backend-apenas      → Backend→QA                         só API
adicionar-pagamento → Ecommerce→QA                       pagamento em site existente
adicionar-cms       → CMS→QA                             painel em site existente
site-pro-max        → Design→Content→SEO→Copy→WebCraft→QA→Feedback  qualidade máxima
```

Todos os pipelines que entregam ao cliente terminam em QA Agent. Exceção: `auditoria-seo` (só retorna análise).

---

## Infraestrutura conectada

```
Vercel      → deploy automático de sites e APIs
Supabase    → banco de dados, auth, storage (schema em scripts/setup-database.sql)
Cloudflare  → Workers, D1, KV, R2, Queues
Google Drive → brand guides e referências dos clientes
Gmail       → notificações de entrega e emails transacionais
```

---

## Features premium integradas

```
Framer Motion   → animações React (skill: agents/webcraft-agent/skills/motion/)
21st.dev        → componentes UI premium (skill: agents/webcraft-agent/skills/components/)
UI/UX Pro Max   → design avançado, dark mode (skill: agents/design-agent/skills/uiux-pro/)
Impeccable      → 23 comandos de design (/audit, /polish, /animate...)
                  skill: agents/webcraft-agent/skills/impeccable/
Taste Skill     → padrão estético anti-slop, dials VARIANCE/MOTION/DENSITY
                  skill: agents/design-agent/skills/taste/
```

---

## Fluxo de novo cliente

```
1. node ../webcraft-clients/new-client.mjs
   → gera (no repo webcraft-clients) clients/{id}/client.json + ACTIVATE.md + REVISAO.md + TASTE.md + .impeccable.md

2. Colar o bloco do REVISAO.md em nova conversa com Claude

3. Descrever o projeto → Orchestrator executa o pipeline

4. Após entrega: preencher "Aprovado" e "Não mudar" no REVISAO.md

5. git add . && git commit && git push → Vercel redeploy automático
```

---

## Fluxo de revisão futura

```
1. Ler REVISAO.md do cliente (OBRIGATÓRIO antes de qualquer ação)
2. Nova conversa com Claude
3. Colar bloco de ativação do REVISAO.md
4. Informar URL do código atual no GitHub
5. Descrever a revisão
6. Atualizar histórico no REVISAO.md após concluir
```

---

## O que o thiagoktz opera manualmente

```
✅ Rodando o new-client.mjs para onboarding
✅ Colando o bloco de ativação no Claude
✅ Revisão humana antes de entregar ao cliente
✅ Configurar domínio (DNS no registrador)
✅ Preencher REVISAO.md após cada entrega
✅ Revogar tokens GitHub após uso
```

---

## O que é automático

```
🤖 SEO, acessibilidade, responsividade
🤖 Deploy via Vercel após git push
🤖 Validação estrutural a cada PR (CI .github/workflows/evals.yml)
🤖 Memory Agent persiste contexto no Supabase
🤖 QA antes de toda entrega
🤖 Fallback quando agente falha
```

---

## Decisões de arquitetura tomadas

- **Stack padrão:** HTML/CSS/JS (sem framework por default)
- **Deploy padrão:** Vercel
- **Banco:** Supabase (PostgreSQL) com schema em `scripts/setup-database.sql`
- **Pagamentos BR:** Mercado Pago como gateway principal
- **CMS:** painel próprio via Supabase (grátis) ou Sanity (até 3 usuários grátis)
- **Qualidade visual:** Impeccable + Taste Skill + Framer Motion + 21st.dev

---

## Métricas atuais

- **Agentes:** 15 (Orchestrator + 14 especializados)
- **Pipelines:** 10
- **Shared-skills:** 17
- **Connectors ativos:** 8 (cloudflare, gmail, google-analytics, google-drive, google-places, supabase, unsplash, vercel)
- **Connectors disponíveis sem implementar:** 8
- **Critérios EVALS (ecosystem):** 312 distribuídos em 14 arquivos
- **Critérios EVALS (standalone):** 101 em EVALS.md + adicionais nos SKILL.md

### Sobre o "score 100/100"

O score 100/100 mencionado em versões anteriores deste handoff refere-se a uma **auditoria estrutural manual** feita em 2026-05-23 que verificou:
- Cada agente declarado tem system-prompt.md ✅
- Cada skill declarado tem SKILL.md ✅
- Cada agente tem arquivo de evals ✅
- JSONs válidos sintaticamente ✅

Não é um score de execução dos EVALS. Os EVALS funcionais (com avaliação por LLM) **rodam contra o repo standalone** via `.github/workflows/evals.yml` daquele repositório. O workflow equivalente no ecosystem (atualizado em 2026-05-24) faz apenas **validação estrutural** — não executa EVALS funcionais ainda.

Para verificar a saúde do ecosystem rodando localmente:
```bash
node -e "JSON.parse(require('fs').readFileSync('ecosystem.json'))"
node -e "JSON.parse(require('fs').readFileSync('agent-registry.json'))"
# E os checks do workflow CI
```

---

## Pendências conhecidas

```
1. CONNECTOR.md faltantes (8 conectores sem documentação):
   netlify, mailerlite, calendly, hubspot, webflow, wordpress, jotform, wix

2. EVALS funcionais do ecosystem:
   O CI atual valida apenas estrutura. Adicionar job que roda os EVALS
   de cada arquivo em evals/agents/ contra os outputs reais dos agentes.

3. Migração para Claude Code (opcional):
   → Criar CLAUDE.md na raiz
   → Mover skills para .claude/skills/
   → Slash commands via .claude/commands/

4. Sincronizar README com versões futuras:
   ecosystem.json é a fonte de verdade — README e HANDOFF devem ser
   atualizados sempre que ecosystem.json mudar de versão.
```

---

## Como retomar qualquer tarefa

### Adicionar um novo agente:
```
1. Criar agents/{nome}/system-prompt.md
2. Criar agents/{nome}/skills/{skill}/SKILL.md
3. Adicionar entry em agent-registry.json (com can_call e called_by coerentes)
4. Adicionar entry em ecosystem.json.agents.list e atualizar agents.total
5. Criar evals/agents/{nome}.md
6. Adicionar a pipelines relevantes em AMBOS os JSONs
7. Atualizar README.md (tabela "Os 12 agentes")
8. Commit + push → CI valida estrutura
```

### Criar CONNECTOR.md faltante:
```
Padrão: ver connectors/vercel/CONNECTOR.md como template
Campos obrigatórios: Status, MCP URL, Agentes que usam,
  exemplos de código, ferramentas MCP disponíveis, checklist
```

### Adicionar novo pipeline:
```
1. Definir sequência de agentes (incluir qa-agent no fim se houver entrega)
2. Adicionar em agent-registry.json → pipelines
3. Adicionar em ecosystem.json → pipelines
4. Documentar em evals/pipelines/pipelines.md
5. Atualizar README.md (tabela "Os 10 pipelines")
```

---

## Arquivos-chave para ler primeiro

```
ecosystem.json              → visão geral, fonte de verdade do ecossistema
agent-registry.json         → schema detalhado de cada agente e pipeline
orchestrator/system-prompt.md → como o Orchestrator pensa
ACTIVATE.md                 → como ativar (está nos dois repos públicos)
../webcraft-clients/new-client.mjs → onboarding de clientes (vive no repo irmão)
clients/REVISAO-exemplo.md  → exemplo real de REVISAO.md preenchido
```

---

## Contexto do thiagoktz

- Usa Claude no browser (claude.ai) e tem Claude Code rodando em projeto paralelo
- Prefere respostas diretas e operacionais — sem enrolação
- Quer o máximo automatizado — operação manual só no inevitável
- Já entende o ecossistema — não precisa de explicações básicas
- Tokens GitHub sempre revogados após uso

---

## Histórico

| Versão | Data | Mudança |
|---|---|---|
| 2.0 | 2026-05-23 | 8 agentes, infra completa |
| 2.1.0 | 2026-05-24 | +3 agentes (backend, ecommerce, cms), +4 pipelines, sincronização registry↔ecosystem.json, CI reescrito para validar o próprio ecosystem, contagens reais |
| 2.2.0 | 2026-05-26 | +buscador-agent (Google Places, reviews reais), +2 connectors (Unsplash, Google Places), +shared-skill social-sharing (OG completo + WhatsApp preview + ícones sociais), webcraft-agent atualizado para renderizar o bloco OG e o footer social, validação de og:image (HTTPS, dimensões, <300KB) na Camada 4.5 do QA |
| 2.3.0 | 2026-05-26 | +analytics-agent (GA4 + GTM, mapeamento de conversões, docs do cliente), +connector google-analytics, +shared-skill analytics, qa-agent ganha Camada 4.6 (valida GTM/dataLayer/listeners), webcraft-agent passa a marcar data-cta e id em CTAs/forms para tracking sem ambiguidade. Pipelines site-completo, site-com-cms, ecommerce-completo, redesign-textos e site-pro-max ganham analytics-agent antes do qa-agent. Aviso interim de LGPD até Compliance Agent existir. |
| 2.4.0 | 2026-05-26 | +compliance-agent (LGPD: banner Consent Mode v2 padrão híbrido Aceitar/Recusar/Personalizar; endpoints obrigatórios direitos do titular), +shared-skill lgpd-compliance (bases legais, retenção, anti-patterns), +skill legal-copy no copy-agent (compliance delega geração de Política de Privacidade e Política de Cookies). qa-agent ganha Camada 4.7. Backend ganha endpoints LGPD. WebCraft reserva slot footer.legal-links. Analytics detecta compliance_active e remove o TODO LGPD interim. Pipelines site-completo, site-com-cms, ecommerce-completo e site-pro-max ganham compliance-agent ANTES do analytics-agent (Consent Mode v2 entra antes do GTM). |

---

*Handoff atualizado em 26 de maio de 2026 — WebCraft Ecosystem v2.4.0*
*Para retomar: ler este arquivo + abrir ecosystem.json + agent-registry.json*
