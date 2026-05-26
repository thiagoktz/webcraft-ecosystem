# CONNECTOR.md — Google Analytics 4 + Google Tag Manager

**Status:** ✅ Conectado (uso manual + Measurement Protocol)
**Documentação:** https://developers.google.com/analytics/devguides/collection/ga4
**Tipo:** Setup manual pelo cliente + tagging via gtag.js/GTM no site

---

## O que GA4 + GTM faz no ecossistema

Instrumenta cada site entregue com mensuração real de conversão (form submits, cliques em WhatsApp/telefone, CTAs do hero, profundidade de scroll, Enhanced Ecommerce). Sem isso o site é "cego" — cliente não sabe quanto lead/venda o site gera, de onde vem o tráfego, qual CTA converte mais.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Analytics Agent** | Gera bloco GTM, mapeia eventos, escreve docs do cliente |
| **WebCraft Agent** | Mantém `data-cta="<id>"` e `id` em forms pro mapeamento funcionar |
| **Backend Agent** | Dispara `dataLayer.push` no callback de form submit bem-sucedido |
| **E-commerce Agent** | Dispara eventos Enhanced Ecommerce (`view_item`, `add_to_cart`, `purchase`) |
| **QA Agent** | Valida Camada 4.6 — scripts presentes, dataLayer ativo, listeners funcionando |
| **Memory Agent** | Persiste `measurement_id` e `gtm_container_id` reais entre sessões |

---

## 1. Setup inicial — quem faz o quê

### O cliente faz (manualmente, ~5 min):

1. **GA4 — criar property:**
   - Acessar https://analytics.google.com
   - Admin → Create Property → Nome do negócio, fuso BR, moeda BRL
   - Adicionar Data Stream → Web → URL do site
   - Copiar o **Measurement ID** (formato `G-XXXXXXXXXX`)

2. **GTM — criar container:**
   - Acessar https://tagmanager.google.com
   - Create Account → Nome do negócio, país Brasil
   - Container → Web → Create
   - Copiar o **Container ID** (formato `GTM-XXXXXXX`)

3. **Enviar os 2 IDs** pro Orchestrator (via REVISAO.md ou bloco de ativação)

### O Analytics Agent faz (automaticamente):

1. Lê o HTML do WebCraft Agent
2. Mapeia eventos a partir de `data-cta`, `[href*="wa.me"]`, `[href^="tel:"]`, `form#*`
3. Injeta bloco GTM no `<head>` (com placeholder `GTM-XXXXXXX`)
4. Injeta `<noscript>` GTM fallback no início do `<body>`
5. Injeta listeners JS inline pros eventos custom
6. Escreve `client-docs/analytics-setup.md` com passos finais (criar a tag GA4 dentro do GTM, marcar conversions)
7. Escreve `client-docs/analytics-dashboard.md` com "como ler os números"

### O WebCraft Agent faz (substituição final):

- Antes do deploy, substitui `GTM-XXXXXXX` e `G-XXXXXXXXXX` pelos IDs reais informados pelo cliente

---

## 2. Configuração final no GTM (passos pro cliente)

Após o GTM estar no site, o cliente precisa criar uma tag GA4 dentro do container. O `analytics-setup.md` gerado pelo Analytics Agent contém:

```
1. tagmanager.google.com → seu container
2. Tags → New → Tag Configuration → GA4 Configuration
3. Measurement ID → cole o G-XXXXXXXXXX
4. Trigger → All Pages
5. Save → Submit (versão 1 do container)
```

A partir daí, qualquer evento que o site dispara via `dataLayer.push({event: 'X'})` aparece no GA4 em até 5 minutos.

---

## 3. Marcar eventos como Conversion no GA4

Eventos comuns que o Analytics Agent gera (e que o cliente deve marcar como conversion no painel):

```
hero_cta_click       → marcar como conversion
whatsapp_open        → marcar como conversion
phone_click          → marcar como conversion
form_submit_success  → marcar como conversion
booking_cta_click    → marcar como conversion (se site de serviço)
purchase             → automático para e-commerce (já é conversion nativo)
```

**No GA4:**
- Admin → Events → marcar o toggle "Mark as conversion" em cada um

Aparecem listados após o primeiro disparo real (até 24h pra GA4 reconhecer eventos novos).

---

## 4. Enhanced Ecommerce (quando há ecommerce-agent no pipeline)

O Analytics Agent gera dataLayer pushes coordenados com o E-commerce Agent:

```javascript
// Ao visualizar produto
dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'BRL',
    value: 199.90,
    items: [{ item_id: 'sku-123', item_name: 'Curso Avançado', price: 199.90, quantity: 1 }]
  }
});

// Ao adicionar ao carrinho
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: { currency: 'BRL', value: 199.90, items: [...] }
});

// Ao finalizar compra (no callback de success do gateway)
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'mp-abc123',
    value: 199.90,
    currency: 'BRL',
    items: [...]
  }
});
```

