#!/usr/bin/env node
/**
 * WebCraft — Importar cliente de ecossistema externo
 * Uso: node scripts/import-client.mjs --source=github|notion|supabase --id=...
 *
 * Suporta:
 *  - GitHub: lê contexto de repo externo com ecosystem.json
 *  - Notion: importa briefing e brand guide de páginas Notion
 *  - Supabase: migra cliente de outro ecossistema WebCraft
 *  - JSON: importa client.json exportado manualmente
 */

import fs from 'fs';
import path from 'path';

const CLIENTS_DIR = path.resolve('./clients');
const TEMPLATE_PATH = path.join(CLIENTS_DIR, 'client-template.json');

// ─── Adaptadores por fonte ────────────────────────────────────────────────────

/**
 * Importa de outro ecossistema WebCraft via ecosystem.json público
 */
async function importFromEcosystem(ecosystemUrl) {
  console.log(`→ Lendo ecosystem.json de ${ecosystemUrl}...`);

  const ecoResponse = await fetch(`${ecosystemUrl}/ecosystem.json`);
  if (!ecoResponse.ok) throw new Error('ecosystem.json não encontrado ou inacessível');

  const ecosystem = await ecoResponse.json();
  console.log(`✅ Ecossistema encontrado: ${ecosystem.ecosystem.name} v${ecosystem.ecosystem.version}`);

  // Verificar compatibilidade de schema
  if (ecosystem.data_model?.client_schema) {
    console.log(`→ Schema de cliente: ${ecosystem.data_model.client_schema}`);
  }

  return ecosystem;
}

/**
 * Importa contexto de cliente de repo GitHub externo
 */
async function importFromGitHub(repoUrl, clientId) {
  const rawBase = repoUrl
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    + '/main';

  const clientUrl = `${rawBase}/clients/${clientId}/client.json`;
  console.log(`→ Buscando client.json em ${clientUrl}...`);

  const response = await fetch(clientUrl);
  if (!response.ok) throw new Error(`Cliente ${clientId} não encontrado no repo`);

  const clientData = await response.json();
  console.log(`✅ Cliente encontrado: ${clientData.identity?.empresa}`);
  return clientData;
}

/**
 * Importa de Supabase externo
 */
async function importFromSupabase(supabaseUrl, supabaseKey, clientId) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/clients?client_id=eq.${clientId}&select=*`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );

  if (!response.ok) throw new Error('Falha ao conectar ao Supabase externo');
  const [client] = await response.json();
  if (!client) throw new Error(`Cliente ${clientId} não encontrado`);

  // Converter formato Supabase → formato WebCraft
  return {
    _schema: 'webcraft-client-v1',
    _imported_from: 'supabase-external',
    _imported_at: new Date().toISOString(),
    identity: {
      client_id: client.client_id,
      nome: client.nome,
      empresa: client.empresa,
      segmento: client.segmento
    },
    profile: JSON.parse(client.preferencias_json || '{}'),
    brand: JSON.parse(client.marca_json || '{}'),
    history: { ultima_sessao: client.ultima_sessao },
    projects: [],
    memory_hints: {}
  };
}

/**
 * Importa de arquivo JSON local
 */
function importFromJSON(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Arquivo não encontrado: ${filePath}`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`✅ JSON carregado: ${data.identity?.empresa || 'cliente sem nome'}`);
  return data;
}

// ─── Normalização ─────────────────────────────────────────────────────────────

/**
 * Garante que o cliente importado está no schema WebCraft v1
 */
