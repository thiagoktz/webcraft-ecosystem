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
[ ] <link rel="canonical"> presente
[ ] Nenhum atributo inline de style que contradiga o CSS
```

### Social preview (critérios próprios — ver Camada 4.5)

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
[ ] <link rel="canonical"> presente
[ ] Schema.org JSON-LD presente e válido (parseable como JSON)
[ ] Imagens têm width e height definidos (evita CLS)
[ ] lang correto no <html>
```

---

## Camada 4.5 — Social Preview (Open Graph + Twitter Card)

Padrão completo em `shared-skills/social-sharing/SKILL.md`.

### Issues críticos:
```
[ ] og:image presente e HTTPS (sem og:image, WhatsApp degrada para link cru)
[ ] og:image:width e og:image:height presentes (sem dimensões absolutas, WhatsApp não renderiza)
[ ] og:image acessível (HEAD 200, content-type image/*)
[ ] og:image abaixo de 300 KB (limite do WhatsApp)
[ ] og:url igual ao <link rel="canonical">
```

### Warnings:
```
[ ] og:type, og:site_name, og:locale presentes
[ ] og:image:alt descritivo
[ ] twitter:card = summary_large_image
[ ] twitter:title, twitter:description, twitter:image
[ ] Ícones sociais no footer com aria-label e rel="noopener noreferrer"
[ ] Link WhatsApp no footer em formato wa.me/55DDDXXXXXXXX
```

### Verificação programática:
```javascript
async function validarSocialPreview(html) {
  const issues = [];
  const get = (re) => html.match(re)?.[1];

  const ogImage  = get(/property="og:image"\s+content="([^"]+)"/);
  const ogW      = get(/property="og:image:width"\s+content="([^"]+)"/);
  const ogH      = get(/property="og:image:height"\s+content="([^"]+)"/);
  const ogUrl    = get(/property="og:url"\s+content="([^"]+)"/);
  const canon    = get(/<link\s+rel="canonical"\s+href="([^"]+)"/);

  if (!ogImage)                          issues.push({ severity: 'critical', msg: 'og:image ausente' });
  if (ogImage && !ogImage.startsWith('https://')) issues.push({ severity: 'critical', msg: 'og:image deve ser HTTPS' });
  if (!ogW || !ogH)                      issues.push({ severity: 'critical', msg: 'og:image:width/height ausentes' });
  if (ogUrl && canon && ogUrl !== canon) issues.push({ severity: 'warning',  msg: 'og:url != canonical' });

  if (ogImage) {
    const head = await fetch(ogImage, { method: 'HEAD' }).catch(() => null);
    if (!head?.ok) issues.push({ severity: 'critical', msg: 'og:image inacessível' });
    const size = parseInt(head?.headers.get('content-length') || '0');
    if (size > 300 * 1024) issues.push({ severity: 'critical', msg: `og:image > 300KB (${(size/1024).toFixed(0)}KB)` });
  }

  return issues;
}
```

---

## Camada 4.6 — Analytics (GA4 + GTM)

Padrão completo em `shared-skills/analytics/SKILL.md`. Esta camada só roda quando o pipeline incluiu o Analytics Agent (todos exceto `site-rapido`, `auditoria-seo`, `backend-apenas`, `adicionar-pagamento`, `adicionar-cms`).

### Issues críticos:
```
[ ] Bloco GTM presente no <head> (script de googletagmanager.com/gtm.js)
[ ] window.dataLayer inicializado ANTES do bloco GTM
[ ] <noscript> fallback do GTM logo após <body> (necessário se JS desabilitado)
[ ] GTM Container ID não é placeholder (não pode ser "GTM-XXXXXXX")
[ ] GA4 Measurement ID não é placeholder (não pode ser "G-XXXXXXXXXX")
[ ] Apenas 1 carregamento de gtm.js no HTML (sem duplicação)
[ ] Listeners JS dos eventos críticos presentes (hero_cta_click, form_submit_success, whatsapp_open, phone_click)
```

