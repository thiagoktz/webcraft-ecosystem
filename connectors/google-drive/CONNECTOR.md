# CONNECTOR.md — Google Drive

**Status:** ✅ Conectado  
**MCP URL:** https://drivemcp.googleapis.com/mcp/v1  
**Documentação:** https://developers.google.com/drive

---

## O que o Google Drive faz no ecossistema

Acesso a documentos, brand guides, referências visuais e arquivos que o cliente já tem — sem precisar fazer upload manual. O Memory Agent e o Design Agent leem diretamente do Drive do cliente.

---

## Agentes que usam este conector

| Agente | Para quê |
|---|---|
| **Memory Agent** | Ler brand guides e documentos de identidade existentes |
| **Design Agent** | Buscar referências visuais aprovadas pelo cliente |
| **Orchestrator** | Verificar se há briefing ou contexto já documentado |

---

## 1. Memory Agent — Ler brand guide existente

Quando o cliente já tem um brand guide no Drive:

```
Orchestrator instrui o Memory Agent:
"Antes de criar o perfil, verifique se há um brand guide
no Google Drive do cliente em: [URL ou nome do arquivo]"

Memory Agent usa o conector para:
1. Buscar arquivo por nome ou URL
2. Extrair cores, fontes e tom de voz
3. Popular o client.json com os dados encontrados
```

### Ferramentas MCP usadas:
```
search_files → buscar por nome: "brand guide", "manual de marca", "identidade visual"
read_file_content → ler o conteúdo do documento encontrado
get_file_metadata → verificar data de modificação (versão mais recente)
```

---

## 2. Design Agent — Referências visuais

```
Design Agent busca referências visuais aprovadas pelo cliente:
search_files → query: "referências visuais [empresa]"
              → query: "sites que gosto"
              → query: "exemplos de design aprovados"

Usa as referências para calibrar o TASTE.md do projeto.
```

---

## 3. Ferramentas MCP disponíveis

| Tool | O que faz |
|---|---|
| `search_files` | Busca por nome, conteúdo ou tipo de arquivo |
| `read_file_content` | Lê conteúdo de Google Docs, Sheets, PDFs |
| `get_file_metadata` | Metadados: nome, data, tamanho, tipo |
| `get_file_permissions` | Verifica quem tem acesso |
| `list_recent_files` | Arquivos modificados recentemente |
| `download_file_content` | Baixa o arquivo em base64 |

---

## 4. Padrão de busca recomendado

```javascript
// Buscar brand guide do cliente
const brandGuide = await drive.search_files({
  api_query: "name contains 'brand' or name contains 'marca' or name contains 'identidade'",
  semantic_query: "brand guide, manual de marca, identidade visual, cores, fontes"
});

// Buscar referências visuais
const referencias = await drive.search_files({
  api_query: "name contains 'referenc' or name contains 'inspirac'",
  semantic_query: "sites de referência, inspirações visuais, exemplos aprovados"
});
```

---

## Checklist de integração

- [ ] Cliente compartilhou pasta ou arquivo com a conta conectada
- [ ] Memory Agent verifica Drive antes de criar perfil novo
- [ ] Arquivos encontrados citados no client.json (para rastreabilidade)
- [ ] Brand guide importado complementa (não substitui) o onboarding manual
