---
name: eeat-geo
description: Padrão obrigatório de Experience, Expertise, Authoritativeness e Trustworthiness (E-E-A-T) combinado com Generative Engine Optimization (GEO) — otimização para busca orgânica em plataformas de IA (ChatGPT, Perplexity, Google AI Overview, Gemini). Define convenções de hierarquia de headings, sentenças curtas, HTML semântico, marcação schema.org, inverted pyramid e formatos extraíveis (listas, tabelas, Q&A) usadas por SEO Agent, Copy Agent, WebCraft Agent, Content Agent e QA Agent.
---

# Skill: EEAT + GEO (Shared)

Conteúdo bem rankeado em IA combina **autoridade demonstrável** (EEAT) com **formato extraível** (GEO). Os crawlers das LLMs e mecanismos de busca generativa (ChatGPT, Perplexity, Google AI Overview, Gemini, Claude search) priorizam conteúdo que prova quem está falando e entrega a resposta no início, em formato programático.

Esta skill define o padrão que SEO Agent, Copy Agent, WebCraft Agent, Content Agent e QA Agent compartilham para entregar páginas que IA consegue extrair e citar.

---

## Os 4 pilares EEAT (e o que cada um significa pra IA)

| Pilar | Sinal que a IA procura |
|---|---|
| **Experience** (experiência) | Primeira pessoa contando fato vivido. "Atendi 1.200 pacientes desde 2003." em vez de "Atendemos com excelência." |
| **Expertise** (especialização) | Credenciais nomeadas (formação, certificações, anos no campo) + linguagem técnica precisa. "Formada pela UNIFESP em 2001, especialista em RPG." |
| **Authoritativeness** (autoridade) | Citações de terceiros (mídia, papers, awards), `sameAs` em schema apontando para perfis verificáveis (LinkedIn, CRM/CREFITO, ResearchGate). |
| **Trustworthiness** (confiabilidade) | Política de privacidade, contato verificável, endereço físico, NF emitida, reviews reais (do `buscador-agent`). |

EEAT não é um número que o Google calcula — é um conjunto de sinais que IA agrega. O ecossistema produz esses sinais sistematicamente.

---

## As 5 práticas operacionais

### 1. Hierarquia clara de headings (H2 → H3 → H4)

Cada bloco de conteúdo tem um título declarando o tópico. A IA usa headings pra delimitar contexto na hora de extrair.

```html
<article>
  <h1>Fisioterapia ortopédica em São Paulo</h1>

  <h2>O que tratamos</h2>
    <h3>Lesões esportivas</h3>
    <h3>Reabilitação pós-cirúrgica</h3>
    <h3>Dor crônica</h3>

  <h2>Como funciona o atendimento</h2>
    <h3>Avaliação inicial</h3>
    <h3>Plano de tratamento</h3>

  <h2>Perguntas frequentes</h2>
    <h3>Quanto tempo dura uma sessão?</h3>
    <h3>Aceitam convênio?</h3>
</article>
```

**Regras:**
- 1 `<h1>` por página, sempre
- Sem pulos de nível (não saltar de H1 pra H3)
- Heading descreve o conteúdo da seção, não é decorativo
- Headings curtos (3-7 palavras) — IA usa como label

### 2. Frases curtas com transições claras

Frase média ≤ 20 palavras. Cada frase introduz **um** conceito. Transições entre conceitos são explícitas: "Por isso,", "Em contraste,", "Resumindo,".

❌ Frase parede:
> "Nossa abordagem combina fisioterapia ortopédica com pilates clínico em sessões individuais de 50 minutos onde o paciente tem acompanhamento exclusivo do mesmo profissional do início ao fim do tratamento garantindo continuidade do protocolo."

✅ Quebrado:
> "Atendemos em sessões individuais de 50 minutos. Cada paciente fica com o mesmo fisioterapeuta do início ao fim. Por isso o protocolo flui sem interrupções."

### 3. HTML semântico + schema.org

Tags semânticas dão contexto que `<div>` não dá. Combine com JSON-LD pra contexto duplo (texto + estrutura).

**HTML semântico mínimo por página:**

