---
name: taste
description: Use este skill no Design Agent para gerar o arquivo TASTE.md de cada projeto — as regras de julgamento estético que guiam o WebCraft Agent antes de qualquer geração. Diferente do Impeccable (que refina depois), o Taste define o padrão antes de começar.
---

# Skill: Taste — Regras de Julgamento Estético por Projeto

---

## O que é o Taste Skill

Taste Skill é uma coleção de arquivos SKILL.md que injetam regras de design opinionadas em qualquer agente de IA, substituindo "AI slop" por design premium e intencional.

A diferença fundamental em relação ao Impeccable:

```
Impeccable → refina e audita depois de gerar
Taste      → define o padrão antes de começar

Impeccable → comandos interativos (/audit, /polish, /animate)
Taste      → arquivo de contexto injetado automaticamente

Impeccable → vocabulário compartilhado com o agente
Taste      → julgamento estético embutido no agente
```

---

## Instalação

```bash
# Instalar o taste-skill padrão
npx skills add https://github.com/Leonxlnx/taste-skill

# Instalar variante específica
npx skills add https://github.com/Leonxlnx/taste-skill --skill minimalist-skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill soft-skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill brutalist-skill
```

---

## As 7 variantes do Taste Skill

| Variante | Quando usar | Estilo |
|---|---|---|
| `taste-skill` | Padrão — output premium sem forçar estilo único | All-rounder |
| `redesign-skill` | Projeto existente que precisa de audit + redesign | Refactor |
| `soft-skill` | Interface calma, cara, com whitespace e motion suave | Premium silencioso |
| `output-skill` | Previne placeholders, seções cortadas, trabalho incompleto | Completude |
| `minimalist-skill` | UI editorial restrita — sem gradientes, sem sombras coloridas | Minimalismo |
| `brutalist-skill` | Swiss typography, estrutura crua, contraste agressivo | Maximalismo estrutural |
| `stitch-skill` | Compatível com Google Stitch — exporta `DESIGN.md` semântico | Design system |

---

## Os 3 dials de configuração

O Taste Skill tem 3 parâmetros que controlam o resultado:

```markdown
# No TASTE.md do projeto:

DESIGN_VARIANCE: 7      # 1-10: quão diferente do padrão
                        # 1-3 = layouts convencionais
                        # 7-10 = composição experimental

MOTION_INTENSITY: 5     # 1-10: quantidade e peso das animações
                        # 1-2 = quase sem animação
                        # 8-10 = cinemático, pesado

VISUAL_DENSITY: 4       # 1-10: quantidade de informação por tela
                        # 1-3 = muito espaço, respira
                        # 8-10 = denso, compacto
```

---

## Como o Design Agent gera o TASTE.md

O Design Agent gera o arquivo `TASTE.md` ao final do brief de design, antes de passar o contexto para o WebCraft Agent. Este arquivo é o "DNA estético" do projeto.

### Template gerado pelo Design Agent:

```markdown
# TASTE.md — [Nome do Cliente]
# Gerado pelo Design Agent em [data]
# Variante: [taste-skill | soft-skill | minimalist-skill | brutalist-skill]

---

## Identidade Visual

**Conceito:** [1 parágrafo evocativo — não regras, intenção]
Exemplo: "Uma interface que respira. Espaço generoso entre cada elemento,
como uma galeria bem curada. O usuário chega e sente que foi pensado para ele."

**Personalidade em 3 adjetivos:** [específicos, potencialmente contraditórios]
Exemplo: clínico · acolhedor · preciso

**Arquétipo:** [Humano | Clínico | Editorial | Tecnológico | Orgânico | Bold | Premium]

---

## Dials

DESIGN_VARIANCE: [1-10]
MOTION_INTENSITY: [1-10]
VISUAL_DENSITY: [1-10]

---

## Regras obrigatórias (ALWAYS DO)

- [Regra específica do projeto — ex: "sempre usar espaço negativo generoso"]
- [Regra específica — ex: "tipografia como elemento visual, não só funcional"]
- [Regra específica — ex: "hierarquia clara — 1 CTA dominante por tela"]

---

## Anti-patterns deste projeto (NEVER DO)

- [Anti-pattern específico — ex: "sem azul — cor muito associada a plano de saúde"]
- [Anti-pattern — ex: "sem gradiente — paleta sólida e madura"]
- [Anti-pattern — ex: "sem ícones de estetoscópio — muito clichê de saúde"]
- Sem Inter como fonte principal
- Sem gradiente roxo/azul em fundo branco
- Sem hero centralizado sem tensão visual
- Sem grid de 3 ícones como única seção de features

---

## Sistema de cores

Primária:    [hex] — [por que esta cor para este projeto]
Secundária:  [hex] — [papel]
Acento:      [hex] — [quando usar]
Fundo:       [hex] — [atmosfera que cria]
Texto:       [hex] — [legibilidade + personalidade]

---

## Tipografia

Título:  [fonte] — [por que esta fonte para este projeto]
Corpo:   [fonte] — [por que complementa o título]
Mono:    [fonte] (se necessário)

---

## Referências aprovadas

[URLs ou descrições de sites que o cliente admirou]

---

## Referências negativas

[URLs ou descrições de sites que o cliente detestou — importantes para não repetir]
```

