---
name: design-delight
description: Gate de ousadia visual obrigatório do ecossistema. Define anti-templates categóricos (layouts/padrões proibidos), wow-factor obrigatório (pelo menos 1 elemento surpreendente por entrega), craft details (refinamentos técnicos invisíveis mas que comunicam carinho) e os 3 moments of delight (entrada, surpresa, despedida). Aplicada por Design Agent, WebCraft Agent e validada pelo QA Agent (Camada 4.9 — anti-convencionalidade). Existe pra evitar regressão à média dos LLMs em decisões visuais.
---

# Skill: Design Delight (Shared)

LLMs gerando design tendem a regredir à média. Sem regra categórica forçando ousadia, o resultado fica convencional mesmo com `taste`, `uiux-pro` e `impeccable` instalados. Esta skill é o **gate de ousadia obrigatório** — define o que é proibido, o que é obrigatório, e o que é refinamento.

⚠️ **Esta não é orientação. É regra.** Design Agent declara, WebCraft Agent executa, QA Agent valida (Camada 4.9). Sem cumprimento, a entrega é rejeitada.

---

## Os 4 pilares

```
1. Anti-templates obrigatórios   — o que NUNCA fazer
2. Wow-factor obrigatório        — pelo menos 1 dos N elementos surpreendentes
3. Craft details                 — refinamentos técnicos invisíveis
4. 3 moments of delight          — entrada, surpresa, despedida
```

---

## 1. Anti-templates obrigatórios (NEVER DO)

Padrões que denunciam "site genérico de LLM". **Proibidos sem exceção**, mesmo que o cliente pedir explicitamente (nesse caso, oferecer alternativa).

### Layout
- ❌ **Hero `display: flex; justify-content: space-between` com texto à esquerda e foto à direita.** Layout mais clichê da internet. Use asymmetric, overlap, ou hero não-fotográfico.
- ❌ **3 cards em grid 3xN com `ícone + título + 2 linhas de texto`**. Já visto 100 mil vezes. Alternativas: cards de tamanhos diferentes, stack vertical com peso visual desigual, números grandes ao invés de ícones.
- ❌ **Footer em 4 colunas iguais de links agrupados por tema**. Aceite stack mobile-first, footer com personalidade visual (não só dump de links).
- ❌ **Pricing table em 3 colunas com "Mais popular" destacado no meio.** É template Stripe de 2018. Alternativa: comparação horizontal, calculadora interativa, ou opção única (quando faz sentido).
- ❌ **Hero centralizado com `H1 + subtítulo + 2 botões CTAs lado a lado` (primary + secondary)**. Defina hierarquia clara: 1 ação dominante.

### Tipografia
- ❌ **`font-family: Inter` ou `Roboto` ou `system-ui` sem justificativa explícita no TASTE.md.** São fallbacks, não escolhas. Se for usar, declare por quê.
- ❌ **Apenas 1 família tipográfica em todo o site.** Sem contraste display/body, hierarquia visual fica fraca.
- ❌ **Tamanhos múltiplos de 4px sem razão**: 12, 16, 20, 24... Use escala modular (1.25, 1.333, 1.5, golden ratio).

### Cor
- ❌ **Paleta default Tailwind**: `#3B82F6` (blue-500), `#10B981` (emerald-500), `#F59E0B` (amber-500) sem razão de marca. Se for usar paleta Tailwind, customize ao menos 2 cores.
- ❌ **Cinza-azul (`#64748B` slate / `#1F2937` gray-800) como cor primária** sem brand reason. É o "azul de SaaS B2B" da internet inteira.
- ❌ **Gradient `from-blue-500 to-purple-500`**. Cliché de 2020. Use gradient mesh, gradient com 3+ stops, ou cor sólida.

### Texto/CTA
- ❌ **`Bem-vindo`, `Somos especialistas`, `A melhor empresa de…`** como hero.
- ❌ **`Saiba mais`, `Conheça nossos serviços`, `Clique aqui`** como CTA. Use verbo de ação + objeto concreto.
- ❌ **`Lorem ipsum` em qualquer lugar** (mesmo em mockup interno — escreva placeholders reais).

### Imagens
- ❌ **Stock de "pessoa sorrindo com headset"**, "mãos brancas teclando", "equipe diversa em reunião", "estetoscópio em azul".
- ❌ **Foto de perfil em círculo de tamanho default 80px sem contexto.**

---

## 2. Wow-factor obrigatório (pelo menos 1 por entrega)

