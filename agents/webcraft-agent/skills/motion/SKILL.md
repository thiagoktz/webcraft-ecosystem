---
name: motion
description: Use este skill no WebCraft Agent quando o projeto usar React e precisar de animações de alta qualidade. Cobre instalação do Framer Motion, padrões de animação por componente, page transitions, gestos e integração com o design system.
---

# Skill: Motion — Framer Motion no Ecossistema WebCraft

---

## Quando usar Framer Motion vs CSS puro

| Situação | Usar |
|---|---|
| Hover simples, fade, slide | CSS puro (mais leve) |
| Page transitions | Framer Motion |
| Animações condicionais (show/hide) | Framer Motion |
| Drag and drop | Framer Motion |
| Animações baseadas em scroll complexas | Framer Motion |
| Layout animations (reordenar lista) | Framer Motion |
| Gestos (swipe, pinch) | Framer Motion |
| Stagger automático | Framer Motion |

**Regra:** se pode fazer em CSS sem sacrificar qualidade, use CSS. Framer Motion é para o que CSS não consegue fazer bem.

---

## Instalação

```bash
npm install framer-motion
```

```tsx
// Import básico
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
```

---

## 1. Variantes — o coração do Framer Motion

Variantes centralizam as definições de animação e permitem que elementos filhos sincronizem.

```tsx
// Definir variantes reutilizáveis
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] }
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } }
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

// Usar nas seções
export function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.section>
  )
}

// Itens filhos herdam o stagger automaticamente
export function SectionItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp}>
      {children}
    </motion.div>
  )
}
```

---

## 2. Page Transitions

```tsx
// app/layout.tsx (Next.js App Router)
'use client'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## 3. Componentes com animação embutida

### Hero animado:
```tsx
const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

const heroItem = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] } }
}

export function Hero({ titulo, subtitulo, cta }: HeroProps) {
  return (
    <motion.section
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="hero"
    >
      <motion.p variants={heroItem} className="eyebrow">
        Clínica Saúde Total
      </motion.p>
      <motion.h1 variants={heroItem}>
        {titulo}
      </motion.h1>
      <motion.p variants={heroItem} className="subtitulo">
        {subtitulo}
      </motion.p>
      <motion.div variants={heroItem}>
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {cta}
        </motion.button>
      </motion.div>
    </motion.section>
  )
}
```

### Card com hover elevado:
```tsx
export function Card({ titulo, descricao, icone }: CardProps) {
  return (
    <motion.div
      className="card"
      whileHover={{
        y: -6,
        boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{icone}</span>
      <h3>{titulo}</h3>
      <p>{descricao}</p>
    </motion.div>
  )
}
```

### Modal com AnimatePresence:
```tsx
export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Conteúdo */}
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Toast / Notificação:
```tsx
export function Toast({ mensagem, tipo }: ToastProps) {
  return (
    <motion.div
      className={`toast toast-${tipo}`}
      initial={{ opacity: 0, y: 48, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 48, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {mensagem}
    </motion.div>
  )
}
```

---

## 4. Scroll Animations

```tsx
import { useScroll, useTransform, useSpring } from 'framer-motion'

// Parallax simples no hero
export function HeroParallax() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div className="hero-bg" style={{ y, opacity }} />
  )
}

// Barra de progresso de leitura
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="reading-bar"
      style={{ scaleX, transformOrigin: 'left' }}
    />
  )
}

// Número contando ao entrar na viewport
export function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return <span ref={ref}>{count.toLocaleString('pt-BR')}</span>
}
```

---

## 5. Layout Animations (LayoutGroup)

```tsx
import { LayoutGroup, motion } from 'framer-motion'

// Filtros que reordenam cards suavemente
export function FilteredCards({ items, filtro }: Props) {
  const filtered = items.filter(item =>
    filtro === 'todos' || item.categoria === filtro
  )

  return (
    <LayoutGroup>
      <div className="cards-grid">
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ layout: { type: 'spring', stiffness: 300, damping: 28 } }}
            >
              <Card {...item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
```

---

## 6. Gestos (Drag, Swipe)

```tsx
// Carrossel com drag
export function Carrossel({ slides }: { slides: string[] }) {
  const [active, setActive] = useState(0)

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -((slides.length - 1) * 320), right: 0 }}
      dragElastic={0.1}
      className="carrossel"
    >
      {slides.map((slide, i) => (
        <motion.div key={i} className="slide">{slide}</motion.div>
      ))}
    </motion.div>
  )
}
```

---

## 7. Performance — Boas Práticas

```tsx
// ✅ Animar transform e opacity — composited, não causa reflow
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// ❌ Evitar animar width, height, top, left — causam reflow
<motion.div animate={{ width: 200 }} /> // ruim

// ✅ useReducedMotion — respeitar preferência do usuário
import { useReducedMotion } from 'framer-motion'

export function AnimatedSection({ children }: Props) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// ✅ Lazy load de animações pesadas
const HeavyAnimation = dynamic(() => import('./HeavyAnimation'), { ssr: false })
```

---

## 8. Checklist Framer Motion

- [ ] Instalado e importado corretamente
- [ ] Variantes definidas centralizadamente (não inline)
- [ ] `useReducedMotion` implementado em todas as animações
- [ ] Apenas `transform` e `opacity` animados (nunca `width`, `height`, `top`)
- [ ] `AnimatePresence` em elementos com mount/unmount
- [ ] `viewport={{ once: true }}` em scroll animations (não repetir)
- [ ] Page transitions com `AnimatePresence mode="wait"`
- [ ] `whileHover` e `whileTap` em botões principais
- [ ] Layout animations para listas filtráveis
- [ ] Performance verificada (60fps no DevTools)
