# CONNECTOR.md — Google Places API (New)

**Status:** ✅ Conectado
**API Base:** https://places.googleapis.com/v1
**Documentação:** https://developers.google.com/maps/documentation/places/web-service/overview
**Tipo:** REST API (Google Cloud — não há MCP server oficial)

⚠️ **Este é um conector PAGO.** Tem US$200 de crédito grátis/mês na Google Cloud, mas é fácil estourar. **Cache obrigatório.**

---

## O que o Google Places faz no ecossistema

Fornece dados reais de estabelecimentos: nome oficial, endereço, telefone, horário, **rating, total de avaliações, reviews textuais** e foto de capa. É a fonte primária do **Buscador Agent** — alimenta seções de depoimentos, badges de "Avaliado X.X no Google" e blocos de contato com dados verificados.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Buscador Agent** | Busca + enriquecimento (rating, reviews, contato) |
| **Copy Agent** | Recebe os reviews do Buscador para reescrever na seção depoimentos |
| **WebCraft Agent** | Insere a foto de capa via Places Photo API quando o Content Agent não roda |
| **SEO Agent** | (Opcional) Usa endereço + horário para gerar schema `LocalBusiness` |

---

## 1. Autenticação

Google Places (New) usa **API Key** via header `X-Goog-Api-Key` + máscara de campos `X-Goog-FieldMask`.

### Como obter:
1. Acessar https://console.cloud.google.com
2. Criar/selecionar projeto → **Billing** habilitado (obrigatório, mesmo no crédito grátis)
3. **APIs & Services → Library** → habilitar **Places API (New)**
4. **Credentials → Create credentials → API Key**
5. **Restrições recomendadas:**
   - Application restriction: HTTP referrers (web sites) OU IP addresses (worker)
   - API restriction: limitar à Places API (New) apenas

---

## 2. Variável de ambiente

```bash
# .env (nunca commitar)
GOOGLE_PLACES_API_KEY=AIza...

# Cloudflare Workers
wrangler secret put GOOGLE_PLACES_API_KEY

# Vercel
vercel env add GOOGLE_PLACES_API_KEY production
```

---

## 3. Custos (resumo prático)

Tabela atualizada do Places API (New) — cobrado **por SKU**, não por endpoint:

| SKU | Custo / 1k requests | Quando dispara |
|---|---|---|
| **Place Details (Essentials)** | US$ 5 | Pedindo só id, displayName, formattedAddress |
| **Place Details (Pro)** | US$ 17 | + contact (phone, website, opening hours) |
| **Place Details (Enterprise)** | US$ 20 | + atmosphere (reviews, rating, photos) ← **o que usamos** |
| **Text Search** | US$ 32 | Busca por nome+cidade quando não tem place_id |
| **Place Photo** | US$ 7 | Cada foto solicitada (uma vez por foto) |

**Estimativa por site:** 1 Text Search + 1 Place Details Enterprise + 1 Place Photo ≈ **US$ 0.059** sem cache.

Com **cache de 7 dias** no Cloudflare KV, sites do mesmo cliente revisitados no período custam **US$ 0**.

---

## 4. Buscador Agent — fluxo padrão

### Passo 1: Text Search (só se não tem `place_id`)

