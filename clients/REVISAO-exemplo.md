# REVISAO.md — Clínica Saúde Total
**Client ID:** `maria-saude-total-m3x9`  
**Criado em:** 2026-05-23  
**Última revisão:** 2026-05-23

---

## 🚀 Site em produção

| Campo | Valor |
|---|---|
| URL | https://saudetotal.com.br |
| Plataforma | vercel |
| Domínio próprio | saudetotal.com.br ✓ |
| Stack | HTML/CSS/JS |
| Repo do site | `clients/maria-saude-total-m3x9/projects/` |

**Redeploy manual (se necessário):**
```bash
cd clients/maria-saude-total-m3x9/projects/site-atual
vercel --prod
```

---

## ⚡ Como acionar o ecossistema para revisões

**Passo 1 — Abra uma nova conversa com o Claude**

**Passo 2 — Cole este bloco exato no início:**

```
Você é o Orchestrator do ecossistema WebCraft.

Leia e siga:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/system-prompt.md

Registro de agentes:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/agent-registry.json

Skills:
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/routing/SKILL.md
https://raw.githubusercontent.com/thiagoktz/webcraft-ecosystem/main/orchestrator/skills/integration/SKILL.md

CONTEXTO DO CLIENTE:
client_id: maria-saude-total-m3x9
empresa: Clínica Saúde Total
segmento: saúde
perfil: pm
stack: HTML/CSS/JS
deploy: vercel
url_producao: https://saudetotal.com.br
tom: acolhedor

Carregue o contexto completo do cliente antes de qualquer ação.
Site atual em produção: https://saudetotal.com.br
```

**Passo 3 — Descreva a revisão em linguagem natural:**
```
Exemplos reais que a Maria pode pedir:
"Adiciona o número do WhatsApp no header"
"Muda o horário de atendimento no footer para seg-sex 8h-20h"
"Adiciona um depoimento novo da paciente Ana Paula"
"Cria uma seção de perguntas frequentes"
"Atualiza a foto da equipe"
```

---

## 👤 Perfil do cliente

| Campo | Valor |
|---|---|
| Responsável | Maria Silva |
| Empresa | Clínica Saúde Total |
| Segmento | saúde |
| E-mail | maria@saudetotal.com.br |
| Cidade | São Paulo |
| Perfil técnico | pm (não técnica) |
| Ritmo preferido | detalhado |

---

## ✅ O que foi aprovado pelo cliente

- [x] Tom acolhedor com frases focadas em recuperação
- [x] Paleta com tons quentes (ajustada na iteração 2)
- [x] CTA "Agendar avaliação gratuita"
- [x] 6 seções: hero, serviços, sobre, depoimentos, CTA, footer
- [x] Tipografia: Cormorant (título) + Lato (corpo)
- [x] Seção de depoimentos com 3 cases reais

---

## 🚫 O que NÃO mudar sem perguntar antes

- [x] **Cor primária** — a Maria foi muito específica com o verde #16A34A
- [x] **Nome da clínica** — "Saúde Total" (sem "Clínica" no logo)
- [x] **Tom do hero** — aprovado após 2 iterações, não reescrever
- [x] **Estrutura de seções** — cliente não quer mais seções por enquanto
- [x] **Fonte do título** — cliente amou o Cormorant, não trocar

---

## 🎨 Identidade de marca

| Campo | Valor |
|---|---|
| Tom de voz | acolhedor |
| Cor primária | #16A34A (verde saúde) |
| Cor secundária | #F0FDF4 (verde claro) |
| Fonte título | Cormorant Garamond |
| Fonte corpo | Lato |

**Palavras da marca:** recuperação, movimento, cuidado, personalizado, resultado

**Evitar:** "revolucionário", "inovador", termos muito técnicos, exclamações excessivas

---

## 📋 Histórico de revisões

| # | Data | O que mudou | Agentes acionados | QA Score | Aprovado |
|---|---|---|---|---|---|
| 1 | 2026-05-23 | Entrega inicial | SEO, Copy, WebCraft, QA | 94 | ✅ |
| 2 | 2026-05-23 | Paleta ajustada (tons quentes) | Design, WebCraft, QA | 96 | ✅ |

---

## 🔧 Pipelines disponíveis para este cliente

| Pedido | Pipeline a usar |
|---|---|
| Mudar texto, CTA, horário, contato | `site-rapido` → só WebCraft + QA |
| Nova seção, novo depoimento | `redesign-textos` → Copy + WebCraft + QA |
| Melhorar posição no Google | `auditoria-seo` → só SEO Agent |
| Redesign completo ou nova página | `site-completo` → todos os agentes |

---

## 📁 Estrutura de arquivos

```
clients/maria-saude-total-m3x9/
  ├── client.json        ← contexto completo (atualizado pelo Memory Agent)
  ├── ACTIVATE.md        ← bloco de ativação simples
  ├── REVISAO.md         ← este arquivo (manual de operação)
  └── projects/
        └── site-v2/     ← versão atual (após ajuste de paleta)
              ├── index.html
              ├── styles.css
              └── script.js
```

---

## ⚠️ Antes de cada revisão — checklist

- [ ] Abri o `client.json` para revisar o contexto atual
- [ ] Confirmei a URL de produção está no ar: https://saudetotal.com.br
- [ ] Entendi o que o cliente pediu antes de acionar os agentes
- [ ] Sei qual pipeline usar (tabela acima)
- [ ] Tenho o bloco de ativação copiado (seção "Como acionar")
- [ ] Conferi a seção "Não mudar" para não alterar nada sem permissão

---

*Gerado automaticamente pelo WebCraft Onboarding Script v2.0*  
*Ecossistema: thiagoktz/webcraft-ecosystem*
