# Infra: Logging Estruturado

## Formato padrão de log

Todo agente registra eventos neste formato:

```json
{
  "timestamp": "2026-05-23T14:32:00Z",
  "session_id": "sess_abc123",
  "pipeline": "site-completo",
  "agent": "copy-agent",
  "event": "task_completed | task_failed | task_started | fallback_activated",
  "duration_ms": 4200,
  "input_tokens": 850,
  "output_tokens": 1200,
  "status": "success | error | fallback",
  "error_code": null,
  "metadata": {
    "client_id": "marcos-techstart",
    "project_id": "proj_xyz",
    "iteration": 1
  }
}
```

---

## Implementação (JavaScript)

```javascript
class Logger {
  constructor(sessionId, pipeline) {
    this.sessionId = sessionId;
    this.pipeline = pipeline;
    this.logs = [];
  }

  log(agent, event, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      pipeline: this.pipeline,
      agent,
      event,
      ...data
    };
    this.logs.push(entry);
    console.log(`[${agent}] ${event}`, data.status || '');
    return entry;
  }

  start(agent, input) {
    return this.log(agent, 'task_started', {
      status: 'running',
      input_size: JSON.stringify(input).length
    });
  }

  complete(agent, duration, tokens = {}) {
    return this.log(agent, 'task_completed', {
      status: 'success',
      duration_ms: duration,
      input_tokens: tokens.input || 0,
      output_tokens: tokens.output || 0
    });
  }

  fail(agent, error) {
    return this.log(agent, 'task_failed', {
      status: 'error',
      error_code: error.code || 'E000',
      error_message: error.message
    });
  }

  fallback(agent, reason) {
    return this.log(agent, 'fallback_activated', {
      status: 'fallback',
      reason
    });
  }

  exportSession() {
    return {
      session_id: this.sessionId,
      pipeline: this.pipeline,
      total_duration_ms: this.logs.reduce((acc, l) => acc + (l.duration_ms || 0), 0),
      total_agents: new Set(this.logs.map(l => l.agent)).size,
      errors: this.logs.filter(l => l.status === 'error').length,
      fallbacks: this.logs.filter(l => l.status === 'fallback').length,
      logs: this.logs
    };
  }
}
```

---

## Retenção e uso

- Logs de sessão: mantidos durante a sessão ativa
- Logs de projeto: salvos pelo Memory Agent por projeto
- Logs de erro: sempre persistidos para análise do Feedback Agent
- Dashboard: agrega logs para visibilidade operacional
