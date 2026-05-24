# Infra: Versionamento de Outputs

## Estrutura de versões por projeto

```json
{
  "project_id": "proj_xyz",
  "client_id": "marcos-techstart",
  "versions": [
    {
      "version": "v1",
      "timestamp": "2026-05-23T10:00:00Z",
      "pipeline": "site-completo",
      "agentes": ["design", "seo", "copy", "webcraft", "qa"],
      "status": "rejected",
      "feedback": "Muito colorido, precisa de algo mais sóbrio",
      "arquivos": {
        "html": "snapshots/proj_xyz_v1.html",
        "css": "snapshots/proj_xyz_v1.css"
      },
      "qa_score": 72
    },
    {
      "version": "v2",
      "timestamp": "2026-05-23T10:45:00Z",
      "pipeline": "site-completo",
      "agentes": ["design", "webcraft", "qa"],
      "status": "approved",
      "feedback": null,
      "arquivos": {
        "html": "snapshots/proj_xyz_v2.html",
        "css": "snapshots/proj_xyz_v2.css"
      },
      "qa_score": 94
    }
  ],
  "version_atual": "v2",
  "total_iteracoes": 2
}
```

---

## Regras de versionamento

- Toda nova entrega cria uma versão com ID incremental (`v1`, `v2`...)
- Versões rejeitadas são mantidas para análise do Feedback Agent
- Rollback disponível: usuário pode pedir "volta para v1"
- Máximo de 10 versões por projeto (arquivar as mais antigas)

---

## Rollback

```javascript
async function rollback(projectId, targetVersion) {
  const versao = await getVersion(projectId, targetVersion);
  if (!versao) throw new Error(`Versão ${targetVersion} não encontrada`);

  // Restaurar arquivos da versão alvo como versão atual
  await setCurrentVersion(projectId, targetVersion);
  return versao;
}
```
