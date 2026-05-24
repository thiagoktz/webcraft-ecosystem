---
name: acessibilidade
description: Skill público de acessibilidade WCAG 2.1 AA. Aplicar em toda geração de site. Garante conformidade para pessoas com deficiências visuais, motoras, auditivas e cognitivas.
---

# Skill: Acessibilidade — WCAG 2.1 AA (Shared)

Este skill é a referência pública de acessibilidade do ecossistema.
O skill completo está em `agent-website-builder/skills/acessibilidade/SKILL.md`.

## Checklist mínimo obrigatório
- [ ] Skip link como primeiro elemento do body
- [ ] `lang="pt-BR"` no `<html>`
- [ ] Landmarks semânticos (header, nav, main, footer)
- [ ] Todas as imagens com `alt` descritivo
- [ ] Contraste texto/fundo ≥ 4.5:1
- [ ] `:focus-visible` definido no CSS
- [ ] `@media (prefers-reduced-motion: reduce)` implementado
- [ ] Formulários com `<label>` associado
