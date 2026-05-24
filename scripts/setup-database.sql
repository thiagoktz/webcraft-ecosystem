-- WebCraft — Schema do banco de dados
-- Executar no Supabase SQL Editor ou via: supabase db push

-- ─── Clientes ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  client_id         TEXT PRIMARY KEY,
  nome              TEXT NOT NULL,
  empresa           TEXT NOT NULL,
  segmento          TEXT,
  email_contato     TEXT,
  cidade            TEXT,
  site_atual        TEXT,
  perfil_usuario    TEXT CHECK (perfil_usuario IN ('dev', 'pm', 'designer')),
  nivel_tecnico     TEXT CHECK (nivel_tecnico IN ('alto', 'medio', 'baixo')),
  ritmo_preferido   TEXT CHECK (ritmo_preferido IN ('rapido', 'detalhado')),
  autonomia_agente  TEXT DEFAULT 'alto',
  stack_preferida   TEXT DEFAULT 'HTML/CSS/JS',
  deploy_preferido  TEXT DEFAULT 'vercel',
  dominio           TEXT,
  marca_json        JSONB DEFAULT '{}',
  preferencias_json JSONB DEFAULT '{}',
  memory_hints_json JSONB DEFAULT '{}',
  ultima_sessao     TIMESTAMPTZ,
  total_projetos    INTEGER DEFAULT 0,
  total_iteracoes   INTEGER DEFAULT 0,
  score_medio_qa    NUMERIC(5,2),
  satisfacao_media  NUMERIC(3,1),
  ecosystem_version TEXT DEFAULT '2.0.0',
  criado_em         TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Projetos ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  project_id        TEXT PRIMARY KEY,
  client_id         TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  nome              TEXT NOT NULL,
  tipo              TEXT,
  descricao         TEXT,
  pipeline          TEXT,
  status            TEXT DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'em_andamento', 'entregue', 'aprovado', 'pausado', 'cancelado')),
  agentes_usados    TEXT[],
  iteracoes         INTEGER DEFAULT 0,
  max_iteracoes     INTEGER DEFAULT 5,
  brief_json        JSONB DEFAULT '{}',
  outputs_json      JSONB DEFAULT '{}',
  seo_json          JSONB DEFAULT '{}',
  qa_score_final    INTEGER,
  qa_score_historico INTEGER[],
  lighthouse_score  INTEGER,
  deploy_url        TEXT,
  aprovado_em       TIMESTAMPTZ,
  iniciado_em       TIMESTAMPTZ DEFAULT NOW(),
  entregue_em       TIMESTAMPTZ,
  criado_em         TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Logs de Feedback ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feedback_logs (
  id                BIGSERIAL PRIMARY KEY,
  project_id        TEXT REFERENCES projects(project_id) ON DELETE CASCADE,
  client_id         TEXT REFERENCES clients(client_id) ON DELETE CASCADE,
  feedback_bruto    TEXT NOT NULL,
  classificacao_json JSONB DEFAULT '{}',
  categoria         TEXT,
  severidade        TEXT CHECK (severidade IN ('bloqueante', 'importante', 'sugestao')),
  agente_responsavel TEXT,
  resolucao         TEXT DEFAULT 'pendente'
                    CHECK (resolucao IN ('pendente', 'resolvido', 'descartado')),
  iteracao_numero   INTEGER,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Sessões ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  session_id        TEXT PRIMARY KEY,
  client_id         TEXT REFERENCES clients(client_id) ON DELETE CASCADE,
  project_id        TEXT REFERENCES projects(project_id) ON DELETE SET NULL,
  pipeline          TEXT,
  agentes_log       JSONB DEFAULT '[]',
  status            TEXT DEFAULT 'ativa'
                    CHECK (status IN ('ativa', 'concluida', 'erro')),
  total_tokens      INTEGER DEFAULT 0,
  custo_estimado    NUMERIC(10,4),
  iniciado_em       TIMESTAMPTZ DEFAULT NOW(),
  finalizado_em     TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- ─── Índices ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_feedback_project_id ON feedback_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_client_id ON feedback_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ─── Triggers de atualização automática ──────────────────────────────────────

CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_clients_updated
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER trigger_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- ─── Views úteis ─────────────────────────────────────────────────────────────

-- Dashboard: resumo por cliente
CREATE OR REPLACE VIEW client_dashboard AS
SELECT
  c.client_id,
  c.empresa,
  c.segmento,
  c.perfil_usuario,
  COUNT(p.project_id) AS total_projetos,
  COUNT(CASE WHEN p.status = 'aprovado' THEN 1 END) AS projetos_aprovados,
  AVG(p.qa_score_final) AS qa_score_medio,
  MAX(p.entregue_em) AS ultimo_projeto,
  c.satisfacao_media
FROM clients c
LEFT JOIN projects p ON p.client_id = c.client_id
GROUP BY c.client_id, c.empresa, c.segmento, c.perfil_usuario, c.satisfacao_media;

-- Dashboard: saúde dos pipelines
CREATE OR REPLACE VIEW pipeline_health AS
SELECT
  pipeline,
  COUNT(*) AS total_execucoes,
  AVG(iteracoes) AS media_iteracoes,
  AVG(qa_score_final) AS qa_score_medio,
  COUNT(CASE WHEN status = 'aprovado' THEN 1 END)::FLOAT / COUNT(*) AS taxa_aprovacao
FROM projects
WHERE pipeline IS NOT NULL
GROUP BY pipeline;
