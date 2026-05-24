---
name: checklist
description: Use este skill no QA Agent em toda validação de output do WebCraft Agent. Define o processo de auditoria completo — HTML, CSS, JS, acessibilidade, SEO, performance e segurança — com critérios objetivos de aprovação ou rejeição.
---

# Skill: QA Checklist — Auditoria Completa de Output

---

## Processo de auditoria

O QA Agent executa a auditoria em 7 camadas, nesta ordem. Issues críticos em qualquer camada ativam rejeição imediata — as camadas seguintes ainda são auditadas para relatório completo.

---

## Camada 1 — HTML Estrutural

### Issues críticos (bloqueiam aprovação):
```
[ ] DOCTYPE presente: <!DOCTYPE html>
[ ] Tag <html> com atributo lang correto (ex: lang="pt-BR")
[ ] <meta charset="UTF-8"> presente
[ ] <meta name="viewport" content="width=device-width, initial-scale=1.0"> presente
[ ] <title> presente e não vazio
[ ] Sem tags não fechadas que quebram o DOM
[ ] <body> presente e único
```

### Warnings (não bloqueiam):
```
[ ] <meta name="description"> presente
[ ] Favicon referenciado no <head>
[ ] Open Graph tags presentes (og:title, og:description, og:type)
[ ] <link rel="canonical"> presente
[ ] Nenhum atributo inline de style que contradiga o CSS
```

### Como verificar:
```javascript
// Checar presença de elementos obrigatórios no HTML
const checks = {
  doctype: html.includes('<!DOCTYPE html>'),
  lang: /html[^>]+lang=/.test(html),
  charset: html.includes('charset="UTF-8"') || html.includes("charset='UTF-8'"),
  viewport: html.includes('name="viewport"'),
  title: /<title>[^<]+<\/title>/.test(html),
};
```

---

## Camada 2 — Semântica e Heading Hierarchy

### Issues críticos:
```
[ ] Exatamente 1 <h1> por página (0 ou 2+ = crítico)
[ ] <h1> não está vazio
[ ] Hierarquia sem pulos: h1 → h2 → h3 (nunca h1 → h3)
```

### Warnings:
```
[ ] <header>, <nav>, <main>, <footer> presentes (landmarks)
[ ] <main> único e contém o conteúdo principal
[ ] Listas usam <ul>/<ol> (não <div> com bullets via CSS)
[ ] Tabelas têm <caption> ou aria-label
[ ] Links com texto descritivo (não "clique aqui" ou "saiba mais" sem contexto)
```

### Verificação de heading hierarchy:
```javascript
function verificarHierarchiaHeadings(html) {
  const headings = [...html.matchAll(/<h([1-6])[^>]*>/g)]
    .map(m => parseInt(m[1]));

  const erros = [];
  let anterior = 0;

  for (const nivel of headings) {
    if (nivel > anterior + 1 && anterior !== 0) {
      erros.push(`Pulo de h${anterior} para h${nivel}`);
    }
    anterior = nivel;
  }

  return {
    total_h1: headings.filter(h => h === 1).length,
    pulos: erros
  };
}
```

---

## Camada 3 — Acessibilidade

### Issues críticos:
```
[ ] Todas as <img> têm atributo alt (ausente = crítico)
[ ] alt não é nome de arquivo (ex: "foto123.jpg" = crítico)
[ ] Contraste texto/fundo ≥ 4.5:1 para texto normal
[ ] Contraste texto/fundo ≥ 3:1 para texto grande (≥ 18pt ou 14pt bold)
[ ] Skip link presente como primeiro elemento do <body>
[ ] Nenhum elemento com tabindex > 0
```

### Warnings:
```
[ ] Imagens decorativas têm alt="" e role="presentation"
[ ] Inputs têm <label> associado por for/id
[ ] Botões têm texto descritivo (não apenas ícone sem aria-label)
[ ] :focus-visible definido no CSS (não outline: none sem substituição)
[ ] aria-label em navegações múltiplas
[ ] prefers-reduced-motion implementado no CSS
[ ] Formulários com aria-required e aria-invalid nos campos obrigatórios
```

### Verificação de contraste (simplificada):
```javascript
function ratioContraste(cor1hex, cor2hex) {
  const luminancia = hex => {
    const rgb = parseInt(hex.slice(1), 16);
    const [r, g, b] = [rgb >> 16, (rgb >> 8) & 255, rgb & 255]
      .map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const L1 = luminancia(cor1hex);
  const L2 = luminancia(cor2hex);
  const [leve, escuro] = L1 > L2 ? [L1, L2] : [L2, L1];
  return ((leve + 0.05) / (escuro + 0.05)).toFixed(2);
}

// Exemplo de uso
const ratio = ratioContraste('#1E293B', '#FFFFFF'); // deve ser ≥ 4.5
```

---

## Camada 4 — SEO On-Page

### Issues críticos:
```
[ ] <title> entre 50-60 caracteres
[ ] <meta name="description"> entre 150-160 caracteres
[ ] <h1> contém palavra(s)-chave relevante(s) ao negócio
```

