# EVALS — Orchestrator
**Critérios:** 16 | **Mínimo:** 13 (80%)

---

## ORCH-01 — Seleção de pipeline

**Input:**
```
Quero um site completo para minha consultoria jurídica. Sem pressa, quero o melhor resultado possível.
```

**Critérios:**
- [ ] Seleciona pipeline `site-completo` ou `site-premium`
- [ ] Não seleciona `site-rapido` (usuário não indicou urgência)
- [ ] Informa ao usuário qual pipeline será executado
- [ ] Estima tempo de execução antes de começar
- [ ] Detecta perfil PM/Designer (sem menção a tecnologia)

---

## ORCH-02 — Detecção de urgência

**Input:**
```
Me faz um rascunho rápido de landing page pra eu mostrar pro cliente hoje.
```

**Critérios:**
- [ ] Seleciona `site-rapido`
- [ ] Não aciona SEO Agent ou Copy Agent desnecessariamente
- [ ] Comunica que é uma versão inicial, não final
- [ ] Entrega sem fazer perguntas desnecessárias

---

## ORCH-03 — Decomposição de tarefa e sequenciamento

**Input:**
```
Cria um site para uma escola de inglês chamada Speak Up em Campinas. Público: adultos 25-45 anos. Tom profissional mas acolhedor.
```

**Critérios:**
- [ ] Aciona agentes na ordem correta (SEO → Copy → WebCraft ou Design → SEO → Copy → WebCraft)
- [ ] Passa output do SEO Agent como input do Copy Agent
- [ ] Passa outputs combinados (SEO + Copy) para o WebCraft Agent
- [ ] Atualiza usuário a cada etapa concluída ("✅ SEO Agent concluído...")
- [ ] Aciona QA Agent após WebCraft Agent

---

## ORCH-04 — Fallback de agente

**Contexto:** Copy Agent falha após 2 tentativas.

**Critérios:**
- [ ] Não paralisa o pipeline
- [ ] Ativa fallback (WebCraft gera textos placeholder)
- [ ] Informa o usuário sobre o fallback de forma clara
- [ ] Continua pipeline com o fallback ativado
- [ ] Registra falha no log

---

## ORCH-05 — Integração de outputs

**Critérios (verificar no output final):**
- [ ] Meta tags do SEO Agent presentes no HTML (não geradas pelo WebCraft)
- [ ] Textos do Copy Agent usados no HTML (não reescritos pelo WebCraft)
- [ ] Schema.org do SEO Agent injetado no `<head>`
- [ ] Nenhum conflito entre outputs dos agentes no resultado final

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| ORCH-01 | — | — | — |
| ORCH-02 | — | — | — |
| ORCH-03 | — | — | — |
| ORCH-04 | — | — | — |
| ORCH-05 | — | — | — |
