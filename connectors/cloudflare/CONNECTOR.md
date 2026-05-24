# CONNECTOR.md — Cloudflare Developer Platform

**Status:** ✅ Conectado  
**Documentação oficial:** https://developers.cloudflare.com  
**MCP URL:** https://bindings.mcp.cloudflare.com/mcp

---

## O que o Cloudflare oferece ao ecossistema

O Cloudflare não é só deploy — é uma plataforma completa de infraestrutura global que o ecossistema WebCraft usa em múltiplas camadas:

| Produto | O que faz | Agente que usa |
|---|---|---|
| **Workers + Static Assets** | Deploy de sites estáticos e apps | WebCraft Agent |
| **Pages** | Deploy com CI/CD via GitHub | WebCraft Agent |
| **Workers KV** | Cache e configuração global | Memory Agent, Rate Limiter |
| **D1** | Banco SQL serverless | Memory Agent, Feedback Agent |
| **R2** | Armazenamento de assets sem egress | Content Agent |
| **Queues** | Processamento assíncrono entre agentes | Orchestrator |
| **Workers AI** | Inferência de modelos na edge | Todos os agentes |

---

## Plano gratuito — o que está disponível

Confirmado na documentação oficial:

| Produto | Limite gratuito |
|---|---|
| Workers | 100.000 requests/dia |
| Workers KV | 100.000 leituras/dia, 1.000 escritas/dia, 1GB storage |
| D1 | 5 milhões de rows lidos/dia, 100.000 escritas/dia, 5GB storage |
| R2 | 10GB storage, 1M operações Class A/mês, 10M Class B/mês |
| Pages | Builds ilimitados, 500 deploys/mês |
| Workers AI | 10.000 Neurons/dia |
| Build minutes | 3.000 minutos/mês |

**Para o ecossistema WebCraft, o plano gratuito é suficiente para dezenas de projetos por mês.**

---

## 1. WebCraft Agent — Deploy via Workers Static Assets

A forma recomendada atual (Workers Sites foi descontinuado):

### `wrangler.jsonc` gerado pelo WebCraft Agent:
```json
{
  "name": "cliente-nome-site",
  "compatibility_date": "2026-05-23",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist"
  }
}
```

### Comando de deploy:
```bash
# Instalar Wrangler
npm install -g wrangler

# Autenticar
wrangler login

# Deploy direto (sem config file — modo interativo)
wrangler deploy dist

# Deploy com config
wrangler deploy
```

### Deploy automático via CI/CD (GitHub Actions):
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

### Como o WebCraft Agent usa via MCP:
```javascript
// WebCraft Agent chama via Anthropic API com MCP Cloudflare
{
  mcp_servers: [{
    type: 'url',
    url: 'https://bindings.mcp.cloudflare.com/mcp',
    name: 'cloudflare'
  }]
}

// Tools disponíveis:
// - workers_list → listar workers existentes
// - workers_get_worker → ver detalhes de um worker
// - d1_database_create → criar banco D1
// - kv_namespace_create → criar namespace KV
// - r2_bucket_create → criar bucket R2
```

---

## 2. Memory Agent — D1 como banco de contexto

Substitui o Supabase para persistência de contexto do cliente quando se quer tudo no Cloudflare:

### Criar banco D1:
```bash
wrangler d1 create webcraft-memory
```

### Schema do Memory Agent:
```sql
-- Executar via: wrangler d1 execute webcraft-memory --file=schema.sql

CREATE TABLE IF NOT EXISTS clients (
  client_id TEXT PRIMARY KEY,
  nome TEXT,
  empresa TEXT,
  segmento TEXT,
  perfil_usuario TEXT,
  tom_preferido TEXT,
  stack_preferida TEXT,
  marca_json TEXT,        -- JSON com cores, fontes, brand guide
  preferencias_json TEXT, -- JSON com preferências de comunicação
  ultima_sessao TEXT,
  total_projetos INTEGER DEFAULT 0,
  criado_em TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  projeto_id TEXT PRIMARY KEY,
  client_id TEXT,
  nome TEXT,
  tipo TEXT,
  status TEXT DEFAULT 'em_andamento',
  pipeline_usado TEXT,
  feedback_json TEXT,
  qa_score INTEGER,
  iteracoes INTEGER DEFAULT 0,
  arquivos_json TEXT,
  criado_em TEXT DEFAULT (datetime('now')),
  entregue_em TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE IF NOT EXISTS feedback_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projeto_id TEXT,
  client_id TEXT,
  feedback_bruto TEXT,
  classificacao_json TEXT,
  resolucao TEXT DEFAULT 'pendente',
  criado_em TEXT DEFAULT (datetime('now'))
);
```

