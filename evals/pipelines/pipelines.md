# EVALS — Pipelines Ponta a Ponta

---

# PIPELINE-01 — site-completo
**Critérios:** 20 | **Mínimo:** 16 (80%)

**Setup:** pipeline SEO → Copy → WebCraft → QA executado para o cenário abaixo.

**Input do usuário:**
```
Quero um site para minha clínica de dermatologia chamada DermaCare em Porto Alegre.
Público: mulheres 30-55 anos que buscam tratamentos estéticos. Tom: sofisticado e acolhedor.
```

---

## Integração entre agentes

- [ ] SEO Agent roda antes do Copy Agent
- [ ] Copy Agent recebe `palavras_chave` do SEO Agent no input
- [ ] WebCraft Agent recebe `textos` do Copy Agent intactos
- [ ] WebCraft Agent recebe `meta_tags` e `schema_json_ld` do SEO Agent
- [ ] QA Agent valida o output do WebCraft Agent antes da entrega
- [ ] Nenhum agente reescreve output de outro sem instrução explícita

---

## Qualidade do resultado final

- [ ] HTML contém textos do Copy Agent (não reescritos pelo WebCraft)
- [ ] Meta title do SEO Agent presente no `<head>` (não gerado pelo WebCraft)
- [ ] Schema `MedicalBusiness` do SEO Agent no `<head>`
- [ ] CSS usa variáveis semânticas (tokens do Design Agent se presente)
- [ ] QA score ≥ 80 no output final
- [ ] Nenhum issue crítico no relatório do QA Agent

---

## Comunicação com o usuário

- [ ] Usuário informado do pipeline antes de começar
- [ ] Progresso comunicado a cada agente concluído
- [ ] Entrega final com resumo do que cada agente contribuiu
- [ ] Score de qualidade apresentado na entrega
- [ ] Próximos passos sugeridos (deploy, ajustes, etc.)

---

## Tempo e robustez

- [ ] Pipeline concluído sem travamentos ou loops
- [ ] Falha de 1 agente não cancela o pipeline (fallback ativo)
- [ ] Output entregue mesmo com fallback ativado

---

## Registro

| Execução | Data | Score QA | Status | Observações |
|---|---|---|---|---|
| 1 | — | — | — | — |

---

---

# PIPELINE-02 — site-rapido
**Critérios:** 10 | **Mínimo:** 8 (80%)

**Input:**
```
Me faz um rascunho de landing page para uma fintech chamada CreditoJá. Preciso mostrar para o investidor hoje.
```

**Critérios:**
- [ ] Apenas WebCraft Agent acionado (sem SEO ou Copy)
- [ ] Entrega em menos de 2 minutos
- [ ] HTML básico válido (DOCTYPE, lang, viewport, title)
- [ ] Responsivo em 375px
- [ ] QA roda e aprova (ou aprova com warnings)
- [ ] Usuário informado que é versão inicial
- [ ] Textos placeholder são descritivos (não "Lorem ipsum")
- [ ] CTA presente e funcional
- [ ] Sem issues críticos de segurança
- [ ] Próximos passos sugeridos (upgrade para site-completo)

---

## Registro

| Execução | Data | Score QA | Status | Observações |
|---|---|---|---|---|
| 1 | — | — | — | — |

---

---

# PIPELINE-03 — auditoria-seo
**Critérios:** 10 | **Mínimo:** 8 (80%)

**Input:**
```json
{
  "url_atual": "https://exemplo.com.br",
  "html": "<!-- HTML do site existente -->"
}
```

**Critérios:**
- [ ] Apenas SEO Agent acionado
- [ ] Relatório identifica title e description ausentes ou fora do tamanho
- [ ] Relatório identifica problemas de heading hierarchy
- [ ] Relatório identifica ausência de schema.org
- [ ] Relatório identifica ausência de Open Graph
- [ ] Recomendações são priorizadas (crítico → importante → sugestão)
- [ ] Palavras-chave sugeridas para o segmento do site
- [ ] Entrega sem acionar outros agentes desnecessariamente
- [ ] Usuário recebe próximo passo claro ("Quer que eu corrija esses problemas?")
- [ ] Output é JSON válido com todos os campos do schema do SEO Agent

---

## Registro

| Execução | Data | Issues detectados | Status | Observações |
|---|---|---|---|---|
| 1 | — | — | — | — |
