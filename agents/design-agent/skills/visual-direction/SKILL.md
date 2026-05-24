---
name: visual-direction
description: Use este skill no Design Agent ao iniciar qualquer projeto. Define o processo de escolha da direção visual — conceito, referências, personalidade e princípios estéticos — antes de definir cores e tipografia.
---

# Skill: Visual Direction — Direção Visual e Conceito

---

## Por que direção antes de cores

Cores e fontes são consequências de uma direção, não o ponto de partida. Sem direção:
- Escolhas visuais são arbitrárias e inconsistentes
- O resultado parece "site de IA genérico"
- Revisões são subjetivas e infinitas

Com direção clara, cada decisão visual tem justificativa.

---

## 1. Processo de definição de direção

### Passo 1 — Extrair a essência do negócio

Responder internamente antes de qualquer escolha visual:

```
O negócio resolve qual tensão emocional do cliente?
  Fisioterapia → tensão entre dor/limitação e liberdade de movimento
  SaaS financeiro → tensão entre caos e controle
  Consultoria de carreira → tensão entre estagnação e crescimento

O que o cliente sente ao usar o produto/serviço?
  Fisioterapia → alívio, confiança, progresso
  SaaS → clareza, controle, tranquilidade
  Moda premium → prestígio, pertencimento, prazer estético

Qual é a promessa não-verbal da marca?
  (o que o visual deve comunicar sem palavras)
```

### Passo 2 — Definir a personalidade em 3 adjetivos

```
Regra: os adjetivos devem ser específicos e potencialmente contraditórios.

❌ "Moderno, profissional, confiável" (genérico — qualquer marca diria isso)
✅ "Clínico, acolhedor, preciso" (específico — guia decisões reais)
✅ "Bruto, honesto, artesanal" (contraditório — cria tensão interessante)
✅ "Silencioso, premium, atemporal" (evocativo — cada palavra exclui opções)
```

### Passo 3 — Escolher o arquétipo visual

| Arquétipo | Características | Exemplos de marca |
|---|---|---|
| **Clínico** | Muito espaço branco, tipografia precisa, paleta neutra | Apple, Muji, clínicas premium |
| **Editorial** | Grid assimétrico, tipografia forte, imagens de impacto | Vogue, NYT, agências criativas |
| **Orgânico** | Texturas naturais, cores terrosas, formas irregulares | marcas de alimentos naturais, bem-estar |
| **Tecnológico** | Escuro, neon accent, tipografia geométrica, código | SaaS técnico, cybersecurity, dev tools |
| **Humano** | Fotos reais de pessoas, paleta quente, sans-serif amigável | saúde, educação, serviços sociais |
| **Bold** | Contraste extremo, tipografia display grande, cor saturada | moda jovem, food delivery, entretenimento |
| **Clássico** | Serif, dourado/navy, layout simétrico, muito espaço | jurídico, financeiro, luxo tradicional |

---

## 2. Princípios por arquétipo

### Clínico:
```
- Espaço negativo abundante (padding mínimo: 6rem entre seções)
- Grid de 12 colunas com margem generosa
- No máximo 2 cores + branco + preto
- Tipografia sans-serif de espessura fina a regular
- Imagens: produto isolado, fundo branco ou neutro
- Bordas: apenas quando funcionais
- Animações: sutis, fade e slide — nunca chamativas
```

### Editorial:
```
- Grid quebrado intencionalmente em pelo menos 1 seção
- Tipografia como elemento visual (não só funcional)
- Contraste de tamanhos extremo (hero title muito grande)
- Imagens: full-bleed, sem moldura
- Sobreposição de elementos (texto sobre imagem)
- Paleta: preto + branco + 1 cor de impacto
```

### Orgânico:
```
- Formas não-retangulares (blob shapes, curvas suaves)
- Texturas de papel, linho, madeira como background
- Paleta: bege, terracota, verde musgo, areia
- Tipografia: serif humanista ou script cuidadoso
- Fotografia: luz natural, saturação baixa, enquadramento próximo
- Espaçamento: respira mas não é clínico
```

### Tecnológico:
```
- Fundo escuro como padrão (dark mode first)
- Acento em ciano, verde ou roxo neon
- Tipografia: monospace para código, geométrico para títulos
- Elementos de UI: bordas finas, glow effects sutis
- Grid: preciso, denso, muita informação organizada
- Animações: mais evidentes mas ainda controladas
```

### Humano:
```
- Fotografia de pessoas reais (não stock genérico)
- Paleta quente e acessível
- Tipografia: rounded sans-serif ou humanista
- Layout: menos geométrico, mais fluido
- Espaçamento: confortável mas não excessivo
- Sem efeitos visuais que distraiam da mensagem
```

---

## 3. Referências visuais por segmento

Quando não há referências do cliente, use como ponto de partida:

| Segmento | Referências de direção |
|---|---|
| Clínica de saúde | Nuvem Corretora de Saúde, Lavvi, One Health |
| SaaS B2B | Linear, Notion, Loom |
| Alimentação saudável | Liv Up, Eataly, Mãe Terra |
| Moda premium | Osklen, Arezzo premium line |
| Educação | Descomplica, Alura (visual), Khan Academy |
| Consultoria | McKinsey.com, Bain, Deloitte Digital |
| E-commerce | Amaro, Dafiti premium |

---

## 4. Output do visual direction

```json
{
  "conceito": "string — 2-3 frases descrevendo a direção e o porquê",
  "arquetipo": "string — um dos 7 arquetipos",
  "personalidade": ["adjetivo 1", "adjetivo 2", "adjetivo 3"],
  "principios": [
    "string — princípio visual 1",
    "string — princípio visual 2",
    "string — princípio visual 3"
  ],
  "o_que_evitar": [
    "string — o que não fazer neste projeto"
  ],
  "referencias_de_direcao": ["URL ou descrição de referência"]
}
```

---

## Checklist de visual direction

- [ ] Tensão emocional do negócio identificada
- [ ] 3 adjetivos específicos e não-genéricos definidos
- [ ] Arquétipo visual escolhido e justificado
- [ ] Princípios de espaçamento, imagem e animação definidos
- [ ] O que evitar listado explicitamente
- [ ] Direção documentada antes de qualquer escolha de cor ou fonte
