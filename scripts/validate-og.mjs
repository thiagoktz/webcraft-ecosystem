#!/usr/bin/env node
/**
 * validate-og.mjs — Valida tags Open Graph / Twitter Card / WhatsApp preview
 * em qualquer URL pública, segundo o padrão de shared-skills/social-sharing.
 *
 * Uso:   node scripts/validate-og.mjs <url>
 * Exemplo: node scripts/validate-og.mjs https://saudetotal.com.br/
 *
 * Saída: tabela legível + exit code 0 (aprovado) ou 1 (críticos encontrados).
 */

const url = process.argv[2];
if (!url) {
  console.error('Uso: node scripts/validate-og.mjs <url>');
  process.exit(2);
}

const REQUIRED_OG = [
  'og:type', 'og:site_name', 'og:title', 'og:description',
  'og:url', 'og:locale', 'og:image',
  'og:image:width', 'og:image:height', 'og:image:alt'
];
const REQUIRED_TWITTER = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];

function extractMeta(html) {
  const tags = {};
  // property="..." (Open Graph)
  for (const m of html.matchAll(/<meta\s+property="([^"]+)"\s+content="([^"]*)"/g)) {
    tags[m[1]] = m[2];
  }
  // name="..." (Twitter, description, etc.)
  for (const m of html.matchAll(/<meta\s+name="([^"]+)"\s+content="([^"]*)"/g)) {
    tags[m[1]] = m[2];
  }
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (canonical) tags['link:canonical'] = canonical;
  return tags;
}

const issues = [];
const add = (sev, msg) => issues.push({ sev, msg });

console.log(`→ Fetching ${url}...`);
const r = await fetch(url, { redirect: 'follow' }).catch(e => ({ ok: false, error: e.message }));
if (!r.ok) {
  console.error(`✘ Falha ao buscar: ${r.error || r.status}`);
  process.exit(1);
}
const html = await r.text();
const tags = extractMeta(html);

console.log(`→ HTML carregado (${(html.length / 1024).toFixed(1)} KB)\n`);

// --- Open Graph obrigatórios ---
console.log('Open Graph:');
for (const k of REQUIRED_OG) {
  const v = tags[k];
  if (!v) {
    add('critical', `${k} ausente`);
    console.log(`  ✘ ${k.padEnd(22)} AUSENTE`);
  } else {
    console.log(`  ✓ ${k.padEnd(22)} ${v.slice(0, 60)}${v.length > 60 ? '…' : ''}`);
  }
}

// --- Twitter Card ---
console.log('\nTwitter Card:');
for (const k of REQUIRED_TWITTER) {
  const v = tags[k];
  if (!v) {
    add('warning', `${k} ausente`);
    console.log(`  ⚠ ${k.padEnd(22)} ausente`);
  } else {
    console.log(`  ✓ ${k.padEnd(22)} ${v.slice(0, 60)}${v.length > 60 ? '…' : ''}`);
  }
}
if (tags['twitter:card'] && tags['twitter:card'] !== 'summary_large_image') {
  add('warning', `twitter:card = "${tags['twitter:card']}" (esperado summary_large_image)`);
}

// --- og:url vs canonical ---
console.log('\nIntegridade:');
if (tags['og:url'] && tags['link:canonical'] && tags['og:url'] !== tags['link:canonical']) {
  add('warning', `og:url ≠ canonical (og:url=${tags['og:url']}, canonical=${tags['link:canonical']})`);
  console.log(`  ⚠ og:url ≠ canonical`);
} else if (tags['og:url']) {
  console.log(`  ✓ og:url == canonical`);
}

// --- og:image: HTTPS + acessível + tamanho ---
const ogImage = tags['og:image'];
if (ogImage) {
  if (!ogImage.startsWith('https://')) {
    add('critical', `og:image não é HTTPS — WhatsApp degrada`);
  }
  console.log(`\n→ Verificando og:image acessível...`);
  try {
    const head = await fetch(ogImage, { method: 'HEAD' });
    if (!head.ok) {
      add('critical', `og:image retornou ${head.status}`);
      console.log(`  ✘ HTTP ${head.status}`);
    } else {
      const ct = head.headers.get('content-type') || '';
      const len = parseInt(head.headers.get('content-length') || '0');
      const kb = (len / 1024).toFixed(0);
      console.log(`  ✓ HTTP 200 · ${ct} · ${kb} KB`);
      if (!ct.startsWith('image/')) add('critical', `og:image content-type "${ct}" não é image/*`);
      if (len > 300 * 1024) add('critical', `og:image ${kb} KB > 300 KB — WhatsApp falha`);
      else if (len > 200 * 1024) add('warning', `og:image ${kb} KB acima de 200 KB — considere otimizar`);
    }
  } catch (e) {
    add('critical', `og:image inacessível: ${e.message}`);
    console.log(`  ✘ erro: ${e.message}`);
  }

  // Dimensões absolutas (WhatsApp exige)
  const w = parseInt(tags['og:image:width'] || '0');
  const h = parseInt(tags['og:image:height'] || '0');
  if (!w || !h) {
    add('critical', `og:image:width/height ausentes — WhatsApp não renderiza preview sem`);
  } else if (w !== 1200 || h !== 630) {
    add('warning', `og:image:width/height = ${w}×${h} (recomendado 1200×630)`);
  } else {
    console.log(`  ✓ dimensões 1200×630`);
  }
}

// --- Resumo ---
console.log('\n────────────────────────────────────────');
const crit = issues.filter(i => i.sev === 'critical');
const warn = issues.filter(i => i.sev === 'warning');
console.log(`Críticos: ${crit.length}  ·  Warnings: ${warn.length}`);

if (crit.length) {
  console.log('\nCríticos:');
  for (const i of crit) console.log(`  ✘ ${i.msg}`);
}
if (warn.length) {
  console.log('\nWarnings:');
  for (const i of warn) console.log(`  ⚠ ${i.msg}`);
}

console.log('');
if (crit.length === 0) {
  console.log('✓ APROVADO — preview rico funcionará em WhatsApp/FB/LinkedIn/Telegram.');
  process.exit(0);
} else {
  console.log('✘ REPROVADO — corrigir críticos antes de publicar.');
  process.exit(1);
}
