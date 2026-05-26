---
name: analytics
description: Padrão obrigatório de instrumentação de analytics do ecossistema. Define convenções de naming de eventos, estrutura do dataLayer, eventos mínimos por tipo de negócio, e como Backend/E-commerce Agents disparam eventos em callbacks de servidor. Aplicar em toda página entregue pelo Analytics Agent.
---

# Skill: Analytics (Shared)

Toda página entregue pelo ecossistema (exceto `site-rapido` e patches) precisa de instrumentação GA4 + GTM consistente. Esta skill define as **convenções não-negociáveis** que Analytics Agent, WebCraft Agent, Backend Agent, E-commerce Agent e QA Agent compartilham.

---

## Naming de eventos (regras absolutas)

| Regra | Exemplo bom | Exemplo ruim |
|---|---|---|
| snake_case sempre | `hero_cta_click` | `heroCTAClick`, `cta-hero` |
| Inglês sempre (GA4 espera) | `whatsapp_open` | `abrir_whatsapp` |
| Máx 40 caracteres | `pricing_cta_click` | `clicou_no_botao_principal_de_preco` |
| Padrão `<seção>_<acao>[_<qualificador>]` | `form_submit_success` | `success_form`, `formOK` |
| Sem espaços, hífens, acentos | `phone_click` | `phone-click`, `clicar_telefone` |
| Sem números no início | `scroll_75` (depth como param OK) | `75_scroll` |

---

## Eventos mínimos por tipo de negócio

### Todos os sites (obrigatório):
```
page_view              → automático pelo GA4
hero_cta_click         → conversion
form_submit_success    → conversion (se houver form)
whatsapp_open          → conversion (se houver WhatsApp)
phone_click            → conversion (se houver telefone)
scroll_75              → engagement (não conversion)
outbound_click         → engagement (clicks pra Instagram/LinkedIn)
```

### Sites locais (clínica, restaurante, salão):
```
+ booking_cta_click    → conversion (CTA "Agendar")
+ directions_click     → conversion (link "Como chegar" do Google Maps)
+ menu_view            → engagement (se restaurante)
```

### Sites de serviços (consultoria, advocacia):
```
+ case_study_view      → engagement (clique em case)
+ email_click          → conversion
+ linkedin_click       → engagement
```

### Sites e-commerce (obrigatório quando ecommerce-agent rodou):
```
+ view_item            → Enhanced Ecommerce
+ add_to_cart          → Enhanced Ecommerce
+ begin_checkout       → Enhanced Ecommerce
+ purchase             → Enhanced Ecommerce (conversion automática)
+ remove_from_cart     → engagement
```

---

## Estrutura padrão do dataLayer

```javascript
// Inicialização (primeira linha do <head>, ANTES do GTM)
window.dataLayer = window.dataLayer || [];

// Page view enriquecido (Analytics Agent injeta após GTM)
dataLayer.push({
  event: 'page_view_enriched',
  page_section: '<home | servicos | contato | produto | etc>',
  user_type: '<first_visit | returning>',
  language: 'pt-BR'
});

// Evento custom
dataLayer.push({
  event: 'hero_cta_click',
  cta_label: 'Agendar consulta',
  section: 'hero',
  destination: '#contato'
});

// E-commerce (com array `items` no formato GA4)
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    currency: 'BRL',
    value: 199.90,
    items: [{
      item_id: 'sku-123',
      item_name: 'Nome do Produto',
      price: 199.90,
      quantity: 1,
      item_category: 'Categoria'
    }]
  }
});
```

**Regras:**
- Sempre `currency: 'BRL'` em sites BR
- `value` sempre número, nunca string com vírgula
- `items` sempre array, mesmo com 1 produto
- Não duplicar `event` em pushes próximos — GA4 deduplica mas polui debugger

---

## Convenção de seletores no HTML (WebCraft Agent segue)

Pra que o Analytics Agent mapeie eventos sem ambiguidade, o WebCraft Agent **deve**:

