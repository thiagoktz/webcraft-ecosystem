# CONNECTOR.md — Gmail

**Status:** ✅ Conectado  
**MCP URL:** https://gmailmcp.googleapis.com/mcp/v1  
**Documentação:** https://developers.google.com/gmail

---

## O que o Gmail faz no ecossistema

Envio de notificações ao cliente e ao time interno em momentos-chave do pipeline — entrega do site, solicitação de revisão, confirmação de deploy.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Feedback Agent** | Notificar cliente quando site está pronto para revisão |
| **Orchestrator** | Confirmar deploy concluído e enviar URL de produção |
| **E-commerce Agent** | Emails transacionais de pedidos (confirmação, envio, cancelamento) |

---

## 1. Feedback Agent — Notificação de entrega

Após o QA Agent aprovar e o deploy ser feito:

```
Feedback Agent envia email ao cliente:
  Para: email do cliente (do client.json)
  Assunto: "Seu site está pronto — [nome da empresa]"
  Corpo: URL de produção + resumo do que foi feito
         + link para dar feedback
```

### Template de email de entrega:
```
Assunto: ✅ [Nome da Empresa] — seu site está no ar

Olá, [Nome]!

Seu site está pronto e no ar em:
[URL de produção]

O que foi feito:
• Textos otimizados para [público-alvo]
• Configurado para aparecer no Google com [palavra-chave]
• Score de qualidade: [QA score]/100
• Testado em celular e desktop

Para dar seu feedback, basta responder este email
ou acessar o link e me contar o que achou.

[Assinatura]
```

---

## 2. E-commerce Agent — Emails transacionais

Para projetos com e-commerce, o Gmail é usado como fallback
quando o cliente não tem serviço de email marketing configurado.

```
Pedido confirmado  → email com resumo do pedido
Pedido enviado     → email com código de rastreamento
Pedido entregue    → email solicitando avaliação
Pagamento recusado → email com instrução para nova tentativa
```

⚠️ **Para volume alto** (mais de 100 emails/dia), usar MailerLite ou SendGrid
em vez do Gmail — evita bloqueio por spam.

---

## 3. Ferramentas MCP disponíveis

| Tool | O que faz |
|---|---|
| `search_threads` | Busca emails por assunto, remetente ou conteúdo |
| `get_thread` | Lê thread completa (útil para ver resposta do cliente) |
| `create_draft` | Cria rascunho para revisão antes de enviar |
| `list_drafts` | Lista rascunhos pendentes |
| `create_label` | Organiza emails por cliente ou projeto |
| `label_thread` | Aplica label a uma thread |

---

## 4. Padrão de uso no Feedback Agent

```javascript
// 1. Criar rascunho do email de entrega
const draft = await gmail.create_draft({
  to: client.email_contato,
  subject: `✅ ${client.empresa} — seu site está no ar`,
  body: gerarCorpoEmail(client, deployUrl, qaScore)
});

// 2. Revisar o rascunho antes de enviar (opcional)
// O Orchestrator pode apresentar o rascunho para aprovação

// 3. Buscar resposta do cliente após alguns dias
const threads = await gmail.search_threads({
  query: `from:${client.email_contato} subject:${client.empresa}`
});
```

---

## 5. Labels recomendados por projeto

```
WebCraft/[empresa]/entrega      → email de entrega do site
WebCraft/[empresa]/revisao      → pedidos de revisão
WebCraft/[empresa]/feedback     → feedback recebido
WebCraft/[empresa]/transacional → emails de e-commerce
```

---

## Checklist de integração

- [ ] Email do cliente registrado no client.json (campo `email_contato`)
- [ ] Template de email de entrega revisado antes do primeiro envio
- [ ] Labels criados para organizar por cliente
- [ ] Para e-commerce: decidir entre Gmail (volume baixo) ou MailerLite (volume alto)
- [ ] Nunca enviar emails em produção sem aprovação do cliente
