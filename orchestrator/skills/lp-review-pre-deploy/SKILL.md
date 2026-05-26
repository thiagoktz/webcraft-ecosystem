---
name: lp-review-pre-deploy
description: Use este skill ANTES de qualquer deploy de landing page em produção. Checklist em 12 fases para o PM revisar copy, design, performance, SEO, acessibilidade e mobile-first. Inclui armadilhas reais aprendidas em projetos anteriores.
---

# Skill: Revisão de LP — Pré-Deploy

Este skill é o **filtro final** antes de subir uma landing page em produção. Use sempre que o Orchestrator estiver prestes a executar deploy (Cloudflare Pages, Vercel, Netlify, etc.).

**Tempo total:** 45-60 min (LP simples) · 1.5-2h (LP complexa).  
**Resultado esperado:** Lighthouse mobile ≥ 90/100/100/100, zero erros no console, cliente confiante para validar.

---

## Quando acionar

O Orchestrator deve **automaticamente invocar este skill** quando:

- Pipeline contém `webcraft-agent` no fluxo
- Usuário pede para "fazer deploy" / "subir" / "publicar"
- Status do projeto no `client.json` está `em-revisao` ou `em-validacao-cliente`

Não pular este skill mesmo em "ritmo rápido" — pode-se executar fases em paralelo, mas todas devem ser cobertas.

---

## Estrutura: 12 fases sequenciais

| # | Fase | Tempo | Categoria |
|---|---|---|---|
| 1 | Briefing & Identidade | 10min | Alinhamento |
| 2 | Copy | 15min | Conteúdo |
| 3 | Estrutura & Seções | 10min | Conteúdo |
| 4 | Design Visual | 15min | Estética |
| 5 | Conteúdo & Mídia | 15min | Mídia |
| 6 | UX & Interação | 10min | Interação |
| 7 | Mobile-First | 15min | Técnico |
| 8 | Performance | 20min | Técnico |
| 9 | SEO | 15min | Técnico |
| 10 | Acessibilidade | 10min | Técnico |
| 11 | Pré-Deploy | 10min | Validação |
| 12 | Pós-Deploy | 5min | Validação |

Priorização visual: 🔴 crítico · 🟡 médio · 🟢 polish.

---

## Fase 1 — Briefing & Identidade

- 🔴 Nome REAL da fundadora/responsável confirmado (separado do nome da marca)
- 🔴 Ano de fundação confirmado (nunca inventar)
- 🔴 Referências visuais REAIS recebidas (Instagram, Pinterest, sites de admiração)
- 🔴 Público-alvo específico (idade, comportamento, ticket médio)
- 🟡 Tom de voz definido
- 🟡 Lista de palavras-chave e palavras a EVITAR

**Padrão:** Se não tiver referência visual, **não começar design**. Pedir antes.

---

## Fase 2 — Copy

- 🔴 Hero (H1 + lede + CTA) claro em 5 segundos
- 🔴 Meta description com voz da marca (≤ 160 chars)
- 🔴 Depoimentos: se fictícios, **avisar cliente** ou rotular como "exemplo"
- 🔴 Valores/preços: nunca colocar sem confirmar
- 🔴 WhatsApp deep-links com nome da pessoa, não da marca:
  ```
  wa.me/55XXXXXXXXXXX?text=Oi%20<NOME>%2C...
  ```
- 🟡 CTAs variados entre seções
- 🟡 H2s com ritmo (italic + quebra de linha pensada)
- 🟡 Verbos não previsíveis
- 🟢 Drop cap no Sobre
- 🟢 Pull quote/assinatura com aspas + linha + atribuição

---

## Fase 3 — Estrutura & Seções

- 🔴 Ordem das seções validada com cliente
- 🔴 Toda seção tem `id` para anchor navigation
- 🔴 `scroll-margin-top` configurado (para não colar no header fixo)
- 🟡 FAQ com 5-6 perguntas (cliente revisa valores e prazos)
- 🟡 Depoimentos em grid (mín. 3)
- 🟡 Footer com info útil: navegação + WhatsApp + horário + cidade
- 🟢 Pull quote entre seções

