# EVALS — Feedback Agent
**Critérios:** 14 | **Mínimo:** 12 (80%)

---

## FEEDBACK-01 — Classificação correta de feedback visual

**Input:**
```json
{
  "modo": "entrega",
  "feedback_bruto": "Ficou bom mas está muito colorido e a fonte parece pesada demais."
}
```

**Critérios:**
- [ ] Classifica como categoria `visual`
- [ ] Identifica `design-agent` e `webcraft-agent` como responsáveis
- [ ] Gera ação recomendada específica (reduzir saturação, ajustar peso tipográfico)
- [ ] Não classifica como `conteudo` ou `funcional`
- [ ] Severidade adequada (`importante` — não `bloqueante`)

---

## FEEDBACK-02 — Classificação de feedback funcional

**Input:**
```json
{
  "modo": "entrega",
  "feedback_bruto": "O formulário de contato não está enviando. Também o menu mobile não fecha depois de clicar."
}
```

**Critérios:**
- [ ] Classifica como categoria `funcional`
- [ ] Identifica 2 issues separados (formulário + menu)
- [ ] Agente responsável: `webcraft-agent` para ambos
- [ ] Severidade `bloqueante` (funcionalidade quebrada)
- [ ] Ação recomendada técnica e específica para cada issue

---

## FEEDBACK-03 — Análise de padrão de ecossistema

**Input:**
```json
{
  "modo": "ecossistema",
  "logs_feedback": [
    { "categoria": "visual", "descricao": "contraste insuficiente" },
    { "categoria": "visual", "descricao": "contraste muito baixo no mobile" },
    { "categoria": "visual", "descricao": "texto difícil de ler no fundo escuro" },
    { "categoria": "conteudo", "descricao": "CTA genérico demais" },
    { "categoria": "conteudo", "descricao": "botão diz apenas Enviar" }
  ]
}
```

**Critérios:**
- [ ] Detecta padrão "contraste" como recorrente (alta frequência)
- [ ] Aponta `design-agent/token-system` como skill a atualizar
- [ ] Detecta padrão "CTA genérico" como médio
- [ ] Aponta `copy-agent/cta` como skill a atualizar
- [ ] Sugere novos casos de teste para EVALS

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| FEEDBACK-01 | — | — | — |
| FEEDBACK-02 | — | — | — |
| FEEDBACK-03 | — | — | — |

---

---

# EVALS — Memory Agent
**Critérios:** 14 | **Mínimo:** 12 (80%)

---

## MEMORY-01 — Recuperação de contexto existente

**Input:**
```json
{
  "operacao": "memory.get",
  "client_id": "marcos-techstart"
}
```
*(contexto previamente salvo com marca, preferências e histórico)*

**Critérios:**
- [ ] Retorna contexto completo do cliente
- [ ] Inclui dados de marca (cores, fontes)
- [ ] Inclui preferências de comunicação e stack
- [ ] Inclui histórico de projetos com status
- [ ] Gera resumo de boas-vindas em linguagem natural

---

## MEMORY-02 — Alimentação do contexto para agentes

**Contexto:** cliente retornando após projeto anterior.

**Critérios:**
- [ ] Design Agent recebe marca e design brief anterior
- [ ] Copy Agent recebe guia de voz e exemplos aprovados
- [ ] WebCraft Agent recebe stack preferida e feedback recorrente
- [ ] Nenhum agente recebe contexto de outro cliente
- [ ] Instrução "manter consistência com projetos anteriores" está presente

---

## MEMORY-03 — Atualização após projeto concluído

**Input:**
```json
{
  "operacao": "memory.update_project",
  "client_id": "marcos-techstart",
  "projeto_id": "proj_001",
  "updates": {
    "status": "entregue",
    "iteracoes": 2,
    "qa_score": 91,
    "feedback_historico": ["gostou das animações sutis", "prefere menos texto no hero"]
  }
}
```

**Critérios:**
- [ ] Status atualizado para "entregue"
- [ ] Iterações registradas corretamente
- [ ] Feedback histórico salvo e acessível em próximas sessões
- [ ] `ultima_sessao` atualizado com timestamp atual
- [ ] `total_projetos` incrementado

---

## MEMORY-04 — Cliente novo (inicialização)

**Input:** `client_id` inexistente no sistema.

**Critérios:**
- [ ] Cria novo perfil sem erro
- [ ] Informa Orchestrator que é primeiro projeto do cliente
- [ ] Não inventa histórico que não existe
- [ ] Solicita informações básicas de marca antes de prosseguir

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| MEMORY-01 | — | — | — |
| MEMORY-02 | — | — | — |
| MEMORY-03 | — | — | — |
| MEMORY-04 | — | — | — |
