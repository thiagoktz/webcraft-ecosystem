---
name: social-sharing
description: Padrão obrigatório de social preview do ecossistema. Define tags Open Graph completas, Twitter Card, requisitos específicos por plataforma (WhatsApp, Instagram, Telegram, Discord, Slack, Facebook) e ícones sociais no footer. Aplicar em toda geração de site para que o link do site colado em qualquer rede social renderize um preview rico.
---

# Skill: Social Sharing (Shared)

Toda página gerada pelo ecossistema deve mostrar um preview rico — imagem, título e descrição — quando o link for compartilhado em qualquer rede social. O caso mais importante na operação WebCraft é o **WhatsApp**, mas as mesmas tags funcionam em Facebook, Instagram, Telegram, LinkedIn, X/Twitter, Discord, Slack e iMessage.

---

## Bloco padrão obrigatório no `<head>`

```html
<!-- Básico / canônico -->
<title>Clínica Saúde Total — Fisioterapia em São Paulo</title>
<meta name="description" content="Clínica de fisioterapia em São Paulo. 127 avaliações no Google com média 4.8. Atendimento ortopédico, RPG, pilates clínico. Agende online.">
<link rel="canonical" href="https://saudetotal.com.br/">

<!-- Open Graph (Facebook, WhatsApp, LinkedIn, Telegram, Discord, iMessage, Slack) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Clínica Saúde Total">
<meta property="og:title" content="Clínica Saúde Total — Fisioterapia em São Paulo">
<meta property="og:description" content="127 avaliações no Google, média 4.8. Ortopédica, RPG, pilates clínico. Agende online.">
<meta property="og:url" content="https://saudetotal.com.br/">
<meta property="og:locale" content="pt_BR">
<meta property="og:image" content="https://saudetotal.com.br/og-image.jpg">
<meta property="og:image:secure_url" content="https://saudetotal.com.br/og-image.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Recepção da Clínica Saúde Total com profissional atendendo paciente">

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Clínica Saúde Total — Fisioterapia em São Paulo">
<meta name="twitter:description" content="127 avaliações no Google, média 4.8. Ortopédica, RPG, pilates clínico.">
<meta name="twitter:image" content="https://saudetotal.com.br/og-image.jpg">
<meta name="twitter:image:alt" content="Recepção da Clínica Saúde Total com profissional atendendo paciente">
```

⚠️ **Toda tag acima é obrigatória.** Falta de `og:image`, `og:image:width` ou `og:image:height` faz o WhatsApp degradar pra link cru sem preview.

---

## Tabela de exigências por plataforma

| Plataforma | Dimensão ideal | Aspect | Tamanho máx | Formato | Observações críticas |
|---|---|---|---|---|---|
| **WhatsApp** | 1200×630 px | 1.91:1 | **< 300 KB** | JPG ou PNG | HTTPS **obrigatório**, dimensões absolutas obrigatórias, cache agressivo (ver invalidação abaixo) |
| **Facebook** | 1200×630 px | 1.91:1 | < 8 MB | JPG/PNG/WebP | Aceita `og:image:width`/`height` |
| **Telegram** | 1200×630 px | 1.91:1 | < 5 MB | JPG/PNG | Usa OG diretamente, sem cache próprio |
| **LinkedIn** | 1200×627 px | ~1.91:1 | < 5 MB | JPG/PNG | Cache agressivo via Post Inspector |
| **X (Twitter)** | 1200×630 px | 1.91:1 | < 5 MB | JPG/PNG/WebP/GIF | Card `summary_large_image` |
| **Discord** | 1200×630 px | 1.91:1 | < 8 MB | JPG/PNG/WebP/GIF | Usa OG diretamente |
| **Slack** | 1200×630 px | 1.91:1 | < 5 MB | JPG/PNG | Usa OG; pode mostrar versão menor |
| **iMessage** | 1200×630 px | 1.91:1 | < 4 MB | JPG/PNG | Apple parsing — texto curto funciona melhor |
| **Instagram (link bio/DM)** | 1080×1080 px (quadrado) | 1:1 | < 300 KB | JPG/PNG | Instagram não lê OG — apenas mostra a URL crua; o card só aparece se a imagem for um anexo manual. **Não dá pra forçar preview no Instagram via OG.** |

### Por que o Instagram aparece nesta lista mesmo não usando OG?

Porque é a pergunta frequente: "por que meu site aparece bonito no WhatsApp e feio no Instagram?". Resposta: o Instagram **não interpreta Open Graph** na maioria dos contextos (DM, stories, comentários, link da bio). Compartilhamento rico no Instagram requer upload manual da imagem como post/story. O que o ecossistema garante é o ícone do Instagram **no footer do site**, apontando para o perfil do cliente — esse sim é o canal nativo.

