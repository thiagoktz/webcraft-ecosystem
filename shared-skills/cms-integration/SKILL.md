---
name: cms-integration
description: Use este skill no CMS Agent ao integrar com Sanity ou Contentful. Define como conectar o CMS headless ao site gerado pelo WebCraft Agent.
---

# Skill: CMS Integration — Sanity e Contentful

## Sanity (recomendado — grátis até 3 usuários)

### Instalação:
```bash
npm create sanity@latest -- --project-id SEU-PROJECT-ID --dataset production
```

### Fetch de conteúdo no frontend:
```javascript
import { createClient } from "@sanity/client";
const client = createClient({
  projectId: "SEU-PROJECT-ID",
  dataset: "production",
  useCdn: true,
  apiVersion: "2026-01-01",
});
const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)`);
```

## Contentful (enterprise — grátis até 5 usuários)

### Fetch de conteúdo:
```javascript
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});
const entries = await client.getEntries({ content_type: "blogPost" });
```

## Checklist de integração CMS
- [ ] API keys em variáveis de ambiente (nunca no código)
- [ ] Preview mode configurado para rascunhos
- [ ] Webhook configurado para rebuild no deploy
- [ ] Tipos de conteúdo documentados no REVISAO.md