### Warnings:
```
[ ] Comentário "<!-- TODO LGPD -->" presente OU banner de consent já implementado
[ ] Atributos data-cta presentes em CTAs principais
[ ] Forms críticos têm id explícito (não auto-gerado)
[ ] Naming dos eventos segue snake_case e ≤ 40 chars
[ ] Eventos de Enhanced Ecommerce presentes quando pipeline incluiu ecommerce-agent
```

### Verificação programática:
```javascript
function validarAnalytics(html, pipelineIncluiuAnalytics) {
  const issues = [];
  if (!pipelineIncluiuAnalytics) return issues; // skip

  const gtmMatch = html.match(/GTM-[A-Z0-9]{6,8}/);
  const ga4Match = html.match(/G-[A-Z0-9]{8,12}/);

  if (!gtmMatch) issues.push({ severity: 'critical', msg: 'GTM container ausente' });
  if (gtmMatch?.[0] === 'GTM-XXXXXXX') issues.push({ severity: 'critical', msg: 'GTM placeholder não substituído' });
  if (ga4Match?.[0] === 'G-XXXXXXXXXX') issues.push({ severity: 'critical', msg: 'GA4 placeholder não substituído' });

  if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html)) {
    issues.push({ severity: 'critical', msg: 'dataLayer não inicializado antes do GTM' });
  }
  if (!/<noscript[^>]*>[\s\S]*?gtm\.js\?id=GTM/.test(html)) {
    issues.push({ severity: 'critical', msg: '<noscript> fallback do GTM ausente' });
  }
  const gtmLoadCount = (html.match(/googletagmanager\.com\/gtm\.js/g) || []).length;
  if (gtmLoadCount > 1) issues.push({ severity: 'critical', msg: `gtm.js carrega ${gtmLoadCount}x` });

  if (!html.includes('TODO LGPD') && !html.includes('cookieconsent') && !html.includes('lgpd-banner')) {
    issues.push({ severity: 'warning', msg: 'Sem indicação de tratamento LGPD' });
  }
  return issues;
}
```

---

## Camada 4.7 — LGPD (quando Compliance Agent rodou)

Padrão completo em `shared-skills/lgpd-compliance/SKILL.md`. Esta camada roda apenas quando o pipeline inclui o Compliance Agent (`site-completo`, `site-com-cms`, `ecommerce-completo`, `site-pro-max`).

### Issues críticos:
```
[ ] Banner LGPD presente (id="lgpd-banner" ou equivalente, role="dialog")
[ ] Banner tem 3 botões: Aceitar tudo, Recusar tudo, Personalizar (não-negociável)
[ ] Botões Aceitar/Recusar têm mesma proeminência visual (sem dark pattern)
[ ] Consent Mode v2 default 'denied' no <head> ANTES do GTM
[ ] localStorage usado pra persistir consent (não cookie pré-consent)
[ ] Link visível para política de cookies dentro do banner
[ ] politica-de-privacidade.html existe no projeto
[ ] politica-de-cookies.html existe no projeto
[ ] Footer tem links pra ambas as páginas legais
```

### Warnings:
```
[ ] Email do DPO presente nas páginas legais (não genérico contato@)
[ ] CNPJ do controlador presente
[ ] Tempo de retenção declarado por categoria de dado
[ ] Aviso de revisão jurídica visível no início das páginas legais
[ ] data-atualizacao presente nas páginas legais
[ ] Painel "Personalizar" exibe categorias com explicação curta de cada uma
[ ] Cookie "essencial" disabled+checked no painel (não pode ser desativado)
```

### Verificação programática:
```javascript
function validarLgpd(html, pipelineIncluiuCompliance, projetoFiles) {
  const issues = [];
  if (!pipelineIncluiuCompliance) return issues; // skip

  // Banner presente
  if (!/id=["']lgpd-banner["']/.test(html)) {
    issues.push({ severity: 'critical', msg: 'Banner LGPD ausente' });
  }
  // 3 botões obrigatórios
  for (const acao of ['accept-all', 'reject-all', 'customize']) {
    if (!html.includes(`data-lgpd="${acao}"`)) {
      issues.push({ severity: 'critical', msg: `Botão ${acao} ausente no banner` });
    }
  }
  // Consent Mode default
  if (!/gtag\(['"]consent['"]\s*,\s*['"]default['"]/.test(html)) {
    issues.push({ severity: 'critical', msg: 'Consent Mode v2 default não inicializado' });
  }
  // Links legais no footer
  if (!/href=["'][^"']*politica-de-privacidade/.test(html)) {
    issues.push({ severity: 'critical', msg: 'Link pra politica-de-privacidade ausente' });
  }
  if (!/href=["'][^"']*politica-de-cookies/.test(html)) {
    issues.push({ severity: 'critical', msg: 'Link pra politica-de-cookies ausente' });
  }
  // Arquivos das páginas legais existem
  for (const f of ['politica-de-privacidade.html', 'politica-de-cookies.html']) {
    if (!projetoFiles.includes(f)) {
      issues.push({ severity: 'critical', msg: `${f} não encontrado no projeto` });
    }
  }
  return issues;
}
```

