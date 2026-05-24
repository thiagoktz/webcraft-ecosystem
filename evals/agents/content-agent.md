# EVALS — Content Agent
**Critérios:** 14 | **Mínimo:** 12 (80%)

---

## CONTENT-01 — Assets adequados ao segmento

**Input:**
```json
{
  "produto": "Escola de gastronomia artesanal",
  "segmento": "alimentação",
  "tom": "descontraído",
  "secoes": ["hero", "servicos", "sobre"],
  "estilo_visual": "fotografia real"
}
```

**Critérios:**
- [ ] Hero image é landscape (não retrato)
- [ ] `unsplash_query` é específico ao segmento (não "business people")
- [ ] `alt_text` descreve o conteúdo real da imagem (não "imagem hero")
- [ ] Dimensões definidas (`w` e `h` numéricos)
- [ ] Biblioteca de ícones adequada ao segmento (Tabler para alimentação)

---

## CONTENT-02 — Mapeamento de ícones por seção

**Input:**
```json
{
  "produto": "Plataforma de cursos online",
  "segmento": "educação",
  "secoes": ["hero", "servicos", "sobre"]
}
```

**Critérios:**
- [ ] Biblioteca de ícones declarada com CDN URL
- [ ] Ícone mapeado para cada item de serviço
- [ ] Nomes de ícones são válidos na biblioteca declarada
- [ ] Favicon sugerido (emoji ou placeholder URL)
- [ ] Recomendações sobre fotografia profissional real presentes

---

## CONTENT-03 — Restrições respeitadas

**Input:**
```json
{
  "produto": "Clínica veterinária",
  "restricoes": ["sem rostos humanos", "apenas animais"],
  "secoes": ["hero", "servicos"]
}
```

**Critérios:**
- [ ] `unsplash_query` do hero não inclui pessoas ("vet clinic dog" não "vet with patient")
- [ ] Todas as imagens respeitam a restrição declarada
- [ ] Restrições são documentadas no output

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| CONTENT-01 | — | — | — |
| CONTENT-02 | — | — | — |
| CONTENT-03 | — | — | — |
