---
name: auth-patterns
description: Use este skill no Backend Agent para padrões compartilhados de autenticação. Complementa o skill auth específico com padrões agnósticos de framework.
---

# Skill: Auth Patterns — Padrões Compartilhados

## Regras universais de autenticação

1. **Nunca armazenar senha em plain text** — sempre hash (Supabase cuida disso)
2. **Tokens JWT com expiração curta** — 1 hora padrão, refresh token de 7 dias
3. **Rate limiting em login** — máximo 5 tentativas por 15 minutos por IP
4. **HTTPS obrigatório** — tokens nunca em conexão HTTP
5. **Logout invalida no servidor** — não apenas apaga o cookie local

## Armazenamento de token no frontend

| Opção | Prós | Contras |
|---|---|---|
| `httpOnly cookie` | Protegido de XSS | Vulnerável a CSRF (mitigar com SameSite) |
| `localStorage` | Simples de implementar | Acessível por JS — risco de XSS |
| Memória (variável) | Mais seguro | Perde ao fechar aba |

**Recomendação:** `httpOnly cookie` com `SameSite=Strict` para produção.

## Checklist de auth
- [ ] Rate limiting no endpoint de login
- [ ] Expiração de sessão configurada
- [ ] Logout invalida token no servidor
- [ ] HTTPS em produção
- [ ] Senhas com mínimo de 8 caracteres validados no cliente e servidor