**Toda entrega final precisa conter pelo menos 1** dos elementos abaixo. O Design Agent declara qual no TASTE.md; o WebCraft Agent implementa; o QA valida presença na Camada 4.9.

### A. Hero não-fotográfico (escolha 1):
- **Gradient mesh** animado lentamente (não loop óbvio — > 30s ciclo)
- **SVG ilustração animada** com timeline curta (entrada de elementos em stagger)
- **Lottie** com loop sutil (não > 5MB)
- **Video loop** silencioso, ≤ 10s, peso ≤ 1.5MB
- **Canvas / WebGL** com efeito minimalista (partículas, ondas, ruído)
- **Texture/grain SVG** sobre cor sólida + tipografia dominante

### B. Tipografia com personalidade técnica:
- **Variable font axis** controlado (`wght`, `wdth`, `slnt`, `opsz`) — não só weight discreto
- **OpenType features ativos**: `font-feature-settings: "ss01", "ss02", "liga", "dlig", "kern"`
- **Lettering manual** em headings críticos (kerning ajustado letra a letra)
- **Fluid typography** com `clamp()` mapeando viewport (não breakpoints discretos)

### C. Motion calibrada (não excesso):
- **Scroll-driven animation** com `IntersectionObserver` + threshold escalonado por seção
- **Motion path** em ícones/setas (não só fade/slide)
- **Stagger reveal** em listas (delay 60-100ms entre itens)
- **Magnetic cursor** no CTA principal (só 1 elemento por página)

### D. Detalhes que surpreendem:
- **Cursor customizado** em zonas específicas (não no body inteiro — fica ruim em mobile)
- **Hover state que muda forma** (não só cor) — letra que se expande, ícone que rotaciona com easing
- **Easter egg discreto** — `console.log` com ASCII art da marca + recado curto
- **Microcopy com personalidade** — error states, loading states, 404 com voz

### E. Layout não-convencional:
- **Asymmetric grid** — texto cobrindo parte da imagem, sobreposições intencionais
- **Diagonal sections** com `clip-path` (não tudo retangular)
- **Editorial layout** — espaçamento generoso (1.5x do "padrão"), hierarquia tipográfica dominante
- **Sticky/parallax controlado** em 1 elemento por página (não excesso)

### Como declarar no TASTE.md:

```markdown
## Wow factor desta entrega

Escolhido: **B — Variable font axis (wght 100→900) com animação ao scroll**
Justificativa: tom premium + tipografia como protagonista combina com o
arquétipo "elegante e técnico" da marca.

Implementação: WebCraft Agent usa `font-variation-settings` com transição
ligada a `IntersectionObserver`.
```

---

## 3. Craft details (refinamentos técnicos invisíveis)

Cliente não percebe conscientemente. Mas a soma deles separa "site genérico" de "feito com carinho".

```css
/* Antialiasing — sempre */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* OpenType features (mesmo se não declarado wow-factor) */
body {
  font-feature-settings: "kern", "liga", "calt";
}

/* Optical sizing (variable fonts modernos) */
h1, h2, h3 {
  font-optical-sizing: auto;
}

/* Smooth scroll com easing customizado */
html {
  scroll-behavior: smooth;
}

/* Vertical rhythm — line-height baseado em escala */
body { line-height: 1.6; }
h1    { line-height: 1.1; }
h2    { line-height: 1.2; }

/* Hover transitions com easing, não default */
button, a {
  transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  /* Nunca: transition: all 0.3s ease; */
}

/* Letter-spacing negativo em headings grandes */
h1 { letter-spacing: -0.02em; }
h2 { letter-spacing: -0.015em; }
/* Uppercase ganha letter-spacing positivo */
.uppercase { letter-spacing: 0.05em; }

/* Tabular numbers em preços, datas, métricas */
.price, .stat, time { font-variant-numeric: tabular-nums; }

/* Image rendering nítido em logos SVG/PNG */
.logo, .icon { image-rendering: -webkit-optimize-contrast; }
```

### Optical alignment (correção visual vs matemática):

```
Botão com ícone à esquerda: ícone fica 1-2px à direita do alinhamento matemático.
Razão: o olho lê o ícone primeiro; o ajuste compensa.

Heading com letra capitular: descida ótica de 2-4px abaixo do baseline.
Razão: a forma da letra parece "flutuar" sem essa compensação.

Cards: padding-bottom 4-8px maior que padding-top.
Razão: peso visual descendente; compensa percepção.
```

Estas regras vão no CSS final. WebCraft Agent não pode "esquecer" porque é skill obrigatória.

