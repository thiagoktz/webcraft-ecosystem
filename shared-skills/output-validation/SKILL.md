---
name: output-validation
description: Use este skill no Orchestrator e no QA Agent sempre que um agente retornar um output que será passado para o próximo agente. Garante que o JSON está conforme o schema esperado antes de prosseguir o pipeline.
---

# Skill: Output Validation — Validação de JSON entre Agentes

Este skill define como validar os outputs de cada agente antes de passá-los adiante no pipeline.

---

## Por que validar

Agentes comunicam-se via JSON. Um campo ausente ou malformado pode:
- Fazer o próximo agente falhar silenciosamente
- Gerar output incorreto sem indicação de erro
- Corromper o resultado final entregue ao usuário

---

## 1. Schemas de validação por agente

### Design Agent output:
```javascript
const schemaDesign = {
  obrigatorios: [
    'design_brief.conceito',
    'design_brief.cores.primaria',
    'design_brief.cores.texto_principal',
    'design_brief.cores.fundo',
    'design_brief.tipografia.fonte_titulo.familia',
    'design_brief.tipografia.fonte_corpo.familia',
    'design_brief.css_variables'
  ],
  tipos: {
    'design_brief.conceito': 'string',
    'design_brief.personalidade': 'array',
    'design_brief.css_variables': 'string'
  },
  regras: [
    { campo: 'design_brief.cores.primaria', regex: /^#[0-9A-Fa-f]{6}$/, erro: 'Cor primária deve ser hex válido' },
    { campo: 'design_brief.css_variables', contem: ':root {', erro: 'css_variables deve conter bloco :root {}' }
  ]
};
```

### SEO Agent output:
```javascript
const schemaSEO = {
  obrigatorios: [
    'palavras_chave.primaria',
    'meta_tags.title',
    'meta_tags.description',
    'schema_json_ld'
  ],
  regras: [
    { campo: 'meta_tags.title', min: 50, max: 60, erro: 'Title deve ter 50-60 chars' },
    { campo: 'meta_tags.description', min: 150, max: 160, erro: 'Description deve ter 150-160 chars' },
    { campo: 'schema_json_ld', validJson: true, erro: 'schema_json_ld deve ser JSON válido' }
  ]
};
```

### Copy Agent output:
```javascript
const schemaCopy = {
  obrigatorios: [
    'textos.hero.titulo',
    'textos.hero.subtitulo',
    'textos.hero.cta_principal',
    'textos.cta.botao',
    'meta.title',
    'meta.description'
  ],
  regras: [
    { campo: 'textos.hero.titulo', max: 60, erro: 'Título do hero deve ter máx 60 chars' },
    { campo: 'textos.hero.cta_principal', max: 30, erro: 'CTA deve ter máx 30 chars' }
  ]
};
```

### WebCraft Agent output:
```javascript
const schemaWebCraft = {
  obrigatorios: ['html', 'css'],
  regras: [
    { campo: 'html', contem: '<!DOCTYPE html>', erro: 'HTML deve ter DOCTYPE' },
    { campo: 'html', contem: 'lang=', erro: 'HTML deve ter atributo lang' },
    { campo: 'html', contem: 'viewport', erro: 'HTML deve ter meta viewport' },
    { campo: 'css', minLength: 100, erro: 'CSS muito curto — possível falha de geração' }
  ]
};
```

### QA Agent output:
```javascript
const schemaQA = {
  obrigatorios: ['status', 'score', 'summary'],
  valores_validos: {
    'status': ['approved', 'approved_with_warnings', 'rejected']
  },
  regras: [
    { campo: 'score', min: 0, max: 100, erro: 'Score deve estar entre 0-100' }
  ]
};
```

---

## 2. Função de validação genérica

```javascript
function validarOutput(output, schema) {
  const erros = [];

  // Checar campos obrigatórios
  for (const campo of schema.obrigatorios) {
    const valor = getNestedValue(output, campo);
    if (valor === undefined || valor === null || valor === '') {
      erros.push({ campo, tipo: 'ausente', erro: `Campo obrigatório ausente: ${campo}` });
    }
  }

  // Checar tipos
  if (schema.tipos) {
    for (const [campo, tipo] of Object.entries(schema.tipos)) {
      const valor = getNestedValue(output, campo);
      if (valor !== undefined && typeof valor !== tipo && !Array.isArray(valor)) {
        erros.push({ campo, tipo: 'tipo_incorreto', erro: `${campo} deve ser ${tipo}` });
      }
    }
  }

  // Checar regras customizadas
  if (schema.regras) {
    for (const regra of schema.regras) {
      const valor = getNestedValue(output, regra.campo);
      if (valor === undefined) continue;

      if (regra.min && String(valor).length < regra.min)
        erros.push({ campo: regra.campo, tipo: 'muito_curto', erro: regra.erro });
      if (regra.max && String(valor).length > regra.max)
        erros.push({ campo: regra.campo, tipo: 'muito_longo', erro: regra.erro });
      if (regra.regex && !regra.regex.test(String(valor)))
        erros.push({ campo: regra.campo, tipo: 'formato_invalido', erro: regra.erro });
      if (regra.contem && !String(valor).includes(regra.contem))
        erros.push({ campo: regra.campo, tipo: 'conteudo_ausente', erro: regra.erro });
      if (regra.validJson) {
        try { JSON.parse(valor); }
        catch { erros.push({ campo: regra.campo, tipo: 'json_invalido', erro: regra.erro }); }
      }
      if (regra.valores_validos && !regra.valores_validos.includes(valor))
        erros.push({ campo: regra.campo, tipo: 'valor_invalido', erro: regra.erro });
    }
  }

  return {
    valido: erros.length === 0,
    erros,
    score: Math.round(((schema.obrigatorios.length - erros.length) / schema.obrigatorios.length) * 100)
  };
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
```

---

## 3. Checklist de validação no Orchestrator

Antes de passar output de um agente para o próximo:

- [ ] `status === 'success'` (não `error` ou `fallback`)
- [ ] Campos obrigatórios presentes e não vazios
- [ ] Tipos corretos (string, array, object)
- [ ] Regras de negócio respeitadas (tamanhos, formatos)
- [ ] JSON parseável (para campos que são JSON serializado)

---

## 4. O que fazer quando a validação falha

```
Validação falha
      ↓
Severidade crítica? → Parar pipeline → Reportar ao usuário
      ↓ não
Campos ausentes recuperáveis? → Aplicar defaults
      ↓
Re-executar agente com input mais específico (1x)
      ↓
Ainda falha? → Ativar fallback do error-handling skill
```

---

## 5. Defaults por campo ausente

| Campo ausente | Default seguro |
|---|---|
| `design_brief.cores.acento` | Derivar da primária com 20% mais luminosidade |
| `textos.hero.cta_secundario` | Omitir (campo opcional) |
| `assets.favicon` | `https://placehold.co/32x32?text=?` |
| `schema_json_ld` | Schema genérico `WebSite` |
| `palavras_chave.locais` | Array vazio `[]` |
