# CONNECTOR.md — Vercel

**Status:** ✅ Conectado  
**MCP URL:** https://mcp.vercel.com  
**Documentação:** https://vercel.com/docs

---

## O que o Vercel faz no ecossistema

Deploy automático de sites e APIs gerados pelo WebCraft Agent e Backend Agent, com CDN global, HTTPS automático e CI/CD integrado ao GitHub.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **WebCraft Agent** | Deploy do site gerado (HTML/CSS/JS ou Next.js) |
| **Backend Agent** | Deploy de APIs em Serverless Functions |
| **Orchestrator** | Verificar status de deploys e obter URLs de produção |

---

## 1. WebCraft Agent — Deploy de site estático

### Via MCP (automático no ecossistema):
```
O WebCraft Agent usa o conector Vercel para fazer deploy
após a aprovação do QA Agent — sem comando manual.
```

### Via CLI (manual):
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via wrangler.jsonc (HTML/CSS/JS puro):
```json
{
  "name": "nome-do-projeto",
  "compatibility_date": "2026-05-23",
  "assets": { "directory": "./dist" }
}
```

### Via vercel.json (Next.js — detectado automaticamente):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

## 2. GitHub → Vercel CI/CD automático

Conectar o repo do cliente ao Vercel para redeploy automático a cada push:

```
1. vercel.com → Add New Project → Import Git Repository
2. Selecionar: webcraft-clients (repo privado)
3. Root Directory: clients/{client_id}/projects/site-v1
4. Framework Preset: Other (HTML puro) ou Next.js
5. → Deploy
```

A partir daí, qualquer `git push` na branch `main` dispara redeploy em ~30s.

---

## 3. Backend Agent — Serverless Functions

```javascript
// api/contato.js — função serverless no Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nome, email, mensagem } = req.body;

  // Validar e processar
  await salvarNoSupabase({ nome, email, mensagem });
  await enviarEmailConfirmacao(email);

  res.status(200).json({ ok: true });
}
```

Deploy automático — qualquer arquivo em `/api/` vira um endpoint.

---

## 4. Configuração de domínio customizado

```
vercel.com → Projeto → Settings → Domains → Add Domain
  → saudetotal.com.br
  → Vercel mostra os registros DNS

Cliente configura no registrador (registro.br, GoDaddy):
  Tipo A    → @ → 76.76.21.21
  Tipo CNAME → www → cname.vercel-dns.com

Propagação: 15 min a 48 horas
HTTPS: automático após propagação
```

---

## 5. Variáveis de ambiente por projeto

```bash
# Adicionar via CLI
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production

# Adicionar via dashboard
vercel.com → Projeto → Settings → Environment Variables
```

⚠️ **Nunca commitar variáveis de ambiente no código.**

---

## 6. Headers de segurança (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 7. Ferramentas MCP disponíveis

| Tool | O que faz |
|---|---|
| `list_deployments` | Lista deploys de um projeto |
| `get_deployment` | Detalhes e status de um deploy |
| `get_deployment_build_logs` | Logs de build para debug |
| `get_runtime_logs` | Logs de runtime (erros em produção) |
| `list_projects` | Lista todos os projetos do workspace |
| `deploy_to_vercel` | Faz deploy do projeto atual |

---

## Checklist de deploy

- [ ] `vercel.json` ou `wrangler.jsonc` configurado
- [ ] Variáveis de ambiente adicionadas no dashboard (não no código)
- [ ] Domínio customizado configurado (se houver)
- [ ] Headers de segurança no `vercel.json`
- [ ] Branch `main` conectada ao Vercel para CI/CD automático
- [ ] URL de produção registrada no `REVISAO.md` do cliente
