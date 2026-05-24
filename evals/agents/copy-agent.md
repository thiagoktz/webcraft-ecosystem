# EVALS — Copy Agent
**Critérios:** 22 | **Mínimo:** 18 (80%)

---

## COPY-01 — Hero com benefício claro

**Input:**
```json
{
  "produto": "Clínica de fisioterapia Saúde Total",
  "publico": "Adultos com dores crônicas",
  "tom": "acolhedor",
  "secoes": ["hero"]
}
```

**Critérios:**
- [ ] Título do hero ≤ 60 caracteres
- [ ] Título comunica benefício, não apenas serviço ("Recupere seu movimento" vs "Fisioterapia")
- [ ] Subtítulo ≤ 120 caracteres
- [ ] CTA contém verbo de ação + objeto específico
- [ ] CTA ≤ 30 caracteres
- [ ] Nenhuma frase genérica proibida ("excelência", "soluções inovadoras", "líderes de mercado")

---

## COPY-02 — Tom consistente entre seções

**Input:**
```json
{
  "produto": "Plataforma SaaS de RH",
  "tom": "profissional",
  "secoes": ["hero", "servicos", "sobre", "cta"]
}
```

**Critérios:**
- [ ] Tom profissional mantido em todas as seções (sem exclamações excessivas)
- [ ] Pronome consistente ("você" em todas as seções — não mistura com "vocês")
- [ ] Nível de formalidade não varia entre seções
- [ ] Zero emojis (tom profissional não usa)
- [ ] Máximo 1 exclamação em toda a página

---

## COPY-03 — Especificidade nos depoimentos

**Input:**
```json
{
  "produto": "Academia de musculação",
  "publico": "Adultos 30-50 anos que querem emagrecer",
  "tom": "descontraído",
  "secoes": ["depoimentos"]
}
```

**Critérios:**
- [ ] 3 depoimentos gerados
- [ ] Cada depoimento tem nome + contexto ("Maria S., membro há 8 meses")
- [ ] Depoimentos têm detalhes específicos (não "ótimo atendimento!")
- [ ] Depoimentos refletem o resultado prometido ao público-alvo
- [ ] Tom dos depoimentos é natural (não parece escrito pela empresa)

---

## COPY-04 — Output JSON válido e completo

**Critérios (verificar estrutura do output):**
- [ ] Output é JSON parseável sem erros
- [ ] `textos.hero.titulo` presente e não vazio
- [ ] `textos.hero.cta_principal` presente e não vazio
- [ ] `meta.title` entre 50-60 caracteres
- [ ] `meta.description` entre 150-160 caracteres
- [ ] Todas as seções solicitadas no input estão presentes no output

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| COPY-01 | — | — | — |
| COPY-02 | — | — | — |
| COPY-03 | — | — | — |
| COPY-04 | — | — | — |
