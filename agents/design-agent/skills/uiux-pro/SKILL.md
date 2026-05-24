---
name: uiux-pro
description: Use este skill no Design Agent em todo projeto que exige qualidade visual acima da média. Define princípios avançados de interface, motion design, tipografia refinada, spatial design e dark mode real — elevando o output de "site bonito" para "interface memorável".
---

# Skill: UI/UX Pro Max — Design de Interface de Alto Nível

---

## A diferença entre bom e memorável

Um site bom é funcional, acessível e bonito. Uma interface memorável tem:

```
1. Ponto de vista estético claro — não é neutro, tem personalidade
2. Motion com propósito — cada animação tem razão de existir
3. Tipografia como elemento de design — não só legibilidade
4. Hierarquia espacial — o olho sabe onde ir sem pensar
5. Detalhes que surpreendem — um hover que ninguém esperava
```

---

## 1. Design System Completo

Todo projeto pro max começa com um sistema, não com uma página.

### Componentes obrigatórios:
```
Primitivos:
  Button (primary, secondary, ghost, destructive)
  Input (default, error, disabled, with-icon)
  Badge (success, warning, error, info, neutral)
  Avatar (image, initials, skeleton)
  Divider (horizontal, vertical, with-label)

Compostos:
  Card (default, interactive, elevated, outlined)
  Modal (small, medium, fullscreen)
  Toast (success, error, warning, info, promise)
  Dropdown (select, menu, command palette)
  Tabs (underline, pill, card)

Layout:
  Container (sm, md, lg, xl, full)
  Grid (1-12 colunas, responsive)
  Stack (horizontal, vertical, com gap)
  Section (com padding semântico)
```

### Variantes por estado:
```
Todo componente interativo precisa de:
  default → hover → active → focus → disabled → loading

Nunca omitir o estado de loading — é o mais esquecido
e o mais importante para percepção de performance.
```

---

## 2. Motion Design com Propósito

### Princípios de animação:

**Animação deve:**
- Confirmar uma ação ("o botão respondeu")
- Orientar atenção ("olha aqui agora")
- Criar continuidade ("onde foi aquilo que sumiu")
- Comunicar estado ("está carregando")

**Animação NÃO deve:**
- Existir apenas para parecer moderno
- Atrasar o acesso ao conteúdo
- Repetir em loop sem controle do usuário
- Conflitar com `prefers-reduced-motion`

### Biblioteca de easing:

```css
:root {
  /* Padrão — natural, como física real */
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);

  /* Entrada — começa devagar, acelera */
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);

  /* Saída — começa rápido, desacelera */
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);

  /* Spring — ultrapassa e volta (botões, cards) */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Bounce — exagera o spring (alertas, badges) */
  --ease-bounce:   cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Durations */
  --dur-instant:   80ms;   /* feedback imediato (hover) */
  --dur-fast:      150ms;  /* micro-interações */
  --dur-normal:    300ms;  /* transições padrão */
  --dur-slow:      500ms;  /* page transitions */
  --dur-slower:    800ms;  /* hero reveals */
}
```

### Padrões de animação por contexto:

```css
/* Entrada de seção ao scroll */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section-reveal {
  animation: fadeSlideUp var(--dur-slow) var(--ease-out) both;
}

/* Stagger — elementos aparecem em cascata */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 80ms; }
.card:nth-child(3) { animation-delay: 160ms; }
.card:nth-child(4) { animation-delay: 240ms; }

/* Hover em card — elevação com sombra */
.card {
  transition:
    transform var(--dur-fast) var(--ease-spring),
    box-shadow var(--dur-fast) var(--ease-out);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

/* Botão com feedback físico */
.btn {
  transition: transform var(--dur-instant) var(--ease-spring);
}
.btn:active { transform: scale(0.96); }
```

---

## 3. Tipografia Avançada

### Escala modular (razão 1.25 — Major Third):
```
base: 16px
xs:   12.8px  (0.8rem)
sm:   14.4px  (0.9rem)
md:   16px    (1rem)    ← base
lg:   20px    (1.25rem)
xl:   25px    (1.5625rem)
2xl:  31.25px (1.953rem)
3xl:  39px    (2.441rem)
4xl:  48.8px  (3.052rem)
hero: clamp(3rem, 6vw, 5.5rem) ← fluido
```

### Optical sizing (ajustes visuais finos):
```css
/* Títulos grandes precisam de menos espaço entre letras */
h1 { letter-spacing: -0.03em; } /* tight */
h2 { letter-spacing: -0.02em; }
h3 { letter-spacing: -0.01em; }

/* Corpo tem espaçamento neutro */
p  { letter-spacing: 0; }

/* Labels e eyebrows precisam de mais espaço */
.label   { letter-spacing: 0.08em; }
.eyebrow { letter-spacing: 0.15em; text-transform: uppercase; }

/* Números em tabelas sempre tabulares */
.price, .stat, table td {
  font-variant-numeric: tabular-nums;
}

/* Linha máxima confortável */
p, .body-text { max-width: 65ch; }
.caption      { max-width: 45ch; }
```

