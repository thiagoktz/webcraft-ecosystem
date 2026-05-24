---
name: token-system
description: Use este skill no Design Agent após definir a direção visual. Traduz conceito e personalidade em design tokens concretos — variáveis CSS prontas para o WebCraft Agent usar diretamente no código.
---

# Skill: Token System — Design Tokens e Variáveis CSS

---

## O que são design tokens

Design tokens são os valores atômicos do sistema visual: cores, tamanhos, espaçamentos, sombras e animações expressos como variáveis nomeadas. São a ponte entre decisão de design e código.

**Regra de ouro:** se o WebCraft Agent precisar hardcodar um valor visual, o token está faltando.

---

## 1. Estrutura completa de tokens

### Cores — nomenclatura semântica (não descritiva)
```css
:root {
  /* Cores base */
  --color-primary:           #2563EB; /* ação principal */
  --color-primary-hover:     #1D4ED8; /* estado hover */
  --color-primary-light:     #EFF6FF; /* fundo suave, badges */
  --color-secondary:         #64748B; /* elementos de suporte */
  --color-accent:            #F59E0B; /* destaque pontual */

  /* Superfícies */
  --color-bg:                #FFFFFF;
  --color-bg-alt:            #F8FAFC; /* seções alternadas */
  --color-bg-dark:           #0F172A; /* header escuro, footer */
  --color-surface:           #FFFFFF; /* cards, modais */
  --color-border:            #E2E8F0;
  --color-border-strong:     #CBD5E1;

  /* Texto */
  --color-text-primary:      #1E293B; /* corpo principal */
  --color-text-secondary:    #64748B; /* labels, captions */
  --color-text-tertiary:     #94A3B8; /* placeholder, disabled */
  --color-text-inverse:      #FFFFFF; /* texto em fundo escuro */
  --color-text-link:         #2563EB;
  --color-text-link-hover:   #1D4ED8;

  /* Feedback */
  --color-success:           #16A34A;
  --color-success-light:     #F0FDF4;
  --color-error:             #DC2626;
  --color-error-light:       #FEF2F2;
  --color-warning:           #D97706;
  --color-warning-light:     #FFFBEB;
  --color-info:              #0284C7;
  --color-info-light:        #F0F9FF;
}
```

### Tipografia
```css
:root {
  /* Famílias */
  --font-heading:   'Space Grotesk', system-ui, sans-serif;
  --font-body:      'DM Sans', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', 'Courier New', monospace;

  /* Escala — clamp para responsividade automática */
  --text-xs:        clamp(0.70rem, 0.7rem + 0.1vw, 0.75rem);
  --text-sm:        clamp(0.85rem, 0.85rem + 0.1vw, 0.875rem);
  --text-base:      clamp(1rem, 1rem + 0.1vw, 1.0625rem);
  --text-lg:        clamp(1.1rem, 1.1rem + 0.15vw, 1.25rem);
  --text-xl:        clamp(1.2rem, 1.2rem + 0.2vw, 1.5rem);
  --text-2xl:       clamp(1.4rem, 1.3rem + 0.5vw, 1.875rem);
  --text-3xl:       clamp(1.7rem, 1.5rem + 1vw, 2.25rem);
  --text-4xl:       clamp(2rem, 1.7rem + 1.5vw, 3rem);
  --text-hero:      clamp(2.5rem, 2rem + 2.5vw, 4.5rem);

  /* Pesos */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;

  /* Line height */
  --leading-tight:    1.15;
  --leading-snug:     1.35;
  --leading-normal:   1.5;
  --leading-relaxed:  1.7;
  --leading-loose:    2;

  /* Letter spacing */
  --tracking-tight:   -0.03em;
  --tracking-snug:    -0.01em;
  --tracking-normal:  0em;
  --tracking-wide:    0.05em;
  --tracking-wider:   0.1em;
  --tracking-widest:  0.2em;
}
```

