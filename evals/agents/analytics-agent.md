# EVALS — Analytics Agent
**Critérios:** 22 | **Mínimo:** 18 (82%)

---

## ANALYTICS-01 — Mapeamento mínimo de eventos

**Input:**
```json
{
  "briefing": { "objetivo": "gerar_leads", "cliente_segmento": "saude" },
  "html": "<html>...com hero CTA, form #contato, link wa.me, link tel:...</html>",
  "copy_data": { "ctas": [{ "selector": "[data-cta='hero']", "label": "Agendar" }] },
  "stack": "HTML/CSS/JS",
  "social_links": { "whatsapp": "https://wa.me/5511999999999", "phone": "+551133334444" }
}
```

**Critérios:**
- [ ] `tracking_plan.events` contém `hero_cta_click` com `conversion: true`
- [ ] `tracking_plan.events` contém `form_submit_success` apontando para `#form-contato` (ou `#contato`)
- [ ] `tracking_plan.events` contém `whatsapp_open` com selector `a[href*='wa.me']`
- [ ] `tracking_plan.events` contém `phone_click` com selector `a[href^='tel:']`
- [ ] `tracking_plan.events` contém `scroll_75` como evento de engagement (não conversion)

---

## ANALYTICS-02 — Naming e estrutura corretos

**Critérios:**
- [ ] Todos os `name` são snake_case
- [ ] Todos os `name` são em inglês
- [ ] Nenhum `name` excede 40 caracteres
- [ ] `tracking_plan.platform` é `"ga4+gtm"` (default da v2.3.0)

---

## ANALYTICS-03 — HTML patches consistentes

**Critérios:**
- [ ] `html_patches.head_inject` contém o snippet do GTM (`googletagmanager.com/gtm.js`)
- [ ] `html_patches.head_inject` inicializa `window.dataLayer` antes do GTM
- [ ] `html_patches.body_open_inject` contém o `<noscript>` fallback
- [ ] `html_patches.event_listeners_inline_script` contém um listener pra cada evento custom mapeado
- [ ] Measurement ID está como placeholder `G-XXXXXXXXXX` (nunca inventar)
- [ ] Container ID está como placeholder `GTM-XXXXXXX`

---

## ANALYTICS-04 — Aviso LGPD presente

**Input:** qualquer briefing sem indicação de banner de cookies já implementado.

**Critérios:**
- [ ] `alertas` contém menção clara a LGPD/consent e ao Compliance Agent (roadmap)
- [ ] `html_patches.head_inject` inclui comentário `<!-- TODO LGPD -->` acima do GTM

---

## ANALYTICS-05 — Enhanced Ecommerce quando aplicável

**Input:**
```json
{
  "briefing": { "objetivo": "vender" },
  "ecommerce_data": { "gateway": "mercadopago", "produtos": ["sku-1", "sku-2"] },
  "html": "<html>...com pagina de produto e checkout...</html>"
}
```

**Critérios:**
- [ ] `tracking_plan.events` inclui `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
- [ ] Eventos de e-commerce têm `params.ecommerce` com `currency: 'BRL'` e `items: array`
- [ ] Documentação `client_docs.setup_md` instrui marcar `purchase` como conversion no GA4

---

## ANALYTICS-06 — Documentação pro cliente

**Critérios:**
- [ ] `client_docs.setup_md` existe e tem passo-a-passo pra criar GA4 property
- [ ] `client_docs.setup_md` tem passo-a-passo pra criar GTM container e tag GA4 Configuration
- [ ] `client_docs.dashboard_md` explica em português não-técnico como ler conversions no painel

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| ANALYTICS-01 | — | — | — |
| ANALYTICS-02 | — | — | — |
| ANALYTICS-03 | — | — | — |
| ANALYTICS-04 | — | — | — |
| ANALYTICS-05 | — | — | — |
| ANALYTICS-06 | — | — | — |
