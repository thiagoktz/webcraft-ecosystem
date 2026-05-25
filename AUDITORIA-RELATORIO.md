# Auditoria WebCraft Ecosystem — Maio 2026

**Data:** 24 de maio de 2026
**Escopo:** webcraft-ecosystem (público) + webcraft-standalone (público). webcraft-clients é privado e não foi inspecionado.
**Versão real do ecosystem (após sync):** 2.1.0

---

## Resumo executivo

O ecossistema está estruturalmente coerente no plano agente↔skill↔eval, mas três fontes de verdade (`agent-registry.json`, `ecosystem.json`, `HANDOFF.md`, `README.md`) discordam entre si em pontos importantes. **O HANDOFF.md afirma "score 100/100" mas o workflow CI está quebrado e jamais rodou contra este repositório.** Encontrei 11 problemas, 5 deles classificados como severos.

| Severidade | Descrição curta |
|---|---|
| 🔴 Crítico | Workflow CI procura arquivos do repo standalone, falha em todo PR |
| 🔴 Crítico | ecosystem.json declara 9 agentes — faltam backend, ecommerce, cms |
| 🟠 Alto | 3 pipelines sem qa-agent no fim (contradiz HANDOFF) |
| 🟠 Alto | orchestrator.can_call só lista 3 agentes (deveria listar todos os 11) |
| 🟠 Alto | README.md ainda na v2.0 antiga (8 agentes, 17 skills) |
| 🟡 Médio | webcraft-agent entry_point errado no ecosystem.json |
| 🟡 Médio | shared_skills cita 'analytics' e 'performance' que não existem como shared |
| 🟡 Médio | shared-skills/security/ existe mas não está declarado no registry |
| 🟡 Médio | 3 shared-skills do FS faltam no ecosystem.json (payments, cms-integration, auth-patterns) |
| 🟢 Baixo | Contagem de critérios EVALS no HANDOFF (291) não bate (real ≈ 413) |
| 🟢 Baixo | Versão divergente (HANDOFF v2.1, README v2.0, ecosystem.json v2.0.0) |

---

## 1. Agentes — divergência entre fontes

| Fonte | Quantidade | Lista |
|---|---|---|
| `agents/` no filesystem | 11 + orchestrator | todos os 12 |
| `agent-registry.json` | 12 | todos os 12 |
| `ecosystem.json` | **9 (declara `total: 9`)** | **falta: backend-agent, ecommerce-agent, cms-agent** |
| `HANDOFF.md` | 12 | todos os 12 |
| `README.md` | **8** | desatualizado |

**Impacto:** Um agente Orchestrator que consulte `ecosystem.json` para descobrir capacidades não saberá que existem backend, ecommerce e cms — quebra pipelines como `ecommerce-completo`.

**Correção aplicada:** novo `ecosystem.json` com 12 agentes, em ordem lógica (orchestrator → memory → design → content → seo → copy → webcraft → qa → feedback → backend → ecommerce → cms).

---

## 2. Pipelines — falta de QA

O HANDOFF descreve estes pipelines como terminando em QA:

```
site-completo  → SEO→Copy→WebCraft→QA
site-rapido    → WebCraft→QA
redesign-textos → Copy→WebCraft→QA
```

Tanto `ecosystem.json` quanto `agent-registry.json` os declaram **sem qa-agent no fim**.

**Decisão tomada:** seguir o HANDOFF e a regra "QA valida antes de qualquer entrega". Adicionei qa-agent nos 3 pipelines. (Pipeline `auditoria-seo` continua sem QA porque não gera entrega de site.)

---

## 3. orchestrator.can_call está manco

```json
"can_call": ["webcraft-agent", "copy-agent", "seo-agent"]
```

Mas todos os outros agentes têm `"called_by": ["orchestrator"]`. O Orchestrator não consegue, formalmente, chamar memory, design, content, qa, feedback, backend, ecommerce ou cms.

**Correção aplicada:** `can_call` agora contém os 11 outros agentes.

---

## 4. webcraft-agent — entry_point errado

```diff
- "entry_point": "agents/webcraft/system-prompt.md"        // ecosystem.json (errado)
+ "entry_point": "agents/webcraft-agent/system-prompt.md"  // registry (correto, arquivo existe)
```

O README também usa `agents/webcraft/` no diagrama. **Mantive a forma do registry** porque o arquivo está fisicamente em `agents/webcraft-agent/`.

---

## 5. shared-skills — fantasmas e ausências

