---
name: impeccable
description: Use este skill no WebCraft Agent e no QA Agent para integrar o Impeccable ao ecossistema WebCraft. Define quando e como acionar cada um dos 23 comandos do Impeccable ao longo do pipeline — do briefing ao polish final.
---

# Skill: Impeccable — Integração ao Pipeline WebCraft

---

## O que é o Impeccable

Impeccable é um skill open source criado por Paul Bakaus para resolver o problema de todo agente de IA gerar a mesma UI genérica — fonte Inter, gradiente roxo, cards empilhados, texto cinza em fundo colorido.

Entrega 23 comandos que encapsulam disciplinas de design — `/polish`, `/audit`, `/critique`, `/typeset` e outros — dando ao agente um vocabulário compartilhado para decisões visuais precisas.

---

## Instalação (uma vez por projeto)

```bash
# Instalar no projeto do cliente
npx skills add pbakaus/impeccable

# Alternativa via Claude Code plugin
/plugin marketplace add pbakaus/impeccable
```

Auto-detecta o ambiente e coloca os arquivos no lugar certo. A instalação é no nível do projeto — o skill fica no repositório e viaja com ele. Trocar de Cursor para Claude Code no meio do projeto usa o mesmo skill.

---

## Os 23 comandos por categoria

### Criar
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable craft` | Gera UI a partir de brief + referências visuais |
| `/impeccable shape` | Produz brief de design por discovery — antes do WebCraft Agent gerar |
| `/impeccable impeccable` | Inteligência de design por trás de todos os comandos |

### Avaliar
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable audit` | Check técnico em 5 dimensões com severidade P0–P3 — **acionar no QA Agent** |
| `/impeccable critique` | Review com scoring, persona tests e detecção automática de anti-patterns |

### Refinar
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable animate` | Motion com propósito — acionar quando cliente pede "mais vida" |
| `/impeccable bolder` | Empurra designs seguros em direção a impacto |
| `/impeccable colorize` | Adiciona cor estratégica a interfaces monocromáticas |
| `/impeccable delight` | Pequenos momentos de personalidade — hover surpresa, micro-interação |
| `/impeccable layout` | Corrige layout, espaçamento e ritmo visual |
| `/impeccable overdrive` | Shaders, física, 60fps, transições cinemáticas — para projetos premium |
| `/impeccable quieter` | Atenua designs que estão "gritando" sem perder intenção |
| `/impeccable typeset` | Corrige tipografia genérica, inconsistente ou acidental |

### Simplificar
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable adapt` | Faz o design funcionar em todas as telas sem amputar features |
| `/impeccable clarify` | Reescreve copy confuso — UX writing que se explica sozinho |
| `/impeccable distill` | Subtração implacável — elimina o que não tem razão de existir |

### Solidificar
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable harden` | Edge cases, i18n, estados de erro, overflow — production-ready |
| `/impeccable onboard` | First-run, empty states, caminhos para o valor |
| `/impeccable optimize` | LCP, bundle size, performance de UI |
| `/impeccable polish` | A última passagem meticulosa entre bom e ótimo |

### Sistema
| Comando | O que faz no contexto WebCraft |
|---|---|
| `/impeccable document` | Gera `DESIGN.md` capturando o sistema visual para todos os agentes |
| `/impeccable extract` | Extrai componentes, tokens e padrões para o design system |
| `/impeccable live` | Itera UI no browser — pick element, comentar, 3 variantes, aceitar |
| `/impeccable teach` | Ensina o Impeccable quem é o produto — **rodar uma vez por projeto** |

---

## Onde cada comando entra no pipeline WebCraft

```
1. ONBOARDING DO CLIENTE
   └── /impeccable teach
       → Captura: público-alvo, personalidade da marca, casos de uso
       → Salva em .impeccable.md na raiz do projeto
       → Todos os comandos seguintes se beneficiam do contexto

2. DESIGN AGENT (antes de gerar)
   └── /impeccable shape
       → Discovery de design: o que o projeto realmente precisa
       → Output: brief visual estruturado para o WebCraft Agent