### Espaçamento — escala de 4px base
```css
:root {
  --space-1:    0.25rem;   /*  4px */
  --space-2:    0.5rem;    /*  8px */
  --space-3:    0.75rem;   /* 12px */
  --space-4:    1rem;      /* 16px */
  --space-5:    1.25rem;   /* 20px */
  --space-6:    1.5rem;    /* 24px */
  --space-8:    2rem;      /* 32px */
  --space-10:   2.5rem;    /* 40px */
  --space-12:   3rem;      /* 48px */
  --space-16:   4rem;      /* 64px */
  --space-20:   5rem;      /* 80px */
  --space-24:   6rem;      /* 96px */
  --space-32:   8rem;      /* 128px */

  /* Espaçamento semântico */
  --section-gap:         clamp(4rem, 8vw, 8rem);
  --section-gap-sm:      clamp(2rem, 4vw, 4rem);
  --container-max:       1200px;
  --container-padding:   clamp(1rem, 5vw, 2rem);
  --card-padding:        clamp(1.5rem, 3vw, 2.5rem);
  --button-padding-x:    1.5rem;
  --button-padding-y:    0.75rem;
}
```

### Bordas e raios
```css
:root {
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    12px;
  --radius-xl:    20px;
  --radius-2xl:   28px;
  --radius-full:  9999px;

  --border-width:       1px;
  --border-width-md:    2px;
  --border-color:       var(--color-border);
}
```

### Sombras
```css
:root {
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.07);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.09);
  --shadow-lg:  0 8px 30px rgba(0,0,0,0.11);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.14);
  --shadow-2xl: 0 24px 64px rgba(0,0,0,0.18);

  /* Sombra colorida (para botão primário) */
  --shadow-primary: 0 4px 14px rgba(37, 99, 235, 0.35);
}
```

### Animações e transições
```css
:root {
  --duration-fast:    100ms;
  --duration-normal:  200ms;
  --duration-slow:    350ms;
  --duration-slower:  600ms;

  --ease-default:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:        cubic-bezier(0.4, 0, 1, 1);
  --ease-out:       cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);

  --transition-base:    all var(--duration-normal) var(--ease-default);
  --transition-color:   color var(--duration-fast) var(--ease-default),
                        background-color var(--duration-fast) var(--ease-default);
  --transition-transform: transform var(--duration-normal) var(--ease-spring);
}
```

---

## 2. Tokens por arquétipo visual

### Clínico:
```css
/* Ajustes sobre o sistema base */
--color-bg: #FFFFFF;
--color-bg-alt: #FAFAFA;
--section-gap: clamp(6rem, 12vw, 12rem); /* mais espaço */
--radius-md: 4px;    /* menos arredondado */
--shadow-md: none;   /* sem sombras nos cards */
--font-heading: 'DM Serif Display', Georgia, serif;
```

### Tecnológico (dark):
```css
--color-bg: #0A0E1A;
--color-bg-alt: #111827;
--color-surface: #1F2937;
--color-border: #374151;
--color-text-primary: #F9FAFB;
--color-text-secondary: #9CA3AF;
--color-primary: #38BDF8;
--color-primary-hover: #7DD3FC;
--font-heading: 'Space Grotesk', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Orgânico:
```css
--color-bg: #FAF7F2;
--color-bg-alt: #F0EBE3;
--color-primary: #6B7C45;
--color-accent: #C17D3C;
--color-text-primary: #2D2417;
--radius-md: 16px;
--radius-lg: 24px;
--font-heading: 'Cormorant Garamond', Georgia, serif;
--font-body: 'Lato', sans-serif;
```

---

## 3. Checklist de token system

- [ ] Todos os tokens de cor definidos (primária, bg, texto, feedback)
- [ ] Ratios de contraste verificados (mínimo 4.5:1)
- [ ] Escala tipográfica com `clamp()` (responsiva sem media queries)
- [ ] Espaçamento semântico (`--section-gap`, `--container-max`)
- [ ] Tokens de animação com `prefers-reduced-motion` em mente
- [ ] Tokens de arquétipo sobrepostos ao sistema base
- [ ] Bloco `:root {}` completo entregue ao WebCraft Agent
- [ ] Nenhum valor hardcoded no CSS gerado (tudo via variável)
