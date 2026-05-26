# Scripts — Onboarding e Gestão de Clientes

---

## Estrutura

```
scripts/
  ├── import-client.mjs       ← Importar cliente de ecossistema externo
  └── setup-database.sql      ← Schema do banco de dados (Supabase)
```

> **Nota:** `new-client.mjs` foi movido para o repo irmão `webcraft-clients/`
> (fonte de verdade dos clientes). Ele resolve paths via `import.meta.url`,
> então funciona de qualquer CWD desde que os dois repos estejam lado a lado.

---

## 1. Criar novo cliente

O script de onboarding vive no repo irmão `webcraft-clients/`:

```bash
# A partir de webcraft-ecosystem/
node ../webcraft-clients/new-client.mjs

# Ou a partir da raiz do monorepo (ex: Webcraft/)
node webcraft-clients/new-client.mjs
```

Fluxo interativo que coleta:
- Identidade (nome, empresa, segmento, cidade)
- Perfil (dev/PM/designer, ritmo, autonomia)
- Marca (descrição, público, tom, cor primária)
- Técnico (stack, deploy, domínio)

Gera automaticamente (em `webcraft-clients/clients/{client_id}/`):
- `client.json`
- `ACTIVATE.md`
- `REVISAO.md`
- `projects/`
- Registro no Supabase (se `SUPABASE_URL` configurado)

---

## 2. Importar cliente de ecossistema externo

### De outro repo WebCraft (GitHub):
```bash
node scripts/import-client.mjs \
  --source=github \
  --url=https://github.com/outra-empresa/webcraft-clients \
  --id=cliente-xyz-ab12
```

### De ecossistema com ecosystem.json público:
```bash
node scripts/import-client.mjs \
  --source=ecosystem \
  --url=https://raw.githubusercontent.com/outra-empresa/webcraft/main \
  --id=cliente-xyz-ab12
```

### De Supabase externo:
```bash
EXTERNAL_SUPABASE_URL=https://xxx.supabase.co \
EXTERNAL_SUPABASE_KEY=seu-key \
node scripts/import-client.mjs \
  --source=supabase \
  --id=cliente-xyz-ab12
```

### De arquivo JSON exportado:
```bash
node scripts/import-client.mjs \
  --source=json \
  --file=./exports/cliente-exportado.json
```

---

## 3. Setup do banco de dados

### Supabase:
```bash
# Via CLI Supabase
supabase db push --file scripts/setup-database.sql

# Ou via Supabase Dashboard → SQL Editor → colar o conteúdo do arquivo
```

### Cloudflare D1 (alternativa):
```bash
wrangler d1 execute webcraft-memory --file=scripts/setup-database.sql
```

---

## Variáveis de ambiente necessárias

```bash
# .env (nunca commitar!)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=seu-service-key
ANTHROPIC_API_KEY=sua-api-key

# Para importação de ecossistema externo:
EXTERNAL_SUPABASE_URL=https://yyy.supabase.co
EXTERNAL_SUPABASE_KEY=key-externo
```

---

## Estrutura de clientes gerada

```
clients/
  ├── client-template.json     ← template base (não editar)
  ├── project-template.json    ← template de projeto (não editar)
  │
  ├── {client_id_1}/
  │     ├── client.json        ← contexto e preferências
  │     ├── ACTIVATE.md        ← instruções de ativação
  │     └── projects/          ← outputs dos projetos
  │           └── {project_id}/
  │
  └── {client_id_2}/
        └── ...
```

---

## Fluxo completo de novo cliente

```
1. node ../webcraft-clients/new-client.mjs
        ↓
2. Abre webcraft-clients/clients/{id}/ACTIVATE.md
        ↓
3. Copia bloco de ativação
        ↓
4. Cola em nova conversa com Claude
        ↓
5. Descreve o projeto
        ↓
6. Ecossistema executa com contexto do cliente
        ↓
7. Ao final da sessão, Memory Agent atualiza client.json
```
