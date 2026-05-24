---
name: brand-guide
description: Use este skill no Design Agent e no Copy Agent quando o cliente tiver uma identidade de marca existente. Garante que cores, tipografia, tom de voz e princípios visuais da marca sejam respeitados em todo output gerado.
---

# Skill: Brand Guide — Identidade de Marca

Este skill define como capturar, documentar e aplicar a identidade de marca de um cliente em todos os outputs do ecossistema.

---

## 1. Captura de identidade existente

Quando o cliente já tem uma marca, colete:

```json
{
  "marca": {
    "nome": "string",
    "slogan": "string (opcional)",
    "cores": {
      "primaria": "#hex — obrigatório",
      "secundaria": "#hex — opcional",
      "acento": "#hex — opcional",
      "fundo": "#hex — opcional, default #ffffff",
      "texto": "#hex — opcional, default #1a1a1a"
    },
    "tipografia": {
      "titulo": "nome da fonte (opcional)",
      "corpo": "nome da fonte (opcional)"
    },
    "logo_url": "URL da logo (opcional)",
    "guia_de_voz": {
      "tom": "string — ex: profissional, acolhedor",
      "palavras_chave": ["lista de palavras que representam a marca"],
      "evitar": ["lista de palavras ou abordagens a evitar"],
      "exemplos_aprovados": ["frases ou slogans já aprovados pelo cliente"]
    },
    "referencias_visuais": ["URLs de sites que o cliente admira"],
    "referencias_negativas": ["URLs de sites que o cliente detesta"]
  }
}
```

---

## 2. Validação de consistência de marca

Antes de entregar qualquer output, verificar:

### Cores:
- [ ] Paleta gerada usa a cor primária do cliente como base
- [ ] Cor primária não foi alterada sem aprovação explícita
- [ ] Contraste com cores da marca ≥ 4.5:1
- [ ] Novas cores derivadas são harmônicas com a primária

### Tipografia:
- [ ] Fonte da marca usada (se informada)
- [ ] Se fonte não informada, nova fonte é harmônica com o estilo da marca
- [ ] Pesos e tamanhos consistentes com usos anteriores aprovados

### Tom de voz:
- [ ] Textos usam as palavras-chave da marca
- [ ] Textos evitam os termos na lista negativa
- [ ] Tom é consistente com exemplos aprovados anteriores

---

## 3. Hierarquia de decisões visuais

Quando há conflito entre preferência do Design Agent e a marca do cliente:

```
1. Cores explícitas da marca (inegociável)
2. Tom e personalidade da marca
3. Referências visuais aprovadas pelo cliente
4. Decisões do Design Agent (criatividade dentro dos limites)
5. Defaults do ecossistema (último recurso)
```

---

## 4. Documento de Brand Guide gerado

Ao final de um projeto, gerar e salvar no Memory Agent:

```markdown
# Brand Guide — [Nome da Empresa]
Gerado pelo WebCraft Agent em [data]

## Identidade Visual

**Cor primária:** #2563EB
**Cor secundária:** #1E40AF
**Cor de acento:** #60A5FA
**Fundo principal:** #FFFFFF
**Texto principal:** #1E293B

**Fonte títulos:** Space Grotesk (700)
**Fonte corpo:** DM Sans (400, 500)

## Tom de Voz

**Adjetivos da marca:** Inovador, direto, confiável, acessível
**Usar:** "transformar", "crescer", "resultado", "simples"
**Evitar:** "revolucionário", "disruptivo", jargão técnico excessivo

## CSS Variables
:root {
  --color-primary: #2563EB;
  --color-secondary: #1E40AF;
  --color-accent: #60A5FA;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

## Exemplos de copy aprovados
- Hero: "Transforme seu negócio com tecnologia que funciona."
- CTA: "Começar agora" / "Ver demonstração"
```

---

## 5. Checklist de aplicação de marca

- [ ] Cor primária do cliente usada como base da paleta
- [ ] Fonte da marca aplicada (ou escolha harmônica justificada)
- [ ] Tom de voz consistente com guia
- [ ] Palavras a evitar não presentes nos textos
- [ ] Logo referenciada corretamente (ou placeholder adequado)
- [ ] Brand guide salvo no Memory Agent ao final do projeto