---

## Camada 4.8 — EEAT / GEO (Generative Engine Optimization)

Padrão completo em `shared-skills/eeat-geo/SKILL.md`. Valida que o conteúdo entregue está otimizado para extração por LLMs (ChatGPT, Perplexity, Google AI Overview, Gemini).

### Issues críticos:
```
[ ] Exatamente 1 <h1> por página
[ ] Sem pulos de hierarquia (h1 → h3 sem h2 entre)
[ ] Tag semântica raiz presente (<article> ou <main>)
[ ] JSON-LD parseável (sintaxe válida)
[ ] @type do JSON-LD é específico (não genérico Thing)
```

### Warnings:
```
[ ] Quando há Q&A visível no HTML, FAQPage schema também presente
[ ] Nenhum parágrafo > 100 palavras sem subdivisão (texto-parede)
[ ] Alt texts descritivos (não "imagem", "foto", "hero", "thumb")
[ ] Frase média ≤ 25 palavras (heurística por parágrafo)
[ ] <time datetime> presente em artigos com data
[ ] sameAs em Person/Organization quando aplicável
```

### Verificação programática:
```javascript
function validarEeatGeo(html) {
  const issues = [];

  // 1 H1 único
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count !== 1) issues.push({ severity: 'critical', msg: `Esperado 1 <h1>, encontrado ${h1Count}` });

  // Sem pulos de hierarquia
  const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map(m => parseInt(m[1]));
  let prev = 0;
  for (const lvl of headings) {
    if (prev > 0 && lvl > prev + 1) {
      issues.push({ severity: 'critical', msg: `Pulo de h${prev} para h${lvl}` });
    }
    prev = lvl;
  }

  // Tag semântica raiz
  if (!/<article[\s>]/i.test(html) && !/<main[\s>]/i.test(html)) {
    issues.push({ severity: 'critical', msg: 'Sem <article> ou <main> raiz' });
  }

  // JSON-LD parseável
  const ldMatches = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  let hasSpecific = false;
  for (const m of ldMatches) {
    try {
      const j = JSON.parse(m[1]);
      const type = Array.isArray(j) ? j[0]['@type'] : j['@type'];
      if (type && type !== 'Thing') hasSpecific = true;
    } catch (e) {
      issues.push({ severity: 'critical', msg: `JSON-LD inválido: ${e.message}` });
    }
  }
  if (ldMatches.length > 0 && !hasSpecific) {
    issues.push({ severity: 'critical', msg: 'JSON-LD usa @type genérico (Thing) — usar tipo específico' });
  }

  // FAQ no texto mas sem FAQPage schema
  const temFAQVisible = /(perguntas? frequentes?|faq)/i.test(html);
  const temFAQSchema = ldMatches.some(m => /"@type"\s*:\s*"FAQPage"/.test(m[1]));
  if (temFAQVisible && !temFAQSchema) {
    issues.push({ severity: 'warning', msg: 'Texto sugere FAQ mas FAQPage schema ausente' });
  }

  // Alt genéricos
  const genericAlts = [...html.matchAll(/<img[^>]+alt=["'](imagem|foto|hero|thumb|imagem hero|banner)["']/gi)];
  if (genericAlts.length > 0) {
    issues.push({ severity: 'warning', msg: `${genericAlts.length} alt(s) genérico(s) — descrever conteúdo da imagem` });
  }

  return issues;
}
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