---

## 4. Os 3 moments of delight

Toda página entregue tem **3 momentos** mapeados e implementados. Sem isso, a página é tecnicamente correta mas emocionalmente plana.

### Momento 1 — Entrada (primeira impressão)
- **Hero load em < 1.2s** (mensurado, não estimado)
- **Animação de entrada calibrada**: stagger dos elementos do hero (logo → headline → subhead → CTA), não tudo de uma vez
- **Easing customizado** (não `ease`) — `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quart) tem feel premium
- **Sem layout shift** durante o load (CLS = 0 obrigatório — já validado em outras camadas)

### Momento 2 — Surpresa (intermediária)
- **1 interação inesperada** que o usuário descobre rolando ou interagindo
- Exemplos:
  - Imagem que se distorce levemente no hover (não só zoom genérico)
  - Texto que muda de forma ao entrar no viewport (variable font morph)
  - Cursor que ganha label próximo a links importantes
  - Scroll-triggered color shift no fundo
  - Número de stat que conta animado ao entrar no viewport
- **Declare qual no TASTE.md**

### Momento 3 — Despedida (footer / fim de página)
- **Footer NÃO é dump de links em 4 colunas** (ver Anti-templates)
- Pode ser: bloco grande com tipografia dominante + 1 CTA pessoal + endereço/contato com `<address>` semântico
- **Microcopy diferente** do botão principal — ex: "vamos conversar" em vez de "Entrar em contato"
- **Easter egg opcional** no `console.log` (ASCII art da marca + 1 frase)

---

## 5. Integração com agentes

### Design Agent — declara
No `design_brief` JSON e no TASTE.md:

```json
{
  "wow_factor": {
    "categoria": "B - tipografia técnica",
    "elemento": "variable font axis wght 100→900 com IntersectionObserver",
    "justificativa": "tipografia como protagonista bate com tom premium + arquétipo técnico"
  },
  "moments_of_delight": {
    "entrada": "stagger hero 80ms entre elementos, easing ease-out-quart",
    "surpresa": "headings com font-variation wght oscilando 400→700 ao scroll",
    "despedida": "footer com headline grande + endereço semântico + console.log easter egg"
  },
  "anti_templates_recusados": [
    "rejeitado layout hero-flex-direita (genérico)",
    "rejeitada paleta default Tailwind (não comunica marca)"
  ]
}
```

### WebCraft Agent — implementa
- Lê `wow_factor.elemento` do design_brief e implementa no HTML/CSS/JS
- Aplica os 3 moments_of_delight como código real
- Inclui o bloco de craft details acima no CSS sempre

### QA Agent — valida (Camada 4.9)
- Detecta presença de pelo menos 1 wow-factor signature (regex ou DOM check)
- Detecta anti-templates proibidos no HTML/CSS
- Detecta defaults preguiçosos (Inter sem justificativa, paleta Tailwind crua, hero-flex-direita)
- Score de "convencionalidade" 0-100

---

## 6. Checklist pré-entrega

```
Anti-templates:
[ ] Nenhum hero "flex justify-between + foto direita"
[ ] Nenhum "Bem-vindo" / "Saiba mais" / "Lorem ipsum"
[ ] Inter/Roboto/system-ui só se declarado e justificado
[ ] Paleta NÃO é Tailwind default cru

Wow-factor:
[ ] 1 elemento (A, B, C, D ou E) implementado
[ ] Declarado no TASTE.md com justificativa

Craft details:
[ ] -webkit-font-smoothing: antialiased aplicado
[ ] font-feature-settings ativo (kern, liga no mínimo)
[ ] Transitions com cubic-bezier custom, não "ease"
[ ] Letter-spacing negativo em headings grandes
[ ] Tabular-nums em preços/stats/datas

Moments of delight:
[ ] Entrada: stagger calibrado, easing custom
[ ] Surpresa: 1 interação inesperada mapeada
[ ] Despedida: footer com personalidade + microcopy diferente

QA Camada 4.9:
[ ] Score de convencionalidade < 30/100 (acima = rejeitado)
```

---

## Referências

- Awwwards Sites of the Year (referência de wow-factor consistente): https://www.awwwards.com/websites/sites_of_the_year/
- Variable fonts (axis playground): https://v-fonts.com/
- Easing functions visualizadas: https://easings.net/
- Optical alignment (Anton Repponen): https://medium.com/@anton.repponen/optical-vs-mathematical-alignment-3a7e51a2c9c8
