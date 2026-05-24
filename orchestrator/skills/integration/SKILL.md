---
name: integration
description: Use este skill quando o Orchestrator precisar combinar outputs de múltiplos agentes em uma entrega coesa. Cobre validação de outputs, resolução de conflitos e montagem do resultado final.
---

# Skill: Integration — Combinação de Outputs de Agentes

Este skill guia o Orchestrator na validação e integração dos resultados de múltiplos agentes em uma entrega única e coerente.

---

## 1. Validação de Output por Agente

Antes de passar o output de um agente para o próximo, valide:

### SEO Agent:
```javascript
function validarOutputSEO(output) {
  const checks = {
    tem_palavras_chave: Array.isArray(output.palavras_chave) && output.palavras_chave.length > 0,
    tem_meta_title: output.meta_tags?.title?.length >= 50,
    tem_meta_description: output.meta_tags?.description?.length >= 100,
    tem_schema: typeof output.schema_json_ld === 'string'
  };
  return checks;
}
```

### Copy Agent:
```javascript
function validarOutputCopy(output, secoesEsperadas) {
  const checks = {
    tem_hero: !!output.textos?.hero?.titulo,
    tem_cta: !!output.textos?.hero?.cta,
    secoes_completas: secoesEsperadas.every(s => !!output.textos?.[s])
  };
  return checks;
}
```

### WebCraft Agent:
```javascript
function validarOutputWebCraft(output) {
  const checks = {
    tem_html: output.html?.includes('<!DOCTYPE html>') || output.html?.includes('<html'),
    tem_css: output.css?.length > 100,
    tem_viewport: output.html?.includes('viewport'),
    tem_lang: output.html?.includes('lang=')
  };
  return checks;
}
```

---

## 2. Resolução de Conflitos

Quando outputs de agentes diferentes conflitam:

### Conflito de textos (Copy Agent vs WebCraft Agent):
- **Regra:** Copy Agent tem prioridade sobre textos
- O WebCraft Agent deve usar os textos do Copy Agent, nunca gerar os seus

### Conflito de meta tags (SEO Agent vs WebCraft Agent):
- **Regra:** SEO Agent tem prioridade sobre meta tags
- O WebCraft Agent insere as meta tags exatamente como o SEO Agent entregou

### Conflito de estrutura de seções:
- **Regra:** Manter o que o WebCraft Agent gerou estruturalmente
- Substituir apenas o conteúdo textual com o que veio do Copy Agent

---

## 3. Montagem do Resultado Final

```javascript
function montarResultadoFinal(outputs) {
  const { seo, copy, webcraft } = outputs;

  // 1. Partir do HTML gerado pelo WebCraft
  let html = webcraft.html;

  // 2. Substituir meta tags pelas do SEO Agent
  if (seo?.meta_tags) {
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${seo.meta_tags.title}</title>`
    );
    // ... demais substituições
  }

  // 3. Injetar schema.org do SEO Agent
  if (seo?.schema_json_ld) {
    html = html.replace(
      '</head>',
      `<script type="application/ld+json">${seo.schema_json_ld}</script>\n</head>`
    );
  }

  return {
    html,
    css: webcraft.css,
    js: webcraft.js,
    agentes_usados: Object.keys(outputs).filter(k => outputs[k] !== null),
    qualidade: calcularQualidade(outputs)
  };
}
```

---

## 4. Score de Qualidade

Calcule e reporte ao usuário:

```javascript
function calcularQualidade(outputs) {
  let score = 0;
  const detalhes = [];

  if (outputs.seo) {
    score += 30;
    detalhes.push('✅ SEO otimizado (+30)');
  }
  if (outputs.copy) {
    score += 40;
    detalhes.push('✅ Textos profissionais (+40)');
  }
  if (outputs.webcraft) {
    score += 30;
    detalhes.push('✅ Design e estrutura (+30)');
  }

  return { score, detalhes, classificacao: score >= 80 ? 'Premium' : score >= 50 ? 'Padrão' : 'Básico' };
}
```

---

## 5. Fallback por Agente Ausente

Se um agente falhar, o Orchestrator continua sem ele:

| Agente ausente | Fallback |
|---|---|
| `seo-agent` | WebCraft usa seu próprio skill de SEO |
| `copy-agent` | WebCraft gera textos placeholder com orientações |
| `webcraft-agent` | Entrega textos e SEO sem o site (bloqueante — informar usuário) |

---

## 6. Formato da Entrega Final ao Usuário

### Para PM/Designer:
```
✅ Seu site está pronto!

📝 Textos escritos pelo Copy Agent para 5 seções
🔍 Otimizado para aparecer no Google (palavras-chave: fisioterapia São Paulo, clínica de reabilitação...)
🎨 Design responsivo e acessível pelo WebCraft Agent

Qualidade: Premium (100/100)

[Arquivos disponíveis para download]
Próximo passo: fazer o deploy — posso te guiar!
```

### Para Dev:
```
Pipeline executado: seo-agent → copy-agent → webcraft-agent

SEO Agent:
  - 8 palavras-chave identificadas
  - Meta tags geradas (title 58 chars, description 155 chars)
  - Schema LocalBusiness injetado

Copy Agent:
  - 5 seções com textos originais
  - Tom: profissional e acolhedor

WebCraft Agent:
  - Stack: HTML/CSS/JS
  - Lighthouse estimado: 90+ Performance, 100 Accessibility

[Arquivos: index.html, styles.css, script.js]
```
