---
name: components
description: Use este skill no WebCraft Agent para referenciar e adaptar componentes do 21st.dev. Define como pesquisar, selecionar, adaptar e integrar componentes de alto nível ao projeto do cliente, mantendo consistência com o design system gerado pelo Design Agent.
---

# Skill: Components — 21st.dev no Ecossistema WebCraft

---

## O que é 21st.dev

21st.dev é um registry de componentes de UI criados especificamente para serem usados com IA. Diferente de bibliotecas como shadcn/ui (utilitária) ou MUI (enterprise), o 21st.dev foca em:

- Qualidade visual acima da média
- Componentes com animação já integrada (Framer Motion)
- Código limpo e adaptável
- Desenhados para serem modificados por LLMs

**URL:** https://21st.dev  
**Como usar:** buscar pelo componente desejado → copiar o código → adaptar ao design system do cliente

---

## 1. Como buscar o componente certo

### Por categoria:

```
Hero sections:
  → hero-gradient, hero-particles, hero-split, hero-video-bg

Navigation:
  → navbar-glass, navbar-sticky, navbar-mobile-drawer

Cards:
  → card-hover-reveal, card-3d-tilt, card-spotlight, card-bento

Buttons:
  → button-magnetic, button-shimmer, button-ripple, button-gradient

Forms:
  → input-floating-label, input-otp, form-multi-step

Testimonials:
  → testimonials-marquee, testimonials-grid, testimonials-carousel

Pricing:
  → pricing-toggle, pricing-cards, pricing-comparison-table

Features:
  → features-bento, features-tabs, features-alternating

Stats:
  → stats-counter, stats-ticker, stats-card-grid

CTA:
  → cta-gradient, cta-split, cta-email-capture

Loaders:
  → skeleton-card, skeleton-text, spinner-dots

```

---

## 2. Como adaptar ao design system do cliente

Ao copiar um componente do 21st.dev, sempre:

### Substituir tokens hardcoded pelos do design system:
```tsx
// ❌ Como vem do 21st.dev
<div style={{ background: '#6366f1', color: '#ffffff' }}>

// ✅ Após adaptação ao design system
<div style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
```

### Substituir fontes hardcoded:
```tsx
// ❌ Hardcoded
<h1 style={{ fontFamily: 'Inter, sans-serif' }}>

// ✅ Design system
<h1 style={{ fontFamily: 'var(--font-heading)' }}>
```

### Adaptar textos placeholder:
```tsx
// ❌ Placeholder genérico
<p>Lorem ipsum dolor sit amet...</p>

// ✅ Textos do Copy Agent
<p>{textos.hero.subtitulo}</p>
```

---

## 3. Componentes prioritários por tipo de projeto

### Site institucional / landing page:

```tsx
// HERO — hero-split com animação de entrada
// Buscar: "hero split animated" no 21st.dev
// Características: texto à esquerda, visual à direita, entrada com stagger

// FEATURES — features-bento
// Grid assimétrico tipo Bento Box
// Cada card tem tamanho diferente por importância

// TESTIMONIALS — testimonials-marquee
// Depoimentos em carrossel infinito horizontal
// Muito mais dinâmico que grid estático

// CTA — cta-gradient com email capture
// Fundo com gradiente animado, campo de e-mail integrado
```

### E-commerce:

```tsx
// PRODUCT CARD — card-hover-reveal
// Hover revela segunda imagem (frente/costas do produto)
// Ação rápida de adicionar ao carrinho

// CART DRAWER — drawer-slide
// Carrinho em drawer lateral com AnimatePresence

// CHECKOUT — form-multi-step
// Formulário em etapas com transições suaves

// PRODUCT GALLERY — gallery-zoom
// Zoom ao hover, lightbox ao clicar
```

### SaaS / Tech:

```tsx
// HERO — hero-particles
// Partículas interativas no fundo (canvas ou CSS)

// FEATURES — features-tabs
// Tabs com preview animado de cada feature

// PRICING — pricing-toggle
// Toggle mensal/anual com animação de valor

// DASHBOARD PREVIEW — mockup-browser
// Frame de browser/device mostrando o produto
```

---

## 4. Componentes implementados (prontos para usar)

### Card com spotlight (efeito de luz seguindo o mouse):
```tsx
'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        padding: 'var(--card-padding)'
      }}
    >
      {/* Spotlight effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 300ms',
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px,
            rgba(var(--spotlight-color, 99,102,241), 0.08) 0%,
            transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
      {children}
    </motion.div>
  )
}
```

### Marquee de depoimentos:
```tsx
import { motion } from 'framer-motion'

interface TestimonialMarqueeProps {
  depoimentos: Array<{ texto: string; nome: string; cargo: string }>
  velocidade?: number
}

export function TestimonialMarquee({
  depoimentos,
  velocidade = 30
}: TestimonialMarqueeProps) {
  const duplicated = [...depoimentos, ...depoimentos] // loop infinito

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Fade nas bordas */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '10%', zIndex: 1,
        background: 'linear-gradient(to right, var(--color-bg), transparent)'
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '10%', zIndex: 1,
        background: 'linear-gradient(to left, var(--color-bg), transparent)'
      }} />

      <motion.div
        style={{ display: 'flex', gap: '1.5rem', width: 'max-content' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: velocidade,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {duplicated.map((dep, i) => (
          <div key={i} style={{
            minWidth: '320px',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)'
          }}>
            <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
              "{dep.texto}"
            </p>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>{dep.nome}</strong>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}>
                {' — '}{dep.cargo}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
```

### Número animado ao entrar na viewport:
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function AnimatedStat({
  valor,
  sufixo = '',
  prefixo = '',
  duracao = 2000
}: {
  valor: number
  sufixo?: string
  prefixo?: string
  duracao?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const steps = 60
    const increment = valor / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= valor) { setCount(valor); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duracao / steps)
    return () => clearInterval(timer)
  }, [isInView, valor, duracao])

  return (
    <span ref={ref}>
      {prefixo}{count.toLocaleString('pt-BR')}{sufixo}
    </span>
  )
}

// Uso: <AnimatedStat valor={2000} sufixo="+" /> → "2.000+"
```

---

## 5. Regras de adaptação

```
1. Nunca usar componente 21st.dev sem adaptar os tokens
2. Sempre testar em mobile antes de entregar
3. Sempre adicionar useReducedMotion nos componentes animados
4. Componentes pesados (partículas, 3D) — lazy load obrigatório
5. Máximo de 3 componentes "wow" por página — mais que isso cansa
6. Componentes do 21st.dev são ponto de partida — adaptar ao cliente
```

---

## 6. Checklist de componentes

- [ ] Tokens do design system substituídos (cores, fontes, espaçamento)
- [ ] Textos do Copy Agent inseridos (não placeholders)
- [ ] `useReducedMotion` em componentes animados
- [ ] Lazy load em componentes pesados (partículas, 3D)
- [ ] Testado em mobile (375px)
- [ ] Contraste verificado no estado hover
- [ ] Acessibilidade verificada (ARIA, foco visível)
- [ ] Performance: máximo 3 componentes "wow" por página
