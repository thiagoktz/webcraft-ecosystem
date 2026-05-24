---
name: database-schema
description: Use este skill no Backend Agent ao projetar o banco de dados de qualquer projeto. Define padrões de nomenclatura, tipos de dados, relacionamentos, índices e migrações para Supabase (PostgreSQL).
---

# Skill: Database Schema — Design de Banco de Dados

---

## Padrões obrigatórios

```sql
-- Nomenclatura: snake_case, plural para tabelas
-- IDs: UUID por padrão (nunca INT auto-increment em produção)
-- Timestamps: sempre criado_em e atualizado_em
-- Soft delete: deleted_at ao invés de DELETE físico
-- RLS: habilitar em toda tabela com dados de usuário
```

---

## 1. Schemas por tipo de projeto

### E-commerce completo:
```sql
-- Produtos
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          TEXT NOT NULL,
  descricao     TEXT,
  preco         NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  preco_original NUMERIC(10,2),
  estoque       INTEGER NOT NULL DEFAULT 0,
  sku           TEXT UNIQUE,
  categoria_id  UUID REFERENCES categories(id),
  imagens       JSONB DEFAULT '[]',
  atributos     JSONB DEFAULT '{}',
  ativo         BOOLEAN DEFAULT true,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

-- Categorias
CREATE TABLE categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      TEXT NOT NULL,
  slug      TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  ordem     INTEGER DEFAULT 0
);

-- Pedidos
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id),
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  subtotal        NUMERIC(10,2) NOT NULL,
  desconto        NUMERIC(10,2) DEFAULT 0,
  frete           NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  gateway         TEXT CHECK (gateway IN ('stripe','mercadopago','pagseguro')),
  gateway_id      TEXT,
  gateway_status  TEXT,
  endereco_json   JSONB,
  metadata        JSONB DEFAULT '{}',
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  nome        TEXT NOT NULL,
  preco       NUMERIC(10,2) NOT NULL,
  quantidade  INTEGER NOT NULL CHECK (quantidade > 0),
  atributos   JSONB DEFAULT '{}'
);

-- Endereços
CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  apelido     TEXT,
  cep         TEXT NOT NULL,
  logradouro  TEXT NOT NULL,
  numero      TEXT NOT NULL,
  complemento TEXT,
  bairro      TEXT NOT NULL,
  cidade      TEXT NOT NULL,
  estado      CHAR(2) NOT NULL,
  principal   BOOLEAN DEFAULT false
);

-- Cupons de desconto
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          TEXT UNIQUE NOT NULL,
  tipo            TEXT CHECK (tipo IN ('percentual','fixo','frete_gratis')),
  valor           NUMERIC(10,2),
  minimo_pedido   NUMERIC(10,2) DEFAULT 0,
  uso_maximo      INTEGER,
  uso_atual       INTEGER DEFAULT 0,
  valido_ate      TIMESTAMPTZ,
  ativo           BOOLEAN DEFAULT true
);
```

### Site com área de membros:
```sql
CREATE TABLE memberships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plano       TEXT CHECK (plano IN ('free','basic','pro','enterprise')),
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','expired')),
  gateway_id  TEXT,
  inicio_em   TIMESTAMPTZ DEFAULT NOW(),
  expira_em   TIMESTAMPTZ,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_access (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conteudo_id UUID NOT NULL,
  plano_minimo TEXT NOT NULL,
  descricao   TEXT
);
```

### Blog / CMS:
```sql
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id    UUID REFERENCES auth.users(id),
  titulo      TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  conteudo    TEXT,
  resumo      TEXT,
  capa_url    TEXT,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  publicado_em TIMESTAMPTZ,
  tags        TEXT[] DEFAULT '{}',
  metadata    JSONB DEFAULT '{}',
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Índices obrigatórios

```sql
-- Produtos
CREATE INDEX idx_products_categoria ON products(categoria_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_ativo ON products(ativo) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_preco ON products(preco);

-- Pedidos
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_gateway_id ON orders(gateway_id);
CREATE INDEX idx_orders_criado_em ON orders(criado_em DESC);

-- Posts
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_publicado_em ON posts(publicado_em DESC) WHERE status = 'published';
```

---

## 3. Triggers padrão

```sql
-- Auto-update de atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas com atualizado_em:
CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products FOR EACH ROW
  EXECUTE FUNCTION update_atualizado_em();

-- Reduzir estoque ao confirmar pedido
CREATE OR REPLACE FUNCTION reduce_stock_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status = 'pending' THEN
    UPDATE products p
    SET estoque = estoque - oi.quantidade
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND p.id = oi.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_paid
  AFTER UPDATE ON orders FOR EACH ROW
  EXECUTE FUNCTION reduce_stock_on_payment();
```

---

## 4. RLS por contexto

```sql
-- E-commerce: usuário vê só seus pedidos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_all_orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Produtos: todos podem ler, só admin escreve
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (ativo = true AND deleted_at IS NULL);
CREATE POLICY "admin_write_products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 5. Checklist de schema

- [ ] Todas as tabelas com UUID como PK
- [ ] `criado_em` e `atualizado_em` em toda tabela
- [ ] `deleted_at` em tabelas com soft delete
- [ ] RLS habilitado em tabelas com dados de usuário
- [ ] Índices nas colunas de busca e foreign keys
- [ ] Triggers de `atualizado_em` aplicados
- [ ] Triggers de negócio documentados (ex: reduzir estoque)
- [ ] Constraints de CHECK nos campos de status e enum
- [ ] Migrations versionadas (não alterar schema direto em produção)
