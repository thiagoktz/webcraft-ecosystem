# EVALS — Backend Agent
**Critérios:** 18 | **Mínimo:** 15 (80%)

---

## BACKEND-01 — Schema de banco correto por tipo de projeto

**Input:**
```json
{
  "projeto": "E-commerce de cosméticos naturais",
  "features": ["auth", "produtos", "pedidos", "pagamento"],
  "stack": "cloudflare-workers"
}
```

**Critérios:**
- [ ] Output é JSON válido e parseável
- [ ] `database.migrations` contém SQL com tabelas `products`, `orders`, `order_items`
- [ ] Todas as tabelas têm UUID como PK (não INT auto-increment)
- [ ] `criado_em` e `atualizado_em` presentes em todas as tabelas
- [ ] RLS habilitado em tabelas com dados de usuário
- [ ] Índices definidos nas colunas de busca frequente

---

## BACKEND-02 — Autenticação completa

**Input:**
```json
{
  "projeto": "Plataforma de cursos online",
  "features": ["auth"],
  "stack": "cloudflare-workers",
  "auth_providers": ["email", "google"]
}
```

**Critérios:**
- [ ] Endpoints `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` presentes
- [ ] Middleware de autenticação JWT documentado
- [ ] Rate limiting no login (máx 5 tentativas / 15 min) mencionado
- [ ] OAuth do Google configurado com `redirectTo` correto
- [ ] Tabela `profiles` com trigger automático de criação
- [ ] `env_vars` lista `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`

---

## BACKEND-03 — Segurança e boas práticas

**Critérios (verificar no código gerado):**
- [ ] Nenhum `eval()` presente
- [ ] Inputs validados com Zod antes de qualquer operação no banco
- [ ] `SUPABASE_SERVICE_KEY` nunca aparece em código client-side
- [ ] Endpoints públicos com rate limiting declarado
- [ ] Sem SQL concatenado com string (usar prepared statements)
- [ ] `deploy_commands` lista o comando exato de deploy

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| BACKEND-01 | — | — | — |
| BACKEND-02 | — | — | — |
| BACKEND-03 | — | — | — |