---

## Fase 4 — Design Visual

- 🔴 Paleta validada com cliente (não inventar baseado em adjetivos)
- 🔴 Tipografia: 2 fontes max (serif + sans, ou variações da mesma família)
- 🔴 Contraste WCAG AA (≥ 4.5:1 para corpo) — validar com WebAIM
- 🔴 Espaçamento entre seções consistente: `clamp(56px, 7vw, 96px)`
- 🟡 Eyebrows com tracinho dourado/acento
- 🟡 Cards de serviço com ritmo visual (não 4 idênticos)
- 🟢 Grão sutil (noise SVG) no body
- 🟢 Color grading uniforme nas fotos (`filter: saturate(0.92) contrast(1.05)`)

---

## Fase 5 — Conteúdo & Mídia

- 🔴 **Imagens REAIS do cliente** (stock só como última opção)
- 🔴 **Resolução originais ≥ 1920px** de largura para fotos hero/protagonistas
- 🔴 Conversão para WebP com fallback JPG
- 🔴 Srcset responsivo: 360w / 720w / 1400w / 2000w
- 🔴 Alt text descritivo em todas as imagens
- 🔴 `fetchpriority="high"` + `preload` na imagem do hero (LCP)
- 🔴 `loading="lazy"` em todas exceto o hero
- 🟡 Pasta `assets/` com nomes semânticos (hero.webp, servico-01.webp)
- 🟡 `og:image` real (1200×630px)
- 🟢 Numerar fotos só se faz sentido editorial

**Geração de WebP responsivo (script Node + sharp):**

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = './assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

for (const f of files) {
  const base = f.replace(/\.jpg$/, '');
  for (const w of [360, 720, 1400, 2000]) {
    await sharp(path.join(dir, f))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(dir, `${base}-${w}w.webp`));
  }
}
```

---

## Fase 6 — UX & Interação

- 🔴 WhatsApp como CTA principal + bolha flutuante (canto inferior direito, `z-index: 110`)
- 🔴 Botão hambúrguer com `aria-expanded` correto
- 🔴 Anchors do menu funcionam
- 🔴 Skip link para `<main>`
- 🟡 Hover states (transition 0.3-0.6s, não 1.4s)
- 🟡 FAQ accordion nativo (`<details>/<summary>`)
- 🟢 Reveal on scroll sutil (opacity + 16px translateY, threshold 0.08)
- 🟢 Smooth scroll com Lenis **só desktop** — NUNCA mobile

**Avaliar smooth scroll caso a caso:** se as fotos do cliente forem ≤ 1000px de largura, NÃO usar Lenis (causa blur em retina sem solução).

---

## Fase 7 — Mobile-First

- 🔴 Header **`position: fixed`** (não sticky com efeitos complexos)
- 🔴 `padding-top` no `<main>` compensando altura do header fixo
- 🔴 Touch targets ≥ 44×44px em todos os links/botões (Apple HIG)
- 🔴 Fontes ≥ 13px em textos pequenos (eyebrows, captions)
- 🔴 Sem overflow horizontal (testar viewport 375px)
- 🔴 Bolha WhatsApp não cobre conteúdo crítico
- 🟡 Hero copy não corta ascenders
- 🟡 Espaço header → eyebrow ≥ 24px de respiro
- 🟡 Carrossel horizontal OU stack vertical (deixar cliente decidir)

**Inspecionar touch targets no console:**

```javascript
[...document.querySelectorAll('a, button, summary')]
  .filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
  })
  .map(el => ({ tag: el.tagName, h: r.height, w: r.width, text: el.textContent.trim().slice(0, 40) }));
