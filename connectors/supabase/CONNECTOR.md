# CONNECTOR.md — Supabase

**Status:** ✅ Conectado  
**MCP URL:** https://mcp.supabase.com/mcp  
**Documentação:** https://supabase.com/docs

---

## O que o Supabase faz no ecossistema

Banco de dados PostgreSQL serverless, autenticação de usuários, storage de arquivos e APIs REST/GraphQL automáticas. É a espinha dorsal de persistência do ecossistema WebCraft.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Memory Agent** | Persistir contexto, preferências e histórico de clientes entre sessões |
| **Backend Agent** | Banco de dados dos projetos dos clientes (produtos, pedidos, usuários) |
| **E-commerce Agent** | Tabelas de pedidos, estoque e webhooks de pagamento |
| **QA Agent** | Verificar integridade do schema antes do deploy |
| **Feedback Agent** | Registrar logs de feedback e padrões de revisão |

---

## 1. Memory Agent — Banco central do ecossistema

O Memory Agent usa o Supabase como memória persistente entre sessões.

### Schema (executar via setup-database.sql):
```sql
-- Tabela principal de clientes
CREATE TABLE clients (
  client_id         TEXT PRIMARY KEY,
  nome              TEXT NOT NULL,
  empresa           TEXT NOT NULL,
  segmento          TEXT,
  perfil_usuario    TEXT,
  marca_json        JSONB DEFAULT '{}',
  preferencias_json JSONB DEFAULT '{}',
  ultima_sessao     TIMESTAMPTZ,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

-- Projetos por cliente
CREATE TABLE projects (
  project_id    TEXT PRIMARY KEY,
  client_id     TEXT REFERENCES clients(client_id),
  nome          TEXT,
  status        TEXT DEFAULT 'pendente',
  pipeline      TEXT,
  qa_score_final INTEGER,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);
```

### Como o Memory Agent lê o contexto:
```javascript
// Recuperar cliente ao iniciar sessão
const { data: client } = await supabase
  .from('clients')
  .select('*, projects(*)')
  .eq('client_id', clientId)
  .single();

// Atualizar após sessão
await supabase
  .from('clients')
  .update({
    ultima_sessao: new Date().toISOString(),
    marca_json: clientData.brand,
    preferencias_json: clientData.preferences
  })
  .eq('client_id', clientId);
```

---

## 2. Backend Agent — Banco dos projetos dos clientes

Para cada projeto que usa backend, o Backend Agent cria um schema isolado ou usa a tabela pública com RLS.

### Padrão de isolamento por cliente (RLS):
```sql
-- Habilitar RLS em todas as tabelas do cliente
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas por cliente (via auth.uid() ou client_id no JWT)
CREATE POLICY "client_isolation" ON products
  USING (client_id = current_setting('app.client_id')::TEXT);
```

### Conexão via Backend Agent:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // service role — somente no backend
);
```

---

## 3. Supabase Auth — Autenticação de usuários

Usado pelo Backend Agent para sistemas com login:

```typescript
// Cadastro
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { nome } }
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// Verificar sessão no middleware
const { data: { user } } = await supabase.auth.getUser(token);
```

---

## 4. Supabase Storage — Upload de arquivos

Usado pelo CMS Agent para imagens e mídia dos clientes:

```javascript
// Upload de imagem do produto
const { data, error } = await supabase.storage
  .from('produtos')
  .upload(`${clientId}/${produtoId}.webp`, file, {
    contentType: 'image/webp',
    upsert: true
  });

// URL pública
const { data: { publicUrl } } = supabase.storage
  .from('produtos')
  .getPublicUrl(`${clientId}/${produtoId}.webp`);
```

---

## 5. Ferramentas MCP disponíveis

| Tool | O que faz |
|---|---|
| `list_projects` | Lista projetos Supabase da conta |
| `get_project` | Detalhes de um projeto |
| `execute_sql` | Executa SQL direto (DDL e DML) |
| `apply_migration` | Aplica migration versionada |
| `list_tables` | Lista tabelas de um schema |
| `list_migrations` | Histórico de migrations |
| `get_logs` | Logs por tipo de serviço |
| `generate_typescript_types` | Tipos TypeScript a partir do schema |
| `create_branch` | Branch de desenvolvimento isolado |

---

## 6. Configuração por ambiente

```bash
# Desenvolvimento — usar branch separada do Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=chave-publica-safe-no-frontend
SUPABASE_SERVICE_KEY=chave-privada-somente-backend

# Produção — mesmo projeto, branch main
# Configurar no painel do Vercel (Settings → Environment Variables)
```

⚠️ **`service_role` key nunca vai para o frontend.** Só no backend (Cloudflare Workers, Vercel Functions, Node.js server).

---

## 7. Branches de desenvolvimento (Supabase Branching)

Para não afetar dados de produção ao testar:

```bash
# Criar branch de desenvolvimento
supabase branches create dev-nova-feature

# Aplicar migration só na branch
supabase db push --branch dev-nova-feature

# Merge para produção após aprovação
supabase branches merge dev-nova-feature
```

---

## 8. Configuração inicial (uma vez por ecossistema)

```bash
# 1. Instalar CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Criar projeto (ou usar painel em supabase.com)
supabase projects create webcraft-db --region sa-east-1

# 4. Executar schema do ecossistema
supabase db push --file scripts/setup-database.sql
```

---

## Checklist de integração

- [ ] Projeto Supabase criado em sa-east-1 (São Paulo)
- [ ] `setup-database.sql` executado (tabelas clients, projects, feedback_logs, sessions)
- [ ] RLS habilitado em todas as tabelas com dados de usuário
- [ ] `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` nas variáveis de ambiente do Vercel
- [ ] `SUPABASE_ANON_KEY` configurada no frontend (segura — pode aparecer no código)
- [ ] Branch de desenvolvimento criada para testes
- [ ] Backup automático habilitado (painel → Settings → Backups)