### Combinações de fontes pro max:

```
Editorial refinado:
  Display: Cormorant (italic, 300) — muito espaçado
  Body:    Jost (300, 400) — contraponto geométrico leve

Tecnológico expressivo:
  Display: Space Grotesk (700) — geométrico bold
  Body:    Space Grotesk (400) — consistência
  Mono:    JetBrains Mono — código e dados

Humanista caloroso:
  Display: Fraunces (italic, opsz) — expressivo, variável
  Body:    Instrument Sans (400, 500) — legível e moderno

Premium silencioso:
  Display: Editorial New (ultra light italic) — se disponível
  Fallback: DM Serif Display (300)
  Body:    DM Sans (300) — levíssimo
```

---

## 4. Spatial Design — Hierarquia pelo Espaço

### Escala de espaçamento intencional:
```
O espaço não é decoração — é comunicação.
Mais espaço = mais importante / mais premium.
Menos espaço = densidade de informação / urgência.

Seção hero:          padding vertical: clamp(8rem, 15vw, 14rem)
Entre seções:        gap: clamp(5rem, 10vw, 10rem)
Entre grupos:        gap: clamp(2.5rem, 5vw, 5rem)
Entre elementos:     gap: clamp(1rem, 2vw, 2rem)
Dentro de componente: gap: 0.5rem a 1.5rem
```

### Grid assimétrico (mais interessante que centralizado):
```css
/* Texto à esquerda, visual à direita — 5:7 */
.hero-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 4rem;
  align-items: center;
}

/* Elemento que quebra o grid intencionalmente */
.breakout {
  grid-column: 1 / -1;
  margin: 0 -4rem; /* extrapola o container */
}

/* Overlap intencional */
.overlap-card {
  position: relative;
  margin-top: -4rem; /* entra na seção anterior */
  z-index: 1;
}
```

---

## 5. Dark Mode Real

Não é só inverter cores — é repensar profundidade e contraste para fundo escuro.

```css
:root {
  color-scheme: light dark;
}

/* Light */
[data-theme="light"] {
  --bg-base:     #ffffff;
  --bg-elevated: #f8fafc;
  --bg-overlay:  #f1f5f9;
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-tertiary:  #94a3b8;
  --border:         rgba(0,0,0,0.08);
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg:   0 8px 32px rgba(0,0,0,0.12);
}

/* Dark — não é só inverter */
[data-theme="dark"] {
  --bg-base:     #09090b;  /* quase preto, não #000 */
  --bg-elevated: #18181b;  /* ligeiramente mais claro */
  --bg-overlay:  #27272a;  /* cards, modais */
  --text-primary:   #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary:  #71717a;
  --border:         rgba(255,255,255,0.06); /* muito sutil */

  /* Sombras no dark são quase invisíveis — usar glow no lugar */
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:   0 0 0 1px rgba(255,255,255,0.05); /* borda sutil */
  --shadow-lg:   0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5);
}

/* Toggle com transição suave */
* {
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

/* Respeitar preferência do sistema */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* aplicar variáveis dark */
  }
}
```

### Toggle de dark mode:
```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// Inicializar sem flash (colocar no <head> antes do CSS)
const saved = localStorage.getItem('theme');
const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', saved || preferred);
```

---

## 6. Detalhes que Surpreendem

### Cursor customizado:
```css
/* Para projetos premium/editorial */
*, *::before, *::after { cursor: none; }

.cursor {
  width: 12px; height: 12px;
  background: var(--color-primary);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 150ms var(--ease-spring);
}

.cursor.hovering {
  transform: scale(3);
  background: transparent;
  border: 1px solid var(--color-primary);
  mix-blend-mode: difference;
}
```

### Gradient animado no hero:
```css
.hero-bg {
  background: linear-gradient(
    -45deg,
    var(--color-primary),
    var(--color-secondary),
    var(--color-accent),
    var(--color-primary)
  );
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Noise texture para profundidade:
```css
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.04;
  pointer-events: none;
}
```

### Scroll reveal com Intersection Observer:
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // revela só uma vez
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}
[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger via data-attribute */
[data-reveal][data-delay="1"] { transition-delay: 100ms; }
[data-reveal][data-delay="2"] { transition-delay: 200ms; }
[data-reveal][data-delay="3"] { transition-delay: 300ms; }
```

---

## 7. Checklist UI/UX Pro Max

- [ ] Design system com componentes e variantes definidos
- [ ] Escala tipográfica modular com optical sizing
- [ ] Easing library definida no :root
- [ ] Animações com propósito documentado
- [ ] `prefers-reduced-motion` em todas as animações
- [ ] Dark mode implementado (não só invertido)
- [ ] Scroll reveal com Intersection Observer
- [ ] Stagger de elementos em listas e grids
- [ ] Estados de loading em todo elemento interativo
- [ ] Hover states com feedback físico (scale, elevação)
- [ ] Grid assimétrico ou breakout em pelo menos 1 seção
- [ ] Detalhe surpresa presente (cursor, gradient, noise)
- [ ] Contraste verificado em light E dark mode