| Skill | FS | ecosystem.json | registry |
|---|---|---|---|
| ab-testing | ✅ | ✅ | ✅ |
| acessibilidade | ✅ | ✅ | ✅ |
| **analytics** | ❌ | ✅ (fantasma) | ✅ (fantasma) |
| auth-patterns | ✅ | ❌ | ✅ |
| brand-guide | ✅ | ✅ | ✅ |
| cms-integration | ✅ | ❌ | ✅ |
| content-strategy | ✅ | ✅ | ✅ |
| error-handling | ✅ | ✅ | ✅ |
| forms-backend | ✅ | ✅ | ✅ |
| frontend-design | ✅ | ✅ | ✅ |
| output-validation | ✅ | ✅ | ✅ |
| payments | ✅ | ❌ | ✅ |
| **performance** | ❌ (existe como skill do webcraft-agent) | ✅ (fantasma como shared) | ✅ (fantasma como shared) |
| rate-limiting | ✅ | ✅ | ✅ |
| security | ✅ | ✅ | **❌** |
| seo | ✅ | ✅ | ✅ |

**Correção aplicada:**
- `shared_skills` em ambos os arquivos agora reflete exatamente as 14 pastas em `shared-skills/`.
- `analytics` removido (não existe).
- `performance` removido da lista shared (continua existindo como skill do webcraft-agent, onde de fato está).
- `security` adicionado ao registry.

---

## 6. CI/CD quebrado 🔴

O `.github/workflows/evals.yml` no repo ecosystem é **uma cópia literal do workflow do repo standalone**. Procura arquivos como:

```
PRD.md, SDD.md, EVALS.md, skills/intake/SKILL.md, ...
```

que **não existem** no repo ecosystem (a estrutura é `agents/<id>/`, `evals/agents/`, etc).

**Resultado:** todo PR para o ecosystem falha em Job 1 ("Verificar arquivos obrigatórios"). O HANDOFF afirma "EVALS a cada PR no GitHub (CI/CD ativo)" — não é verdade hoje.

**Correção aplicada:** novo `evals.yml` com 3 jobs adequados ao ecosystem:
1. `validate-structure` — confere arquivos obrigatórios reais, valida JSONs, valida coerência registry↔FS e registry↔ecosystem.json.
2. `validate-evals` — confere que cada agente tem arquivo de evals.
3. `comment-pr` — posta resumo no PR.

---

## 7. Contagens nos docs

| Métrica | HANDOFF afirma | Realidade medida |
|---|---|---|
| Arquivos totais (3 repos) | 103 | 104 só nos 2 públicos (clients é privado) |
| Agentes | 12 | ✅ 12 |
| Pipelines | 10 | ✅ 10 |
| Critérios totais EVALS | 291 (95 + 196) | ~413 (101 standalone EVALS.md + 312 ecosystem) |
| Score auditoria | 100/100 | Não pode ser afirmado — CI está quebrado |

**Recomendação:** atualizar HANDOFF.md para refletir números reais ou esclarecer o que foi contado (provavelmente apenas EVALS.md de cada repo, sem somar critérios dispersos pelos system-prompts).

---

## 8. CONNECTOR.md pendentes (já mapeado no HANDOFF)

```
netlify, mailerlite, calendly, hubspot, webflow, wordpress, jotform, wix
```

8 connectors listados como `available` no ecosystem.json, sem pasta nem documentação. Status mantido — é trabalho a fazer, não bug.

---

## Sincronização aplicada — checklist

- [x] `ecosystem.json`: v2.0.0 → **v2.1.0**, 12 agentes completos, pipelines com QA, shared_skills coerentes, capabilities expandidas
- [x] `agent-registry.json`: v1.0 → **v1.1**, orchestrator.can_call com 11 agentes, shared_skills sem fantasmas, pipelines com QA
- [x] `.github/workflows/evals.yml`: reescrito para validar o ecosystem corretamente
- [ ] **Pendente para o thiagoktz aplicar:**
  - Atualizar README.md (ainda diz "8 agentes, 17 skills, 5 pipelines")
  - Atualizar HANDOFF.md com contagens reais ou esclarecer metodologia do "score 100/100"
  - Decidir sobre os 8 CONNECTOR.md faltantes

---

## Arquivos entregues

```
/mnt/user-data/outputs/ecosystem.json            ← substitui o atual
/mnt/user-data/outputs/agent-registry.json       ← substitui o atual
/mnt/user-data/outputs/evals.yml                 ← substitui .github/workflows/evals.yml
/mnt/user-data/outputs/AUDITORIA-RELATORIO.md    ← este documento
```

---

*Auditoria gerada por Claude · 24 de maio de 2026*
