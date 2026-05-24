# EVALS — QA Agent
**Critérios:** 18 | **Mínimo:** 15 (80%)

---

## QA-01 — Detecção de issues críticos

**Input HTML propositalmente defeituoso:**
```html
<html>
<head><title>Cl</title></head>
<body>
<h1>Bem-vindo</h1>
<h3>Serviços</h3>
<img src="foto.jpg">
<script src="app.js"></script>
</body>
</html>
```

**Critérios — QA deve detectar todos:**
- [ ] `lang` ausente no `<html>` → issue crítico
- [ ] `<meta charset>` ausente → issue crítico
- [ ] `<meta viewport>` ausente → issue crítico
- [ ] Title com 2 chars (abaixo de 50) → issue crítico
- [ ] Pulo h1→h3 sem h2 → issue crítico
- [ ] `alt` ausente na `<img>` → issue crítico
- [ ] Script sem `defer`/`async` → issue crítico
- [ ] Status retornado: `rejected`

---

## QA-02 — Aprovação de output de qualidade

**Input:** HTML completo e bem formado com todos os elementos obrigatórios.

**Critérios:**
- [ ] Status retornado: `approved` ou `approved_with_warnings`
- [ ] Score ≥ 80
- [ ] `passed_checks` lista pelo menos 10 verificações aprovadas
- [ ] `blocked_by` está vazio (sem críticos)
- [ ] Output é JSON válido com todos os campos obrigatórios

---

## QA-03 — Ciclo de correção

**Contexto:** QA rejeita v1. WebCraft corrige. QA valida v2.

**Critérios:**
- [ ] Issues do relatório v1 são resolvidos na v2
- [ ] QA não gera novos issues para elementos não alterados
- [ ] Score da v2 é maior que da v1
- [ ] Máximo de 2 ciclos de correção antes de escalar

---

## QA-04 — Comunicação por perfil

**Critérios:**
- [ ] Para PM: issues explicados em linguagem de negócio (não técnica)
- [ ] Para Dev: issues com localização exata (linha, seletor, tag) e fix técnico
- [ ] Ambos: score numérico presente
- [ ] Ambos: próximos passos claros após rejeição

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| QA-01 | — | — | — |
| QA-02 | — | — | — |
| QA-03 | — | — | — |
| QA-04 | — | — | — |
