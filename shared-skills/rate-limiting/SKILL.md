---
name: rate-limiting
description: Use este skill no Orchestrator para controlar o consumo de chamadas à API da Anthropic e entre agentes. Evita pipelines runaway, custos inesperados e degradação de serviço.
---

# Skill: Rate Limiting — Controle de Consumo entre Agentes

---

## 1. Limites por pipeline

| Pipeline | Chamadas máx. à API | Timeout total | Custo estimado |
|---|---|---|---|
| `site-rapido` | 3 | 2 min | ~$0.05 |
| `site-completo` | 8 | 8 min | ~$0.20 |
| `redesign-textos` | 5 | 5 min | ~$0.12 |
| `auditoria-seo` | 2 | 1 min | ~$0.03 |

---

## 2. Implementação de rate limiting

```javascript
class RateLimiter {
  constructor(maxCalls, windowMs) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = [];
  }

  async throttle(fn) {
    const agora = Date.now();

    // Remover chamadas fora da janela
    this.calls = this.calls.filter(t => agora - t < this.windowMs);

    if (this.calls.length >= this.maxCalls) {
      const espera = this.windowMs - (agora - this.calls[0]);
      console.log(`[RateLimit] Aguardando ${Math.ceil(espera/1000)}s...`);
      await new Promise(r => setTimeout(r, espera));
    }

    this.calls.push(Date.now());
    return fn();
  }
}

// Instância global do orquestrador
const limiter = new RateLimiter(
  10,          // máx 10 chamadas
  60 * 1000    // por minuto
);

// Uso
const output = await limiter.throttle(() => chamarAgente('copy-agent', input));
```

---

## 3. Circuit breaker (evitar falhas em cascata)

```javascript
class CircuitBreaker {
  constructor(threshold = 3, timeout = 30000) {
    this.threshold = threshold;   // falhas antes de abrir
    this.timeout = timeout;       // tempo antes de tentar novamente
    this.failures = 0;
    this.state = 'CLOSED';        // CLOSED | OPEN | HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit OPEN — agente temporariamente indisponível');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.error(`[CircuitBreaker] ABERTO — próxima tentativa em ${this.timeout/1000}s`);
    }
  }
}

// Um circuit breaker por agente
const breakers = {
  'copy-agent': new CircuitBreaker(),
  'seo-agent': new CircuitBreaker(),
  'design-agent': new CircuitBreaker()
};
```

---

## 4. Checklist de rate limiting

- [ ] Limite de chamadas definido por pipeline
- [ ] Timeout global configurado por pipeline
- [ ] Rate limiter ativo no Orchestrator
- [ ] Circuit breaker por agente
- [ ] Log de consumo registrado a cada chamada
- [ ] Alerta ao usuário quando pipeline demora mais que o esperado
- [ ] Estimativa de custo exibida antes de pipelines longos (opcional)
