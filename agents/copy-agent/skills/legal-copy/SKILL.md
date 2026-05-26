---
name: legal-copy
description: Geração de textos jurídicos LGPD (Política de Privacidade, Política de Cookies, Termos de Uso) para sites do ecossistema. Acionada pelo Copy Agent quando recebe input com tipo "legal_pages" vindo do Compliance Agent. Produz HTMLs prontos para uso, com placeholders preenchidos a partir dos dados do controlador, e sempre marca claramente que o texto é template e exige revisão jurídica.
---

# Skill: Legal Copy (Copy Agent)

Quando o Compliance Agent identifica que o site precisa de Política de Privacidade e Política de Cookies, ele delega a geração dos textos ao Copy Agent via `copy_agent_request: { tipo: "legal_pages", paginas: [...] }`. Esta skill define como o Copy Agent gera esses textos.

⚠️ **Esta skill produz template juridicamente revisável, não substitui parecer de advogado.** Todo output inclui aviso explícito no início do documento.

---

## Input que o Copy Agent recebe via Compliance Agent

```json
{
  "tipo": "legal_pages",
  "controlador": {
    "nome": "Clínica Saúde Total Ltda.",
    "cnpj": "12.345.678/0001-99",
    "endereco": "Av. Exemplo, 123 — São Paulo/SP, CEP 01234-567",
    "email_dpo": "lgpd@saudetotal.com.br"
  },
  "segmento": "saude",
  "dados_coletados": ["identificacao", "contato", "navegacao", "saude_sensivel"],
  "bases_legais_por_finalidade": [...],
  "tempo_retencao": {...},
  "tracking_categorias": ["analytics", "marketing", "funcional"],
  "cookies_inventariados": [
    { "nome": "_ga",  "categoria": "analytics",  "duracao": "13 meses", "provedor": "Google" },
    { "nome": "_fbp", "categoria": "marketing",  "duracao": "3 meses",  "provedor": "Meta" }
  ],
  "paginas": [
    { "slug": "politica-de-privacidade", "secoes_obrigatorias": [...] },
    { "slug": "politica-de-cookies",     "secoes_obrigatorias": [...] }
  ]
}
```

---

## Política de Privacidade — seções obrigatórias

Cada uma destas seções deve ser gerada, nesta ordem, no HTML final:

### 1. Aviso de template (sempre primeiro)
```html
<div class="aviso-template" role="alert">
  <strong>Documento revisável.</strong> Este texto foi gerado a partir de template
  padrão LGPD pelo ecossistema WebCraft em <data-de-geracao>. Antes de receber
  tráfego de produção, RECOMENDAMOS REVISÃO POR ADVOGADO especializado em
  proteção de dados.
</div>
```

### 2. Identificação do controlador
```
Nome / Razão social: {controlador.nome}
CNPJ: {controlador.cnpj}
Endereço: {controlador.endereco}
Contato LGPD: {controlador.email_dpo}
```

### 3. Quais dados coletamos
Lista por categoria:
- **Identificação:** nome, CPF (quando aplicável), data de nascimento
- **Contato:** e-mail, telefone, endereço
- **Navegação:** páginas visitadas, tempo no site, dispositivo, IP
- **Transação:** quando aplicável — itens comprados, valor, forma de pagamento
- **Saúde / Sensível:** quando aplicável (segmento saúde) — informações de consulta, exames

### 4. Para que finalidades usamos
Mapear cada categoria de dado a uma finalidade clara:
- Identificação → criação de conta, emissão de NF
- Contato → resposta a solicitações, agendamento, newsletter (com consent)
- Navegação → métricas agregadas, melhoria do site (analytics)
- Transação → cumprir o pedido, obrigação fiscal
- Saúde → atendimento e prontuário (sob sigilo médico, base legal específica)

### 5. Bases legais
Para cada finalidade, declarar a base legal (consentimento, execução de contrato, etc.). Esta lista vem do `bases_legais_por_finalidade` do input.

### 6. Compartilhamento com terceiros
Lista dos terceiros (Vercel, Supabase, Google Analytics, gateway de pagamento) e finalidade de cada. Sempre incluir aviso de transferência internacional quando o provedor está nos EUA.

### 7. Tempo de retenção
Tabela das categorias × tempo de retenção (vem de `tempo_retencao` do input).

### 8. Direitos do titular
Lista dos 9 direitos do art. 18 + como exercer (link ou e-mail).

