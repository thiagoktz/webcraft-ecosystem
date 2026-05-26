---
name: seo
description: Skill público de SEO on-page. Garante meta tags completas, schema.org e estrutura semântica correta. Aplicar em toda geração de site.
---

# Skill: SEO On-Page (Shared)

Este skill é a referência pública de SEO do ecossistema.
O skill completo está em `agent-website-builder/skills/seo/SKILL.md`.
Skills específicos do SEO Agent: `agents/seo-agent/skills/keyword-research/SKILL.md` e `agents/seo-agent/skills/schema/SKILL.md`.

## Checklist mínimo obrigatório
- [ ] `<title>` entre 50-60 caracteres com palavra-chave
- [ ] `<meta name="description">` entre 150-160 caracteres
- [ ] Tags Open Graph completas — bloco padrão em `shared-skills/social-sharing/SKILL.md` (inclui `og:image` 1200×630 obrigatório, com `og:image:width`/`height`/`alt` — sem isso o WhatsApp não renderiza preview)
- [ ] Twitter Card `summary_large_image` (ver social-sharing)
- [ ] `<link rel="canonical">` igual ao `og:url`
- [ ] Único `<h1>` por página
- [ ] Hierarquia de headings sem pulos (h1→h2→h3)
- [ ] Schema.org JSON-LD adequado ao tipo de negócio (com `sameAs` apontando para perfis sociais do cliente)
- [ ] `lang="pt-BR"` no `<html>`
