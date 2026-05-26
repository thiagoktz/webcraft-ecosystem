# EVALS — Compliance Agent
**Critérios:** 24 | **Mínimo:** 20 (83%)

---

## COMPLIANCE-01 — Banner padrão híbrido gerado corretamente

**Input:**
```json
{
  "briefing": {
    "segmento": "saude",
    "controlador": {
      "nome": "Clínica Saúde Total Ltda.",
      "cnpj": "12.345.678/0001-99",
      "endereco": "Av. Exemplo, 123 — São Paulo/SP",
      "email_dpo": "lgpd@saudetotal.com.br"
    },
    "tem_login": false,
    "tem_transacao": false,
    "tem_newsletter": true
  },
  "html": "<html>...HTML completo com hero, form contato, footer...</html>",
  "tracking_categorias": ["analytics", "funcional"]
}
```

**Critérios:**
- [ ] `html_patches.body_inject_banner` contém `data-lgpd="accept-all"`, `data-lgpd="reject-all"`, `data-lgpd="customize"`
- [ ] Botões Aceitar e Recusar têm **mesma proeminência visual** (mesmo tamanho/contraste)
- [ ] Banner inclui `role="dialog"` e `aria-labelledby` (acessibilidade)
- [ ] Painel "Personalizar" oferece toggles para categorias declaradas (analytics, funcional)
- [ ] Cookie "essencial" aparece como disabled+checked (não negociável)

---

## COMPLIANCE-02 — Consent Mode v2 default denied

**Critérios:**
- [ ] `html_patches.head_inject_consent_mode` contém `gtag('consent', 'default', {...})`
- [ ] Default tem `analytics_storage: 'denied'`, `ad_storage: 'denied'`
- [ ] `security_storage: 'granted'` (necessário pro CSRF/sessão)
- [ ] Script inicializa `dataLayer` e `gtag` antes do bloco — para o Analytics Agent reaproveitar (sem duplicar)

---

## COMPLIANCE-03 — Dados do controlador completos

**Input com controlador faltando campos:**
```json
{ "briefing": { "controlador": { "nome": "Empresa X" } } }
```

**Critérios:**
- [ ] Output devolve `status: "dados_controlador_incompletos"` OU bloqueia explicitamente
- [ ] Não inventa CNPJ, endereço ou email
- [ ] `alertas` lista quais campos faltam

---

## COMPLIANCE-04 — Bases legais corretas por finalidade

**Critérios:**
- [ ] Newsletter usa `consentimento` (não execução de contrato)
- [ ] Form de contato usa `consentimento`
- [ ] Em pipeline e-commerce: processar pedido = `execucao_contrato`, NF = `obrigacao_legal`
- [ ] Analytics agregado pode usar `legitimo_interesse` (com opt-out via banner)
- [ ] Nenhuma finalidade usa "qualquer base, tanto faz" — todas explicitadas

---

## COMPLIANCE-05 — Delegação correta ao Copy Agent

**Critérios:**
- [ ] `copy_agent_request.tipo === "legal_pages"`
- [ ] `copy_agent_request.paginas` inclui `politica-de-privacidade` (sempre)
- [ ] `copy_agent_request.paginas` inclui `politica-de-cookies` (sempre)
- [ ] `politica-de-privacidade.secoes_obrigatorias` lista 9+ seções (controlador, dados, finalidades, bases, compartilhamento, retenção, direitos, contato, atualização)
- [ ] NÃO solicita Termos de Uso quando `tem_login=false` e `tem_transacao=false` (escopo mínimo v2.4.0)

---

## COMPLIANCE-06 — Endpoints LGPD obrigatórios para Backend Agent

**Critérios:**
- [ ] `backend_endpoints_obrigatorios` contém `GET /api/lgpd/dados-pessoais` (direito de acesso)
- [ ] `backend_endpoints_obrigatorios` contém `DELETE /api/lgpd/exclusao` (direito de eliminação)
- [ ] Quando `tem_login=true`: também `GET /api/lgpd/portabilidade`
- [ ] Cada endpoint tem `autenticacao_requerida: true`
- [ ] Cada endpoint cita o inciso do art. 18 LGPD

---

## COMPLIANCE-07 — Alertas e revisão jurídica

**Critérios:**
- [ ] `alertas` contém menção explícita a "revisar com advogado antes de produção"
- [ ] `compliance_active: true` no output (sinal pro Analytics Agent)
- [ ] Output JSON-only, sem texto fora do schema

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| COMPLIANCE-01 | — | — | — |
| COMPLIANCE-02 | — | — | — |
| COMPLIANCE-03 | — | — | — |
| COMPLIANCE-04 | — | — | — |
| COMPLIANCE-05 | — | — | — |
| COMPLIANCE-06 | — | — | — |
| COMPLIANCE-07 | — | — | — |