O E-commerce Agent é responsável por integrar esses pushes nos callbacks reais de Mercado Pago/Stripe/PagSeguro.

---

## 5. Variáveis úteis no dataLayer (gerador pelo Analytics Agent)

```javascript
dataLayer.push({
  event: 'page_view_enriched',
  page_section: 'home | servicos | contato | ...',
  user_type: 'first_visit | returning',
  language: 'pt-BR',
  // ecommerce-specific quando aplicável
  customer_lifetime_value: null,
  cart_value: null
});
```

Essas variáveis ficam disponíveis pra GTM enriquecer outros eventos automaticamente.

---

## 6. Consent Mode v2 — quando Compliance Agent existir

O ecossistema **ainda não implementa** banner LGPD automático (Compliance Agent é roadmap). Quando ele existir, o Analytics Agent deve:

1. Injetar `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })` ANTES do GTM
2. Banner LGPD dispara `gtag('consent', 'update', { analytics_storage: 'granted' })` no opt-in
3. GTM e GA4 já respeitam isso nativamente (não precisa mexer nas tags)

Hoje, o Analytics Agent insere comentário `<!-- TODO LGPD -->` no HTML e item no array `alertas` do output, sinalizando ao orchestrator/cliente o risco antes do tráfego real.

---

## 7. Measurement Protocol (server-side, opcional)

Pra eventos que acontecem **fora do navegador** (ex: webhook do Mercado Pago confirma pagamento — não tem JS rodando):

```javascript
// Backend Agent dispara via fetch após webhook de pagamento
await fetch('https://www.google-analytics.com/mp/collect?measurement_id=G-XXX&api_secret=<secret>', {
  method: 'POST',
  body: JSON.stringify({
    client_id: '<gerado por gtag>',
    events: [{ name: 'purchase', params: { transaction_id: 'mp-abc', value: 199.90, currency: 'BRL' } }]
  })
});
```

Requer o cliente gerar um **API Secret** em GA4 → Admin → Data Streams → API Secrets. Esse secret vai num `wrangler secret put GA4_API_SECRET` quando aplicável.

---

## 8. Custos

| Item | Custo |
|---|---|
| GA4 | Grátis (até 10M eventos/mês — irrealista atingir num site institucional) |
| GTM | Grátis (sem limites práticos) |
| GA4 360 (enterprise) | US$ 150k/ano — não usamos |
| Measurement Protocol | Grátis |

---

## 9. Erros comuns

| Sintoma | Causa | Como resolver |
|---|---|---|
| Eventos não aparecem no GA4 | Tag GA4 não criada dentro do GTM | Cliente precisa fazer passo 2 do setup (GTM → New Tag → GA4 Configuration) |
| Evento aparece como `(not set)` | Falta `event` no dataLayer push | Verificar listener — deve ser `{event: 'X', ...}` |
| `gtm.js` carrega 2x | GTM injetado tanto no template quanto pelo Analytics Agent | WebCraft Agent não deve gerar GTM por conta própria |
| `_ga` cookie não cria | Browser com block de cookies de terceiros | Esperado — usuário decidiu não ser rastreado |
| Conversions = 0 mas eventos = 100 | Eventos não marcados como conversion no painel | Admin → Events → toggle "Mark as conversion" |

---

## 10. Validação pelo QA Agent

```javascript
const checks = {
  gtm_present:    /GTM-[A-Z0-9]{6,8}/.test(html),
  not_placeholder: !html.includes('GTM-XXXXXXX'),
  datalayer_init: /window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html),
  noscript_fallback: /<noscript[^>]*>[\s\S]*?gtm\.js\?id=GTM/.test(html),
  consent_warning: html.includes('TODO LGPD') || html.includes('Compliance Agent')
};
```

---

## Checklist de configuração

- [ ] Cliente criou GA4 property e tem Measurement ID
- [ ] Cliente criou GTM container e tem Container ID
- [ ] Ambos os IDs informados no REVISAO.md ou bloco de ativação
- [ ] Analytics Agent rodou e injetou GTM no `<head>` com IDs reais
- [ ] Tag GA4 Configuration criada dentro do container (passo manual do cliente)
- [ ] Eventos conversion marcados no painel do GA4 após primeiro disparo
- [ ] `analytics-dashboard.md` entregue ao cliente
- [ ] **TODO até Compliance Agent existir:** banner LGPD providenciado pelo cliente OU por terceiro (Cookiebot/OneTrust)

---

## Referências

- GA4: https://developers.google.com/analytics/devguides/collection/ga4
- GTM: https://developers.google.com/tag-platform/tag-manager
- Enhanced Ecommerce: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- Consent Mode v2: https://developers.google.com/tag-platform/security/guides/consent
- Measurement Protocol: https://developers.google.com/analytics/devguides/collection/protocol/ga4