---

## Especificação da `og:image` padrão

Quando o cliente não fornece imagem própria, o **Content Agent** gera a variante 1200×630 a partir do hero (que já vem do Unsplash em 1440×800):

```javascript
// Crop a partir da URL do Unsplash (parâmetros nativos)
const heroBaseUrl = assets.hero.url_base; // ex: https://images.unsplash.com/photo-abc123

const ogImageUrl =
  `${heroBaseUrl}?w=1200&h=630&fit=crop&crop=entropy&q=82&fm=jpg`;

// Variante quadrada 1080×1080 (Instagram bio / WhatsApp Status manual)
const ogImageSquareUrl =
  `${heroBaseUrl}?w=1080&h=1080&fit=crop&crop=entropy&q=82&fm=jpg`;
```

**Por que `crop=entropy`:** Unsplash escolhe o pedaço com mais informação visual (rostos, objetos principais) em vez de cortar pelo centro mecânico. Reduz risco de cortar a cabeça da pessoa principal.

**Por que `q=82` e `fm=jpg`:** mantém o arquivo abaixo de 300 KB (limite do WhatsApp). PNG só se for logotipo/ilustração com áreas chapadas.

---

## Atribuição obrigatória da `og:image` quando vem do Unsplash

A imagem OG conta como uso de imagem para os termos do Unsplash. **No HTML do site, em qualquer lugar onde a `og:image` for visível ao usuário humano** (não só no preview da rede social), incluir o crédito (ver `connectors/unsplash/CONNECTOR.md` seção 5).

Quando a `og:image` é apenas servida no `<head>` e não aparece em nenhuma página do site, o crédito ainda assim deve estar visível em **uma** página (ex: rodapé, página /creditos).

---

## Output schema do SEO Agent — bloco completo

O SEO Agent passa a entregar:

```json
{
  "meta_tags": {
    "title": "string (50-60 chars)",
    "description": "string (150-160 chars)",
    "canonical": "string (URL absoluta)",
    "lang": "pt-BR",
    "og": {
      "type": "website | article | product",
      "site_name": "string",
      "title": "string",
      "description": "string",
      "url": "string (URL absoluta, deve bater com canonical)",
      "locale": "pt_BR",
      "image": {
        "url": "string (HTTPS obrigatório, 1200x630)",
        "secure_url": "string (mesma URL)",
        "type": "image/jpeg | image/png",
        "width": 1200,
        "height": 630,
        "alt": "string (descritivo, mesmo padrão do alt de img)"
      }
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "string",
      "description": "string",
      "image": "string (mesma URL da og:image)",
      "image_alt": "string"
    }
  }
}
```

Quando o Content Agent rodou antes do SEO Agent, a `og.image.url` vem dele (variante 1200×630 do hero). Quando não rodou (pipeline `site-rapido` sem content-agent), o SEO Agent usa placeholder colorido + nome do negócio.

---

## Validação no QA Agent (Camada 4 — SEO)

Checks adicionados:

```
[ ] og:image presente e HTTPS (crítico)
[ ] og:image:width e og:image:height presentes e absolutos (crítico — WhatsApp degrada sem)
[ ] og:image acessível (HEAD 200, content-type image/*)
[ ] og:image abaixo de 300 KB (crítico para WhatsApp)
[ ] og:image:alt presente e descritivo
[ ] twitter:card = summary_large_image
[ ] og:url igual ao canonical
[ ] og:locale presente (ex: pt_BR)
```

Implementação de exemplo:

```javascript
async function validarOgImage(html, baseUrl) {
  const issues = [];

  const get = (re) => html.match(re)?.[1];
  const ogImage  = get(/property="og:image"\s+content="([^"]+)"/);
  const ogWidth  = get(/property="og:image:width"\s+content="([^"]+)"/);
  const ogHeight = get(/property="og:image:height"\s+content="([^"]+)"/);
  const ogAlt    = get(/property="og:image:alt"\s+content="([^"]+)"/);

  if (!ogImage) issues.push({ severity: 'critical', msg: 'og:image ausente' });
  if (ogImage && !ogImage.startsWith('https://'))
    issues.push({ severity: 'critical', msg: 'og:image deve ser HTTPS' });
  if (!ogWidth || !ogHeight)
    issues.push({ severity: 'critical', msg: 'og:image:width/height ausentes (WhatsApp degrada)' });
  if (!ogAlt) issues.push({ severity: 'warning', msg: 'og:image:alt ausente' });

  // Verificar tamanho do arquivo
  if (ogImage) {
    try {
      const head = await fetch(ogImage, { method: 'HEAD' });
      const len = parseInt(head.headers.get('content-length') || '0');
      if (len > 300 * 1024)
        issues.push({ severity: 'critical', msg: `og:image > 300KB (atual: ${(len/1024).toFixed(0)}KB) — WhatsApp falha` });
    } catch (e) {
      issues.push({ severity: 'critical', msg: `og:image inacessível: ${e.message}` });
    }
  }

  return issues;
}
```

