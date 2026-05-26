#!/usr/bin/env node
/**
 * health-check.mjs — Relatório de saúde do ecossistema WebCraft.
 *
 * Valida em 4 camadas:
 *   1. Estrutura: registry ↔ ecosystem ↔ filesystem ↔ evals
 *   2. Connectors: cada um listado em ecosystem.json tem CONNECTOR.md
 *   3. Runtime: Worker /health, endpoints, KV reachability
 *   4. Por-agente: snapshot resumido de cada um dos 13 agentes
 *
 * Uso:
 *   node scripts/health-check.mjs              # tabela colorida
 *   node scripts/health-check.mjs --md         # markdown
 *   node scripts/health-check.mjs --json       # JSON estruturado
 *
 * Exit codes:  0 = tudo verde · 1 = crítico · 2 = só warnings
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const FORMAT = args.has('--json') ? 'json' : args.has('--md') ? 'md' : 'term';

const WORKER_URL = 'https://webcraft-cache-proxy.thiago-618.workers.dev';

const checks = [];
function record(layer, name, status, detail = '') {
  checks.push({ layer, name, status, detail });
}

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf-8'); }
function exists(p) { return fs.existsSync(path.join(ROOT, p)); }

// ──────────────────────────────────────────────────────────────────────────
// Camada 1 — Estrutura
// ──────────────────────────────────────────────────────────────────────────

const eco = JSON.parse(read('ecosystem.json'));
const reg = JSON.parse(read('agent-registry.json'));

// JSONs válidos
record('estrutura', 'ecosystem.json parseável', 'ok');
record('estrutura', 'agent-registry.json parseável', 'ok');

// Versões
record('estrutura', `ecosystem version`, 'info', eco.ecosystem.version);
record('estrutura', `registry version`, 'info', reg.version);

// Contagens
record('estrutura', 'agentes declarados', 'info', `${eco.agents.total} (eco) / ${reg.agents.length} (reg)`);
if (eco.agents.total !== reg.agents.length) {
  record('estrutura', 'count mismatch agentes', 'crit', `eco=${eco.agents.total} reg=${reg.agents.length}`);
}

// Mesmas IDs nos dois
const ecoIds = new Set(eco.agents.list.map(a => a.id));
const regIds = new Set(reg.agents.map(a => a.id));
for (const id of regIds) if (!ecoIds.has(id)) record('estrutura', `${id} ausente no ecosystem`, 'crit');
for (const id of ecoIds) if (!regIds.has(id)) record('estrutura', `${id} ausente no registry`, 'crit');
if (regIds.size === ecoIds.size && [...regIds].every(id => ecoIds.has(id))) {
  record('estrutura', 'agentes alinhados ecosystem ↔ registry', 'ok');
}

// Pipelines coerentes
const ecoP = Object.keys(eco.pipelines).sort();
const regP = Object.keys(reg.pipelines).sort();
if (JSON.stringify(ecoP) === JSON.stringify(regP)) {
  record('estrutura', `pipelines coerentes`, 'ok', `${ecoP.length} pipelines`);
} else {
  record('estrutura', 'pipelines divergentes', 'crit', `eco=${ecoP} reg=${regP}`);
}

// Pipelines citam agentes existentes
for (const [pname, seq] of Object.entries(reg.pipelines)) {
  for (const a of seq) if (!regIds.has(a)) record('estrutura', `pipeline ${pname} cita ${a}`, 'crit', 'agente inexistente');
}

// System prompts e skills existem
for (const agent of reg.agents) {
  if (!exists(agent.system_prompt)) record('estrutura', `${agent.id}: system_prompt`, 'crit', agent.system_prompt);
  for (const skill of (agent.skills || [])) if (!exists(skill)) record('estrutura', `${agent.id}: skill faltando`, 'crit', skill);
}

// Evals
for (const agent of reg.agents) {
  const direct = `evals/agents/${agent.id}.md`;
  const shared = 'evals/agents/feedback-memory-agents.md';
  if (exists(direct)) continue;
  if (['memory-agent', 'feedback-agent'].includes(agent.id) && exists(shared)) continue;
  record('estrutura', `${agent.id}: sem evals`, 'crit', direct);
}

// Shared-skills declarados existem como arquivo
for (const skill of (reg.shared_skills || [])) {
  if (!exists(skill)) record('estrutura', `shared-skill faltando`, 'crit', skill);
}

// ──────────────────────────────────────────────────────────────────────────
// Camada 2 — Connectors
// ──────────────────────────────────────────────────────────────────────────

for (const c of (eco.connectors?.active || [])) {
  const p = `connectors/${c}/CONNECTOR.md`;
  if (exists(p)) record('connectors', `${c}`, 'ok');
  else record('connectors', `${c}: sem CONNECTOR.md`, 'crit', p);
}

// ──────────────────────────────────────────────────────────────────────────
// Camada 3 — Runtime (Worker + KV)
// ──────────────────────────────────────────────────────────────────────────

async function check(name, fn) {
  try {
    const r = await fn();
    record('runtime', name, 'ok', r);
  } catch (e) {
    record('runtime', name, 'crit', e.message);
  }
}

async function fetchJson(url, opts) {
  const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

await check(`Worker /health (${WORKER_URL})`, async () => {
  const j = await fetchJson(`${WORKER_URL}/health`);
  if (!j.ok) throw new Error('campo ok=false');
  return `ok · ts=${j.ts}`;
});

await check('/places/search smoke', async () => {
  const j = await fetchJson(`${WORKER_URL}/places/search?q=Einstein&city=S%C3%A3o%20Paulo`);
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 80));
  if (!j.places?.length) throw new Error('sem resultados');
  return `${j._source} · ${j.places[0].displayName?.text || j.places[0].id}`;
});

await check('/unsplash/search smoke', async () => {
  const j = await fetchJson(`${WORKER_URL}/unsplash/search?q=clinic&per_page=1`);
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 80));
  if (!j.results?.length) throw new Error('sem resultados');
  return `${j._source} · ${j.results[0].id}`;
});

// ──────────────────────────────────────────────────────────────────────────
// Output
// ──────────────────────────────────────────────────────────────────────────

const summary = {
  ok:   checks.filter(c => c.status === 'ok').length,
  warn: checks.filter(c => c.status === 'warn').length,
  crit: checks.filter(c => c.status === 'crit').length,
  info: checks.filter(c => c.status === 'info').length,
};

// Snapshot por-agente
const agentRows = reg.agents.map(a => {
  const skillsOk = (a.skills || []).every(s => exists(s));
  const promptOk = exists(a.system_prompt);
  const evalsOk = exists(`evals/agents/${a.id}.md`) || (['memory-agent', 'feedback-agent'].includes(a.id) && exists('evals/agents/feedback-memory-agents.md'));
  const inPipelines = Object.entries(reg.pipelines).filter(([, seq]) => seq.includes(a.id)).map(([n]) => n);
  return {
    id: a.id,
    prompt: promptOk,
    skills: `${(a.skills || []).length}${skillsOk ? '' : ' ✘'}`,
    evals: evalsOk,
    can_call: (a.can_call || []).length,
    called_by: (a.called_by || []).length,
    pipelines: inPipelines.length
  };
});

if (FORMAT === 'json') {
  console.log(JSON.stringify({ ts: new Date().toISOString(), summary, checks, agents: agentRows }, null, 2));
} else if (FORMAT === 'md') {
  console.log(renderMarkdown(summary, checks, agentRows, eco));
} else {
  renderTerm(summary, checks, agentRows, eco);
}

process.exit(summary.crit > 0 ? 1 : summary.warn > 0 ? 2 : 0);

// ──────────────────────────────────────────────────────────────────────────

function ico(s) { return { ok: '\x1b[32m✓\x1b[0m', warn: '\x1b[33m⚠\x1b[0m', crit: '\x1b[31m✘\x1b[0m', info: '·' }[s] || '?'; }
function icoMd(s) { return { ok: '✅', warn: '⚠️', crit: '❌', info: 'ℹ️' }[s] || '?'; }

function renderTerm(sum, all, agents, eco) {
  console.log(`\nWebCraft Ecosystem — Health Check  (${new Date().toLocaleString('pt-BR')})`);
  console.log(`Versão: ${eco.ecosystem.version} · ${eco.agents.total} agentes · ${(eco.connectors?.active || []).length} connectors · ${(eco.shared_skills || []).length} shared-skills\n`);

  const layers = ['estrutura', 'connectors', 'runtime'];
  for (const layer of layers) {
    const ls = all.filter(c => c.layer === layer);
    console.log(`── ${layer.toUpperCase()} ──`);
    for (const c of ls) {
      console.log(`  ${ico(c.status)} ${c.name.padEnd(46)} ${c.detail || ''}`);
    }
    console.log('');
  }

  console.log('── AGENTES ──');
  console.log(`  ${'id'.padEnd(20)} ${'prompt'.padEnd(8)} ${'skills'.padEnd(8)} ${'evals'.padEnd(8)} ${'can_call'.padEnd(10)} ${'called_by'.padEnd(11)} pipelines`);
  for (const a of agents) {
    console.log(`  ${a.id.padEnd(20)} ${(a.prompt ? '✓' : '✘').padEnd(8)} ${String(a.skills).padEnd(8)} ${(a.evals ? '✓' : '✘').padEnd(8)} ${String(a.can_call).padEnd(10)} ${String(a.called_by).padEnd(11)} ${a.pipelines}`);
  }
  console.log('');
  console.log(`Total: ${sum.ok} ok · ${sum.warn} warn · ${sum.crit} crit · ${sum.info} info`);
  console.log(sum.crit ? '\n✘ REPROVADO — corrigir críticos.' : sum.warn ? '\n⚠ APROVADO COM WARNINGS' : '\n✓ APROVADO');
}

function renderMarkdown(sum, all, agents, eco) {
  const lines = [];
  lines.push(`# WebCraft Ecosystem — Health Check`);
  lines.push('');
  lines.push(`**Timestamp:** ${new Date().toISOString()}`);
  lines.push(`**Versão:** ${eco.ecosystem.version}`);
  lines.push(`**Resumo:** ${sum.ok} ok · ${sum.warn} warn · ${sum.crit} crit`);
  lines.push('');
  for (const layer of ['estrutura', 'connectors', 'runtime']) {
    lines.push(`## ${layer[0].toUpperCase()}${layer.slice(1)}`);
    lines.push('');
    for (const c of all.filter(x => x.layer === layer)) {
      lines.push(`- ${icoMd(c.status)} **${c.name}** ${c.detail ? `— ${c.detail}` : ''}`);
    }
    lines.push('');
  }
  lines.push(`## Snapshot por agente`);
  lines.push('');
  lines.push('| Agente | Prompt | Skills | Evals | Can_call | Called_by | Pipelines |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const a of agents) {
    lines.push(`| \`${a.id}\` | ${a.prompt ? '✅' : '❌'} | ${a.skills} | ${a.evals ? '✅' : '❌'} | ${a.can_call} | ${a.called_by} | ${a.pipelines} |`);
  }
  return lines.join('\n');
}
