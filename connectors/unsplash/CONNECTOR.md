# CONNECTOR.md — Unsplash API

**Status:** ✅ Conectado · proxy ativo em produção
**API Base:** https://api.unsplash.com
**Worker proxy:** https://webcraft-cache-proxy.thiago-618.workers.dev (ponto de entrada padrão)
**Documentação oficial:** https://unsplash.com/documentation
**Tipo:** REST API (não há MCP server oficial — uso via Worker)

---

## Ponto de entrada recomendado: Worker `webcraft-cache-proxy`

Agentes **não devem chamar `api.unsplash.com` direto** em produção. O caminho oficial é via o Worker `webcraft-cache-proxy` (código em `infra/workers/cache-proxy/`), que:

1. Esconde a `UNSPLASH_ACCESS_KEY` (vive como secret no Worker, não vaza pro frontend)
2. Cacheia respostas em Cloudflare KV (`UNSPLASH_CACHE`, TTL 7 dias) — economiza requests do limite Demo (50/h)
3. Reduz o payload da Unsplash pros campos úteis (`id`, `urls.raw`, `urls.regular`, `user`, `download_location`)
4. Exige header `X-WebCraft-Auth: <WEBCRAFT_AUTH_TOKEN>` em todos os endpoints exceto `/health`

### Endpoint do Worker:

```
GET /unsplash/search?q=<query>&orientation=landscape&color=blue&per_page=5
```

### Exemplo de uso (Content Agent):

```javascript
const r = await fetch(
  `${env.WEBCRAFT_CACHE_PROXY}/unsplash/search?q=physiotherapy%20clinic&orientation=landscape&per_page=5`,
  { headers: { 'X-WebCraft-Auth': env.WEBCRAFT_AUTH_TOKEN } }
);
const data = await r.json();
// data._source = "origin" | "cache"
// data.results[0] = { id, alt, urls: { raw, regular }, user, download_location, width, height }
```

A chamada direta à API só deve acontecer **dentro** do Worker. O `download_location` retornado deve ser pingado pelo WebCraft Agent no build final (obrigação dos termos Unsplash).

---

## O que o Unsplash faz no ecossistema