```html
<article itemscope itemtype="https://schema.org/Article">
  <header>
    <h1 itemprop="headline">Título</h1>
    <p><time datetime="2026-05-27" itemprop="datePublished">27 mai 2026</time>
       por <span itemprop="author">Nome do Autor</span></p>
  </header>
  <section aria-labelledby="secao1-titulo">
    <h2 id="secao1-titulo">…</h2>
    <p itemprop="articleBody">…</p>
  </section>
  <address>
    Endereço físico verificável
  </address>
</article>
```

**Schema.org por tipo de conteúdo (SEO Agent gera):**

| Tipo de página | Schema |
|---|---|
| Site institucional / serviço local | `LocalBusiness` + `Organization` |
| Página de profissional | `Person` (com `sameAs` apontando LinkedIn/CRM) |
| Artigo / post de blog | `Article` (com `author` em `Person`) |
| Tutorial passo-a-passo | `HowTo` |
| Bloco de perguntas frequentes | `FAQPage` |
| Página com avaliações | `Review` ou `AggregateRating` |
| Produto / serviço com preço | `Product` ou `Service` |
| Vídeo embedado | `VideoObject` |
| Receita | `Recipe` |
| Evento | `Event` |

**Exemplo `FAQPage`:**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto tempo dura uma sessão?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "50 minutos. Avaliação inicial é mais longa: 1h30."
      }
    },
    {
      "@type": "Question",
      "name": "Aceitam convênio?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, atendemos Bradesco, Amil e Unimed. Para outros planos, emitimos recibo para reembolso."
      }
    }
  ]
}
```

### 4. Inverted pyramid (resposta no início)

A primeira frase de cada bloco é a resposta completa. As frases seguintes adicionam contexto, justificativa, exceções.

**Por seção:**

| Seção | Primeira frase deve responder |
|---|---|
| Hero | O que faz + pra quem + benefício mensurável |
| Sobre | O que faz e quem você é (1 linha) — história vem depois |
| Serviço (cada) | Resultado mensurável do serviço |
| FAQ | Resposta direta em até 2 frases |
| Depoimento | A mudança concreta sentida pelo cliente |
| CTA | Verbo de ação + objeto |

**Validação que cada agente faz no próprio output:**

```
Antes de devolver o JSON, releia cada bloco textual:
1. Se a IA cortar nos primeiros 40-60 palavras, a resposta sobrevive?
2. Se eu ler só a primeira frase, entendi o ponto principal?
3. As frases seguintes acrescentam ou só repetem a primeira?

