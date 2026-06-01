---
name: lead-tracking
description: Use este skill SEMPRE que leads novos forem enriquecidos ou avançarem no pipeline de prospecção. Registra e atualiza cada lead num sistema de tracking/CRM (planilha, banco) de forma idempotente e automática, pra que nenhum lead enriquecido suma do funil. Dispara automaticamente após a geração de mensagens; também pode rodar manual.
---

# Skill: Lead Tracking — Nenhum lead enriquecido fica fora do CRM

## Princípio

Lead enriquecido mas não registrado **some no fluxo**. Dado de prospecção
só vale se está rastreado: quem foi mapeado, quem tem site, quem recebeu
mensagem, quem foi disparado, quem respondeu. O CRM (planilha ou banco) é
a fonte única de verdade do funil comercial — o JSON técnico não substitui
isso porque ninguém abre JSON pra decidir follow-up.

## Quando dispara

Automático, no fim da etapa que torna o lead **rastreável de verdade**:

- No pipeline agente-sites: fim do `agente_redator.py` (lead passa a ter
  `site_gerado` + `mensagem_gerada` = pronto pra disparar).
- Em qualquer pipeline: assim que o lead tem dados de contato + ativo
  suficiente pra ser trabalhado comercialmente.

Não é a etapa de "enriquecimento bruto" (mapeamento) que dispara — naquele
ponto o lead ainda não tem site nem mensagem, e a linha do CRM ficaria
vazia nas colunas que importam. Dispara quando há o que rastrear.

## Regras inegociáveis

1. **Idempotente.** Rodar N vezes não duplica. Dedupe por identificador
   estável: `place_id` quando disponível, senão `nome + telefone`
   normalizados (lowercase, dígitos do telefone).

2. **Insere novos, atualiza status dos existentes.** Lead que muda de
   estágio (ex: Pronto → Disparado) tem o Status atualizado in-place na
   linha que já existe. Não cria linha nova.

3. **NUNCA sobrescreve coluna preenchida por humano.** Data de disparo,
   "Leu?", "Respondeu?", "Qualificada?", "Fechou?", "Notas", "Próxima
   ação" são do operador. O sync só mexe em colunas derivadas do pipeline
   (Status, URL). Sobrescrever trabalho humano destrói confiança no CRM.

4. **Preserva estrutura do CRM.** Em planilha: usar `load_workbook`
   (openpyxl), NUNCA recriar — senão Dashboard, fórmulas e formatação
   se perdem. Em banco: UPSERT, nunca DROP+recreate.

5. **Falha de sync nunca quebra o pipeline.** O agente que chama o sync
   envolve em try/except. Sync é efeito colateral desejável, não
   pré-requisito. Se a planilha estiver aberta/travada, loga aviso e segue.

6. **Backup antes de gravar.** 1 cópia por dia do CRM antes da 1ª escrita.

## Mapeamento de campos (referência agente-sites)

| Coluna do CRM | Origem no lead | Observação |
|---|---|---|
| Data disparo | — | humano preenche ao disparar |
| Nome | `nome` | chave de dedupe (com telefone) |
| Segmento | `segmento` | |
| Cidade | fixo / `cidade` | |
| Telefone | `telefone` | chave de dedupe |
| URL site | `site_gerado` | |
| Status | `status` mapeado | mensagem_pronta→Pronto, enviado→Disparado, etc |
| Leu? … Notas | — | colunas humanas, sync nunca toca |

## Mapa de status (pipeline → CRM)

```
mensagem_pronta → "Pronto"
aprovado        → "Aprovado"
enviado         → "Disparado"
respondido      → "Respondido"
```

## Implementação de referência

No projeto agente-sites: `sync_leads_tracking.py`.
- Expõe `sync(dry_run=False, verbose=True) -> dict` (stats).
- `agente_redator.py` chama `sync()` no fim do `main()`, dentro de
  try/except, só quando gerou mensagens (não em DRY_RUN).
- CLI: `python3 sync_leads_tracking.py [--dry-run]`.

Em outros stacks, replicar o mesmo contrato: função idempotente,
update-in-place de status, preservação de colunas humanas, backup.
