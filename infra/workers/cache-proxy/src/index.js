// webcraft-cache-proxy
// Proxy + cache pra Google Places API (New) e Unsplash API.
//
// Auth: todos os endpoints (exceto /health) exigem header
//   X-WebCraft-Auth: <WEBCRAFT_AUTH_TOKEN do .env / wrangler secret>
//
// TODO: restringir CORS por origem (atualmente * pra facilitar dev).

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 dias
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-WebCraft-Auth',
  'Access-Control-Max-Age': '86400'
};

// Comparação em tempo constante pra não vazar info via timing
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function requireAuth(request, env) {
  const token = request.headers.get('X-WebCraft-Auth') || '';
  if (!env.WEBCRAFT_AUTH_TOKEN) {
    return json({ error: 'server_misconfigured', message: 'WEBCRAFT_AUTH_TOKEN não definido' }, 500);
  }
  if (!safeEqual(token, env.WEBCRAFT_AUTH_TOKEN)) {
    return json({ error: 'unauthorized', message: 'X-WebCraft-Auth ausente ou inválido' }, 401);
  }
  return null; // OK
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Endpoint público (necessário pro health-check externo funcionar sem expor o token)
      if (path === '/health') return json({ ok: true, ts: Date.now() });

      // Tudo o resto exige auth
      const authErr = requireAuth(request, env);
      if (authErr) return authErr;

      if (path === '/places/search')   return await placesSearch(url, env);
      if (path === '/places/details')  return await placesDetails(url, env);
      if (path === '/unsplash/search') return await unsplashSearch(url, env);

      return json({ error: 'not_found', path }, 404);
    } catch (e) {
      return json({ error: 'internal', message: e.message }, 500);
    }
  }
};

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

function cacheKey(prefix, params) {
  const normalized = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${String(v).toLowerCase().trim()}`)
    .join('&');
  return `${prefix}:${normalized}`;
}

async function cachedFetch(kv, key, fetchFn) {
  const cached = await kv.get(key, 'json');
  if (cached) {
    return { ...cached, _source: 'cache', _cache_key: key };
  }
  const fresh = await fetchFn();
  if (fresh._ok !== false) {
    await kv.put(key, JSON.stringify(fresh), { expirationTtl: CACHE_TTL_SECONDS });
  }
  return { ...fresh, _source: 'origin', _cache_key: key };
}

// ──────────────────────────────────────────────────────────────────────────
// Google Places — Text Search
// ──────────────────────────────────────────────────────────────────────────

async function placesSearch(url, env) {
  const q    = url.searchParams.get('q');
  const city = url.searchParams.get('city') || '';
  const lang = url.searchParams.get('lang') || 'pt-BR';
  if (!q) return json({ error: 'missing_param', param: 'q' }, 400);

  const key = cacheKey('places:search', { q, city, lang });
  const data = await cachedFetch(env.PLACES_CACHE, key, async () => {
    const textQuery = city ? `${q} ${city}` : q;
    const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount'
      },
      body: JSON.stringify({
        textQuery,
        languageCode: lang,
        regionCode: 'BR',
        maxResultCount: 1
      })
    });
    const body = await r.json();
    if (!r.ok) return { _ok: false, status: r.status, error: body };
    return { _ok: true, places: body.places || [] };
  });

  return json(data);
}

// ──────────────────────────────────────────────────────────────────────────
// Google Places — Place Details
// ──────────────────────────────────────────────────────────────────────────

async function placesDetails(url, env) {
  const id   = url.searchParams.get('id');
  const lang = url.searchParams.get('lang') || 'pt-BR';
  if (!id) return json({ error: 'missing_param', param: 'id' }, 400);

  const key = cacheKey('places:details', { id, lang });
  const data = await cachedFetch(env.PLACES_CACHE, key, async () => {
    const fields = [
      'id', 'displayName', 'formattedAddress',
      'internationalPhoneNumber', 'nationalPhoneNumber',
      'websiteUri', 'googleMapsUri', 'location',
      'regularOpeningHours', 'rating', 'userRatingCount',
      'reviews', 'photos'
    ].join(',');

    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=${encodeURIComponent(lang)}`, {
      headers: {
        'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fields
      }
    });
    const body = await r.json();
    if (!r.ok) return { _ok: false, status: r.status, error: body };
    return { _ok: true, place: body };
  });

  return json(data);
}

// ──────────────────────────────────────────────────────────────────────────
// Unsplash — Search Photos
// ──────────────────────────────────────────────────────────────────────────

async function unsplashSearch(url, env) {
  const q           = url.searchParams.get('q');
  const orientation = url.searchParams.get('orientation') || 'landscape';
  const color       = url.searchParams.get('color') || '';
  const perPage     = url.searchParams.get('per_page') || '5';
  if (!q) return json({ error: 'missing_param', param: 'q' }, 400);

  const key = cacheKey('unsplash:search', { q, orientation, color, per_page: perPage });
  const data = await cachedFetch(env.UNSPLASH_CACHE, key, async () => {
    const qs = new URLSearchParams({
      query: q,
      orientation,
      per_page: perPage,
      content_filter: 'high',
      ...(color ? { color } : {})
    });
    const r = await fetch(`https://api.unsplash.com/search/photos?${qs}`, {
      headers: {
        'Authorization': `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });
    const body = await r.json();
    if (!r.ok) return { _ok: false, status: r.status, error: body };
    // Reduzir payload: só campos úteis pro Content Agent
    const results = (body.results || []).map(p => ({
      id: p.id,
      alt: p.alt_description || p.description || '',
      urls: { raw: p.urls?.raw, regular: p.urls?.regular },
      user: { name: p.user?.name, username: p.user?.username, profile: p.user?.links?.html },
      download_location: p.links?.download_location,
      width: p.width,
      height: p.height
    }));
    return { _ok: true, total: body.total, results };
  });

  return json(data);
}
