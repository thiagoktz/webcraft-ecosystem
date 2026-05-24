# Infra: Dashboard de Saúde dos Agentes

## Métricas por agente

```json
{
  "periodo": "últimos 30 dias",
  "agentes": {
    "design-agent": {
      "total_execucoes": 48,
      "taxa_sucesso": 0.96,
      "taxa_fallback": 0.02,
      "taxa_erro": 0.02,
      "duracao_media_ms": 3200,
      "qa_score_medio": 88,
      "top_erros": ["E001: tom não especificado", "E003: cor hex inválida"]
    },
    "copy-agent": {
      "total_execucoes": 52,
      "taxa_sucesso": 0.94,
      "taxa_fallback": 0.04,
      "taxa_erro": 0.02,
      "duracao_media_ms": 5800,
      "satisfacao_usuario": 4.3,
      "top_erros": ["E001: segmento não identificado"]
    },
    "seo-agent": {
      "total_execucoes": 45,
      "taxa_sucesso": 0.98,
      "taxa_fallback": 0.02,
      "taxa_erro": 0.00,
      "duracao_media_ms": 2100,
      "top_erros": []
    },
    "webcraft-agent": {
      "total_execucoes": 60,
      "taxa_sucesso": 0.90,
      "taxa_fallback": 0.05,
      "taxa_erro": 0.05,
      "duracao_media_ms": 9400,
      "qa_score_medio": 85,
      "top_erros": ["E003: CSS incompleto", "E006: QA rejeitou mobile layout"]
    },
    "qa-agent": {
      "total_execucoes": 55,
      "taxa_aprovacao_direto": 0.65,
      "taxa_aprovacao_com_aviso": 0.25,
      "taxa_rejeicao": 0.10,
      "score_medio": 83,
      "top_issues": ["contraste insuficiente", "heading hierarchy", "lazy loading ausente"]
    }
  },
  "pipelines": {
    "site-completo": {
      "execucoes": 30,
      "taxa_conclusao": 0.93,
      "duracao_media_min": 6.2,
      "iteracoes_media_ate_aprovacao": 1.8,
      "satisfacao_media": 4.4
    },
    "site-rapido": {
      "execucoes": 20,
      "taxa_conclusao": 0.98,
      "duracao_media_min": 1.8,
      "satisfacao_media": 3.9
    }
  },
  "alertas": [
    {
      "nivel": "warning",
      "agente": "webcraft-agent",
      "mensagem": "Taxa de erro acima de 5% — revisar skill de CSS responsivo"
    },
    {
      "nivel": "info",
      "agente": "qa-agent",
      "mensagem": "'contraste insuficiente' é o issue mais frequente — atualizar design-agent"
    }
  ]
}
```

---

## Critérios de alerta

| Métrica | Warning | Critical |
|---|---|---|
| Taxa de erro | > 5% | > 15% |
| Taxa de fallback | > 10% | > 25% |
| QA score médio | < 80 | < 70 |
| Duração média | > 2x baseline | > 3x baseline |
| Satisfação usuário | < 3.5 | < 3.0 |

---

## Geração automática

O Feedback Agent gera este relatório semanalmente e salva em:
`infra/dashboard/report-YYYY-MM-DD.json`

Issues recorrentes são convertidos em sugestões de atualização de skills no `EVALS.md`.
