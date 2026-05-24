# EVALS — Shared Skills
**Critérios:** 20 | **Mínimo:** 16 (80%)

---

## SS-01 — error-handling: fallback ativado corretamente

**Cenário:** Copy Agent retorna erro após 2 tentativas.

**Critérios:**
- [ ] Erro retornado com `code`, `message`, `agent` e `timestamp`
- [ ] `recoverable: false` após 2 tentativas
- [ ] Fallback ativado automaticamente (textos placeholder)
- [ ] Mensagem ao usuário PM em linguagem simples (não técnica)
- [ ] Mensagem ao usuário Dev com código de erro e detalhe técnico
- [ ] Log registrado com todos os campos obrigatórios

---

## SS-02 — output-validation: schema enforced

**Cenário:** Copy Agent retorna output com `meta.title` de 35 chars (abaixo do mínimo de 50).

**Critérios:**
- [ ] Validação detecta o campo fora do limite
- [ ] Erro categorizado como `E003` (output inválido)
- [ ] Orchestrator não passa o output defeituoso ao WebCraft Agent
- [ ] Agente é re-executado com instrução específica de correção
- [ ] Após correção, validação passa sem erro

---

## SS-03 — security: XSS prevenido

**Cenário:** formulário de contato gerado pelo WebCraft Agent.

**Critérios:**
- [ ] Nenhum `innerHTML` com input de usuário sem sanitização
- [ ] Honeypot presente no formulário
- [ ] Links externos com `rel="noopener noreferrer"`
- [ ] Sem `eval()` no JavaScript
- [ ] Sem API keys hardcoded no código

---

## SS-04 — forms-backend: estados implementados

**Cenário:** WebCraft Agent gera formulário com Netlify Forms.

**Critérios:**
- [ ] Estado `loading` implementado (botão desabilitado durante envio)
- [ ] Estado `success` implementado (mensagem de confirmação)
- [ ] Estado `error` implementado (mensagem de erro com instrução)
- [ ] `aria-busy` no botão durante loading (acessibilidade)
- [ ] Mensagem de sucesso com `focus()` (acessibilidade)

---

## SS-05 — rate-limiting: circuit breaker funciona

**Cenário:** agente falha 3 vezes consecutivas.

**Critérios:**
- [ ] Circuit breaker abre após 3 falhas
- [ ] Novas chamadas ao agente bloqueadas enquanto aberto
- [ ] Usuário notificado que agente está temporariamente indisponível
- [ ] Circuit fecha após timeout configurado
- [ ] Log registrado em cada falha e na abertura do circuit

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| SS-01 | — | — | — |
| SS-02 | — | — | — |
| SS-03 | — | — | — |
| SS-04 | — | — | — |
| SS-05 | — | — | — |
