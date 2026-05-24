---
name: schema
description: Use este skill no SEO Agent ao gerar dados estruturados para qualquer tipo de site. Define qual schema usar por tipo de negócio, como gerá-lo corretamente em JSON-LD e como validá-lo antes de entregar ao WebCraft Agent.
---

# Skill: Schema.org — Dados Estruturados para Rich Snippets

---

## Por que schema importa

Schema.org é a linguagem que o Google usa para entender o conteúdo de uma página além do texto. Implementado corretamente, habilita **rich snippets** — resultados enriquecidos na busca com estrelas, horários, preços, FAQs e muito mais.

**Impacto real:** sites com rich snippets têm CTR (taxa de clique) até 30% maior que concorrentes sem schema.

---

## 1. Schema por tipo de negócio

### LocalBusiness (clínica, restaurante, loja, escritório)
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Clínica Saúde Total",
  "description": "Fisioterapia especializada para dores crônicas em São Paulo.",
  "url": "https://saudetotal.com.br",
  "telephone": "+55-11-3000-0000",
  "email": "contato@saudetotal.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Flores, 123",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "postalCode": "01310-100",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "13:00"
    }
  ],
  "priceRange": "$$",
  "image": "https://saudetotal.com.br/images/clinica.jpg",
  "sameAs": [
    "https://www.instagram.com/saudetotal",
    "https://www.facebook.com/saudetotal"
  ]
}
```

**Subtipos de LocalBusiness mais usados:**
- `MedicalBusiness` → clínicas, consultórios
- `LegalService` → escritórios de advocacia
- `FinancialService` → consultorias financeiras
- `FoodEstablishment` → restaurantes, cafés
- `Store` → lojas físicas
- `BeautySalon` → salões, estéticas

---

### SoftwareApplication (SaaS, app)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FinControl",
  "description": "Gestão financeira simplificada para pequenas empresas.",
  "url": "https://fincontrol.com.br",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL",
    "description": "Plano gratuito disponível"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "230"
  }
}
```

---

### Person (profissional liberal, consultor, coach)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Marcos Duarte",
  "jobTitle": "Coach de Carreira e Desenvolvimento Pessoal",
  "url": "https://marcosduarte.com.br",
  "image": "https://marcosduarte.com.br/foto.jpg",
  "description": "Coach certificado com 10 anos de experiência em transição de carreira.",
  "telephone": "+55-11-99999-9999",
  "email": "marcos@marcosduarte.com.br",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://www.linkedin.com/in/marcosduarte",
    "https://www.instagram.com/marcosduarte"
  ]
}
```

---

### FAQPage (perguntas frequentes — habilita rich snippet de FAQ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto tempo dura uma sessão de fisioterapia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cada sessão dura entre 45 e 60 minutos, dependendo do tratamento indicado pelo fisioterapeuta."
      }
    },
    {
      "@type": "Question",
      "name": "O plano de saúde cobre o tratamento?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aceitamos os principais convênios. Entre em contato para verificar a cobertura do seu plano."
      }
    }
  ]
}
```

---

### BreadcrumbList (navegação — melhora SEO de sites multi-página)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://saudetotal.com.br"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Serviços",
      "item": "https://saudetotal.com.br/servicos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Fisioterapia Ortopédica",
      "item": "https://saudetotal.com.br/servicos/ortopedica"
    }
  ]
}
```

---

### WebSite (schema mínimo para qualquer site)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Clínica Saúde Total",
  "url": "https://saudetotal.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://saudetotal.com.br/busca?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## 2. Como injetar no HTML

Sempre via `<script type="application/ld+json">` no `<head>`:

```html
<head>
  <!-- Meta tags normais -->
  <title>...</title>

  <!-- Schema.org — sempre JSON-LD, nunca microdata ou RDFa -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    ...
  }
  </script>

  <!-- Múltiplos schemas: um script por tipo -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...
  }
  </script>
</head>
```

---

## 3. Combinações recomendadas por tipo de site

| Tipo de site | Schemas a implementar |
|---|---|
| Clínica / Consultório | `MedicalBusiness` + `FAQPage` + `WebSite` |
| Restaurante / Café | `FoodEstablishment` + `Menu` + `WebSite` |
| Profissional liberal | `Person` + `FAQPage` + `WebSite` |
| SaaS / App | `SoftwareApplication` + `FAQPage` + `WebSite` |
| E-commerce | `Product` + `Offer` + `BreadcrumbList` + `WebSite` |
| Multi-página | Todos acima + `BreadcrumbList` em cada página |

---

## 4. Validação antes de entregar

Antes de passar o schema ao WebCraft Agent, verificar:

```javascript
function validarSchema(schemaString) {
  try {
    const schema = JSON.parse(schemaString);
    const checks = {
      tem_context: schema['@context'] === 'https://schema.org',
      tem_type: !!schema['@type'],
      tem_name: !!schema.name,
      json_valido: true
    };
    return { valido: Object.values(checks).every(Boolean), checks };
  } catch {
    return { valido: false, erro: 'JSON inválido' };
  }
}
```

**Ferramenta de validação oficial:** https://search.google.com/test/rich-results

---

## Checklist de schema

- [ ] Tipo de schema correto para o negócio
- [ ] `@context` = "https://schema.org"
- [ ] `name` e `url` presentes
- [ ] Endereço completo (para LocalBusiness)
- [ ] Horários de funcionamento (para LocalBusiness)
- [ ] FAQPage implementado se houver seção de perguntas
- [ ] JSON válido (sem vírgulas ou aspas faltando)
- [ ] Injetado via `<script type="application/ld+json">` no `<head>`
- [ ] Um `<script>` por tipo de schema
- [ ] Entregue como string serializada ao WebCraft Agent
