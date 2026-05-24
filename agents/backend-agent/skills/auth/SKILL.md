---
name: auth
description: Use este skill no Backend Agent sempre que o projeto precisar de login, cadastro, área restrita ou qualquer forma de identificação de usuário. Cobre Supabase Auth, JWT, OAuth social e proteção de rotas.
---

# Skill: Auth — Autenticação e Autorização

---

## Stack padrão: Supabase Auth

Supabase Auth já está conectado ao ecossistema e oferece:
- E-mail + senha
- Magic link (login sem senha, por e-mail)
- OAuth: Google, Facebook, Apple, GitHub
- JWT automático com refresh token
- Row Level Security (RLS) — dados por usuário no banco

---

## 1. Configuração no Supabase

```sql
-- Habilitar confirmação de e-mail (recomendado)
-- Supabase Dashboard → Authentication → Settings
-- "Enable email confirmations" → ON

-- Criar tabela de perfis (complementa auth.users do Supabase)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: criar perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS: usuário só vê seu próprio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "admins_see_all" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 2. Endpoints de autenticação

### Cadastro:
```typescript
// POST /auth/register
app.post('/auth/register', async (c) => {
  const { email, password, nome } = await c.req.json();

  // Validar com Zod
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    nome: z.string().min(2).max(100)
  });
  const data = schema.parse({ email, password, nome });

  const { data: user, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { nome: data.nome }
    }
  });

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ user: user.user, message: 'Confirme seu e-mail para ativar a conta' }, 201);
});
```

### Login:
```typescript
// POST /auth/login
app.post('/auth/login', rateLimiter(5, '15m'), async (c) => {
  const { email, password } = await c.req.json();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return c.json({ error: 'E-mail ou senha inválidos' }, 401);

  return c.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
    expires_at: data.session.expires_at
  });
});
```

### Refresh token:
```typescript
// POST /auth/refresh
app.post('/auth/refresh', async (c) => {
  const { refresh_token } = await c.req.json();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) return c.json({ error: 'Token inválido' }, 401);
  return c.json({ access_token: data.session.access_token });
});
```

### Logout:
```typescript
// POST /auth/logout
app.post('/auth/logout', authMiddleware, async (c) => {
  await supabase.auth.signOut();
  return c.json({ message: 'Logout realizado' });
});
```

---

## 3. Middleware de autenticação

```typescript
// middleware/auth.ts
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return c.json({ error: 'Token inválido ou expirado' }, 401);

  c.set('user', user);
  await next();
};

// Middleware de role (ex: apenas admins)
export const requireRole = (role: string) => async (c: Context, next: Next) => {
  const user = c.get('user');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== role) return c.json({ error: 'Acesso negado' }, 403);
  await next();
};
```

---

## 4. OAuth social (Google, Facebook)

```typescript
// GET /auth/google — redireciona para o Google
app.get('/auth/google', async (c) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${c.env.FRONTEND_URL}/auth/callback`
    }
  });
  if (error) return c.json({ error: error.message }, 400);
  return c.redirect(data.url);
});

// GET /auth/callback — processa o retorno do OAuth
app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return c.redirect(`${c.env.FRONTEND_URL}/login?error=oauth_failed`);
  return c.redirect(`${c.env.FRONTEND_URL}/dashboard?token=${data.session.access_token}`);
});
```

---

## 5. Frontend — integração com a área restrita

```javascript
// Verificar se usuário está logado
async function checkAuth() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const response = await fetch('/api/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    return null;
  }

  return response.json();
}

// Proteger página
document.addEventListener('DOMContentLoaded', async () => {
  const user = await checkAuth();
  if (user) {
    document.getElementById('user-name').textContent = user.nome;
    document.getElementById('protected-content').style.display = 'block';
  }
});
```

---

## 6. Checklist de auth

- [ ] Supabase Auth habilitado no projeto
- [ ] Tabela `profiles` criada com trigger automático
- [ ] RLS habilitado em todas as tabelas com dados de usuário
- [ ] Rate limiting no endpoint de login (máx 5 tentativas / 15 min)
- [ ] Refresh token implementado (tokens expiram em 1h por padrão)
- [ ] Senhas nunca armazenadas em plain text (Supabase cuida disso)
- [ ] HTTPS obrigatório em produção (tokens nunca em HTTP)
- [ ] Tokens armazenados em `httpOnly cookie` ou `localStorage` (tradeoffs documentados)
- [ ] Logout invalida o token no servidor
- [ ] Middleware de auth testado em todas as rotas protegidas
