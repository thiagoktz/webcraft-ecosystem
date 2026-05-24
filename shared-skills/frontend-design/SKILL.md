---
name: frontend-design
description: Skill público de design de frontend. Define padrões de UI de qualidade, componentes reutilizáveis e boas práticas visuais. Aplicar em toda geração de interface.
---

# Skill: Frontend Design

Este skill define os padrões de qualidade visual para toda geração de interface no ecossistema WebCraft.
Consulte sempre em conjunto com o design_brief do Design Agent e o TASTE.md do projeto.

## Referência principal
Os padrões completos estão nos skills próprios do Design Agent:
- `agents/design-agent/skills/uiux-pro/SKILL.md` — princípios avançados
- `agents/design-agent/skills/token-system/SKILL.md` — CSS variables
- `agents/design-agent/skills/typography/SKILL.md` — tipografia
- `agents/design-agent/skills/visual-direction/SKILL.md` — direção visual

## Regras base (sempre aplicar)
- Nunca usar Inter, Roboto ou Arial como fonte intencional
- CSS variables semânticas em todo o código (`--color-primary`, não `#2563eb`)
- Mobile-first: estilos base para mobile, media queries para desktop
- Espaçamento em escala consistente (múltiplos de 4px)
- Contraste mínimo 4.5:1 para texto normal
- Skip link como primeiro elemento do body
- `prefers-reduced-motion` em todas as animações