```html
<!-- CTAs principais: data-cta com o nome da seção -->
<button data-cta="hero" class="...">Agendar consulta</button>
<button data-cta="pricing" class="...">Comprar agora</button>
<button data-cta="footer" class="...">Fale conosco</button>

<!-- Forms: id explícito -->
<form id="form-contato">...</form>
<form id="form-newsletter">...</form>

<!-- WhatsApp: href com wa.me -->
<a href="https://wa.me/5511999999999">WhatsApp</a>

<!-- Telefone: href com tel: -->
<a href="tel:+551133334444">(11) 3333-4444</a>

<!-- Links externos sociais: rel="external" pra facilitar tracking -->
<a href="https://instagram.com/xyz" rel="external">Instagram</a>
```

---

## Backend Agent — quando dispara dataLayer

O Backend Agent é responsável por confirmar que o form submit foi bem-sucedido. Padrão:

```javascript
// No frontend (gerado pelo WebCraft Agent)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const r = await fetch('/api/contato', { method: 'POST', body: new FormData(form) });
  if (r.ok) {
    dataLayer.push({
      event: 'form_submit_success',
      form_id: form.id,
      form_destination: '/api/contato'
    });
    // mostrar mensagem de sucesso
  } else {
    dataLayer.push({
      event: 'form_submit_error',
      form_id: form.id,
      error_code: r.status
    });
  }
});
```

---

## E-commerce Agent — eventos por etapa do checkout

```
Página de produto      → view_item
Botão "Adicionar"      → add_to_cart
Página do carrinho     → view_cart
Botão "Finalizar"      → begin_checkout
Página de pagamento    → add_payment_info
Callback success       → purchase (com transaction_id real do gateway)
```

O `transaction_id` deve ser o ID do pagamento no gateway (Mercado Pago `payment_id`, Stripe `pi_xxx`), não um ID gerado pelo site. Evita duplicação de purchase em retry/refresh.

---

## Measurement Protocol (server-side)

Quando o evento acontece sem JS rodando (webhook), use Measurement Protocol:

```javascript
// Worker / Backend Agent dispara após confirmação do webhook
async function trackPurchaseServerSide(transactionId, value, items, clientId) {
  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${env.GA4_MEASUREMENT_ID}&api_secret=${env.GA4_API_SECRET}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      events: [{
        name: 'purchase',
        params: { transaction_id: transactionId, value, currency: 'BRL', items }
      }]
    })
  });
}
```

`client_id` deve ser o mesmo gerado pelo gtag no navegador — Backend Agent salva no momento do `begin_checkout` pra usar no webhook depois.

---

## Validação pelo QA Agent (Camada 4.6)

```
[ ] Bloco GTM presente no <head>
[ ] dataLayer inicializado antes do bloco GTM
[ ] <noscript> fallback do GTM logo após <body>
[ ] Listeners JS injetados (querySelector dos eventos mínimos)
[ ] Measurement ID e Container ID não são placeholders (G-XXXXXXXXXX / GTM-XXXXXXX)
[ ] Comentário LGPD presente OU banner LGPD implementado
[ ] Sem duplicação de gtm.js (apenas 1 carregamento)
[ ] Eventos disparados sem erro no console (smoke test via Playwright/Puppeteer se possível)
```

---

## Anti-patterns proibidos

```
❌ Tracking de mouse movement                     (overhead sem retorno)
❌ Click listener em todos os <a>                 (poluí relatório, mata signal)
❌ Salvar email/telefone no dataLayer             (LGPD)
❌ Disparar `purchase` no frontend antes da confirmação real do gateway
❌ Usar `gtag.js` direto quando o pipeline pede GTM (a TAG GA4 mora dentro do GTM)
❌ Misturar Facebook Pixel sem briefing explícito (impacto LGPD diferente)
❌ Esconder o GTM em iframe pra "ganhar 1 ponto no Lighthouse" (quebra mensuração)
```

---

## Checklist pré-entrega

```
[ ] tracking_plan do Analytics Agent cobre todos os CTAs/forms gerados
[ ] data-cta presente em todos os CTAs principais
[ ] id presente em todos os forms
[ ] dataLayer init + GTM injection no <head> com IDs reais
[ ] noscript fallback presente
[ ] Listeners JS dos eventos custom presentes
[ ] analytics-setup.md gerado pro cliente
[ ] analytics-dashboard.md gerado pro cliente
[ ] alertas[] do output do Analytics Agent revisados pelo orchestrator
[ ] QA Agent aprovou Camada 4.6
```