```javascript
async function buscarPlaceId(nome, cidade, env) {
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
    },
    body: JSON.stringify({
      textQuery: `${nome} ${cidade}`,
      languageCode: 'pt-BR',
      regionCode: 'BR',
      maxResultCount: 1
    })
  });

  if (!r.ok) throw new Error(`Places SearchText ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.places?.[0] || null;
}
```

### Passo 2: Place Details com todos os campos necessários

```javascript
async function obterDetalhes(placeId, env) {
  const fields = [
    'id',
    'displayName',
    'formattedAddress',
    'internationalPhoneNumber',
    'nationalPhoneNumber',
    'websiteUri',
    'googleMapsUri',
    'location',
    'regularOpeningHours',
    'currentOpeningHours',
    'rating',
    'userRatingCount',
    'reviews',
    'photos'
  ].join(',');

  const r = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=pt-BR`, {
    headers: {
      'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': fields
    }
  });

  if (!r.ok) throw new Error(`Places Details ${r.status}: ${await r.text()}`);
  return r.json();
}
```

### Passo 3: Place Photo (URL pública via redirect)

```javascript
function montarFotoUrl(photoName, env, maxWidth = 1600) {
  // photoName vem como "places/{place_id}/photos/{photo_reference}"
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${env.GOOGLE_PLACES_API_KEY}`;
}
```

⚠️ **Atenção:** a URL acima inclui a API Key. Para uso público no HTML do cliente, **proxie a foto através de um Worker** que valide o referer ou baixe e sirva via R2.

---

## 5. Cache obrigatório (Cloudflare KV)

```javascript
async function buscarComCache(nome, cidade, env) {
  const cacheKey = `places:${nome.toLowerCase()}:${cidade.toLowerCase()}`;
  const cached = await env.PLACES_CACHE.get(cacheKey, 'json');

  // Cache hit fresco
  if (cached && (Date.now() - cached.cachedAt) < 7 * 24 * 60 * 60 * 1000) {
    return { ...cached.data, _source: 'cache' };
  }

  // Cache miss — busca tudo
  const place = await buscarPlaceId(nome, cidade, env);
  if (!place) return { status: 'nao_encontrado' };

  const detalhes = await obterDetalhes(place.id, env);

  const resultado = { status: 'encontrado', detalhes };
  await env.PLACES_CACHE.put(cacheKey, JSON.stringify({
    data: resultado,
    cachedAt: Date.now()
  }), { expirationTtl: 30 * 24 * 60 * 60 }); // 30 dias hard limit, soft 7d

  return resultado;
}
```

**Política:**
- Soft TTL 7 dias (uso normal)
- Hard TTL 30 dias (KV expiration)
- Stale-while-revalidate: se a busca falhar e tiver cache até 30d, usar e logar alerta
- Invalidação manual: orchestrator pode forçar refresh via `?nocache=1`

---

## 6. Schema LocalBusiness via SEO Agent

Quando o site é local (clínica, restaurante, escritório), o SEO Agent pega os dados do Buscador e gera schema.org:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Clínica Saúde Total",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Exemplo, 123",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "telephone": "+55 11 99999-9999",
  "url": "https://saudetotal.com.br",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

---

## 7. Compliance — termos do Google Places

Pontos críticos da [Google Maps Platform Terms](https://cloud.google.com/maps-platform/terms):

- **Sem cache de longo prazo dos dados brutos:** o Google permite cache de até **30 dias** para `place_id` e dados básicos; **reviews e rating devem ser atualizados pelo menos a cada 30 dias** ou na exibição
- **Atribuição obrigatória:** quando exibir reviews, mostrar "Powered by Google" e link pra ficha do Google Maps
- **Não sobrescrever reviews:** não combinar review do Google com outras fontes sem identificar a origem
- **Fotos:** o link da Places Photo API é o único uso permitido — não rebaixar a foto, não armazenar permanentemente sem atribuição

### Atribuição mínima no site:

```html
<section class="depoimentos">
  <h2>O que dizem nossos clientes</h2>
  <!-- reviews aqui -->
  <p class="atribuicao">
    Avaliações via
    <a href="https://maps.google.com/?cid=...">Google Maps</a>
  </p>
</section>
```

---

## 8. Erros comuns

| Código | Causa | Como tratar |
|---|---|---|
| `INVALID_ARGUMENT` | FieldMask malformado | Revisar nomes dos campos (camelCase no New API) |
| `PERMISSION_DENIED` | API Key sem Places API habilitada | Habilitar no Cloud Console |
| `RESOURCE_EXHAUSTED` | Quota diária excedida | Subir cota ou esperar reset (00:00 PT) |
| `NOT_FOUND` | `place_id` não existe ou foi deletado | Refazer Text Search por nome+cidade |
| `FAILED_PRECONDITION` | Billing não habilitado | Ativar billing no projeto Cloud |

---

## 9. Limites por minuto/dia

- **Default:** 6.000 requests/minuto, sem limite diário hard
- **Solicitar aumento:** Cloud Console → Quotas → Edit
- **Buscador Agent na prática:** ~3-5 lookups/site × dezenas de sites/dia = bem abaixo do limite, contanto que o cache esteja ligado

---

## Checklist de configuração

- [ ] Projeto Google Cloud criado
- [ ] Billing habilitado (mesmo no crédito grátis)
- [ ] Places API (New) habilitada
- [ ] API Key gerada com restrições (HTTP referrer ou IP)
- [ ] `GOOGLE_PLACES_API_KEY` como secret no Cloudflare/Vercel
- [ ] KV `PLACES_CACHE` criado no Cloudflare
- [ ] Buscador Agent configurado para ler a env var
- [ ] WebCraft Agent gera bloco de atribuição "Powered by Google" quando reviews aparecem
- [ ] Alerta no dashboard de billing pra US$ 50/mês (warning antes do crédito acabar)

---

## Referências

- API New: https://developers.google.com/maps/documentation/places/web-service/op-overview
- Migration v1: https://developers.google.com/maps/documentation/places/web-service/migration-overview
- Pricing: https://mapsplatform.google.com/pricing/
- Terms (cache + atribuição): https://cloud.google.com/maps-platform/terms
- Field Masks (campos disponíveis): https://developers.google.com/maps/documentation/places/web-service/place-details#fieldmask
