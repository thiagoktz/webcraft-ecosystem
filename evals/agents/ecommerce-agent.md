# EVALS — E-commerce Agent
**Critérios:** 20 | **Mínimo:** 16 (80%)

---

## ECOMMERCE-01 — Integração Mercado Pago com PIX

**Input:**
```json
{
  "gateway": ["mercadopago"],
  "features": ["pix", "boleto", "credito"],
  "order_schema": { "id": "uuid", "total": "numeric", "email": "string" }
}
```

**Critérios:**
- [ ] Output JSON válido com `endpoints`, `env_vars`, `webhook_urls`
- [ ] Endpoint `POST /checkout/create-session` presente
- [ ] Endpoint `POST /webhooks/mercadopago` presente
- [ ] `env_vars` lista `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET`
- [ ] PIX retorna `qr_code` e `qr_code_base64`
- [ ] `external_reference` usa o `order.id` para rastreabilidade

---

## ECOMMERCE-02 — Webhook com idempotência

**Critérios:**
- [ ] Verifica assinatura antes de processar
- [ ] Verifica se `payment_id` já foi processado (tabela `payment_events`)
- [ ] Retorna 200 para eventos duplicados sem reprocessar
- [ ] Atualiza status do pedido para `paid` após confirmação
- [ ] Reduz estoque após pagamento (não antes)
- [ ] Dispara email de confirmação após pagamento aprovado

---

## ECOMMERCE-03 — Segurança financeira

**Critérios:**
- [ ] Total calculado no backend — nunca confia no frontend
- [ ] Valores em centavos internamente (sem float para dinheiro)
- [ ] Conversão correta por gateway (MP: reais, Stripe/PS: centavos)
- [ ] Nenhum dado de cartão logado ou armazenado
- [ ] Chaves de API nunca em código client-side
- [ ] Ambiente test/production declarado separadamente
- [ ] webhook_urls usa HTTPS obrigatoriamente
- [ ] Checklist de go-live presente no output

---

## ECOMMERCE-04 — Multi-gateway

**Input:** gateway: ["stripe", "mercadopago", "pagseguro"]

**Critérios:**
- [ ] Os 3 gateways documentados ou implementados
- [ ] Gateway principal destacado
- [ ] Endpoint de webhook separado por gateway
- [ ] Fallback documentado caso gateway principal falhe
- [ ] Instruções de onde obter cada chave de API
- [ ] Ambiente de teste para cada gateway documentado

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| ECOMMERCE-01 | — | — | — |
| ECOMMERCE-02 | — | — | — |
| ECOMMERCE-03 | — | — | — |
| ECOMMERCE-04 | — | — | — |