---

## Exemplos de TASTE.md por segmento

### Clínica de Saúde (Saúde Total):
```markdown
# TASTE.md — Clínica Saúde Total

## Identidade Visual

**Conceito:** Uma clínica que respeita o tempo e a dor do paciente.
Espaço generoso, foco no resultado, sem exageros visuais. Cálida como
um consultório bem cuidado, precisa como um diagnóstico bem feito.

**Personalidade:** acolhedor · preciso · humano

**Arquétipo:** Humano

## Dials
DESIGN_VARIANCE: 4
MOTION_INTENSITY: 3
VISUAL_DENSITY: 3

## ALWAYS DO
- Tons quentes como dominantes (terracota, verde musgo, âmbar)
- Muito espaço negativo — cada elemento precisa respirar
- Tipografia humanista com line-height generoso
- Depoimentos reais com contexto humano (nome + situação)
- CTA único e claro por seção

## NEVER DO
- Sem azul como primária (muito associado a plano de saúde genérico)
- Sem gradiente — paleta sólida e madura
- Sem ícones de estetoscópio, prancheta ou coração
- Sem stock photos de médico sorrindo com jaleco
- Sem Inter ou Roboto — tipografia humanista apenas
- Sem hero centralizado — composição assimétrica
```

### SaaS Tecnológico (TechStart):
```markdown
# TASTE.md — TechStart

## Identidade Visual

**Conceito:** Software que parece inevitável. Dark, denso e preciso —
como um cockpit de avião. Cada pixel tem razão de existir. Quem usa
sente que está no controle.

**Personalidade:** técnico · confiante · direto

**Arquétipo:** Tecnológico

## Dials
DESIGN_VARIANCE: 7
MOTION_INTENSITY: 6
VISUAL_DENSITY: 7

## ALWAYS DO
- Dark mode como padrão (não como opção)
- Acento único e vibrante (ciano ou verde neon)
- Dados e números com fonte mono
- Animações que confirmam ações — não decorativas
- Densidade alta é feature — não problema

## NEVER DO
- Sem light mode como padrão
- Sem gradiente pastel
- Sem "friendly rounded corners" — estrutura sólida
- Sem ilustrações de pessoas felizes usando computador
- Sem Space Grotesk — fingerprint de AI-generated SaaS
```

---

## Pipeline: onde o Taste entra

```
1. Design Agent lê o brief do cliente
         ↓
2. Design Agent escolhe a variante correta do Taste Skill:
   - Site institucional/saúde → soft-skill ou taste-skill
   - SaaS/tech → taste-skill ou brutalist-skill
   - Portfolio premium → minimalist-skill
   - Redesign de site existente → redesign-skill
         ↓
3. Design Agent gera TASTE.md com dials calibrados
         ↓
4. TASTE.md é passado ao WebCraft Agent como contexto obrigatório
         ↓
5. WebCraft Agent lê o TASTE.md antes de qualquer geração
         ↓
6. Impeccable /audit verifica conformidade ao entregar
```

---

## Integração com o Memory Agent

O TASTE.md é salvo no perfil do cliente no Memory Agent:

```json
{
  "client_id": "saude-total-m3x9",
  "brand": {
    "taste_variant": "soft-skill",
    "taste_dials": {
      "DESIGN_VARIANCE": 4,
      "MOTION_INTENSITY": 3,
      "VISUAL_DENSITY": 3
    },
    "taste_md_path": "clients/saude-total-m3x9/TASTE.md"
  }
}
```

Em revisões futuras, o Memory Agent carrega o `TASTE.md` automaticamente — o WebCraft Agent nunca esquece o padrão estético aprovado.

---

## Checklist do Taste

- [ ] Variante correta escolhida para o segmento
- [ ] Conceito escrito como intenção, não como regra
- [ ] 3 adjetivos de personalidade específicos (não "moderno, profissional, confiável")
- [ ] Dials calibrados ao projeto (VARIANCE, MOTION, DENSITY)
- [ ] ALWAYS DO: mínimo 4 regras específicas do projeto
- [ ] NEVER DO: mínimo 5 anti-patterns (incluindo os globais)
- [ ] Paleta com justificativa de cada cor
- [ ] Tipografia com justificativa de cada escolha
- [ ] TASTE.md salvo no Memory Agent
- [ ] TASTE.md passado ao WebCraft Agent como contexto obrigatório
