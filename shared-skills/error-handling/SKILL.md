---
name: error-handling
description: Use este skill em todos os agentes do ecossistema WebCraft. Define o padrão de tratamento de erros, formato de mensagens de erro e comportamento de fallback para garantir que nenhuma falha resulte em silêncio ou comportamento indefinido.
---

# Skill: Error Handling — Tratamento Padronizado de Erros

Este skill garante que todos os agentes falhem de forma previsível, comunicativa e recuperável.

---

## Princípio central

> **Falha ruidosa é melhor que falha silenciosa.**
> Um erro bem reportado pode ser corrigido. Um erro ignorado vira bug em produção.

---

## 1. Categorias de Erro

| Código | Categoria | Exemplos |
|---|---|---|
| `E001` | Input inválido | Brief vazio, JSON malformado, campo obrigatório ausente |
| `E002` | Agente indisponível | Timeout, falha de comunicação entre agentes |
| `E003` | Output inválido | JSON não conforme ao schema, campo obrigatório ausente no output |
| `E004` | Limite atingido | Máximo de iterações, tamanho de contexto excedido |
| `E005` | Fora do escopo | Pedido que o agente não suporta |
| `E006` | Falha de validação | QA Agent rejeitou o output |
| `E007` | Recurso não encontrado | URL inválida, arquivo não encontrado |
| `E008` | Erro de segurança | Input com potencial XSS, dados sensíveis detectados |

---

## 2. Formato Padrão de Erro (JSON)

Todo agente que falha deve retornar:

```json
{
  "status": "error",
  "error": {
    "code": "E001",
    "category": "input_invalido",
    "message": "string — descrição técnica do erro",
    "user_message": "string — mensagem adequada ao perfil do usuário",
    "agent": "nome-do-agente",
    "timestamp": "ISO 8601",
    "recoverable": true,
    "suggested_action": "string — o que fazer para resolver",
    "fallback_available": true,
    "fallback_description": "string — o que o fallback fará"
  }
}
```

---

## 3. Comportamento por Severidade

### Crítico (bloqueia pipeline):
- `E001` sem fallback, `E003`, `E006`, `E008`
- **Ação:** parar pipeline, reportar ao Orchestrator, notificar usuário
- **Nunca:** continuar silenciosamente

### Recuperável (tenta fallback):
- `E001` com fallback, `E002`, `E004`, `E007`
- **Ação:** tentar fallback, registrar tentativa, continuar pipeline se fallback OK
- **Máximo:** 2 tentativas antes de escalar para crítico

### Informativo (registra, continua):
- `E005`
- **Ação:** registrar no log, informar usuário, continuar com escopo reduzido

---

## 4. Fallbacks por Agente

### Design Agent falha:
```json
// Fallback: usar design tokens padrão por segmento
{
  "fallback": "design_padrao_saude",
  "aviso": "Design Agent indisponível — usando tokens padrão para o segmento. Revise as cores após a entrega."
}
```

### Copy Agent falha:
```json
// Fallback: WebCraft gera textos placeholder descritivos
{
  "fallback": "textos_placeholder",
  "aviso": "Copy Agent indisponível — textos placeholder gerados. Substitua antes de publicar."
}
```

### SEO Agent falha:
```json
// Fallback: WebCraft usa skill SEO próprio
{
  "fallback": "seo_basico_interno",
  "aviso": "SEO Agent indisponível — meta tags básicas geradas. Revisão de palavras-chave recomendada."
}
```

### Content Agent falha:
```json
// Fallback: usar placeholders do placehold.co
{
  "fallback": "placeholders_genericos",
  "aviso": "Content Agent indisponível — imagens placeholder usadas. Substitua com imagens reais antes de publicar."
}
```

### QA Agent falha:
```json
// Fallback: entregar com aviso, sem validação
{
  "fallback": "entrega_sem_validacao",
  "aviso": "⚠️ QA Agent indisponível — output não validado. Recomendamos revisão manual antes do deploy."
}
```

---

## 5. Mensagens de Erro por Perfil de Usuário

### Para Dev:
```
[E002] Timeout ao chamar Copy Agent após 30s.
Tentativa 1/2 em andamento...
Fallback: textos placeholder ativado.
```

### Para PM/Designer:
```
⚠️ Um dos nossos agentes de texto está demorando mais que o esperado.
Vamos continuar com textos provisórios que você pode ajustar depois — ok?
```

---

## 6. Template de Try/Catch para Agentes

```javascript
async function executarAgente(agente, input) {
  const MAX_TENTATIVAS = 2;
  let tentativa = 0;

  while (tentativa < MAX_TENTATIVAS) {
    try {
      const output = await agente.executar(input);
      validarOutput(output, agente.schema); // lança se inválido
      return { status: 'success', output };

    } catch (error) {
      tentativa++;

      const erroEstruturado = {
        status: 'error',
        error: {
          code: classificarErro(error),
          message: error.message,
          agent: agente.id,
          timestamp: new Date().toISOString(),
          recoverable: tentativa < MAX_TENTATIVAS,
          suggested_action: sugerirAcao(error)
        }
      };

      registrarLog(erroEstruturado);

      if (tentativa >= MAX_TENTATIVAS) {
        const fallback = await executarFallback(agente.id, input);
        return { status: 'fallback', output: fallback, error: erroEstruturado };
      }

      await esperar(1000 * tentativa); // backoff exponencial
    }
  }
}
```

---

## 7. Checklist de Error Handling

- [ ] Todo agente retorna `{ status: 'error' | 'success' | 'fallback' }`
- [ ] Erros sempre incluem `code`, `message`, `agent` e `timestamp`
- [ ] Fallback definido para cada agente
- [ ] Mensagens de erro adaptadas ao perfil do usuário
- [ ] Máximo de tentativas definido (padrão: 2)
- [ ] Backoff implementado entre tentativas
- [ ] Log registrado em toda falha
- [ ] Nunca retornar `undefined` ou objeto vazio em caso de erro
