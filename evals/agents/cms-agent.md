# EVALS — CMS Agent
**Critérios:** 16 | **Mínimo:** 13 (80%)

---

## CMS-01 — Painel próprio com Supabase

**Input:**
```json
{
  "abordagem": "painel-proprio",
  "modulos": ["produtos", "pedidos", "conteudo", "usuarios"],
  "backend_schema": { "tables": ["products", "orders", "site_content"] }
}
```

**Critérios:**
- [ ] Output JSON válido com `url_admin`, `arquivos`, `instrucoes_cliente`
- [ ] Arquivos HTML do painel gerados (login.html, index.html, produtos.html)
- [ ] Login verifica role (`admin` ou `editor`) antes de permitir acesso
- [ ] CRUD de produtos com soft delete (não hard delete)
- [ ] Editor de conteúdo do site presente (tabela `site_content`)
- [ ] Instruções de uso em linguagem simples para o cliente não-técnico

---

## CMS-02 — Segurança do painel

**Critérios:**
- [ ] Todas as páginas do admin redirecionam para login se sem sessão
- [ ] `SUPABASE_ANON_KEY` usada no frontend (não a service key)
- [ ] Nenhuma rota de escrita acessível sem autenticação
- [ ] Rate limiting no login do painel mencionado
- [ ] Sessão expira após 8h de inatividade documentado
- [ ] Upload de arquivos com validação de tipo e tamanho

---

## CMS-03 — Usabilidade para cliente não-técnico

**Input:** PM sem conhecimento técnico precisando gerenciar produtos

**Critérios:**
- [ ] Interface responsiva (funciona no celular do cliente)
- [ ] Mensagens de erro em português e claras (não stack trace)
- [ ] Estados de loading em todas as ações (salvar, deletar, upload)
- [ ] Confirmação antes de deletar itens
- [ ] Instrução clara de como acessar o painel no `REVISAO.md`

---

## CMS-04 — Integração Sanity (quando solicitado)

**Input:** `"abordagem": "sanity"`

**Critérios:**
- [ ] `SANITY_PROJECT_ID` e `SANITY_DATASET` nas env_vars
- [ ] Query GROQ básica gerada para buscar conteúdo
- [ ] Preview mode documentado para rascunhos
- [ ] Webhook de revalidação configurado para redeploy automático
- [ ] `instrucoes_cliente` explica como acessar o Sanity Studio

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| CMS-01 | — | — | — |
| CMS-02 | — | — | — |
| CMS-03 | — | — | — |
| CMS-04 | — | — | — |
