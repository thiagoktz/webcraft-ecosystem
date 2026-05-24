# EVALS — WebCraft Agent
**Critérios:** 18 | **Mínimo:** 15 (80%)

---

## WEBCRAFT-01 — HTML estrutural obrigatório

**Input:**
```json
{
  "tipo": "landing page",
  "produto": "Consultoria de carreira",
  "tom": "profissional",
  "stack": "HTML/CSS/JS"
}
```

**Critérios:**
- [ ] `<!DOCTYPE html>` presente
- [ ] `<html lang="pt-BR">` presente
- [ ] `<meta charset="UTF-8">` presente
- [ ] `<meta name="viewport" ...>` presente
- [ ] `<title>` não vazio
- [ ] `<main>` presente e único

---

## WEBCRAFT-02 — Design distintivo (não genérico)

**Input:**
```json
{
  "tipo": "landing page",
  "produto": "Estúdio de tatuagem Dark Ink",
  "tom": "bold e alternativo",
  "design_brief": { "arquetipo": "bold", "personalidade": ["sombrio", "artístico", "autêntico"] }
}
```

**Critérios:**
- [ ] Paleta não é azul/branco genérico — reflete o arquétipo bold/sombrio
- [ ] Tipografia não é Arial, Roboto ou Inter
- [ ] CSS usa variáveis (`--color-primary`, não valores hardcoded)
- [ ] Layout tem pelo menos um elemento visual distintivo
- [ ] Animações ou micro-interações presentes

---

## WEBCRAFT-03 — Integração de inputs dos outros agentes

**Input:** output completo de SEO Agent + Copy Agent + Design Agent

**Critérios:**
- [ ] Meta tags do SEO Agent inseridas no `<head>` (não reescritas)
- [ ] Textos do Copy Agent usados no HTML (hero title, CTAs, depoimentos)
- [ ] CSS variables do Design Agent no `:root {}`
- [ ] Schema.org do SEO Agent injetado no `<head>`
- [ ] Google Fonts URL do Design Agent no `<head>` com `display=swap`

---

## WEBCRAFT-04 — Performance e acessibilidade base

**Critérios (verificar no HTML/CSS gerado):**
- [ ] Scripts externos com `defer` ou `async`
- [ ] Imagem hero com `fetchpriority="high"` e sem `loading="lazy"`
- [ ] Demais imagens com `loading="lazy"`, `width` e `height`
- [ ] Skip link como primeiro elemento do `<body>`
- [ ] `:focus-visible` definido no CSS
- [ ] `@media (prefers-reduced-motion: reduce)` presente no CSS
- [ ] `prefers-color-scheme` não ignorado (dark mode mínimo ou comentado)

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| WEBCRAFT-01 | — | — | — |
| WEBCRAFT-02 | — | — | — |
| WEBCRAFT-03 | — | — | — |
| WEBCRAFT-04 | — | — | — |
