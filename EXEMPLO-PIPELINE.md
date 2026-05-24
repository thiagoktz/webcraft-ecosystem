# Exemplo Prático — Pipeline `site-completo`

Este arquivo demonstra como o ecossistema multi-agente funciona na prática, mostrando os dados que trafegam entre cada agente.

---

## Cenário

**Usuário:** "Quero um site para minha clínica de fisioterapia chamada Saúde Total, em São Paulo. Público são adultos com dores crônicas. Tom acolhedor e profissional."

---

## Passo 0 — Orchestrator analisa e roteia

```json
// Análise interna do Orchestrator
{
  "intencao": "criar",
  "urgencia": "normal",
  "escopo": "completo",
  "tem_site_existente": false,
  "pipeline_selecionado": "site-completo",
  "ordem": ["seo-agent", "copy-agent", "webcraft-agent"]
}
```

**Orchestrator → Usuário:**
> "Vou coordenar 3 agentes em sequência para entregar o melhor resultado. Deve levar cerca de 3-5 minutos."

---

## Passo 1 — Orchestrator → SEO Agent

**Input enviado:**
```json
{
  "agent": "seo-agent",
  "task": "pesquisa_e_meta_tags",
  "input": {
    "produto": "Clínica de fisioterapia",
    "publico": "Adultos com dores crônicas",
    "localizacao": "São Paulo",
    "segmento": "saúde",
    "idiomas": ["pt-BR"]
  }
}
```

**Output do SEO Agent:**
```json
{
  "status": "success",
  "output": {
    "palavras_chave": {
      "primaria": "fisioterapia São Paulo",
      "secundarias": ["clínica de fisioterapia SP", "tratamento dor crônica São Paulo"],
      "long_tail": [
        "fisioterapia para dor lombar São Paulo",
        "clínica de reabilitação física SP",
        "fisioterapeuta particular São Paulo"
      ],
      "locais": ["fisioterapia Pinheiros", "fisioterapia Vila Madalena", "fisioterapia Jardins"]
    },
    "meta_tags": {
      "title": "Fisioterapia em São Paulo | Clínica Saúde Total",
      "description": "Tratamento especializado para dores crônicas com fisioterapeutas experientes em São Paulo. Agende sua avaliação gratuita e recupere sua qualidade de vida.",
      "og": {
        "title": "Clínica Saúde Total — Fisioterapia em São Paulo",
        "description": "Recupere seu movimento com tratamento especializado para dores crônicas.",
        "type": "website"
      },
      "canonical": "https://saudetotal.com.br/"
    },
    "schema_json_ld": "{\"@context\":\"https://schema.org\",\"@type\":\"MedicalBusiness\",\"name\":\"Clínica Saúde Total\",\"description\":\"Fisioterapia especializada em São Paulo\",\"medicalSpecialty\":\"PhysicalTherapy\"}",
    "heading_structure": {
      "h1": "Fisioterapia Especializada para Dores Crônicas em São Paulo",
      "h2s": ["Nossos Tratamentos", "Como Funciona", "Nossa Equipe", "Depoimentos", "Agende sua Avaliação"]
    },
    "recomendacoes": [
      "Criar página Google Meu Negócio com mesmo NAP do schema",
      "Adicionar fotos da clínica com alt text otimizado",
      "Criar blog com artigos sobre dores crônicas para SEO de longo prazo"
    ]
  }
}
```

**Orchestrator → Usuário:**
> "✅ SEO Agent concluído — 3 palavras-chave principais e meta tags geradas."

---

## Passo 2 — Orchestrator → Copy Agent

**Input enviado** (inclui output do SEO Agent):
```json
{
  "agent": "copy-agent",
  "task": "gerar_textos_site",
  "input": {
    "produto": "Clínica de fisioterapia Saúde Total",
    "publico": "Adultos com dores crônicas buscando tratamento especializado",
    "tom": "acolhedor e profissional",
    "segmento": "saúde",
    "secoes": ["hero", "servicos", "sobre", "depoimentos", "cta", "footer"],
    "palavras_chave": [
      "fisioterapia São Paulo",
      "tratamento dor crônica",
      "clínica de reabilitação"
    ]
  }
}
```