Fornece imagens profissionais licenciadas (gratuitas para uso comercial sob a [Unsplash License](https://unsplash.com/license)) para sites gerados pelo WebCraft. É a fonte primária de mídia do **Content Agent** — substitui o uso de URLs hardcoded (`images.unsplash.com/photo-[ID]`) por busca real via API com filtros de orientação, cor e relevância.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Content Agent** | Buscar imagens por query, validar URLs, capturar `alt_text` e crédito do autor |
| **WebCraft Agent** | Resolver placeholders do Content Agent em URLs reais durante a geração do site |
| **Design Agent** | (Opcional) Inspiração visual a partir de coleções por tema |

---

## 1. Autenticação

Unsplash usa **Access Key** via header HTTP. Não precisa OAuth para endpoints de leitura.

### Como obter:
1. Criar conta em https://unsplash.com/developers
2. New Application → aceitar os termos da API
3. Copiar a **Access Key** (não a Secret Key — essa é só pra OAuth de upload)

### Limites do plano Demo (gratuito):
- **50 requests/hora** por aplicação
- Suficiente pra ~10 sites gerados/hora (cada um faz 3-5 buscas)

### Promoção a Production (sob aprovação manual):
- **5.000 requests/hora**
- Requisitos: aplicação real em produção + crédito visível ao fotógrafo + link UTM de volta ao Unsplash

---

## 2. Variável de ambiente

```bash
# .env (nunca commitar)
UNSPLASH_ACCESS_KEY=abc123...

# Adicionar no Vercel/Cloudflare
vercel env add UNSPLASH_ACCESS_KEY production
wrangler secret put UNSPLASH_ACCESS_KEY
```

---

## 3. Content Agent — busca de imagens por query

### Endpoint principal: `GET /search/photos`

```javascript
async function buscarImagem(query, opcoes = {}) {
  const params = new URLSearchParams({
    query,
    per_page: opcoes.per_page || 10,
    orientation: opcoes.orientation || 'landscape', // landscape | portrait | squarish
    content_filter: 'high', // filtra conteúdo sensível
    ...(opcoes.color && { color: opcoes.color }) // black_and_white | red | orange | yellow | green | blue | purple | white
  });

  const r = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      'Accept-Version': 'v1'
    }
  });

  if (!r.ok) throw new Error(`Unsplash ${r.status}: ${await r.text()}`);
  return r.json();
}

// Uso no Content Agent
const resultados = await buscarImagem('fisioterapia clínica', {
  orientation: 'landscape',
  color: 'blue'
});

const hero = resultados.results[0];
// {
//   id: 'abc123',
//   urls: { raw, full, regular, small, thumb },
//   alt_description: 'pessoa fazendo alongamento',
//   user: { name: 'João Silva', links: { html: '...' } },
//   links: { download_location: '...' }
// }
```

---

## 4. URLs dinâmicas com transformações

Unsplash entrega URLs que aceitam parâmetros de query pra redimensionar/cortar **na hora**, sem precisar baixar e processar.

```javascript
// URL base devolvida pela API: hero.urls.raw
const raw = hero.urls.raw;

// Construir variantes
const heroUrl     = `${raw}&w=1440&h=800&fit=crop&q=80&fm=webp`;
const thumbUrl    = `${raw}&w=400&h=300&fit=crop&q=70&fm=webp`;
const retinaUrl   = `${raw}&w=2880&h=1600&fit=crop&q=80&fm=webp`;

// Parâmetros úteis:
// w, h        → largura e altura
// fit=crop    → corta mantendo aspect ratio
// q=80        → qualidade (0-100)
// fm=webp     → formato (webp | jpg | png)
// auto=format → deixa o Unsplash escolher o melhor formato
// dpr=2       → device pixel ratio (pra retina)
```

---

## 5. Obrigação de crédito (Unsplash License)

A licença Unsplash é gratuita pra uso comercial, **mas exige crédito visível** quando praticável. Para sites de cliente:

```html
<!-- No alt text e/ou perto da imagem -->
<figure>
  <img src="..." alt="pessoa fazendo alongamento — foto por João Silva no Unsplash">
  <figcaption>
    Foto por <a href="https://unsplash.com/@joaosilva?utm_source=webcraft&utm_medium=referral">João Silva</a>
    no <a href="https://unsplash.com?utm_source=webcraft&utm_medium=referral">Unsplash</a>
  </figcaption>
</figure>
```

⚠️ **Sempre incluir `utm_source` e `utm_medium`** nos links — é obrigatório pelos termos da API.

---

## 6. Trigger de download (também obrigatório)

A cada vez que uma imagem é **efetivamente usada** (não só pesquisada), a app deve pingar o endpoint `download_location` que vem na resposta. Isso conta como "download" para o autor — afeta os rankings dele.

```javascript
async function registrarDownload(downloadLocation) {
  await fetch(downloadLocation, {
    headers: {
      'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    }
  });
}

// No WebCraft Agent, quando a imagem entra no HTML final:
await registrarDownload(hero.links.download_location);
```

Não pingar isso é violação de termos e pode resultar em revogação da Access Key.

---

## 7. Outros endpoints úteis

| Endpoint | Uso no ecossistema |
|---|---|
| `GET /search/photos` | Busca por query — **endpoint principal** do Content Agent |
| `GET /photos/random` | Foto aleatória por query/coleção — fallback quando não há resultado |
| `GET /collections/{id}/photos` | Imagens de uma coleção curada — útil pra Design Agent |
| `GET /topics` | Tópicos editoriais (business, nature, etc.) — inspiração |
| `GET /search/collections` | Buscar coleções por tema |

---

## 8. Integração com o output schema do Content Agent

O JSON de saída do Content Agent passa a carregar dados reais da API:

```json
{
  "assets": {
    "hero": {
      "tipo": "imagem",
      "descricao": "fisioterapeuta atendendo paciente em sala clara",
      "unsplash_query": "physiotherapy clinic",
      "unsplash_id": "abc123",
      "url_base": "https://images.unsplash.com/photo-abc123",
      "url_hero": "https://images.unsplash.com/photo-abc123?w=1440&h=800&fit=crop&q=80&fm=webp",
      "alt_text": "fisioterapeuta atendendo paciente",
      "credito": {
        "autor": "João Silva",
        "url_autor": "https://unsplash.com/@joaosilva?utm_source=webcraft&utm_medium=referral",
        "url_unsplash": "https://unsplash.com?utm_source=webcraft&utm_medium=referral"
      },
      "download_location": "https://api.unsplash.com/photos/abc123/download?ixid=..."
    }
  }
}
```

O WebCraft Agent é responsável por chamar `download_location` no momento do build final.

---

## 9. Rate limit — estratégia

```javascript
// Cache simples de buscas no Cloudflare KV (TTL 7 dias)
async function buscarComCache(query, env) {
  const cacheKey = `unsplash:${query}`;
  const cached = await env.UNSPLASH_CACHE.get(cacheKey, 'json');
  if (cached) return cached;

  const resultado = await buscarImagem(query);
  await env.UNSPLASH_CACHE.put(cacheKey, JSON.stringify(resultado), {
    expirationTtl: 7 * 24 * 60 * 60
  });
  return resultado;
}
```

Com cache, mesmo no plano Demo (50 req/h) o ecossistema aguenta dezenas de sites/dia.

---

## 10. Erros comuns

| Código | Causa | Como tratar |
|---|---|---|
| `401 Unauthorized` | Access Key inválida ou ausente no header | Verificar env var |
| `403 Forbidden` | Excedeu rate limit ou conta suspensa | Backoff + checar dashboard |
| `404 Not Found` | Foto/coleção não existe | Fallback pra `photos/random` |
| `429 Too Many Requests` | Limit/hora estourado | Esperar reset (X-Ratelimit-Reset) ou usar cache |

Headers de resposta sempre trazem:
```
X-Ratelimit-Limit: 50
X-Ratelimit-Remaining: 47
```

---

## Checklist de configuração

- [ ] Conta criada em https://unsplash.com/developers
- [ ] Application criada e Access Key copiada
- [ ] `UNSPLASH_ACCESS_KEY` em `.env` local
- [ ] `UNSPLASH_ACCESS_KEY` adicionada em Vercel/Cloudflare como secret
- [ ] Cache KV `UNSPLASH_CACHE` criado no Cloudflare (recomendado)
- [ ] Content Agent ajustado pra ler `UNSPLASH_ACCESS_KEY` do env
- [ ] WebCraft Agent ajustado pra disparar `download_location` no build final
- [ ] Templates HTML do WebCraft incluem crédito + UTM nos links

---

## Referências

- API docs: https://unsplash.com/documentation
- Licença: https://unsplash.com/license
- Guidelines de atribuição: https://help.unsplash.com/en/articles/2511315-guideline-attribution
- Limites e promoção a Production: https://unsplash.com/documentation#production-applications
