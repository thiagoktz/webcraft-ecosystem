# EVALS — Ecossistema Multi-Agente WebCraft
**Versão:** 1.0  
**Data:** Maio 2026  
**Cobertura:** 9 agentes · 5 pipelines · 8 shared skills · 196 critérios

---

## Estrutura dos EVALS

```
evals/
  ├── EVALS.md                    ← este arquivo (índice e resultado consolidado)
  ├── agents/
  │     ├── orchestrator.md
  │     ├── design-agent.md
  │     ├── content-agent.md
  │     ├── copy-agent.md
  │     ├── seo-agent.md
  │     ├── webcraft-agent.md
  │     ├── qa-agent.md
  │     ├── feedback-agent.md
  │     └── memory-agent.md
  ├── pipelines/
  │     ├── site-completo.md
  │     ├── site-rapido.md
  │     └── auditoria-seo.md
  └── shared-skills/
        └── shared-skills.md
```

---

## Critério de aprovação global

| Nível | Critério |
|---|---|
| Agente aprovado | ≥ 80% dos critérios passam |
| Pipeline aprovado | 100% dos agentes aprovados + integração sem erros |
| Ecossistema aprovado | ≥ 85% do total de critérios passam |

---

## Score consolidado

| Componente | Critérios | Mínimo (80%) |
|---|---|---|
| Orchestrator | 16 | 13 |
| Design Agent | 20 | 16 |
| Content Agent | 14 | 12 |
| Copy Agent | 22 | 18 |
| SEO Agent | 20 | 16 |
| WebCraft Agent | 18 | 15 |
| QA Agent | 18 | 15 |
| Feedback Agent | 14 | 12 |
| Memory Agent | 14 | 12 |
| Pipeline site-completo | 20 | 16 |
| Pipeline site-rapido | 10 | 8 |
| Pipeline auditoria-seo | 10 | 8 |
| Shared Skills | 20 | 16 |
| **Total** | **196** | **157** |

---

## Registro de execução

| Data | Versão | Total | Aprovados | % | Status |
|---|---|---|---|---|---|
| Mai 2026 | 1.0 | 196 | — | — | Aguardando primeira execução |
