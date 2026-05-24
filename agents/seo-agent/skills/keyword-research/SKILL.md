---
name: keyword-research
description: Use este skill no SEO Agent ao iniciar qualquer projeto. Define o processo de seleção de palavras-chave — da palavra primária às long-tails — com base em intenção de busca, segmento e localização do negócio.
---

# Skill: Keyword Research — Pesquisa de Palavras-Chave

---

## Princípio central

> A palavra-chave certa não é a mais buscada — é a que seu público usa quando está pronto para agir.

Foco em **intenção transacional** (quem quer fazer algo) antes de intenção informacional (quem quer aprender).

---

## 1. Processo de seleção em 4 etapas

### Etapa 1 — Palavra-chave semente
Parta do serviço/produto mais importante do negócio:

```
Clínica de fisioterapia em SP
  → semente: "fisioterapia"

SaaS de gestão financeira
  → semente: "gestão financeira" / "controle financeiro"

Consultora de RH
  → semente: "consultoria RH" / "gestão de pessoas"
```

### Etapa 2 — Palavra-chave primária
Combine semente + localização (se local) ou qualificador (se nacional):

```
Negócio local:
  "fisioterapia" + "São Paulo" = "fisioterapia São Paulo"
  "dentista" + "Pinheiros" = "dentista Pinheiros"

Negócio nacional/digital:
  "gestão financeira" + "para pequenas empresas" = "gestão financeira para pequenas empresas"
  "consultoria RH" + "online" = "consultoria RH online"
```

**Critérios da palavra primária:**
- Alta intenção transacional
- Volume de busca relevante (não necessariamente o mais alto)
- Competição viável para o porte do negócio
- Aparece naturalmente no H1 e no title

### Etapa 3 — Palavras secundárias
Variações e sinônimos da primária — 3 a 5 termos:

```
Primária: "fisioterapia São Paulo"
Secundárias:
  - "clínica de fisioterapia SP"
  - "fisioterapeuta São Paulo"
  - "tratamento fisioterapêutico SP"
  - "reabilitação física São Paulo"
```

### Etapa 4 — Long-tails
Frases completas com intenção muito específica — menor volume, maior conversão:

```
"fisioterapia para dor lombar São Paulo"
"fisioterapia pós-operatória SP"
"quanto custa fisioterapia particular São Paulo"
"fisioterapia neurológica pós-AVC"
"melhor clínica de fisioterapia Pinheiros"
```

---

## 2. Classificação por intenção de busca

| Intenção | Tipo | Exemplo | Prioridade |
|---|---|---|---|
| Transacional | Alta conversão | "agendar fisioterapia SP" | 🔴 Máxima |
| Comercial | Avaliando opções | "melhor clínica fisioterapia SP" | 🔴 Alta |
| Informacional | Aprendendo | "o que é fisioterapia neurológica" | 🟡 Média |
| Navegacional | Buscando marca | "Clínica Saúde Total fisioterapia" | 🟢 Baixa |

---

## 3. Palavras-chave locais (SEO local)

Para negócios com endereço físico, sempre incluir variações locais:

```
Nível 1 — Cidade:
  "fisioterapia São Paulo"

Nível 2 — Bairro/Região:
  "fisioterapia Pinheiros"
  "fisioterapia Vila Madalena"
  "fisioterapia Jardins"

Nível 3 — Near me (não usar na keyword, mas considerar na estratégia):
  Google detecta "fisioterapia perto de mim" automaticamente
  → Garantir Google Meu Negócio configurado com endereço correto
```

---

## 4. Palavras-chave por tipo de site

### Landing page (conversão direta):
```
Foco: 1 palavra primária + 3-5 long-tails transacionais
Evitar: palavras muito informacionais (blog é o lugar certo para elas)
```

### Site institucional (múltiplas páginas):
```
Home page: palavra primária mais ampla ("fisioterapia São Paulo")
Páginas de serviço: uma keyword específica por página
  /fisioterapia-ortopedica → "fisioterapia ortopédica SP"
  /fisioterapia-neurologica → "fisioterapia neurológica São Paulo"
Página sobre: keyword de marca + localização
```

### E-commerce:
```
Home: categoria mais ampla
Páginas de categoria: [categoria] + [localização ou qualificador]
Páginas de produto: nome do produto + atributo principal
```

---

## 5. Output estruturado (para alimentar o Copy Agent e WebCraft Agent)

```json
{
  "palavras_chave": {
    "primaria": "fisioterapia São Paulo",
    "secundarias": [
      "clínica de fisioterapia SP",
      "fisioterapeuta São Paulo",
      "reabilitação física São Paulo"
    ],
    "long_tail": [
      "fisioterapia para dor lombar São Paulo",
      "fisioterapia pós-operatória SP",
      "quanto custa fisioterapia particular São Paulo"
    ],
    "locais": [
      "fisioterapia Pinheiros",
      "fisioterapia Vila Madalena"
    ]
  },
  "instrucoes_de_uso": {
    "h1": "Usar palavra primária naturalmente — não forçar",
    "h2s": "Usar secundárias e long-tails como base para H2s",
    "copy": "Distribuir naturalmente — densidade de 1-2% máximo",
    "meta_title": "Palavra primária no início",
    "url": "fisioterapia-sao-paulo (slug com hífens)"
  }
}
```

---

## 6. Armadilhas a evitar

```
❌ Keyword stuffing
   "Fisioterapia São Paulo é a melhor fisioterapia de São Paulo para
    quem busca fisioterapia em São Paulo"
   → Google penaliza, leitores abandonam

❌ Canibalização
   Duas páginas competindo pela mesma keyword
   → Cada página = uma keyword única

❌ Keywords irrelevantes para o estágio do funil
   Landing page de conversão com keywords informacionais
   → Tráfego alto, conversão baixa

❌ Ignorar o Search Intent
   Palavra: "fisioterapia" → intenção: busca por informação geral
   Palavra: "agendar fisioterapia SP" → intenção: quero marcar agora
   → A segunda converte muito mais para landing page
```

---

## Checklist de keyword research

- [ ] Palavra primária definida (intenção transacional ou comercial)
- [ ] 3-5 palavras secundárias identificadas
- [ ] 3-5 long-tails com intenção clara
- [ ] Palavras locais (se negócio local)
- [ ] Sem canibalização entre páginas
- [ ] Instruções de uso entregues ao Copy Agent e WebCraft Agent
- [ ] Slug da URL sugerido com palavra primária
