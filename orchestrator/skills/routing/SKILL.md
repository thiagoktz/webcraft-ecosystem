---
name: routing
description: Use este skill sempre que o Orchestrator receber um novo pedido do usuário. Define como identificar o pipeline correto, decompor a tarefa e montar os inputs de cada agente.
---

# Skill: Routing — Decisão de Pipeline e Decomposição de Tarefas

Este skill guia o Orchestrator na análise do pedido do usuário e na seleção do pipeline e agentes corretos.

---

## 1. Análise do Pedido

Ao receber um pedido, extraia mentalmente:

```json
{
  "intencao": "criar | editar | auditar | consultar",
  "urgencia": "alta | normal",
  "escopo": "completo | parcial",
  "tem_site_existente": true | false,
  "menciona_seo": true | false,
  "menciona_textos": true | false,
  "menciona_design": true | false,
  "perfil_usuario": "dev | pm | designer"
}
```

---

## 2. Árvore de Decisão de Pipeline

```
Pedido recebido
      ↓
Tem site existente?
  ├── SIM → Quer análise? → auditoria-seo
  │         Quer novos textos? → redesign-textos
  │         Quer redesign completo? → site-completo
  │
  └── NÃO → Quer rapidez? → site-rapido
             Quer melhor resultado? → site-completo
             Padrão (sem sinal claro) → site-completo
```

---

## 3. Montagem de Input por Agente

### SEO Agent — sempre primeiro no pipeline completo:
```json
{
  "produto": "[extraído do briefing]",
  "publico": "[extraído do briefing]",
  "localizacao": "[cidade/país, se mencionado]",
  "idiomas": ["pt-BR"],
  "segmento": "[inferido do produto]"
}
```

### Copy Agent — recebe output do SEO Agent:
```json
{
  "produto": "[do briefing]",
  "publico": "[do briefing]",
  "tom": "[do briefing ou inferido]",
  "segmento": "[do briefing]",
  "secoes": ["hero", "servicos", "sobre", "depoimentos", "cta", "footer"],
  "palavras_chave": "[output.palavras_chave do seo-agent]"
}
```

### WebCraft Agent — recebe outputs do SEO e Copy:
```json
{
  "tipo": "[do briefing]",
  "produto": "[do briefing]",
  "publico": "[do briefing]",
  "tom": "[do briefing]",
  "stack": "HTML/CSS/JS",
  "secoes": ["hero", "servicos", "sobre", "depoimentos", "cta", "footer"],
  "textos": "[output.textos do copy-agent]",
  "seo_data": {
    "meta_tags": "[output.meta_tags do seo-agent]",
    "schema_json_ld": "[output.schema_json_ld do seo-agent]"
  }
}
```

---

## 4. Sinais de Urgência

**Alta urgência** (usar `site-rapido`):
- "só para ver como fica"
- "uma versão rápida"
- "protótipo"
- "rascunho"
- "agora"

**Normal** (usar `site-completo`):
- Ausência de sinais de urgência
- "quero o melhor resultado"
- "para lançar"
- "para o cliente"

---

## 5. Inferência de Seções por Tipo de Site

Quando o usuário não especifica seções, use:

| Tipo | Seções padrão |
|---|---|
| Landing page | hero, features, prova-social, cta, footer |
| Site institucional | hero, sobre, servicos, equipe, contato, footer |
| Portfólio | hero, projetos, sobre, contato, footer |
| E-commerce lite | hero, catalogo, como-comprar, contato, footer |
| Dashboard | sidebar, header, main-content, widgets |

---

## 6. Checklist de Routing

Antes de acionar qualquer agente, confirme:

- [ ] Intenção do usuário identificada
- [ ] Pipeline selecionado
- [ ] Inputs de cada agente montados
- [ ] Seções inferidas ou confirmadas
- [ ] Perfil do usuário detectado
- [ ] Usuário informado do pipeline e tempo estimado