### Warnings:
```
[ ] <meta name="description"> presente
[ ] Open Graph completo (title, description, type, url)
[ ] Twitter Card presente
[ ] <link rel="canonical"> presente
[ ] Schema.org JSON-LD presente e válido (parseable como JSON)
[ ] Imagens têm width e height definidos (evita CLS)
[ ] lang correto no <html>
```

### Verificação de title e description:
```javascript
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
const descMatch = html.match(/name="description"[^>]+content="([^"]+)"/);

const titleLen = titleMatch?.[1]?.length || 0;
const descLen = descMatch?.[1]?.length || 0;

const issues = [];
if (titleLen < 50) issues.push(`Title muito curto: ${titleLen} chars (mín 50)`);
if (titleLen > 60) issues.push(`Title muito longo: ${titleLen} chars (máx 60)`);
if (descLen < 150) issues.push(`Description curta: ${descLen} chars (mín 150)`);
if (descLen > 160) issues.push(`Description longa: ${descLen} chars (máx 160)`);
```

---

## Camada 5 — Performance

### Issues críticos:
```
[ ] <meta name="viewport"> presente (mobile rendering)
[ ] Imagem hero NÃO tem loading="lazy" (deve ter fetchpriority="high")
[ ] Scripts externos com defer ou async (ausente = crítico se no <head>)
```

### Warnings:
```
[ ] Google Fonts com display=swap
[ ] <link rel="preconnect"> para Google Fonts
[ ] <link rel="preload"> para hero image
[ ] Imagens abaixo do fold com loading="lazy"
[ ] width e height em todas as imagens (previne CLS)
[ ] CSS crítico inline ou carregado de forma não-bloqueante
[ ] Sem @import dentro de arquivos CSS (bloqueia renderização)
```

### Verificação de scripts:
```javascript
const scriptsNoHead = html.match(/<head>[\s\S]*?<\/head>/)?.[0] || '';
const scriptsExternos = [...scriptsNoHead.matchAll(/<script\s+src=[^>]+>/g)];

scriptsExternos.forEach(script => {
  if (!script[0].includes('defer') && !script[0].includes('async')) {
    issues.push({
      severity: 'critical',
      description: `Script externo sem defer/async no <head>: ${script[0]}`,
      fix: 'Adicionar atributo defer ou async'
    });
  }
});
```

---

## Camada 6 — Segurança

### Issues críticos:
```
[ ] Sem eval() no JavaScript
[ ] Sem innerHTML recebendo input de usuário sem sanitização
[ ] Sem API keys ou tokens hardcoded no código
[ ] Links externos com rel="noopener noreferrer"
```

### Warnings:
```
[ ] Formulários com honeypot anti-spam
[ ] Sem http:// hardcoded (usar https:// ou URL relativa)
[ ] Inputs de formulário com validação client-side
[ ] action de formulário não aponta para URL insegura
```

---

## Camada 7 — Responsividade

### Issues críticos:
```
[ ] Site renderiza sem scroll horizontal em 375px (iPhone SE)
[ ] Texto legível sem zoom em mobile (mínimo 16px)
[ ] Botões e links com área de toque ≥ 44x44px em mobile
[ ] Navegação utilizável em mobile (hamburger ou stack)
```

### Warnings:
```
[ ] Layout testado em 768px (tablet)
[ ] Layout testado em 1280px (desktop padrão)
[ ] Imagens não ultrapassam a largura do container
[ ] Sem overflow: hidden que esconda conteúdo em mobile
[ ] Grid/flex não quebra em viewports intermediárias
```

---

## Score e critério de aprovação

```javascript
function calcularScore(issues) {
  const pesos = { critical: 20, warning: 3, info: 0 };
  const totalPesos = 100;
  const desconto = issues.reduce((acc, i) => acc + (pesos[i.severity] || 0), 0);
  return Math.max(0, totalPesos - desconto);
}

function determinarStatus(score, issues) {
  const temCritico = issues.some(i => i.severity === 'critical');
  if (temCritico || score < 70) return 'rejected';
  if (score < 90) return 'approved_with_warnings';
  return 'approved';
}
```

| Status | Score | Críticos |
|---|---|---|
| `approved` | ≥ 90 | 0 |
| `approved_with_warnings` | 70–89 | 0 |
| `rejected` | < 70 | qualquer |
| `rejected` | qualquer | ≥ 1 |

---

## Checklist rápido — pré-entrega

```
HTML:          DOCTYPE ✓  lang ✓  viewport ✓  title ✓
Semântica:     1x H1 ✓   landmarks ✓  hierarquia ✓
Acessibilidade: alt ✓  contraste ✓  skip link ✓  focus ✓
SEO:           title 50-60 ✓  description 150-160 ✓  schema ✓
Performance:   defer ✓  lazy ✓  hero eager ✓  fonts swap ✓
Segurança:     sem eval ✓  rel noopener ✓  sem keys ✓
Responsivo:    375px ✓  768px ✓  1280px ✓
```