function normalizeClient(rawData, source) {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));

  // Deep merge: template como base, dados importados sobrescrevem
  function deepMerge(base, override) {
    const result = { ...base };
    for (const key of Object.keys(override || {})) {
      if (override[key] !== null && typeof override[key] === 'object' && !Array.isArray(override[key])) {
        result[key] = deepMerge(base[key] || {}, override[key]);
      } else if (override[key] !== null && override[key] !== undefined) {
        result[key] = override[key];
      }
    }
    return result;
  }

  const normalized = deepMerge(template, rawData);
  normalized._schema = 'webcraft-client-v1';
  normalized._imported_from = source;
  normalized._imported_at = new Date().toISOString();
  normalized._updated_at = new Date().toISOString();

  // Gerar client_id se não existir
  if (!normalized.identity.client_id) {
    const base = (normalized.identity.empresa || 'cliente')
      .toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    normalized.identity.client_id = `${base}-imported`;
  }

  return normalized;
}

// ─── Salvar cliente ───────────────────────────────────────────────────────────

function saveClient(clientData) {
  const clientId = clientData.identity.client_id;
  const clientDir = path.join(CLIENTS_DIR, clientId);
  const projectsDir = path.join(clientDir, 'projects');

  fs.mkdirSync(projectsDir, { recursive: true });
  fs.writeFileSync(
    path.join(clientDir, 'client.json'),
    JSON.stringify(clientData, null, 2)
  );

  // Gerar nota de importação
  const importNote = `# Importação — ${clientData.identity?.empresa}

**Fonte:** ${clientData._imported_from}  
**Data:** ${clientData._imported_at?.slice(0, 10)}  
**Client ID:** \`${clientId}\`

## Dados importados

${JSON.stringify(clientData.identity, null, 2)}

## Próximos passos

1. Revisar \`client.json\` e completar campos vazios
2. Rodar \`node scripts/new-client.mjs\` para completar o perfil interativamente
3. Usar o ACTIVATE.md para iniciar a primeira sessão
`;

  fs.writeFileSync(path.join(clientDir, 'IMPORT-NOTE.md'), importNote);

  console.log(`\n✅ Cliente importado: clients/${clientId}/`);
  console.log(`   → client.json`);
  console.log(`   → IMPORT-NOTE.md`);
  console.log(`   → projects/`);

  return clientId;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const getArg = (key) => args.find(a => a.startsWith(`--${key}=`))?.split('=')[1];

  const source = getArg('source') || 'json';
  const id = getArg('id');
  const url = getArg('url');
  const file = getArg('file');

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   WebCraft — Importar Cliente        ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log(`Fonte: ${source}`);

  let rawData;

  try {
    switch (source) {
      case 'github':
        if (!url || !id) throw new Error('Uso: --source=github --url=https://github.com/... --id=client_id');
        rawData = await importFromGitHub(url, id);
        break;

      case 'ecosystem':
        if (!url || !id) throw new Error('Uso: --source=ecosystem --url=https://raw.github.com/... --id=client_id');
        await importFromEcosystem(url);
        rawData = await importFromGitHub(url, id);
        break;

      case 'supabase':
        const sbUrl = process.env.EXTERNAL_SUPABASE_URL;
        const sbKey = process.env.EXTERNAL_SUPABASE_KEY;
        if (!sbUrl || !sbKey) throw new Error('EXTERNAL_SUPABASE_URL e EXTERNAL_SUPABASE_KEY obrigatórios');
        if (!id) throw new Error('Uso: --source=supabase --id=client_id');
        rawData = await importFromSupabase(sbUrl, sbKey, id);
        break;

      case 'json':
        if (!file) throw new Error('Uso: --source=json --file=caminho/para/client.json');
        rawData = importFromJSON(file);
        break;

      default:
        throw new Error(`Fonte desconhecida: ${source}. Use: github | ecosystem | supabase | json`);
    }

    const normalized = normalizeClient(rawData, source);
    const clientId = saveClient(normalized);

    console.log(`\n→ Para ativar este cliente:\n  Abra clients/${clientId}/ACTIVATE.md`);
    console.log('→ Para completar o perfil:\n  node scripts/new-client.mjs\n');

  } catch (err) {
    console.error(`\n❌ Erro na importação: ${err.message}`);
    process.exit(1);
  }
}

main();
