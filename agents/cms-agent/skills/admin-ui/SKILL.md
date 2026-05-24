---
name: admin-ui
description: Use este skill no CMS Agent para gerar a interface do painel administrativo. Cobre layout, autenticação, CRUD de conteúdo e upload de arquivos usando Supabase como backend.
---

# Skill: Admin UI — Painel Administrativo

---

## Estrutura do painel próprio

```
/admin
  ├── login.html           ← autenticação
  ├── index.html           ← dashboard (visão geral)
  ├── produtos.html        ← listagem e edição de produtos
  ├── pedidos.html         ← gestão de pedidos
  ├── conteudo.html        ← edição de textos do site
  ├── midia.html           ← upload de imagens
  └── configuracoes.html   ← dados da loja, métodos de pagamento
```

---

## 1. Login do painel

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Login</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5;
           display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: white; padding: 2rem; border-radius: 12px;
            width: 100%; max-width: 380px; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    h1 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #1a1a1a; }
    label { display: block; font-size: .85rem; color: #555; margin-bottom: .35rem; }
    input { width: 100%; padding: .65rem .85rem; border: 1px solid #ddd;
            border-radius: 8px; font-size: .95rem; margin-bottom: 1rem; }
    input:focus { outline: none; border-color: #2563eb; }
    button { width: 100%; padding: .75rem; background: #2563eb; color: white;
             border: none; border-radius: 8px; font-size: .95rem; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .error { color: #dc2626; font-size: .85rem; margin-top: .5rem; }
  </style>
</head>
<body>
<div class="card">
  <h1>Painel Administrativo</h1>
  <label for="email">E-mail</label>
  <input type="email" id="email" autocomplete="email">
  <label for="senha">Senha</label>
  <input type="password" id="senha" autocomplete="current-password">
  <button onclick="fazerLogin()">Entrar</button>
  <div class="error" id="erro"></div>
</div>

<script>
  const supabase = window.supabase.createClient(
    'SUPABASE_URL',        // substituir
    'SUPABASE_ANON_KEY'    // substituir — chave pública
  );

  async function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      document.getElementById('erro').textContent = 'E-mail ou senha incorretos.';
      return;
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!['admin', 'editor'].includes(profile?.role)) {
      await supabase.auth.signOut();
      document.getElementById('erro').textContent = 'Acesso não autorizado.';
      return;
    }

    window.location.href = '/admin/index.html';
  }

  // Redirecionar se já estiver logado
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) window.location.href = '/admin/index.html';
  });
</script>
</body>
</html>
```

---

## 2. Layout base do painel

```html
<!-- admin-layout.html — incluir em todas as páginas do admin -->
<nav class="sidebar">
  <div class="sidebar-logo">Admin</div>
  <a href="/admin/index.html" class="nav-item">📊 Dashboard</a>
  <a href="/admin/produtos.html" class="nav-item">📦 Produtos</a>
  <a href="/admin/pedidos.html" class="nav-item">🛒 Pedidos</a>
  <a href="/admin/conteudo.html" class="nav-item">✏️ Conteúdo</a>
  <a href="/admin/midia.html" class="nav-item">🖼 Mídia</a>
  <a href="/admin/configuracoes.html" class="nav-item">⚙️ Configurações</a>
  <button onclick="logout()" class="nav-item nav-logout">↩ Sair</button>
</nav>

<style>
  body { display: flex; font-family: system-ui, sans-serif; min-height: 100vh; }
  .sidebar { width: 220px; background: #1e293b; padding: 1.5rem 0; flex-shrink: 0; }
  .sidebar-logo { color: white; font-weight: 700; font-size: 1.1rem; padding: 0 1.5rem 1.5rem; }
  .nav-item { display: block; color: #94a3b8; padding: .65rem 1.5rem;
              text-decoration: none; font-size: .9rem; transition: all .15s; }
  .nav-item:hover { color: white; background: rgba(255,255,255,.05); }
  .nav-item.active { color: white; background: #2563eb; }
  .nav-logout { border: none; background: none; cursor: pointer; width: 100%; text-align: left; }
  .main-content { flex: 1; padding: 2rem; background: #f8fafc; }
  .page-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1e293b; }
</style>

<script>
  // Proteger todas as páginas do admin
  const { supabase } = window;
  supabase.auth.getSession().then(({ data }) => {
    if (!data.session) window.location.href = '/admin/login.html';
  });

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login.html';
  }
</script>
```

---

## 3. CRUD de produtos

```javascript
// Listar produtos
async function listarProdutos(pagina = 1, porPagina = 20) {
  const inicio = (pagina - 1) * porPagina;
  const { data, count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })
    .range(inicio, inicio + porPagina - 1);

  return { produtos: data, total: count };
}

// Criar produto
async function criarProduto(produto) {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      ativo: true
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Atualizar produto
async function atualizarProduto(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Soft delete
async function removerProduto(id) {
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), ativo: false })
    .eq('id', id);

  if (error) throw error;
}
```

---

## 4. Gestão de pedidos

```javascript
// Listar pedidos com filtros
async function listarPedidos({ status, pagina = 1 } = {}) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (produto_id, nome, quantidade, preco),
      profiles (nome, email)
    `)
    .order('criado_em', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  return data;
}

// Atualizar status do pedido
async function atualizarStatusPedido(id, status) {
  const statusValidos = ['pending','paid','processing','shipped','delivered','cancelled'];
  if (!statusValidos.includes(status)) throw new Error('Status inválido');

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Notificar cliente se necessário
  if (['shipped', 'delivered', 'cancelled'].includes(status)) {
    await notificarCliente(data);
  }

  return data;
}
```

---

## 5. Editor de conteúdo do site

```javascript
// Salvar textos editáveis do site na tabela site_content
// Criar a tabela:
/*
CREATE TABLE site_content (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  tipo  TEXT DEFAULT 'text' CHECK (tipo IN ('text','html','json')),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_content VALUES
  ('hero_titulo', 'Título do hero', 'text'),
  ('hero_subtitulo', 'Subtítulo', 'text'),
  ('sobre_texto', 'Texto sobre a empresa', 'html');
*/

async function obterConteudo(key) {
  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single();
  return data?.value;
}

async function salvarConteudo(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, atualizado_em: new Date().toISOString() });
  if (error) throw error;
}
```

---

## 6. Checklist do painel

- [ ] Login com verificação de role (admin/editor)
- [ ] Todas as páginas protegidas — redirect para login se sem sessão
- [ ] CRUD de produtos com soft delete
- [ ] Gestão de pedidos com atualização de status
- [ ] Editor de conteúdo do site (textos editáveis)
- [ ] Upload de imagens com validação de tipo e tamanho
- [ ] Logs de ações administrativas
- [ ] Sessão expira após 8h de inatividade
- [ ] Interface responsiva (funciona no celular do cliente)
- [ ] Instruções de uso enviadas ao cliente
