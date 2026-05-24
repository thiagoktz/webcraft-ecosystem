# EVALS — SEO Agent
**Critérios:** 20 | **Mínimo:** 16 (80%)

---

## SEO-01 — Keyword research com intenção correta

**Input:**
```json
{
  "produto": "Consultoria de marketing digital",
  "publico": "Pequenas empresas",
  "localizacao": "Belo Horizonte",
  "segmento": "marketing"
}
```

**Critérios:**
- [ ] Palavra-chave primária tem intenção transacional ou comercial (não informacional)
- [ ] Palavra-chave primária inclui localização ("marketing digital Belo Horizonte")
- [ ] Mínimo 3 palavras secundárias geradas
- [ ] Mínimo 3 long-tails geradas com intenção específica
- [ ] Palavras locais por bairro/região presentes
- [ ] Instruções de uso entregues (onde usar cada keyword)

---

## SEO-02 — Meta tags dentro dos limites

**Input:**
```json
{
  "produto": "Escola de inglês Speak Up",
  "publico": "Adultos profissionais",
  "localizacao": "Campinas"
}
```

**Critérios:**
- [ ] `meta_tags.title` entre 50-60 caracteres
- [ ] `meta_tags.title` começa com a palavra-chave primária
- [ ] `meta_tags.description` entre 150-160 caracteres
- [ ] `meta_tags.description` contém a palavra-chave naturalmente
- [ ] `meta_tags.description` termina com CTA ("Matricule-se", "Saiba mais", etc.)
- [ ] Open Graph `og:title` e `og:description` presentes

---

## SEO-03 — Schema.org correto por tipo

**Input:**
```json
{
  "produto": "Restaurante japonês Sakura",
  "segmento": "alimentação",
  "localizacao": "São Paulo"
}
```

**Critérios:**
- [ ] Schema usa tipo correto (`FoodEstablishment` — não `LocalBusiness` genérico)
- [ ] `@context` = "https://schema.org"
- [ ] `name` e `url` presentes
- [ ] `address` com `addressCountry: "BR"` e CEP presente
- [ ] `openingHoursSpecification` presente
- [ ] Output é JSON válido (parseável)
- [ ] `schema_json_ld` entregue como string serializada

---

## SEO-04 — Auditoria de site existente

**Input:**
```json
{
  "url_atual": "https://exemplo.com.br",
  "html": "<html><head><title>Clínica</title></head><body><h1>Bem-vindo</h1><h3>Serviços</h3></body></html>"
}
```

**Critérios:**
- [ ] Detecta title muito curto ("Clínica" = 7 chars)
- [ ] Detecta ausência de meta description
- [ ] Detecta pulo de heading (h1 → h3 sem h2)
- [ ] Detecta ausência de schema.org
- [ ] Gera `recomendacoes` com ações concretas e priorizadas

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| SEO-01 | — | — | — |
| SEO-02 | — | — | — |
| SEO-03 | — | — | — |
| SEO-04 | — | — | — |
