---
name: payments
description: Use este skill em qualquer agente que precise entender o contexto de pagamento de um projeto. Define quando usar cada gateway, estrutura de dados de pedido, tratamento de erros e boas práticas compartilhadas entre E-commerce Agent e Backend Agent.
---

# Skill: Payments — Padrões Compartilhados de Pagamento

---

## Quando usar cada gateway

| Situação | Gateway recomendado | Por quê |
|---|---|---|
| Público 100% brasileiro, PIX prioritário | Mercado Pago | Melhor suporte a PIX, boleto e parcelamento local |
| Produto internacional ou SaaS | Stripe | Melhor DX, webhooks mais confiáveis, suporte a 135+ moedas |
| Cliente sem conta bancária / MEI | PagSeguro | Aceita sem conta em banco, saque facilitado |
| Múltiplos países | Stripe | Único gateway que cobre todos os cenários |
| Assinatura recorrente | Stripe | Melhor suporte a subscription management |

---

## Estrutura interna de um pedido

```typescript
interface Order {
  id: string;              // UUID — referência universal
  user_id: string;         // quem comprou
  status: OrderStatus;     // estado atual
  subtotal: number;        // em centavos
  desconto: number;        // em centavos
  frete: number;           // em centavos
  total: number;           // em centavos (subtotal - desconto + frete)
  gateway: Gateway;        // qual gateway processou
  gateway_id: string;      // ID do pagamento no gateway
  gateway_status: string;  // status raw do gateway
  items: OrderItem[];
  endereco: Address;
  criado_em: Date;
}

type OrderStatus =
  | 'pending'       // aguardando pagamento
  | 'paid'          // pago e confirmado
  | 'processing'    // sendo preparado
  | 'shipped'       // enviado
  | 'delivered'     // entregue
  | 'cancelled'     // cancelado
  | 'refunded';     // estornado

type Gateway = 'stripe' | 'mercadopago' | 'pagseguro';
```

---

## Regra de ouro: valores em centavos

```typescript
// ❌ NUNCA faça aritmética em reais
const total = 29.90 + 5.10; // → 35.000000000000004 (bug!)

// ✅ SEMPRE em centavos internamente
const subtotalCentavos = 2990;
const freteCentavos = 510;
const totalCentavos = subtotalCentavos + freteCentavos; // → 3500

// Exibir para o usuário:
const formatarReais = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Enviar para o gateway:
// Stripe: já espera centavos → enviar 3500
// Mercado Pago: espera reais → enviar 35.00
// PagSeguro: espera centavos → enviar 3500
```

---

## Idempotência em webhooks

```typescript
// Tabela de eventos processados (evita duplicação)
CREATE TABLE payment_events (
  gateway_event_id  TEXT PRIMARY KEY,  -- ID único do evento no gateway
  gateway           TEXT NOT NULL,
  event_type        TEXT NOT NULL,
  order_id          TEXT,
  processado_em     TIMESTAMPTZ DEFAULT NOW()
);

// Verificar antes de processar
async function isAlreadyProcessed(gatewayEventId: string): Promise<boolean> {
  const { data } = await supabase
    .from('payment_events')
    .select('gateway_event_id')
    .eq('gateway_event_id', gatewayEventId)
    .single();
  return !!data;
}

// No handler do webhook:
const eventId = event.id; // ID único do evento
if (await isAlreadyProcessed(eventId)) {
  return c.json({ received: true, duplicate: true }); // ignorar silenciosamente
}
// ... processar ...
await logPaymentEvent(eventId, gateway, eventType, orderId);
```

---

## Tratamento de erros por categoria

| Erro | Causa | Ação |
|---|---|---|
| `card_declined` | Cartão recusado | Informar usuário, sugerir outro método |
| `insufficient_funds` | Saldo insuficiente | Informar usuário |
| `expired_card` | Cartão vencido | Solicitar atualização |
| `invalid_signature` | Webhook adulterado | Rejeitar com 400, logar alerta |
| `gateway_timeout` | Gateway fora do ar | Retry com backoff, notificar admin |
| `duplicate_order` | Webhook duplicado | Ignorar silenciosamente (200) |

---

## Emails transacionais obrigatórios

| Evento | Email enviado |
|---|---|
| Pagamento aprovado | Confirmação com resumo do pedido |
| Pedido enviado | Código de rastreamento |
| Pedido entregue | Solicitação de avaliação |
| Pagamento recusado | Orientação para nova tentativa |
| Reembolso processado | Confirmação de estorno |

---

## Checklist de pagamentos

- [ ] Gateway escolhido baseado no perfil do cliente
- [ ] Valores internos em centavos
- [ ] Conversão correta ao enviar para cada gateway
- [ ] Webhook com validação de assinatura
- [ ] Idempotência implementada (tabela payment_events)
- [ ] Emails transacionais configurados
- [ ] Ambiente de teste separado do produção
- [ ] Chaves nunca no código ou no git
- [ ] Tratamento de todos os status de erro relevantes
- [ ] Logs sem dados sensíveis de cartão
