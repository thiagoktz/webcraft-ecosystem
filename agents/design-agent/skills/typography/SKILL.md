---
name: typography
description: Use este skill no Design Agent ao selecionar fontes para qualquer projeto. Define critérios de escolha tipográfica, combinações testadas por arquétipo e como configurar a escala para máxima legibilidade e personalidade.
---

# Skill: Typography — Tipografia com Personalidade

---

## Por que tipografia importa mais que cor

Cor é a primeira impressão. Tipografia é a personalidade duradoura. Um site pode ter cores genéricas mas tipografia forte e ter identidade. O inverso raramente funciona.

**Regra:** nunca use Inter, Roboto ou Arial como escolha intencional — são fontes de fallback, não de identidade.

---

## 1. Critérios de seleção

### Para fonte de título:
- Deve ter personalidade visível em tamanhos grandes (40px+)
- Pesos disponíveis: mínimo regular (400) e bold (700)
- Legível em mobile (mesmo em 28px)
- Licença gratuita no Google Fonts ou similar

### Para fonte de corpo:
- Otimizada para leitura em tamanho base (16-18px)
- Line height 1.5-1.7 funciona bem com ela
- Neutro o suficiente para não competir com o título
- Caracteres especiais do português (ç, ã, é, etc.) completos

---

## 2. Combinações testadas por arquétipo

### Clínico (saúde premium, consultoria, produto técnico elegante):
```
Título: DM Serif Display (serif elegante, muito espaço)
Corpo:  DM Sans (irmã sans-serif, coerência visual)

Ou:
Título: Cormorant Garamond (sofisticado, editorial)
Corpo:  Jost (geométrico limpo)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap
```

### Editorial (agências, portfólios, cultura):
```
Título: Syne (geométrico com personalidade)
Corpo:  Syne (mesma família, coerência) ou Inter

Ou:
Título: Playfair Display (serif clássico com impacto)
Corpo:  Source Sans 3 (leitura confortável)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap
```

### Tecnológico (SaaS, dev tools, cybersecurity):
```
Título: Space Grotesk (geométrico, técnico, personalidade)
Corpo:  Space Grotesk (400) ou DM Sans
Mono:   JetBrains Mono (para código e dados)

Ou:
Título: Outfit (moderno, amigável-técnico)
Corpo:  Outfit (400, 500)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap
```

### Acolhedor (saúde, educação, bem-estar, comunidade):
```
Título: Plus Jakarta Sans (humanista, amigável)
Corpo:  Plus Jakarta Sans (400, 500) ou Nunito

Ou:
Título: Nunito (arredondado, caloroso)
Corpo:  Nunito ou Lato

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap
```

### Orgânico (alimentação natural, bem-estar, artesanal):
```
Título: Cormorant Garamond (elegante, orgânico, clássico)
Corpo:  Lato (neutro, legível, complementar ao serif)

Ou:
Título: Libre Baskerville (sólido, humanista)
Corpo:  Source Serif 4 (consistência serif)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;700&display=swap
```

### Premium / Luxo (moda, arquitetura, hotéis, financeiro private):
```
Título: Cormorant (ultra refinado, espaçado)
Corpo:  Jost Light ou DM Sans Light

Configuração premium:
  --tracking-widest: 0.25em (títulos em uppercase com muito espaçamento)
  --font-normal: 300 (pesos mais leves que o normal)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&display=swap
```

### Bold / Impactante (food delivery, entretenimento, moda jovem):
```
Título: Anton (display, impacto máximo)
Corpo:  Inter ou Barlow

Ou:
Título: Bebas Neue (muito bold, só maiúsculas)
Corpo:  Barlow (espaçoso, legível)

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500&display=swap
```

---

## 3. Configuração CSS por arquétipo

### Clínico:
```css
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: var(--font-normal); /* 400 — elegância pelo peso leve */
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}

p, li {
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-snug);
}
```

### Tecnológico:
```css
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}

code, pre, .data {
  font-family: var(--font-mono);
  font-size: 0.875em;
}
```

### Premium:
```css
.eyebrow { /* pequena label acima do título */
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}

h1 {
  font-family: var(--font-heading);
  font-weight: 300; /* ultra light */
  letter-spacing: var(--tracking-tight);
  line-height: 1.1;
}
```

---

## 4. Hierarquia tipográfica completa

```css
/* Aplicar para todos os projetos — ajustar valores via tokens */

.eyebrow {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-primary);
}

h1 {
  font-size: var(--text-hero);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

h2 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-snug);
}

h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

h4 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

p {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  max-width: 65ch; /* largura máxima para conforto de leitura */
}

.lead { /* parágrafo de destaque, subtítulo */
  font-size: var(--text-lg);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}

small, .caption {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
```

---

## 5. Checklist de tipografia

- [ ] Fonte de título tem personalidade visível em 48px+
- [ ] Fonte de corpo tem boa legibilidade em 16px
- [ ] Google Fonts URL com `display=swap` incluída no `<head>`
- [ ] Máximo 2 famílias por projeto (3 se incluir mono)
- [ ] Hierarquia completa definida (h1 a p, eyebrow, lead, caption)
- [ ] `max-width: 65ch` aplicado em parágrafos de corpo
- [ ] `clamp()` usado na escala de fontes (responsivo sem media queries)
- [ ] Pesos carregados apenas os necessários (reduz tamanho do bundle)
- [ ] Nenhuma das fontes proibidas: Arial, Roboto, Inter como escolha principal