```

---

## Fase 8 — Performance (alvo: 90+ mobile)

- 🔴 **CSS inline no `<head>`** se < 30KB (elimina request bloqueante)
- 🔴 CSS minificado (`clean-css` via Node)
- 🔴 **Fonts self-hosted** quando possível:
  - Baixar woff2 latin (não cyrillic/vietnamese)
  - Inline `@font-face` no CSS
  - Preload dos 2 mais críticos
- 🔴 Imagens em WebP com srcset (Fase 5)
- 🔴 JS não-crítico com `defer`
- 🔴 Smooth scroll só em desktop (Lenis em mobile causa reflow 800ms+)
- 🟡 Cache buster nos arquivos (`?v=YYYYMMDD-N`)
- 🟡 `prefers-reduced-motion` respeitado
- 🟢 Headers de cache configurados (`/assets/*` 1 ano)

**Comando de validação:**

```bash
npx lighthouse https://SEUSITE.com \
  --form-factor=mobile \
  --quiet \
  --view
```

Ou: [pagespeed.web.dev](https://pagespeed.web.dev)

---

## Fase 9 — SEO (alvo: 100)

- 🔴 `<title>` único, ≤ 60 chars, com palavras-chave principais
- 🔴 `<meta name="description">` com voz da marca, ≤ 160 chars
- 🔴 `<link rel="canonical">` apontando para URL definitiva
- 🔴 `<html lang="pt-BR">` correto
- 🔴 Open Graph tags completas (`og:title`, `og:description`, `og:image`, `og:url`)
- 🔴 Twitter Card tags
- 🔴 JSON-LD schema.org correto para o tipo de negócio:
  - Florista → `Florist`
  - Restaurante → `Restaurant`
  - Serviço → `Service`
  - Loja → `Store`
- 🔴 **`robots.txt` criado** (Cloudflare/Vercel não geram automaticamente)
- 🔴 **`sitemap.xml` criado** e referenciado no robots
- 🟡 Hierarquia de headings correta (H1 único, H2 por seção, sem pular)
- 🟡 Alt text em todas as imagens
- 🟢 Schema validado em [Rich Results Test](https://search.google.com/test/rich-results)

---

## Fase 10 — Acessibilidade (alvo: 100)

- 🔴 Skip link para `<main>`
- 🔴 Contraste WCAG AA validado
- 🔴 `aria-labelledby` em todas as `<section>` (referenciando o H2)
- 🔴 `aria-label` em botões só com ícone (hambúrguer, WhatsApp flutuante)
- 🔴 `aria-expanded` / `aria-controls` no hambúrguer
- 🔴 `focus-visible` com outline (não `outline: none` sem fallback)
- 🔴 `prefers-reduced-motion` respeitado
- 🟡 Form fields com `<label>` associado
- 🟡 `<details>` para accordion
- 🟢 Navegação por Tab testada do início ao fim

---

## Fase 11 — Pré-Deploy

- 🔴 Número de WhatsApp confirmado (não placeholder `55XXXXXXXXXXX`)
- 🔴 Links externos com `target="_blank" rel="noopener"`
- 🔴 Console sem erros (DevTools → Console)
- 🔴 Testado em 3 browsers (Chrome, Safari, Firefox)
- 🔴 Testado em mobile real (não só DevTools)
- 🔴 `vercel.json` ou `_headers` (Cloudflare) com cache configurado
- 🟡 Variáveis de ambiente (se tiver — analytics, API keys)
- 🟡 Repositório versionado
- 🟢 Lighthouse mobile com score ≥ 90 em todas as categorias

---

## Fase 12 — Pós-Deploy

- 🔴 URL pública responde HTTP 200: `curl -sI https://...`
- 🔴 Foto hero carrega (verificar assets/*.webp via curl)
- 🔴 PageSpeed Insights na URL pública (não só Lighthouse local — varia menos)
- 🔴 Cliente recebe link com instruções claras de o que validar
- 🟡 Google Search Console configurado (depois do site estabilizar)
- 🟡 Memory do cliente atualizada (`client.json` com URL, status, decisões)
- 🟡 REVISAO.md atualizado com nova entrada no histórico
- 🟢 Cloudflare Web Analytics ativado (free, sem cookies)

---

## 🚨 Armadilhas conhecidas (lições reais)

1. **Não inventar identidade visual baseado em adjetivos vagos.** Pedir referência REAL (Instagram, sites admirados). Refazer design custa 3x mais que pedir referência antes.

2. **Confirmar nome da pessoa vs nome da marca CEDO.** Mudar nome em produção custa caro (deep links de WhatsApp, alt text, footer, assinatura do Sobre).

3. **Não usar `mix-blend-mode: multiply` com `position: fixed`.** Afeta visualmente todos os elementos abaixo independente de z-index, especialmente em Safari mobile. Usar `background-image` no body diretamente.

4. **Header `position: fixed` é mais robusto que `sticky`** em mobile. Sticky + backdrop-filter dá problema em vários browsers.

5. **Não rodar `rm -f assets/foo-*.webp`** se houver variantes `foo-360w.webp` — o glob pega todos. Sempre `rm -f assets/foo.webp` (sem wildcard).

6. **Lenis (smooth scroll) é trade-off:**
   - Bonito em desktop
   - Causa reflow ≥ 800ms em mobile
   - Causa blur em telas retina com fotos pequenas (< 1920px)
   - Conflita com `scroll-behavior: smooth`
   - Em dúvida: **não usar**

7. **Fotos pequenas (≤ 1000px de largura) NÃO ficam nítidas em desktop retina.** Nenhuma CSS resolve. Peça originais grandes ANTES de começar.

8. **Cache busters (`?v=YYYYMMDD-N`) são essenciais.** Cache do Safari iOS é agressivo, ignora até `Cache-Control: max-age=0`.

9. **Image reveal com clip-path** parece bonito mas pode esconder elementos se JS falhar. Sempre ter fallback CSS:
   ```css
   .reveal { opacity: 1; transform: none; } /* fallback sem JS */
   html.js .reveal { opacity: 0; transition: ... }
   html.js .reveal.is-visible { opacity: 1; }
   ```

10. **Touch targets < 44px = falha no Lighthouse Accessibility.** Inclui botão hambúrguer (que costuma estar em 40×40).

---

## 📚 Ferramentas oficiais

| Para | Ferramenta |
|---|---|
| Performance/SEO/A11y | [pagespeed.web.dev](https://pagespeed.web.dev) |
| Schema validation | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| Contraste | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) |
| Deploy estático | Cloudflare Pages via `npx wrangler pages deploy` |
| Lighthouse local | `npx lighthouse <url> --view` |
| Otimização imagem | `sharp` (Node) |
| Minify CSS | `clean-css` (Node) |
| Monitoring contínuo | Google Search Console + Cloudflare Web Analytics |

---

## 🎯 Critério de "pronto pra entregar"

Antes de mandar o link pro cliente:

- [ ] Lighthouse mobile: **Performance ≥ 90, A11y = 100, BP = 100, SEO = 100**
- [ ] Testado em 3 browsers + mobile real
- [ ] Cliente confirmou: copy, fotos, ordem das seções
- [ ] WhatsApp/CTAs apontam para número real
- [ ] Memory do cliente atualizada
- [ ] URL de produção responde 200 OK

---

## Integração com pipeline do Orchestrator

Quando um pipeline `site-completo`, `site-rapido`, `site-com-cms`, `redesign-textos` ou `ecommerce-completo` for executado, o Orchestrator deve:

1. **Antes do deploy**, listar para o usuário as 12 fases deste skill
2. Marcar automaticamente itens que o pipeline já garante (ex: SEO básico vem do `seo-agent`)
3. Pedir confirmação do cliente para fases que dependem dele (Fase 1, 2, 5)
4. Rodar Lighthouse via `npx lighthouse` antes do deploy final
5. Bloquear deploy se algum item 🔴 estiver pendente

---

*Documento vivo. Versão 1.0 — baseado em lições do projeto MAREH casa de flores (2026-05).*