---

## Ícones sociais no footer (renderização pelo WebCraft Agent)

Padrão do ecossistema: ícones via **Lucide** (já é a biblioteca-base do `content-agent`). Lista mínima e ordem canônica para mercado BR:

```html
<footer>
  <nav aria-label="Redes sociais" class="social-links">
    <!-- WhatsApp primeiro: principal CTA no Brasil -->
    <a href="https://wa.me/5511999999999" aria-label="WhatsApp" rel="noopener noreferrer">
      <svg><!-- lucide: message-circle ou ícone WhatsApp custom --></svg>
    </a>

    <!-- Instagram segundo: mais relevante que Facebook hoje -->
    <a href="https://instagram.com/saudetotal" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <svg><!-- lucide: instagram --></svg>
    </a>

    <!-- Facebook terceiro: ainda relevante para faixas etárias 40+ -->
    <a href="https://facebook.com/saudetotal" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
      <svg><!-- lucide: facebook --></svg>
    </a>

    <!-- LinkedIn quarto: incluir só se B2B / serviços profissionais -->
    <a href="https://linkedin.com/company/saudetotal" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
      <svg><!-- lucide: linkedin --></svg>
    </a>
  </nav>
</footer>
```

### Regras de inclusão:
- **WhatsApp:** sempre, formato `https://wa.me/55DDDXXXXXXXX` (sem `+`, sem espaços, sem hífen)
- **Instagram:** sempre que o cliente tem perfil
- **Facebook:** incluir se o cliente tem página ativa (não perfil pessoal)
- **LinkedIn:** apenas B2B, consultoria, serviços profissionais
- **TikTok / YouTube:** incluir se o cliente produz conteúdo lá
- **X (Twitter):** opcional, baixo tráfego de referral no Brasil hoje

### Acessibilidade:
- Cada ícone tem `aria-label` descrevendo a rede
- `target="_blank"` + `rel="noopener noreferrer"` em todos os links externos (exceto `wa.me`, que pode abrir no mesmo contexto)
- Área de toque mínima 44×44 px em mobile

---

## Schema.org `sameAs` (gerado pelo SEO Agent)

Os mesmos perfis sociais entram no schema JSON-LD para reforçar identidade:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Clínica Saúde Total",
  "sameAs": [
    "https://instagram.com/saudetotal",
    "https://facebook.com/saudetotal",
    "https://www.linkedin.com/company/saudetotal"
  ]
}
```

---

## Invalidação de cache nas plataformas

Cada plataforma faz cache do preview. Quando o site for atualizado **e a `og:image` mudar**, é necessário forçar refresh:

| Plataforma | Como invalidar |
|---|---|
| Facebook | https://developers.facebook.com/tools/debug/ → colar URL → "Scrape Again" |
| WhatsApp | Sem ferramenta oficial. Cache ~7 dias. Truque: anexar `?v=2` na URL ao compartilhar |
| LinkedIn | https://www.linkedin.com/post-inspector/ |
| Twitter/X | Card Validator descontinuado — cache resolve sozinho em ~24h |
| Telegram | Mandar `@WebpageBot` o link em chat privado |

---

## Checklist pré-entrega

```
OG essencial:
[ ] og:type, og:site_name, og:title, og:description, og:url, og:locale
[ ] og:image (HTTPS, 1200×630, <300KB)
[ ] og:image:width, og:image:height, og:image:alt, og:image:secure_url

Twitter Card:
[ ] twitter:card = summary_large_image
[ ] twitter:title, twitter:description, twitter:image, twitter:image:alt

Footer / sociais:
[ ] WhatsApp link com wa.me/55... formato correto
[ ] Instagram link (se aplicável)
[ ] Cada ícone com aria-label
[ ] Links externos com rel="noopener noreferrer"

Validação:
[ ] og:image acessível (HEAD 200)
[ ] og:image < 300KB
[ ] og:url == <link rel="canonical">

Pós-deploy:
[ ] Testar no Facebook Sharing Debugger
[ ] Colar link no próprio WhatsApp e validar preview
[ ] Testar no LinkedIn Post Inspector
```