3. WEBCRAFT AGENT (durante a geração)
   └── /impeccable craft
       → Gera a UI com design intelligence embutido
       └── Após gerar:
           /impeccable typeset  → tipografia consistente
           /impeccable layout   → ritmo e espaçamento
           /impeccable animate  → motion com propósito

4. QA AGENT (antes da entrega)
   └── /impeccable audit
       → 5 dimensões: tipografia, cor, layout, motion, UX writing
       → Severidade P0 (crítico) a P3 (sugestão)
       → Issues P0 e P1 bloqueiam entrega
   └── /impeccable polish
       → Passagem final nos detalhes

5. REVISÃO FUTURA (quando cliente pede ajustes)
   └── /impeccable critique   → diagnóstico completo com scoring
   └── /impeccable bolder     → "quero algo mais impactante"
   └── /impeccable quieter    → "está muito carregado"
   └── /impeccable colorize   → "quero mais cor"
   └── /impeccable distill    → "está complexo demais"
   └── /impeccable delight    → "quero aquele detalhe especial"

6. PREPARAÇÃO PARA PRODUÇÃO
   └── /impeccable harden     → edge cases e estados de erro
   └── /impeccable optimize   → performance de UI
   └── /impeccable adapt      → responsividade final
   └── /impeccable document   → gera DESIGN.md para o repositório
```

---

## Anti-patterns detectados pelo Impeccable

O Impeccable mantém uma lista de "design tells" que delata output de IA genérico. Os mais relevantes para o WebCraft Agent evitar:

```
Tipografia:
  ❌ Inter, Roboto, Arial como escolha intencional
  ❌ Italic serif display (Fraunces, Cormorant) no hero H1
     (virou fingerprint de AI marketing pages 2025-2026)
  ❌ Eyebrow chip uppercase + letter-spaced acima do H1

Layout:
  ❌ Grid de 3 colunas de ícones como seção de features
  ❌ Hero centralizado sem tensão visual
  ❌ Cards empilhados em vez de layout real
  ❌ Carrossel sem propósito narrativo

Cor:
  ❌ Gradiente roxo/azul em fundo branco
  ❌ Texto cinza em fundo colorido sem verificação de contraste
  ❌ Blue como cor primária por default

Motion:
  ❌ Animação puramente decorativa sem significado
  ❌ Todos os elementos entrando com o mesmo fade-up
```

---

## Integração com o arquivo `.impeccable.md`

Após instalar, rodar `/impeccable teach` uma vez captura o contexto de design do projeto e salva em `.impeccable.md`. Todos os comandos subsequentes se beneficiam desse contexto automaticamente.

O Design Agent popula este arquivo após o onboarding:

```markdown
# .impeccable.md — Clínica Saúde Total

## Produto
Clínica de fisioterapia em São Paulo

## Público-alvo
Adultos 30-60 anos com dores crônicas, não-técnicos,
buscam confiança e resultado comprovado

## Personalidade da marca
Acolhedor, profissional, preciso
NÃO: frio, técnico, genérico, corporativo

## Referências visuais aprovadas
- Tons quentes (terracota, âmbar, verde musgo)
- Tipografia humanista, não geométrica
- Muito espaço negativo — não denso

## Anti-patterns específicos deste projeto
- Sem azul (muito associado a plano de saúde genérico)
- Sem gradiente — paleta sólida e madura
- Sem ícones de prancheta ou estetoscópio — muito clichê de saúde
```

---

## Checklist de integração do Impeccable

- [ ] `npx skills add pbakaus/impeccable` rodado na raiz do projeto
- [ ] `/impeccable teach` executado uma vez com contexto do cliente
- [ ] `.impeccable.md` populado pelo Design Agent
- [ ] `/impeccable audit` no pipeline do QA Agent (issues P0/P1 bloqueiam)
- [ ] `/impeccable polish` antes de toda entrega ao cliente
- [ ] `/impeccable document` gera `DESIGN.md` ao final do primeiro projeto
- [ ] Anti-patterns da lista acima verificados no output do WebCraft Agent