**Output do Copy Agent:**
```json
{
  "status": "success",
  "output": {
    "textos": {
      "hero": {
        "titulo": "Recupere seu movimento. Recupere sua vida.",
        "subtitulo": "Fisioterapia especializada para quem convive com dores crônicas e quer voltar a viver sem limitações.",
        "cta_principal": "Agendar avaliação gratuita",
        "cta_secundario": "Conheça nossos tratamentos"
      },
      "servicos": {
        "titulo_secao": "Tratamentos que fazem a diferença",
        "subtitulo_secao": "Cada paciente tem uma história. Cada tratamento, um caminho único.",
        "items": [
          {
            "nome": "Fisioterapia Ortopédica",
            "descricao": "Tratamento de lesões musculares, articulares e ósseas. Ideal para quem sofre com dores na coluna, joelhos ou ombros."
          },
          {
            "nome": "Fisioterapia Neurológica",
            "descricao": "Reabilitação para pacientes com sequelas de AVC, Parkinson ou outras condições neurológicas."
          },
          {
            "nome": "RPG — Reeducação Postural",
            "descricao": "Correção de desequilíbrios posturais que causam dores crônicas e limitações de movimento."
          }
        ]
      },
      "sobre": {
        "titulo": "Cuidamos de você como gostaríamos de ser cuidados",
        "paragrafo_1": "Na Saúde Total, cada paciente é tratado como único. Nossa equipe de fisioterapeutas combina técnica avançada com escuta ativa — porque entendemos que dor não é só física.",
        "paragrafo_2": "Com mais de 10 anos atendendo em São Paulo, desenvolvemos protocolos que unem evidência científica e cuidado humano para resultados reais e duradouros.",
        "destaque": "Mais de 2.000 pacientes recuperaram sua qualidade de vida aqui."
      },
      "depoimentos": {
        "titulo_secao": "Quem passou pela Saúde Total conta",
        "items": [
          {
            "texto": "Depois de 3 anos com dor lombar crônica, encontrei na Saúde Total o tratamento que finalmente funcionou. Em 4 meses, voltei a correr.",
            "nome": "Ricardo M.",
            "cargo_ou_contexto": "Paciente há 1 ano"
          },
          {
            "texto": "Me recuperei de uma cirurgia no joelho muito mais rápido do que o esperado. A equipe é atenciosa e o acompanhamento é constante.",
            "nome": "Ana Paula S.",
            "cargo_ou_contexto": "Paciente pós-cirúrgica"
          },
          {
            "texto": "Minha mãe teve um AVC e a equipe de neurologia da Saúde Total foi fundamental na recuperação dela. Profissionalismo e humanidade juntos.",
            "nome": "Carlos F.",
            "cargo_ou_contexto": "Familiar de paciente"
          }
        ]
      },
      "cta": {
        "titulo": "Seu primeiro passo começa aqui",
        "subtitulo": "Agende uma avaliação gratuita e descubra o melhor caminho para sua recuperação.",
        "botao": "Quero minha avaliação gratuita"
      },
      "footer": {
        "tagline": "Saúde Total — Fisioterapia que transforma vidas em São Paulo.",
        "copyright": "© 2026 Clínica Saúde Total. Todos os direitos reservados."
      }
    },
    "meta": {
      "title": "Fisioterapia em São Paulo | Clínica Saúde Total",
      "description": "Tratamento especializado para dores crônicas em São Paulo. Fisioterapia ortopédica, neurológica e RPG. Avaliação gratuita — agende agora."
    }
  }
}
```

**Orchestrator → Usuário:**
> "✅ Copy Agent concluído — textos gerados para 5 seções."

---

## Passo 3 — Orchestrator → WebCraft Agent

**Input enviado** (integra outputs do SEO + Copy):
```json
{
  "agent": "webcraft-agent",
  "task": "gerar_site",
  "input": {
    "tipo": "site institucional",
    "produto": "Clínica Saúde Total",
    "tom": "acolhedor e profissional",
    "stack": "HTML/CSS/JS",
    "secoes": ["hero", "servicos", "sobre", "depoimentos", "cta", "footer"],
    "textos": "{ ...output completo do copy-agent... }",
    "seo_data": {
      "meta_tags": "{ ...output do seo-agent... }",
      "schema_json_ld": "{ ...schema MedicalBusiness... }",
      "heading_structure": {
        "h1": "Fisioterapia Especializada para Dores Crônicas em São Paulo"
      }
    }
  }
}
```

**Orchestrator → Usuário:**
> "⚙️ WebCraft Agent gerando o site com todos os dados integrados..."

---

## Passo 4 — Orchestrator integra e entrega

```json
// Score de qualidade calculado
{
  "score": 100,
  "detalhes": [
    "✅ SEO otimizado (+30)",
    "✅ Textos profissionais (+40)",
    "✅ Design e estrutura (+30)"
  ],
  "classificacao": "Premium"
}
```

**Orchestrator → Usuário (PM):**
> ✅ **Seu site está pronto!**
>
> Trabalharam nele:
> - 🔍 **SEO Agent** — palavras-chave e meta tags para aparecer no Google
> - ✍️ **Copy Agent** — textos para 5 seções, tom acolhedor e profissional
> - 🎨 **WebCraft Agent** — site completo, responsivo e acessível
>
> **Qualidade: Premium (100/100)**
>
> Arquivos disponíveis: `index.html`, `styles.css`, `script.js`
>
> Próximo passo: fazer o deploy — posso te guiar!
