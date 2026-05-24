---
name: payment-gateway
description: Use este skill no E-commerce Agent para implementar integração com Stripe, Mercado Pago ou PagSeguro. Cobre criação de sessão de pagamento, webhooks, PIX, boleto e parcelamento.
---

# Skill: Payment Gateway — Stripe, Mercado Pago e PagSeguro

---

## Princípios de segurança (valem para todos os gateways)

```
1. Pagamento SEMPRE processado no backend — nunca no browser
2. Webhook SEMPRE validado com assinatura antes de processar
3. Valores SEMPRE em centavos internamente (R$29,90 = 2990)
4. Idempotência: processar o mesmo webhook duas vezes = mesmo resultado
5. Logs: NUNCA logar número de cartão, CVV ou dados sensíveis
6. Ambiente: test keys em dev, live keys em produção — nunca misturar
```

---

## GATEWAY 1 — Mercado Pago (recomendado para Brasil)

### Instalação:
```bash
npm install mercadopago
```

### Configuração:
```typescript
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 }
});
```

### Criar preferência (checkout MP):
```typescript
// POST /checkout/mercadopago
export async function createMPPreference(order: Order, items: OrderItem[]) {
  const preference = new Preference(mp);

  const result = await preference.create({
    body: {
      items: items.map(item => ({
        id: item.product_id,
        title: item.nome,
        quantity: item.quantidade,
        unit_price: Number(item.preco), // em reais (MP aceita reais)
        currency_id: 'BRL'
      })),
      payer: {
        email: order.email,
        name: order.nome
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12 // máximo de parcelas
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pedido/${order.id}/sucesso`,
        failure: `${process.env.FRONTEND_URL}/pedido/${order.id}/falha`,
        pending: `${process.env.FRONTEND_URL}/pedido/${order.id}/pendente`
      },
      auto_return: 'approved',
      notification_url: `${process.env.API_URL}/webhooks/mercadopago`,
      external_reference: order.id,
      statement_descriptor: 'MINHA LOJA'
    }
  });

  return {
    init_point: result.init_point,      // URL de checkout (produção)
    sandbox_init_point: result.sandbox_init_point, // URL de teste
    preference_id: result.id
  };
}
```

### PIX via Mercado Pago:
```typescript
export async function createMPPix(order: Order) {
  const payment = new Payment(mp);

  const result = await payment.create({
    body: {
      transaction_amount: Number(order.total),
      payment_method_id: 'pix',
      payer: {
        email: order.email,
        first_name: order.nome.split(' ')[0],
        last_name: order.nome.split(' ').slice(1).join(' '),
        identification: {
          type: 'CPF',
          number: order.cpf
        }
      },
      description: `Pedido #${order.id}`,
      external_reference: order.id
    }
  });

  return {
    qr_code: result.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    ticket_url: result.point_of_interaction?.transaction_data?.ticket_url,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
  };
}
```

### Webhook Mercado Pago:
```typescript
// POST /webhooks/mercadopago
export async function handleMPWebhook(c: Context) {
  const body = await c.req.json();

  // Validar assinatura
  const xSignature = c.req.header('x-signature');
  const xRequestId = c.req.header('x-request-id');
  // Validação conforme docs do MP...

  if (body.type === 'payment') {
    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: body.data.id });

    const orderId = paymentData.external_reference;
    const status = paymentData.status; // approved, pending, rejected

    await updateOrderStatus(orderId, status === 'approved' ? 'paid' : status);

    // Idempotência: verificar se já processamos este payment_id
    await logPaymentEvent(paymentData.id, status, orderId);
  }

  return c.json({ received: true });
}
```

---

## GATEWAY 2 — Stripe (internacional + PIX)

### Instalação:
```bash
npm install stripe
```

### Configuração:
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});
```

