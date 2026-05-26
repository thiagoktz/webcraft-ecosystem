---
name: lgpd-compliance
description: Padrão obrigatório de conformidade com a LGPD (Lei 13.709/2018) do ecossistema. Define bases legais por finalidade, direitos do titular, retenção de dados, requisitos do banner de cookies, atribuições do controlador e do encarregado (DPO). Aplicar em toda página entregue por pipelines que incluam o Compliance Agent.
---

# Skill: LGPD Compliance (Shared)

Toda página entregue pelo ecossistema em pipelines com Compliance Agent (`site-completo`, `site-com-cms`, `ecommerce-completo`, `site-pro-max`) precisa atender a LGPD. Esta skill define as **convenções não-negociáveis** que Compliance Agent, Backend Agent, Copy Agent e QA Agent compartilham.

⚠️ **Esta skill define padrões técnicos. Não substitui consultoria jurídica.** Sempre instruir o cliente a revisar com advogado especializado antes de produção.

---

## Pirâmide LGPD em 30 segundos

1. **Princípios** — finalidade legítima, adequação, necessidade, transparência, segurança, prevenção, não discriminação
2. **Bases legais** (art. 7) — escolha 1 por finalidade: consentimento | execução de contrato | obrigação legal | proteção da vida | políticas públicas | estudo | legítimo interesse | proteção ao crédito
3. **Direitos do titular** (art. 18) — confirmação, acesso, correção, anonimização, portabilidade, eliminação, info de compartilhamento, revogação
4. **Sanções** (art. 52) — advertência, multa até 2% do faturamento (R$ 50M cap), publicização, bloqueio, eliminação dos dados

---

## Bases legais por finalidade (uso prático)

```
Form de contato no site            → Consentimento (art. 7, I)
Newsletter / marketing             → Consentimento (art. 7, I)
Processar pedido de venda          → Execução de contrato (art. 7, V)
Cobrança, NF, escrituração fiscal  → Obrigação legal (art. 7, II)
Cookies essenciais (sessão, CSRF)  → Legítimo interesse (art. 7, IX)
Analytics agregado / anônimo       → Legítimo interesse (com opt-out)
Remarketing / anúncios pessoais    → Consentimento (art. 7, I) — granular
Recuperação de carrinho abandonado → Legítimo interesse OU Consentimento
Decisões automatizadas             → Consentimento explícito + direito a revisão
```

**Regra:** consentimento NÃO é o default. Sempre prefira execução de contrato, obrigação legal ou legítimo interesse quando aplicável — consentimento é o mais frágil (pode ser revogado a qualquer momento).

---

## Direitos do titular — implementação (Backend Agent segue)

| Direito (art. 18) | Endpoint sugerido | Lógica mínima |
|---|---|---|
| Confirmação de tratamento (I) | `GET /api/lgpd/dados-pessoais` | Retorna 200 se há registro do titular autenticado |
| Acesso aos dados (II) | `GET /api/lgpd/dados-pessoais?full=1` | Dump JSON estruturado dos dados |
| Correção (III) | `PATCH /api/perfil` | Update dos dados editáveis |
| Anonimização/eliminação (VI) | `DELETE /api/lgpd/exclusao` | Apagar OU anonimizar campos PII (e-mail, nome, telefone) mantendo registros não-PII para obrigação fiscal |
| Portabilidade (V) | `GET /api/lgpd/portabilidade` | Export estruturado (JSON ou CSV) |
| Revogação de consentimento (IX) | `DELETE /api/lgpd/consentimento` | Marca consent como `revoked_at: now` |

Todos com autenticação obrigatória (não dá pra deletar dados de qualquer titular via URL).

**Logging:** toda requisição LGPD vai em tabela separada (`lgpd_requests`) com `titular_id`, `tipo_direito`, `requested_at`, `completed_at`, `outcome`. ANPD pode auditar.

**Prazo de resposta:** 15 dias úteis (art. 19). Não fica em "aceite cookies pra continuar."

---

## Retenção de dados — padrões de mercado

| Categoria | Tempo padrão | Base |
|---|---|---|
| Dados de navegação (analytics) | 13 meses | Limite padrão GA4 |
| Dados de contato (form) | Até pedido de exclusão | Consentimento |
| Pedidos / transações | 5 anos | Obrigação fiscal (CTN art. 173) |
| NFs eletrônicas | 5 anos | SEFAZ |
| Logs de segurança | 6 meses | Marco Civil da Internet (art. 15) |
| Logs de acesso a aplicação | 6 meses | Marco Civil |
| Logs de LGPD requests | 5 anos | Boa prática (eventual auditoria) |

O Compliance Agent declara isso no `lgpd_config.tempo_retencao`. Backend Agent implementa cron jobs de purga.

---

## Banner de cookies — requisitos não-negociáveis

