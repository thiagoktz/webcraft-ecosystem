# WebCraft — Handoff para Novo Claude
**Projeto:** Ecossistema multi-agente para desenvolvimento de websites  
**Dono:** thiagoktz  
**Status:** Produção — 3 repos no ar, 103 arquivos, score 100/100  
**Data:** Maio 2026

---

## O que é este projeto

Um ecossistema completo de agentes de IA para criar sites profissionais. O thiagoktz descreve um projeto em linguagem natural — o ecossistema cuida de SEO, textos, design, código, qualidade e deploy automaticamente.

---

## Repositórios no ar

| Repo | URL | Visibilidade | Arquivos |
|---|---|---|---|
| webcraft-standalone | github.com/thiagoktz/webcraft-standalone | Public | 16 |
| webcraft-ecosystem | github.com/thiagoktz/webcraft-ecosystem | Public | 87 |
| webcraft-clients | github.com/thiagoktz/webcraft-clients | Private | 6 |

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
| WebCraft Agent | HTML/CSS/JS final | motion, components, impeccable |
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
site-pro-max        → Design→Content→SEO→Copy→WebCraft→QA qualidade máxima
```

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
1. node scripts/new-client.mjs
   → gera clients/{id}/client.json + ACTIVATE.md + REVISAO.md + TASTE.md + .impeccable.md

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
🤖 EVALS a cada PR no GitHub (CI/CD ativo)
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
- **EVALS:** 291 critérios totais (95 standalone + 196 ecosystem)
- **Auditoria:** score 100/100 em Maio 2026

---

## Pendências conhecidas

```
1. CONNECTOR.md faltantes (8 conectores sem documentação):
   Netlify, Webflow, WordPress, Jotform, MailerLite,
   Calendly, HubSpot, Wix

2. EVALS dos novos agentes com critérios básicos apenas:
   backend-agent, ecommerce-agent, cms-agent
   → expandir com critérios específicos

3. Migração para Claude Code (opcional):
   → Criar CLAUDE.md na raiz
   → Mover skills para .claude/skills/
   → Slash commands via .claude/commands/
```

---

## Como retomar qualquer tarefa

### Adicionar um novo agente:
```
1. Criar agents/{nome}/system-prompt.md
2. Criar agents/{nome}/skills/{skill}/SKILL.md
3. Adicionar ao agent-registry.json
4. Adicionar ao ecosystem.json
5. Criar evals/agents/{nome}.md
6. Rodar auditoria: python3 audit.py
7. Commit + push → CI/CD valida
```

### Criar CONNECTOR.md faltante:
```
Padrão: ver connectors/vercel/CONNECTOR.md como template
Campos obrigatórios: Status, MCP URL, Agentes que usam,
  exemplos de código, ferramentas MCP disponíveis, checklist
```

### Adicionar novo pipeline:
```
1. Definir sequência de agentes
2. Adicionar em agent-registry.json → pipelines
3. Sincronizar em ecosystem.json → pipelines
4. Documentar em evals/pipelines/pipelines.md
```

---

## Arquivos-chave para ler primeiro

```
ecosystem.json              → visão geral do ecossistema
agent-registry.json         → todos os agentes e pipelines
orchestrator/system-prompt.md → como o Orchestrator pensa
ACTIVATE.md                 → como ativar (está nos dois repos públicos)
scripts/new-client.mjs      → onboarding de clientes
clients/REVISAO-exemplo.md  → exemplo real de REVISAO.md preenchido
MANUAL-OPERACIONAL.md       → guia completo de operação (arquivo local)
AUDITORIA-RELATORIO.md      → estado atual e pendências (arquivo local)
```

---

## Contexto do thiagoktz

- Usa Claude no browser (claude.ai) e tem Claude Code rodando em projeto paralelo
- Prefere respostas diretas e operacionais — sem enrolação
- Quer o máximo automatizado — operação manual só no inevitável
- Já entende o ecossistema — não precisa de explicações básicas
- Tokens GitHub sempre revogados após uso

---

*Handoff gerado em Maio 2026 — WebCraft Ecosystem v2.1*  
*Para retomar: ler este arquivo + abrir ecosystem.json + agent-registry.json*
