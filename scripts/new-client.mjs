#!/usr/bin/env node
/**
 * WebCraft — Script de Onboarding de Novo Cliente
 * Uso: node scripts/new-client.mjs
 *
 * O que faz:
 *  1. Coleta dados básicos do cliente via CLI
 *  2. Gera client_id único e slugificado
 *  3. Cria arquivo JSON do cliente baseado no template
 *  4. Inicializa registro no Supabase (se configurado)
 *  5. Inicializa bucket R2 no Cloudflare (se configurado)
 *  6. Gera ACTIVATE.md personalizado para o cliente
 *  7. Exibe resumo e próximos passos
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';

// ─── Configuração ────────────────────────────────────────────────────────────

const ECOSYSTEM_ROOT = path.resolve('.');
const CLIENTS_DIR = path.join(ECOSYSTEM_ROOT, 'clients');
const TEMPLATE_PATH = path.join(CLIENTS_DIR, 'client-template.json');
const ECOSYSTEM_PATH = path.join(ECOSYSTEM_ROOT, 'ecosystem.json');

// Supabase (opcional)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue = '') {
  return new Promise(resolve => {
    const hint = defaultValue ? ` (default: ${defaultValue})` : '';
    rl.question(`${question}${hint}: `, answer => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askSelect(question, options) {
  const optionsList = options.map((o, i) => `  ${i + 1}. ${o}`).join('\n');
  return new Promise(resolve => {
    rl.question(`${question}\n${optionsList}\n→ `, answer => {
      const index = parseInt(answer) - 1;
      resolve(options[index] || options[0]);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateClientId(empresa, nome) {
  const base = slugify(`${nome}-${empresa}`).slice(0, 30);
  const suffix = crypto.randomBytes(2).toString('hex');
  return `${base}-${suffix}`;
}

function now() {
  return new Date().toISOString();
}

function log(msg, type = 'info') {
  const icons = { info: '→', success: '✅', warning: '⚠️', error: '❌', section: '\n──' };
  console.log(`${icons[type] || '→'} ${msg}`);
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

async function insertClientSupabase(clientData) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        client_id: clientData.identity.client_id,
        nome: clientData.identity.nome,
        empresa: clientData.identity.empresa,
        segmento: clientData.identity.segmento,
        perfil_usuario: clientData.profile.tipo_usuario,
        tom_preferido: clientData.brand.tom_de_voz.tom_principal,
        stack_preferida: clientData.technical.stack_preferida,
        marca_json: JSON.stringify(clientData.brand),
        preferencias_json: JSON.stringify(clientData.profile),
        ultima_sessao: now()
      })
    });

    return response.ok;
  } catch (err) {
    log(`Supabase indisponível: ${err.message}`, 'warning');
    return false;
  }
}

// ─── Geração do ACTIVATE.md ──────────────────────────────────────────────────

function generateActivateMd(clientData, ecosystemRepo) {
  const { client_id, empresa } = clientData.identity;
  const rawBase = `https://raw.githubusercontent.com/${ecosystemRepo}/main`;

  return `# ACTIVATE — ${empresa}
**Client ID:** \`${client_id}\`  
**Gerado em:** ${now().slice(0, 10)}

---

## Como ativar o WebCraft Agent para este cliente

Cole o bloco abaixo no início de uma conversa com o Claude:

\`\`\`
Você é o Orchestrator do ecossistema WebCraft.

Leia e siga:
${rawBase}/orchestrator/system-prompt.md

Registro de agentes:
${rawBase}/agent-registry.json

Skills do Orchestrator:
${rawBase}/orchestrator/skills/routing/SKILL.md
${rawBase}/orchestrator/skills/integration/SKILL.md

CONTEXTO DO CLIENTE:
client_id: ${client_id}
empresa: ${empresa}
segmento: ${clientData.identity.segmento}
perfil: ${clientData.profile.tipo_usuario}
stack: ${clientData.technical.stack_preferida}
tom: ${clientData.brand.tom_de_voz.tom_principal || 'a definir'}

Carregue o contexto completo do cliente antes de qualquer ação.
\`\`\`

---

## Dados do cliente

| Campo | Valor |
|---|---|
| Client ID | \`${client_id}\` |
| Empresa | ${empresa} |
| Segmento | ${clientData.identity.segmento} |
| Perfil | ${clientData.profile.tipo_usuario} |
| Stack | ${clientData.technical.stack_preferida} |
| Deploy | ${clientData.technical.deploy_preferido} |

---

## Próximos passos

1. Cole o bloco acima em uma nova conversa com o Claude
2. Descreva o projeto em linguagem natural
3. O agente vai carregar o contexto e iniciar o pipeline correto

---

## Arquivos do cliente

\`\`\`
clients/${client_id}/
  ├── client.json          ← contexto e preferências
  ├── ACTIVATE.md          ← este arquivo
  └── projects/            ← outputs dos projetos
\`\`\`
`;
}

// ─── Geração do REVISAO.md ───────────────────────────────────────────────────

function generateRevisaoMd(clientData, ecosystemRepo) {
  const { client_id, empresa, segmento, email_contato, localizacao } = clientData.identity;
  const { stack_preferida, deploy_preferido, dominio } = clientData.technical;
  const { tom_principal } = clientData.brand.tom_de_voz;
  const { tipo_usuario, ritmo_preferido } = clientData.profile;
  const rawBase = `https://raw.githubusercontent.com/${ecosystemRepo}/main`;

  const deployUrl = dominio
    ? `https://${dominio}`
    : `https://${slugify(empresa)}.${deploy_preferido === 'netlify' ? 'netlify.app' : deploy_preferido === 'cloudflare-pages' ? 'pages.dev' : 'vercel.app'}`;

  const redeployCmd = {
    vercel: 'vercel --prod',
    netlify: 'netlify deploy --prod --dir .',
    'cloudflare-pages': 'wrangler pages deploy dist'
  }[deploy_preferido] || 'vercel --prod';

  return `# REVISAO.md — ${empresa}
**Client ID:** \`${client_id}\`  
**Criado em:** ${now().slice(0, 10)}  
**Última revisão:** —

---

## 🚀 Site em produção

| Campo | Valor |
|---|---|
| URL | ${deployUrl} |
| Plataforma | ${deploy_preferido} |
| Domínio próprio | ${dominio || 'não configurado'} |
| Stack | ${stack_preferida} |
| Repo do site | \`clients/${client_id}/projects/\` |

**Redeploy manual (se necessário):**
\`\`\`bash
cd clients/${client_id}/projects/site-atual
${redeployCmd}
\`\`\`

---

## ⚡ Como acionar o ecossistema para revisões

**Passo 1 — Abra uma nova conversa com o Claude**

**Passo 2 — Cole este bloco exato no início:**

\`\`\`
Você é o Orchestrator do ecossistema WebCraft.

Leia e siga:
${rawBase}/orchestrator/system-prompt.md

Registro de agentes:
${rawBase}/agent-registry.json

Skills:
${rawBase}/orchestrator/skills/routing/SKILL.md
${rawBase}/orchestrator/skills/integration/SKILL.md

CONTEXTO DO CLIENTE:
client_id: ${client_id}
empresa: ${empresa}
segmento: ${segmento}
perfil: ${tipo_usuario}
stack: ${stack_preferida}
deploy: ${deploy_preferido}
url_producao: ${deployUrl}
tom: ${tom_principal || 'a definir'}

Carregue o contexto completo do cliente antes de qualquer ação.
Site atual em produção: ${deployUrl}
\`\`\`

**Passo 3 — Descreva a revisão em linguagem natural:**
\`\`\`
Exemplos:
"Muda o texto do botão principal para 'Falar pelo WhatsApp'"
"Adiciona seção de perguntas frequentes após os depoimentos"
"Atualiza a cor primária para #16A34A"
"Adiciona o número de WhatsApp no header"
"Cria uma segunda página de contato"
\`\`\`

---

## 👤 Perfil do cliente

| Campo | Valor |
|---|---|
| Responsável | ${clientData.identity.nome} |
| Empresa | ${empresa} |
| Segmento | ${segmento} |
| E-mail | ${email_contato || '—'} |
| Cidade | ${localizacao?.cidade || '—'} |
| Perfil técnico | ${tipo_usuario} |
| Ritmo preferido | ${ritmo_preferido} |

---

## ✅ O que foi aprovado pelo cliente

> *Preencher após a entrega do primeiro projeto.*

- [ ] —

---

## 🚫 O que NÃO mudar sem perguntar antes

> *Preencher com restrições identificadas nas sessões.*

- [ ] —

---

## 🎨 Identidade de marca

| Campo | Valor |
|---|---|
| Tom de voz | ${tom_principal || '—'} |
| Cor primária | ${clientData.brand.cores?.primaria || 'a definir'} |
| Fonte título | ${clientData.brand.tipografia?.titulo || 'a definir'} |
| Fonte corpo | ${clientData.brand.tipografia?.corpo || 'a definir'} |

**Palavras da marca:**  
${clientData.brand.tom_de_voz?.palavras_chave?.length ? clientData.brand.tom_de_voz.palavras_chave.join(', ') : '— a definir após primeira sessão'}

**Evitar:**  
${clientData.brand.tom_de_voz?.evitar?.length ? clientData.brand.tom_de_voz.evitar.join(', ') : '— a definir após primeira sessão'}

---

## 📋 Histórico de revisões

| # | Data | O que mudou | Agentes acionados | QA Score | Aprovado |
|---|---|---|---|---|---|
| 1 | — | Entrega inicial | SEO, Copy, WebCraft, QA | — | — |

> *Atualizar a cada revisão concluída.*

---

## 🔧 Pipelines disponíveis para este cliente

| Pedido | Pipeline a usar |
|---|---|
| Mudar texto ou CTA | \`site-rapido\` → só WebCraft + QA |
| Nova seção ou redesign | \`redesign-textos\` → Copy + WebCraft + QA |
| Otimizar para Google | \`auditoria-seo\` → só SEO Agent |
| Site do zero / grande mudança | \`site-completo\` → todos os agentes |

---

## 📁 Estrutura de arquivos

\`\`\`
clients/${client_id}/
  ├── client.json        ← contexto completo (atualizado pelo Memory Agent)
  ├── ACTIVATE.md        ← bloco de ativação simples
  ├── REVISAO.md         ← este arquivo (manual de operação)
  └── projects/
        └── site-v1/
              ├── index.html
              ├── styles.css
              └── script.js
\`\`\`

---

## ⚠️ Antes de cada revisão — checklist

- [ ] Abri o \`client.json\` para revisar o contexto atual
- [ ] Confirmei a URL de produção está no ar: ${deployUrl}
- [ ] Entendi o que o cliente pediu antes de acionar os agentes
- [ ] Sei qual pipeline usar (tabela acima)
- [ ] Tenho o bloco de ativação copiado (seção "Como acionar")

---

*Gerado automaticamente pelo WebCraft Onboarding Script v2.0*  
*Ecossistema: ${ecosystemRepo}*
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   WebCraft — Onboarding de Cliente   ║');
  console.log('╚══════════════════════════════════════╝\n');

  // Carregar template e ecosystem
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  const ecosystem = JSON.parse(fs.readFileSync(ECOSYSTEM_PATH, 'utf8'));
  const ecosystemRepo = ecosystem.ecosystem.repository.replace('https://github.com/', '');

  // ── 1. Dados de identidade ──
  log('IDENTIDADE DO CLIENTE', 'section');
  const nome = await ask('Nome do responsável');
  const empresa = await ask('Nome da empresa');
  const segmento = await askSelect('Segmento', [
    'saúde', 'tech/saas', 'educação', 'alimentação',
    'jurídico', 'moda/premium', 'consultoria', 'e-commerce',
    'imóveis', 'outro'
  ]);
  const email = await ask('E-mail de contato');
  const cidade = await ask('Cidade');
  const site_atual = await ask('Site atual (se houver)', '');

  // ── 2. Perfil de usuário ──
  log('PERFIL DE USUÁRIO', 'section');
  const tipo_usuario = await askSelect('Perfil do usuário', ['pm', 'dev', 'designer']);
  const ritmo = await askSelect('Ritmo de trabalho preferido', ['rapido', 'detalhado']);
  const autonomia = await askSelect('Nível de autonomia do agente', ['alto', 'medio', 'baixo']);

  // ── 3. Marca ──
  log('IDENTIDADE DE MARCA', 'section');
  const nome_marca = await ask('Nome da marca', empresa);
  const descricao = await ask('Descreva o negócio em 1-2 frases');
  const publico = await ask('Público-alvo principal');
  const proposta = await ask('Proposta de valor principal');
  const tom = await askSelect('Tom de voz', [
    'profissional', 'acolhedor', 'descontraído', 'técnico', 'premium'
  ]);
  const cor_primaria = await ask('Cor primária da marca (#hex)', '');

  // ── 4. Técnico ──
  log('PREFERÊNCIAS TÉCNICAS', 'section');
  const stack = await askSelect('Stack preferida', [
    'HTML/CSS/JS', 'React', 'Next.js', 'Vue', 'sem preferência'
  ]);
  const deploy = await askSelect('Deploy preferido', [
    'vercel', 'netlify', 'cloudflare-pages', 'sem preferência'
  ]);
  const dominio = await ask('Domínio (se houver)', '');

  // ── Gerar cliente ──
  const client_id = generateClientId(empresa, nome);
  const clientDir = path.join(CLIENTS_DIR, client_id);
  const projectsDir = path.join(clientDir, 'projects');

  log('GERANDO CLIENTE', 'section');

  // Montar objeto do cliente
  const client = JSON.parse(JSON.stringify(template)); // deep clone
  client._created_at = now();
  client._updated_at = now();

  client.identity = {
    client_id,
    nome,
    empresa,
    segmento,
    site_atual,
    email_contato: email,
    telefone: null,
    localizacao: { cidade, estado: null, pais: 'BR' }
  };

  client.profile = {
    tipo_usuario,
    nivel_tecnico: tipo_usuario === 'dev' ? 'alto' : 'baixo',
    ritmo_preferido: ritmo,
    autonomia_agente: autonomia,
    idioma: 'pt-BR'
  };

  client.brand = {
    ...template.brand,
    nome_marca,
    descricao_negocio: descricao,
    publico_alvo: publico,
    proposta_de_valor: proposta,
    cores: {
      primaria: cor_primaria || null,
      secundaria: null,
      acento: null,
      fundo: null,
      texto: null
    },
    tom_de_voz: {
      tom_principal: tom,
      adjetivos: [],
      palavras_chave: [],
      evitar: [],
      exemplos_aprovados: []
    }
  };

  client.technical = {
    stack_preferida: stack,
    deploy_preferido: deploy,
    dominio: dominio || null,
    integrações_ativas: [],
    cms: null,
    analytics_id: null
  };

  // Criar estrutura de pastas
  fs.mkdirSync(projectsDir, { recursive: true });
  log(`Pasta criada: clients/${client_id}/`, 'success');

  // Salvar client.json
  fs.writeFileSync(
    path.join(clientDir, 'client.json'),
    JSON.stringify(client, null, 2)
  );
  log('client.json gerado', 'success');

  // Gerar ACTIVATE.md
  const activateMd = generateActivateMd(client, ecosystemRepo);
  fs.writeFileSync(path.join(clientDir, 'ACTIVATE.md'), activateMd);
  log('ACTIVATE.md gerado', 'success');

  // Gerar REVISAO.md
  const revisaoMd = generateRevisaoMd(client, ecosystemRepo);
  fs.writeFileSync(path.join(clientDir, 'REVISAO.md'), revisaoMd);
  log('REVISAO.md gerado', 'success');

  // Persistir no Supabase
  if (SUPABASE_URL) {
    const ok = await insertClientSupabase(client);
    log(ok ? 'Cliente registrado no Supabase' : 'Supabase: salvo apenas localmente', ok ? 'success' : 'warning');
  } else {
    log('Supabase não configurado — dados salvos apenas localmente', 'warning');
  }

  rl.close();

  // ── Resumo ──
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║         Cliente criado com sucesso   ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`
  Client ID:  ${client_id}
  Empresa:    ${empresa}
  Segmento:   ${segmento}
  Perfil:     ${tipo_usuario}
  Stack:      ${stack}
  Deploy:     ${deploy}

  Arquivos gerados:
  → clients/${client_id}/client.json     ← contexto do cliente
  → clients/${client_id}/ACTIVATE.md     ← bloco de ativação
  → clients/${client_id}/REVISAO.md      ← manual de operação e revisões
  → clients/${client_id}/projects/       ← outputs dos projetos

  Próximos passos:
  1. Abra clients/${client_id}/REVISAO.md
     (contém tudo: URL, bloco de ativação, histórico, checklist)
  2. Cole o bloco de ativação em uma nova conversa com o Claude
  3. Descreva o primeiro projeto do cliente
  4. Após a entrega, preencha as seções "Aprovado" e "Não mudar"
  `);
}

main().catch(err => {
  console.error('Erro no onboarding:', err);
  process.exit(1);
});

// ─── Geração do TASTE.md ──────────────────────────────────────────────────────
// Adicionado após integração Impeccable + Taste

export function generateTasteMd(clientData) {
  const { empresa, segmento } = clientData.identity;
  const { tom_principal, adjetivos } = clientData.brand.tom_de_voz;
  const { cores } = clientData.brand;

  // Sugerir variante com base no segmento
  const varianteSugerida = {
    'saúde': 'soft-skill',
    'tech/saas': 'taste-skill',
    'educação': 'soft-skill',
    'alimentação': 'taste-skill',
    'jurídico': 'minimalist-skill',
    'moda/premium': 'minimalist-skill',
    'consultoria': 'taste-skill',
    'e-commerce': 'taste-skill'
  }[segmento] || 'taste-skill';

  return `# TASTE.md — ${empresa}
# Variante sugerida: ${varianteSugerida}
# Gerado automaticamente — preencher com o Design Agent

---

## Identidade Visual

**Conceito:** [Descreva em 2-3 frases a atmosfera e intenção visual — não regras, intenção]
Exemplo: "Uma interface que respira. Espaço generoso, foco no resultado, sem exageros visuais."

**Personalidade:** ${adjetivos.length > 0 ? adjetivos.join(' · ') : '[adjetivo 1] · [adjetivo 2] · [adjetivo 3]'}

**Arquétipo:** [Humano | Clínico | Editorial | Tecnológico | Orgânico | Bold | Premium]

---

## Dials

DESIGN_VARIANCE: [1-10]   # quão diferente do padrão
MOTION_INTENSITY: [1-10]  # peso das animações
VISUAL_DENSITY: [1-10]    # quantidade de informação por tela

---

## ALWAYS DO

- [Regra específica deste projeto]
- [Regra específica deste projeto]
- [Regra específica deste projeto]

---

## NEVER DO

- [Anti-pattern específico deste projeto]
- [Anti-pattern específico deste projeto]
- Sem Inter como fonte principal
- Sem gradiente roxo/azul em fundo branco
- Sem hero centralizado sem tensão visual

---

## Sistema de cores

Primária:   ${cores.primaria || '[hex]'} — [por que esta cor para este projeto]
Secundária: ${cores.secundaria || '[hex]'} — [papel no sistema]
Acento:     ${cores.acento || '[hex]'} — [quando usar]
Fundo:      ${cores.fundo || '[hex]'} — [atmosfera que cria]
Texto:      ${cores.texto || '[hex]'} — [legibilidade + personalidade]

---

## Tipografia

Título:  [fonte] — [por que esta fonte para este projeto]
Corpo:   [fonte] — [por que complementa]

---

## Referências aprovadas

[URLs ou descrições de sites que o cliente admirou]

---

## Referências negativas

[URLs ou descrições de sites que o cliente detestou]

---

## Instalação do Taste Skill

\`\`\`bash
# Instalar a variante recomendada para este cliente
npx skills add https://github.com/Leonxlnx/taste-skill --skill ${varianteSugerida}

# Depois, peça ao Design Agent para preencher este arquivo
# e passe-o ao WebCraft Agent antes de qualquer geração
\`\`\`
`;
}

export function generateImpeccableMd(clientData) {
  const { empresa, segmento, localizacao } = clientData.identity;
  const { publico_alvo, proposta_de_valor, tom_de_voz } = clientData.brand;

  return `# .impeccable.md — ${empresa}
# Gerado pelo onboarding — completar com /impeccable teach

---

## Produto

${empresa} — ${segmento}

## Público-alvo

${publico_alvo || '[descrever quem usa o produto]'}

## Proposta de valor

${proposta_de_valor || '[o que o produto faz de único]'}

## Localização

${localizacao?.cidade || '[cidade]'}, ${localizacao?.pais || 'BR'}

## Personalidade da marca

Tom: ${tom_de_voz?.tom_principal || '[acolhedor | profissional | técnico | premium | descontraído]'}

## Próximo passo

Rodar \`/impeccable teach\` em uma conversa com o Claude para completar
este arquivo com mais contexto e ativar todos os 23 comandos do Impeccable.
`;
}
