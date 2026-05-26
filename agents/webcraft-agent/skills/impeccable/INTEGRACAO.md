# Impeccable + Taste — Integração no Pipeline WebCraft

Como os dois se encaixam em cada etapa do ecossistema.

---

## A distinção fundamental

```
TASTE           → antes de gerar    → define o padrão
IMPECCABLE      → depois de gerar   → refina e audita
```

Taste é o briefing estético. Impeccable é o revisor de design.
Um projeto pro max usa os dois.

---

## Pipeline completo com Impeccable + Taste

```
ONBOARDING (1x por projeto)
──────────────────────────
1. node ../webcraft-clients/new-client.mjs
2. npx skills add pbakaus/impeccable
3. npx skills add https://github.com/Leonxlnx/taste-skill
4. /impeccable teach  → gera .impeccable.md com contexto do cliente

PRÉ-GERAÇÃO
──────────────────────────
5. Design Agent lê o brief
6. Design Agent roda /impeccable shape  → discovery de design
7. Design Agent escolhe variante do Taste (soft | minimal | brutalist...)
8. Design Agent gera TASTE.md com dials calibrados
9. Design Agent gera design tokens (token-system skill)

GERAÇÃO
──────────────────────────
10. WebCraft Agent lê: TASTE.md + .impeccable.md + design tokens
11. WebCraft Agent roda /impeccable craft
12. WebCraft Agent aplica motion (Framer Motion skill)
13. WebCraft Agent usa componentes 21st.dev (components skill)

PÓS-GERAÇÃO
──────────────────────────
14. /impeccable audit      → check técnico P0–P3
    Issues P0/P1 → corrigir antes de avançar
    Issues P2/P3 → logar, corrigir no polish

15. /impeccable typeset    → tipografia consistente
16. /impeccable layout     → ritmo e espaçamento
17. /impeccable animate    → motion com propósito
18. /impeccable polish     → passagem final

ENTREGA
──────────────────────────
19. QA Agent valida (score ≥ 80)
20. /impeccable document   → gera DESIGN.md para o repo
21. Deploy automático

REVISÃO FUTURA
──────────────────────────
22. Memory Agent carrega TASTE.md + .impeccable.md
23. Usar comandos Impeccable conforme o pedido:
    "mais impactante"  → /impeccable bolder
    "muito carregado"  → /impeccable quieter
    "mais cor"         → /impeccable colorize
    "simplifique"      → /impeccable distill
    "aquele detalhe"   → /impeccable delight
```

---

## Mapeamento pedido do cliente → comando Impeccable

| Cliente diz | Comando |
|---|---|
| "Está genérico / parece de IA" | `/impeccable critique` + `/impeccable bolder` |
| "Está pesado / carregado" | `/impeccable quieter` + `/impeccable distill` |
| "Quero mais vida / movimento" | `/impeccable animate` |
| "A fonte está estranha" | `/impeccable typeset` |
| "Quero mais cor" | `/impeccable colorize` |
| "Não está funcionando no celular" | `/impeccable adapt` |
| "Está quase bom, só falta algo" | `/impeccable delight` + `/impeccable polish` |
| "Quero a versão mais extrema" | `/impeccable overdrive` |
| "O texto não está claro" | `/impeccable clarify` |
| "Está com muita coisa" | `/impeccable distill` |
| "Está pronto para produção?" | `/impeccable harden` + `/impeccable optimize` |

---

## Arquivos gerados por projeto

```
clients/{client_id}/
  ├── client.json
  ├── ACTIVATE.md
  ├── REVISAO.md
  ├── TASTE.md          ← gerado pelo Design Agent (Taste Skill)
  ├── .impeccable.md    ← gerado pelo /impeccable teach
  └── projects/
        └── site-v1/
              ├── index.html
              ├── styles.css
              ├── script.js
              └── DESIGN.md    ← gerado pelo /impeccable document
```

---

## Variante Taste por pipeline

| Pipeline | Variante Taste recomendada | VARIANCE | MOTION | DENSITY |
|---|---|---|---|---|
| `site-rapido` | `taste-skill` | 4 | 3 | 4 |
| `site-completo` | `taste-skill` | 6 | 5 | 4 |
| `site-pro-max` | escolha por segmento | 7-9 | 6-8 | 3-6 |
| `ecommerce-completo` | `taste-skill` ou `soft-skill` | 5 | 4 | 6 |
| `site-com-cms` | `minimalist-skill` | 4 | 3 | 5 |