### Worker para API do Memory Agent:
```javascript
// memory-agent-worker/src/index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // GET /client/:id
    if (path.startsWith('/client/') && request.method === 'GET') {
      const clientId = path.split('/')[2];
      const result = await env.DB.prepare(
        'SELECT * FROM clients WHERE client_id = ?'
      ).bind(clientId).first();
      return Response.json(result || { error: 'not_found' });
    }

    // POST /client — criar ou atualizar
    if (path === '/client' && request.method === 'POST') {
      const data = await request.json();
      await env.DB.prepare(`
        INSERT INTO clients (client_id, nome, empresa, segmento, marca_json)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(client_id) DO UPDATE SET
          nome = excluded.nome,
          ultima_sessao = datetime('now')
      `).bind(
        data.client_id, data.nome, data.empresa,
        data.segmento, JSON.stringify(data.marca)
      ).run();
      return Response.json({ status: 'ok' });
    }

    return new Response('Not found', { status: 404 });
  }
};
```

---

## 3. Memory Agent — Workers KV para cache de sessão

KV é ideal para dados de sessão ativa (leitura rápida, TTL automático):

```javascript
// Salvar contexto de sessão com TTL de 24h
await env.SESSIONS.put(
  `session:${sessionId}`,
  JSON.stringify(sessionContext),
  { expirationTtl: 86400 } // 24 horas
);

// Recuperar
const session = await env.SESSIONS.get(`session:${sessionId}`, 'json');

// Salvar preferências de configuração do agente (sem TTL)
await env.CONFIG.put('ab-test:cta-hero', JSON.stringify({
  variant: 'B',
  started: new Date().toISOString()
}));
```

---

## 4. Content Agent — R2 para assets de mídia

R2 é S3-compatível, sem taxa de egresso — ideal para servir imagens dos sites:

```bash
# Criar bucket
wrangler r2 bucket create webcraft-assets

# Upload de asset
wrangler r2 object put webcraft-assets/clientes/saude-total/hero.webp \
  --file ./hero.webp \
  --content-type image/webp
```

```javascript
// Worker para servir assets com cache
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // remove leading /

    const object = await env.ASSETS.get(key);
    if (!object) return new Response('Not Found', { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(object.body, { headers });
  }
};
```

---

## 5. Orchestrator — Queues para pipeline assíncrono

Queues permitem que o Orchestrator dispare agentes em paralelo sem bloquear:

```javascript
// Orchestrator envia tarefas para a fila
await env.PIPELINE_QUEUE.send({
  pipeline_id: 'pipe_abc123',
  agent: 'copy-agent',
  task: 'gerar_textos',
  input: briefJSON,
  priority: 1
});

// Consumer (cada agente tem seu worker consumer)
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      const { agent, task, input } = message.body;
      // executar tarefa do agente
      await executarAgente(agent, task, input, env);
      message.ack();
    }
  }
};
```

---

## 6. Todos os agentes — Workers AI na edge

Inferência de modelos sem latência de roundtrip para APIs externas:

```javascript
// Usar modelo de embeddings para busca semântica no Memory Agent
const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: ['fisioterapia São Paulo', 'clínica de reabilitação']
});

// Classificar feedback com modelo leve
const classification = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [{
    role: 'user',
    content: `Classifique este feedback em: visual | conteudo | funcional | seo\n\nFeedback: "${feedbackTexto}"\n\nResponda apenas com a categoria.`
  }]
});
```

---

## Mapa de produtos por agente

```
WebCraft Agent
  └── Workers Static Assets → deploy do site gerado
  └── Pages → deploy com CI/CD via GitHub

Memory Agent
  └── D1 → contexto persistente do cliente (SQL)
  └── KV → sessão ativa com TTL (cache)

Content Agent
  └── R2 → assets de mídia sem egress fee

Orchestrator
  └── Queues → pipeline assíncrono entre agentes
  └── Workers → API gateway do ecossistema

Todos os agentes
  └── Workers AI → inferência na edge (grátis até 10k neurons/dia)
```

---

## Checklist de configuração

- [ ] Conta Cloudflare criada (grátis)
- [ ] Wrangler instalado: `npm install -g wrangler`
- [ ] Autenticado: `wrangler login`
- [ ] API Token gerado em dash.cloudflare.com → My Profile → API Tokens
- [ ] Token adicionado como `CLOUDFLARE_API_TOKEN` no GitHub Secrets
- [ ] D1 criado: `wrangler d1 create webcraft-memory`
- [ ] KV criado: `wrangler kv namespace create webcraft-sessions`
- [ ] R2 criado: `wrangler r2 bucket create webcraft-assets`
- [ ] MCP Cloudflare conectado no Claude

---

## Referências

- Deploy estático: https://developers.cloudflare.com/workers/static-assets/
- D1: https://developers.cloudflare.com/d1/
- KV: https://developers.cloudflare.com/kv/
- R2: https://developers.cloudflare.com/r2/
- Queues: https://developers.cloudflare.com/queues/
- Workers AI: https://developers.cloudflare.com/workers-ai/
- Pricing: https://developers.cloudflare.com/workers/platform/pricing/
