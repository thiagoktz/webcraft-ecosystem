# EVALS — Design Agent
**Critérios:** 20 | **Mínimo:** 16 (80%)

---

## DESIGN-01 — Direção visual por segmento

**Input:**
```json
{
  "produto": "Clínica de fisioterapia",
  "segmento": "saúde",
  "tom": "acolhedor e profissional",
  "publico": "Adultos com dores crônicas"
}
```

**Critérios:**
- [ ] Arquétipo escolhido é adequado ao segmento (Humano ou Clínico — não Bold ou Tecnológico)
- [ ] Conceito explica a direção em linguagem clara
- [ ] 3 adjetivos de personalidade são específicos (não "moderno, profissional, confiável")
- [ ] Princípios de espaçamento definidos
- [ ] Lista de o que evitar presente

---

## DESIGN-02 — Sistema de cores com contraste

**Input:**
```json
{
  "produto": "SaaS de gestão financeira",
  "segmento": "tech",
  "tom": "profissional e direto",
  "estilo_preferido": "tecnológico"
}
```

**Critérios:**
- [ ] Cor primária em formato hex válido (`#RRGGBB`)
- [ ] Cor de texto e fundo com ratio ≥ 4.5:1 (declarado no output)
- [ ] Cor de texto secundário com ratio ≥ 3:1
- [ ] Cores de feedback presentes (sucesso, erro, aviso)
- [ ] Paleta coerente com o arquétipo tecnológico (escuro com acento vibrante)

---

## DESIGN-03 — Tipografia distinctiva

**Input:**
```json
{
  "produto": "Escritório de arquitetura",
  "segmento": "arquitetura",
  "tom": "premium e minimalista",
  "estilo_preferido": "premium"
}
```

**Critérios:**
- [ ] Fonte de título não é Arial, Roboto, Inter ou Times New Roman
- [ ] Fonte de título tem personalidade para o segmento (serif ou display premium)
- [ ] Google Fonts URL com `display=swap` incluída
- [ ] Máximo 2 famílias tipográficas definidas
- [ ] Escala com `clamp()` definida para responsividade

---

## DESIGN-04 — Bloco CSS completo e utilizável

**Critérios (verificar no output):**
- [ ] Campo `css_variables` contém bloco `:root { }` completo
- [ ] Todas as variáveis usam nomenclatura semântica (`--color-primary`, não `--azul`)
- [ ] Variáveis de espaçamento semântico presentes (`--section-gap`, `--container-max`)
- [ ] Tokens de animação presentes (`--duration-normal`, `--ease-default`)
- [ ] Output é JSON válido e parseável

---

## Registro

| Teste | Resultado | Data | Observações |
|---|---|---|---|
| DESIGN-01 | — | — | — |
| DESIGN-02 | — | — | — |
| DESIGN-03 | — | — | — |
| DESIGN-04 | — | — | — |