### 9. Como protegemos os dados
Medidas técnicas (HTTPS, criptografia em repouso quando aplicável, backup, controle de acesso). Sem detalhar arquitetura sensível.

### 10. Como nos contatar (DPO)
Email + telefone (se aplicável) + prazo de resposta de 15 dias úteis (art. 19 LGPD).

### 11. Histórico de alterações
```
Versão 1.0 — {data-de-geracao}
```

---

## Política de Cookies — seções obrigatórias

### 1. Aviso de template (mesmo do PP)

### 2. O que são cookies
1-2 parágrafos em linguagem acessível.

### 3. Quais cookies usamos
**Tabela** gerada a partir de `cookies_inventariados`:

| Nome | Categoria | Finalidade | Duração | Provedor |
|---|---|---|---|---|
| `_ga` | Analytics | Identificar visitante único | 13 meses | Google |
| `_fbp` | Marketing | Remarketing | 3 meses | Meta |
| `session` | Essencial | Manter sessão | Sessão | Próprio |

### 4. Categorias e seus usos
- **Essenciais:** sem opt-in (necessários pra funcionar)
- **Analytics:** medição agregada
- **Marketing:** remarketing e personalização de anúncios
- **Funcional:** vídeos, mapas, chats

### 5. Como gerenciar seu consentimento
- Banner no primeiro acesso
- Ícone discreto "Preferências de cookies" no rodapé (revisão posterior)
- Bloqueio via navegador (link pras docs Chrome/Firefox/Safari)

### 6. Cookies de terceiros
Lista os provedores que setam cookies fora do domínio do site (Google, Meta) + link pras respectivas políticas.

### 7. Atualização desta política
Mesma seção do PP.

---

## Tom e linguagem

- **Português acessível.** Frase média < 20 palavras. Evitar juridiquês quando possível.
- **2ª pessoa** quando fala com o titular ("você pode solicitar...")
- **3ª pessoa neutra** quando descreve o controlador ("A {empresa} coleta...")
- **Sem promessas absolutas** ("Garantimos 100% de segurança" ❌)
- **Verbos no presente** ("Coletamos" ✓ — não "Coletaremos")
- **Sempre datar** ("Atualizado em {data}")

---

## Saída JSON do Copy Agent quando `tipo === "legal_pages"`

```json
{
  "legal_pages": {
    "politica-de-privacidade": {
      "html": "<!DOCTYPE html>... HTML completo ... </html>",
      "html_inner": "<article>... só o conteúdo, sem layout ... </article>",
      "titulo": "Política de Privacidade",
      "meta_description": "Como a {empresa} coleta, usa e protege seus dados pessoais.",
      "data_atualizacao": "2026-05-26"
    },
    "politica-de-cookies": {
      "html": "...",
      "html_inner": "...",
      "titulo": "Política de Cookies",
      "meta_description": "Quais cookies a {empresa} usa e como controlá-los.",
      "data_atualizacao": "2026-05-26"
    }
  }
}
```

O orchestrator pega `html` e salva como `politica-de-privacidade.html` e `politica-de-cookies.html` na raiz do projeto. O `html_inner` é útil quando o site é SPA — incorporar dentro do layout React/Next.

---

## Exemplos de tons proibidos (anti-patterns)

```
❌ "Ao usar este site, você concorda com nossa Política."
   (consentimento forçado — LGPD exige opt-in explícito)

❌ "Reservamo-nos o direito de alterar esta política sem aviso prévio."
   (LGPD exige comunicação ao titular)

❌ "Seus dados são 100% seguros."
   (promessa absoluta — abre falha em caso de incidente)

❌ "Compartilhamos dados com parceiros selecionados."
   (vago — precisa listar quem)

❌ "Dúvidas? Fale conosco."
   (precisa indicar canal específico — email do DPO)
```

---

## Checklist pré-entrega (Copy Agent valida antes de devolver)

```
[ ] Aviso de template visível no início
[ ] Todos os {placeholders} substituídos por valores reais do input
[ ] Nenhum placeholder remanescente (ex: "{empresa}", "{cnpj}")
[ ] Data de atualização preenchida
[ ] 9+ seções na Política de Privacidade
[ ] Tabela de cookies preenchida (sem "TBD")
[ ] Links pra cookies de terceiros (Google, Meta, etc.) presentes
[ ] Email do DPO listado em ambas as páginas
[ ] Tom em pt-BR coerente, sem juridiquês excessivo
[ ] Saída JSON com html_outer e html_inner pra cada página
```