Se "não" pra (1) ou (2) — reescreva começando pela resposta.
Se "repetem" pra (3) — corte ou redirecione pra detalhes diferentes.
```

### 5. Formatos extraíveis (bullets, tabelas, Q&A)

IA extrai listas e tabelas com 10x mais confiança do que parágrafos. Sempre que o conteúdo tem estrutura interna, **expresse a estrutura**.

**Quando usar cada um:**

| Formato | Use para | Não use para |
|---|---|---|
| **Bullets** | Lista de 3-7 itens sem ordem natural ou com ordem definida | Itens com explicação longa (vire seções) |
| **Tabela** | Comparar 2+ dimensões (preço × serviço, modelo × feature) | Lista simples (vira bullets) |
| **Q&A explícito** | Dúvidas frequentes, contraste pergunta/resposta | Explicação que não é resposta a pergunta |
| **Definição (`<dl>`)** | Glossário, termos técnicos com definição | Listas comuns |

**Exemplo de tabela vs parágrafo:**

❌ Parágrafo:
> "A consulta básica custa R$ 200, dura 50 minutos e inclui avaliação postural. A consulta completa custa R$ 350, dura 1h30 e inclui avaliação postural, exame de mobilidade e plano de tratamento."

✅ Tabela:

| Plano | Duração | Inclui | Valor |
|---|---|---|---|
| Básico | 50 min | Avaliação postural | R$ 200 |
| Completo | 1h30 | Postural + mobilidade + plano | R$ 350 |

---

## Como cada agente aplica

### SEO Agent
- Gera JSON-LD coerente com o tipo de página (`FAQPage`, `HowTo`, `Review`, `LocalBusiness`, etc.)
- Define `heading_structure` com H2/H3 nomeados e ordenados
- Inclui `Person`/`Organization` com `sameAs` quando autor é identificável
- Adiciona `datePublished`/`dateModified` no `Article`

### Copy Agent
- Aplica inverted pyramid em cada bloco textual
- Frases curtas (≤ 20 palavras médias)
- Estrutura conteúdo em bullets/tabelas/Q&A quando o briefing permite
- Transições explícitas entre tópicos
- Já cobre antipatterns de IA via seção `Estilo proibido`

### WebCraft Agent
- Usa `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>` ao invés de `<div>` decorativo
- `<time datetime>`, `<address>`, `<cite>`, `<dfn>` onde aplicável
- Injeta o JSON-LD do SEO Agent no `<head>` sem modificar
- `aria-labelledby` em `<section>` conectada ao H2/H3 da seção
- `<dl>` com `<dt>`/`<dd>` em glossários

### Content Agent
- Alt text descritivo (frase explicando o que a imagem mostra), não rótulo (`"hero"`, `"imagem"`)
- Conecta alt ao contexto do conteúdo (se a página é sobre fisioterapia, alt da foto inclui essa ligação)
- Quando há figura com legenda, gera `<figure>` + `<figcaption>` em vez de só `<img>`

### QA Agent
- Camada 4.8 — EEAT/GEO valida:
  - Hierarquia de headings sem pulos
  - `<article>` ou tag semântica raiz presente
  - JSON-LD parseável e com `@type` declarado
  - `FAQPage` schema quando há Q&A visível na página
  - Alt texts não-vazios e não-genéricos
  - Sem texto-parede (parágrafo > 100 palavras = warning)

---

## Anti-patterns proibidos

```
❌ Parágrafo de 6 linhas sem heading interno         (IA não delimita contexto)
❌ Heading decorativo ("Conheça nossos diferenciais") (IA ignora — usa palavra-chave concreta)
❌ Lista de 12+ itens sem agrupamento                (vira ruído; agrupe em 2-3 categorias)
❌ Q&A em parágrafo corrido ("Pergunta: X. Resposta: Y.")  (use heading H3 + bloco abaixo)
❌ Alt = "imagem", "foto", "hero"                    (sem contexto pra IA)
❌ Tabela com 1 coluna                               (vira lista)
❌ Schema.org genérico (só @type: Thing)            (sempre tipo específico)
❌ Schema duplicado no mesmo <head>                  (Article + LocalBusiness conflita — escolha o principal)
❌ Frase principal escondida no parágrafo 3          (inverted pyramid quebrada)
❌ <div> com class="article" em vez de <article>     (semântica perdida)
```

---

## Marcação por tipo de página (cheat-sheet pro SEO Agent)

```
Home institucional         → Organization OU LocalBusiness (local) + WebSite + Person/sameAs do fundador
Página de serviço          → Service + AggregateRating (se buscador-agent retornou reviews)
Página "Sobre nós"         → AboutPage + Organization (com foundingDate, founder)
Página de profissional     → Person (sameAs: LinkedIn, CRM/CREFITO/OAB, ResearchGate)
Blog post / artigo         → Article (author: Person, datePublished, dateModified)
Tutorial / passo-a-passo   → HowTo (step: HowToStep, totalTime)
FAQ                        → FAQPage (Question + acceptedAnswer)
Página de contato          → ContactPage + PostalAddress
Avaliações                 → Review OU AggregateRating (NÃO duplicar)
Produto / preço            → Product + Offer
```

---

## Checklist pré-entrega

```
[ ] H1 único e descritivo
[ ] H2/H3 sem pulos, descrevendo conteúdo
[ ] Cada seção começa com a resposta (inverted pyramid)
[ ] Frases ≤ 20 palavras na média
[ ] Bullets ou tabela onde há estrutura
[ ] Q&A em H3 + bloco quando há perguntas
[ ] <article> ou semântico raiz presente
[ ] <time>, <address>, <cite> aplicados quando relevante
[ ] JSON-LD parseável, @type específico
[ ] sameAs em Person/Organization quando há perfil verificável
[ ] Alt texts descritivos (não rótulos)
[ ] Sem parágrafo > 100 palavras sem subdivisão
[ ] EEAT visível: credenciais nomeadas, contato verificável, endereço real
```

---

## Referências

- Google E-E-A-T guidelines: https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t
- Schema.org: https://schema.org/docs/full.html
- Google Search Central — Structured Data: https://developers.google.com/search/docs/appearance/structured-data
- GEO (Generative Engine Optimization) — paper original: https://arxiv.org/abs/2311.09735