```
✓ Opção "Recusar" tão visível quanto "Aceitar" (LGPD art. 5, XII — boa-fé)
✓ Opt-in explícito (cookies NÃO setados antes do clique em "Aceitar")
✓ Granularidade disponível (mesmo que em "Personalizar")
✓ Persistência via localStorage (não cookie, pra não setar cookie antes do consent)
✓ Link visível pra Política de Cookies
✓ Permite mudar a escolha depois (ícone discreto no rodapé, ex: "Cookies")
✗ Banner não bloqueia conteúdo principal (dark pattern proibido)
✗ Sem "Aceitar para continuar" sem alternativa (LGPD não permite consentimento forçado)
✗ Sem checkboxes pré-marcados em granular
✗ Sem auto-aceitar em scroll ou interação implícita (precisa clique explícito)
```

---

## Cookies essenciais vs não-essenciais

**Essenciais (não precisam consent):**
- Sessão autenticada (`session`, `auth_token`)
- Anti-CSRF (`csrf_token`)
- Preferências de UI imediatas (idioma, tema dark/light) — desde que não persistam entre sessões

**Não-essenciais (exigem consent):**
- Google Analytics (`_ga`, `_gid`)
- Facebook Pixel (`_fbp`, `_fbc`)
- Remarketing
- Heatmap (Hotjar, Microsoft Clarity)
- Chat de terceiros (Tawk, Intercom)
- Vídeos embed do YouTube em modo "default"
- Mapas embed do Google Maps

Compliance Agent gera lista no `lgpd_config.cookies_inventariados` baseada nas tags presentes no HTML.

---

## Identificação obrigatória do controlador (na Política de Privacidade)

```
Razão social / Nome completo
CNPJ (ou CPF se pessoa física)
Endereço completo
E-mail de contato LGPD (DPO ou substituto)
Telefone (opcional mas recomendado)
```

Se algum desses dados estiver vazio no briefing, **bloqueie** o pipeline e devolva `status: "dados_controlador_incompletos"`. Não inventar.

---

## Encarregado pela Proteção de Dados (DPO) — art. 41

- **Empresas pequenas** podem nomear sócio/funcionário como DPO interno
- **Empresas com tratamento sensível** (saúde, finanças, +5000 titulares) devem ter DPO dedicado
- ANPD pode multar por DPO inexistente ou inacessível

Padrão do agente: assume DPO interno (mais comum). Cliente decide se quer terceirizar.

---

## Compartilhamento com terceiros

Toda política de privacidade lista terceiros com quem dados são compartilhados:

```
Hospedagem:           Vercel (EUA, Privacy Shield + SCC)
Banco de dados:       Supabase (EUA + UE)
Email transacional:   Gmail Workspace (Google, EUA)
Analytics:            Google Analytics 4 (Google, EUA)
Imagens:              Unsplash (EUA — só metadados, sem dados pessoais)
Avaliações:           Google Places (Google, EUA — só leitura pública)
Pagamento:            [Mercado Pago | Stripe | PagSeguro] (varia)
```

Compliance Agent gera essa lista dinamicamente a partir dos connectors ativos do ecosystem.json + dados do briefing.

---

## Transferência internacional de dados

A LGPD permite (art. 33), mas exige base legal específica. EUA não tem decisão de adequação da ANPD ainda, então o uso de Vercel/Google/Supabase deve estar amparado por:
- Consentimento específico do titular, OU
- Cláusulas contratuais padrão (Standard Contractual Clauses)

Compliance Agent inclui isso na seção "Compartilhamento" automaticamente quando connectors hospedados nos EUA estão ativos.

---

## Anti-patterns proibidos

```
❌ "Aceitar para continuar"                        (dark pattern, sem alternativa)
❌ Checkbox de consent pré-marcado                 (não é opt-in)
❌ Banner que cobre 100% da tela e bloqueia conteúdo (consent forçado)
❌ "Recusar" em cor de baixo contraste vs "Aceitar" colorido
❌ Setar cookies antes do clique em aceitar
❌ Auto-aceitar em scroll / movimento de mouse
❌ Política de privacidade copiada de outro site sem ajuste
❌ Sem link pra política de cookies no banner
❌ Email de DPO genérico (contato@) — LGPD exige acessível e nominalmente identificável
❌ Não responder solicitação LGPD em até 15 dias úteis
```

---

## Checklist de aprovação (QA Agent valida Camada 4.7)

```
[ ] Banner de cookies presente e visível
[ ] Banner respeita padrão "Aceitar/Recusar/Personalizar"
[ ] Consent Mode v2 default 'denied' antes do GTM
[ ] localStorage usado para persistir consent (não cookie)
[ ] Política de Privacidade existe e tem 9 seções obrigatórias
[ ] Política de Cookies existe e lista cookies inventariados
[ ] Footer tem links visíveis para ambas
[ ] Dados do controlador completos (CNPJ, endereço, email DPO)
[ ] Tempo de retenção declarado para cada categoria
[ ] Endpoints LGPD (mínimo /api/lgpd/dados-pessoais e /api/lgpd/exclusao) implementados pelo Backend Agent
[ ] Alerta "revisar com advogado" presente no output
[ ] data-atualizacao da política preenchida com data corrente
```

---

## Referências

- LGPD (Lei 13.709/2018): http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
- ANPD (Autoridade Nacional): https://www.gov.br/anpd/
- Consent Mode v2: https://developers.google.com/tag-platform/security/guides/consent
- Marco Civil da Internet: http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm
