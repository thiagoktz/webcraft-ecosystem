# EVALS — Buscador Agent
**Critérios:** 18 | **Mínimo:** 15 (83%)

---

## BUSCADOR-01 — Negócio conhecido, dados completos

**Input:**
```json
{
  "negocio": {
    "nome": "Hospital Albert Einstein",
    "cidade": "São Paulo",
    "estado_uf": "SP"
  },
  "preferencias": {
    "idioma": "pt-BR",
    "min_reviews": 3,
    "min_rating": 4.0
  }
}
```

**Critérios:**
- [ ] `status === "encontrado"`
- [ ] `place_id` presente e não vazio
- [ ] `negocio.endereco_formatado` contém "São Paulo"
- [ ] `avaliacoes.rating` é um número entre 0.0 e 5.0
- [ ] `avaliacoes.total` é um inteiro positivo
- [ ] `avaliacoes.reviews_textuais.length >= 1`
- [ ] `avaliacoes.destacar_no_site === true` (rating ≥ 4.0 e total ≥ 3)
- [ ] `recomendacoes_para_copy.length >= 1` com instrução acionável

---

## BUSCADOR-02 — Negócio inexistente, fallback gracioso

**Input:**
```json
{
  "negocio": {
    "nome": "Empresa Inventada Que Nao Existe XYZ123",
    "cidade": "Florianópolis"
  }
}
```

**Critérios:**
- [ ] `status === "nao_encontrado"` (não inventa dado)
- [ ] `avaliacoes` ausente OU com todos os campos null
- [ ] `alertas` contém mensagem clara explicando o que aconteceu
- [ ] Nenhuma review fabricada no output

---

## BUSCADOR-03 — Rating baixo, dados frágeis para copy

**Input:** (negócio real conhecido com rating < 4.0)
```json
{
  "negocio": { "nome": "<negócio com rating 3.x>", "cidade": "<cidade>" },
  "preferencias": { "min_rating": 4.0, "min_reviews": 3 }
}
```

**Critérios:**
- [ ] `status === "encontrado"`
- [ ] `avaliacoes.destacar_no_site === false`
- [ ] `alertas` contém aviso sobre rating abaixo do mínimo
- [ ] `recomendacoes_para_copy` orienta NÃO usar o rating como prova social

---

## BUSCADOR-04 — Poucos reviews textuais

**Input:** (negócio com 1-2 reviews)
```json
{
  "negocio": { "nome": "<negócio com <3 reviews>", "cidade": "<cidade>" },
  "preferencias": { "min_reviews": 3 }
}
```

**Critérios:**
- [ ] `avaliacoes.destacar_no_site === false` quando `total < min_reviews`
- [ ] `alertas` menciona contagem insuficiente de reviews
- [ ] Os reviews que existem ainda são devolvidos no array

---

## BUSCADOR-05 — Compliance e integração com outros agentes

**Critérios:**
- [ ] Nenhum review textual é truncado ANTES de chegar ao Copy Agent (truncamento é responsabilidade do Copy)
- [ ] Autor do review preserva o nome exato retornado pelo Google (sem inventar sobrenome)
- [ ] `negocio.url_google_maps` é gerado a partir do `place_id` quando presente (para o SEO Agent incluir no `sameAs`)
- [ ] Quando rating ≥ 4.0 e total ≥ min_reviews, output sinaliza claramente que o SEO Agent deve gerar `aggregateRating` no schema JSON-LD

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| BUSCADOR-01 | — | — | — |
| BUSCADOR-02 | — | — | — |
| BUSCADOR-03 | — | — | — |
| BUSCADOR-04 | — | — | — |
| BUSCADOR-05 | — | — | — |