### Criar Payment Intent:
```typescript
// POST /checkout/stripe
export async function createStripeIntent(order: Order, items: OrderItem[]) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100), // em centavos
    currency: 'brl',
    payment_method_types: ['card', 'pix', 'boleto'],
    metadata: {
      order_id: order.id,
      cliente_email: order.email
    },
    description: `Pedido #${order.id} — ${order.email}`,
    receipt_email: order.email
  });

  return {
    client_secret: paymentIntent.client_secret, // enviado ao frontend
    payment_intent_id: paymentIntent.id
  };
}
```

### PIX via Stripe:
```typescript
export async function createStripePix(order: Order) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: 'brl',
    payment_method_types: ['pix'],
    payment_method_data: { type: 'pix' },
    confirm: true,
    metadata: { order_id: order.id }
  });

  const pixDisplay = paymentIntent.next_action?.pix_display_qr_code;
  return {
    qr_code: pixDisplay?.data,
    qr_code_image_url: pixDisplay?.image_url_png,
    expires_at: new Date(pixDisplay?.expires_at! * 1000).toISOString()
  };
}
```

### Webhook Stripe:
```typescript
// POST /webhooks/stripe
export async function handleStripeWebhook(c: Context) {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return c.json({ error: 'Assinatura inválida' }, 400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const intent = event.data.object as Stripe.PaymentIntent;
      await updateOrderStatus(intent.metadata.order_id, 'paid');
      await sendConfirmationEmail(intent.metadata.order_id);
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      await updateOrderStatus(failedIntent.metadata.order_id, 'payment_failed');
      break;
  }

  return c.json({ received: true });
}
```

### Frontend — Stripe Elements:
```html
<!-- Incluir Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<div id="payment-element"></div>
<button id="pay-btn">Pagar agora</button>

<script>
const stripe = Stripe('pk_live_...'); // chave pública — pode ir no frontend

// 1. Criar Payment Intent no backend
const { client_secret } = await fetch('/checkout/stripe', {
  method: 'POST',
  body: JSON.stringify({ order_id: currentOrderId })
}).then(r => r.json());

// 2. Montar formulário de pagamento
const elements = stripe.elements({ clientSecret: client_secret });
const paymentElement = elements.create('payment');
paymentElement.mount('#payment-element');

// 3. Confirmar pagamento
document.getElementById('pay-btn').addEventListener('click', async () => {
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: `${window.location.origin}/pedido/sucesso` }
  });
  if (error) alert(error.message);
});
</script>
```

---

## GATEWAY 3 — PagSeguro

### Configuração:
```typescript
const PAGSEGURO_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.pagseguro.com'
  : 'https://sandbox.api.pagseguro.com';

const PS_HEADERS = {
  'Authorization': `Bearer ${process.env.PAGSEGURO_TOKEN}`,
  'Content-Type': 'application/json'
};
```

### Criar cobrança PIX:
```typescript
export async function createPagSeguroPix(order: Order) {
  const response = await fetch(`${PAGSEGURO_BASE}/charges`, {
    method: 'POST',
    headers: PS_HEADERS,
    body: JSON.stringify({
      reference_id: order.id,
      description: `Pedido #${order.id}`,
      amount: {
        value: Math.round(Number(order.total) * 100), // centavos
        currency: 'BRL'
      },
      payment_method: {
        type: 'PIX',
        installments: 1,
        capture: true
      },
      notification_urls: [`${process.env.API_URL}/webhooks/pagseguro`]
    })
  });

  const data = await response.json();
  return {
    charge_id: data.id,
    qr_code: data.payment_method?.qr_codes?.[0]?.text,
    qr_code_image: data.payment_method?.qr_codes?.[0]?.links?.[0]?.href,
    expires_at: data.payment_method?.qr_codes?.[0]?.expiration_date
  };
}
```

### Webhook PagSeguro:
```typescript
// POST /webhooks/pagseguro
export async function handlePagSeguroWebhook(c: Context) {
  const body = await c.req.json();

  // Validar token
  const token = c.req.header('x-pagseguro-signature');
  // validação...

  if (body.charges) {
    for (const charge of body.charges) {
      if (charge.status === 'PAID') {
        await updateOrderStatus(charge.reference_id, 'paid');
      }
    }
  }

  return c.json({ received: true });
}
```

---

## Ambiente de teste vs. produção

| Gateway | Chave de teste | Como testar |
|---|---|---|
| Stripe | `pk_test_...` / `sk_test_...` | Cartão: 4242 4242 4242 4242 |
| Mercado Pago | Token de teste no painel | Usuários de teste no painel MP |
| PagSeguro | Token sandbox | Painel sandbox.pagseguro.com |

⚠️ **Nunca use chaves de produção em ambiente de desenvolvimento.**

---

## Checklist de pagamento

- [ ] Chaves de teste configuradas em `.env.development`
- [ ] Chaves de produção configuradas apenas no servidor (nunca no git)
- [ ] Webhook configurado no painel do gateway
- [ ] Webhook validado com assinatura antes de processar
- [ ] Idempotência implementada (não duplicar pedido se webhook chegar duas vezes)
- [ ] Valores sempre calculados no backend (nunca confiar no frontend)
- [ ] Estoque atualizado após confirmação de pagamento (não antes)
- [ ] E-mail de confirmação enviado após pagamento aprovado
- [ ] Logs de pagamento sem dados sensíveis
- [ ] Fluxo de erro tratado (pagamento recusado, expirado, cancelado)
