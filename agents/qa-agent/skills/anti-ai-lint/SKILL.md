---
name: anti-ai-lint
description: Use este skill no QA Agent SEMPRE que houver copy escrita por LLM no output (toda copy gerada pelo Copy Agent ou WebCraft). Detecta sinais óbvios de texto escrito por IA — travessões, abrideiras estereotipadas, paralelismos formulaicos — que comprometem a percepção de autenticidade da marca.
---

# Skill: Anti-AI Lint — Detecção de Sinais de IA na Copy

LP B2B feita pra conversão é lida por humanos que cada vez mais reconhecem (e desconfiam) de texto gerado por IA. Travessões inline, abrideiras como *"É importante notar que..."* e estruturas paralelas mecânicas (*"Não é X. É Y."*) são tells fortes que matam a percepção de autoridade.

Este skill é **obrigatório** no QA Agent. Issues encontradas aqui entram no campo `issues` do output JSON com `category: "copy-ai-lint"`.

---

## 1. Tells de pontuação (críticos — bloqueiam aprovação)

### 1.1. Travessão `—` (em-dash) usado inline

O em-dash é a pegada digital nº 1 de texto escrito por LLM. Humanos brasileiros raramente usam — preferem ponto, vírgula ou parênteses.

**Verificação:**

```bash
# Detecta TODOS os em-dashes no HTML…
grep -nE '—' index.html | \
  # …mas exclui os decorativos intencionais:
  grep -v 'aria-hidden\|aria-label\|class="dash"\|pull-author'
```

**Decorativos permitidos (whitelist):**
- `<span class="dash" aria-hidden="true">—</span>` — elemento gráfico antes do subtítulo
- `aria-label="Brand — Tagline"` — branding em link/botão
- `<p class="pull-author">— TK</p>` — assinatura tradicional de pull quote
- `<title>` ou meta tags com brand divider (raro, avaliar caso a caso)

**Fixes:**
- `"X — Y"` → `"X. Y."` (mais comum, dá pausa natural)
- `"X — Y"` → `"X, Y"` (quando Y é continuação direta)
- `"X — Y"` → `"X (Y)"` (quando Y é aposto explicativo)
- Reescrever a frase inteira se nenhum substituto soar bem

### 1.2. En-dash `–` em ranges textuais

OK em ranges numéricos (`5–10 dias`). Crítico se aparece entre palavras.

### 1.3. Hyphen-minus `-` usado como dash

Outro tell mecânico. Padrão: `palavra - palavra` (espaços ao redor).

```bash
grep -nE '[a-zA-ZáéíóúâêôãõçÀ-ÿ] - [a-zA-ZáéíóúâêôãõçÀ-ÿ]' index.html
```

---

## 2. Tells lexicais — abrideiras estereotipadas (críticos)

LLMs têm fixação por frases-âncora. Se aparecer alguma destas, considerar bloqueador:

### 2.1. Abrideiras com "É [adjetivo] [...]"

```bash
grep -niE '\bÉ (importante|essencial|fundamental|interessante|crucial|vital|crítico) (notar|destacar|ressaltar|mencionar|saber|entender)' index.html
```

| Padrão | Fix |
|---|---|
| "É importante notar que…" | Cortar abertura, começar direto |
| "É essencial entender…" | Cortar |
| "Vale ressaltar que…" | Cortar |
| "Vale destacar…" | Cortar |
| "É interessante mencionar…" | Cortar |

### 2.2. Convites genéricos

```bash
grep -niE '\b(imagine que|imagine o)|vamos (mergulhar|explorar|descobrir)|em um mundo (onde|cada vez)' index.html
```

| Padrão | Fix |
|---|---|
| "Imagine que…" | Reescrever sem framing hipotético |
| "Vamos mergulhar em…" | Cortar, ir direto |
| "Vamos explorar…" | Cortar |
| "Em um mundo onde X, Y" | Reescrever sem o framing épico |

### 2.3. Conclusões formulaicas

```bash
grep -niE '\b(em conclusão|para finalizar|para concluir|em suma|por fim)' index.html
```

Fix: corte total. Vá direto pro CTA.

---

## 3. Tells lexicais — vocabulário (warnings)

### 3.1. Intensificadores artificiais

```bash
grep -niE '\b(verdadeiramente|de fato|realmente|genuinamente|simplesmente|literalmente|absolutamente)\b' index.html
```

| Palavra | Quando é OK | Quando é tell |
|---|---|---|
| "de fato" | Não é OK | Quase sempre tell — corte |
| "verdadeiramente" | Nunca | Sempre tell |
| "realmente" | Conversa informal | Tell em copy formal |
| "simplesmente" | Imperativo curto ("Simplesmente faça") | Tell se enche linguiça |
| "literalmente" | Sentido técnico | Tell se enfatiza |

### 3.2. Conectores paralelos

```bash
grep -niE '(não apenas|tanto.*quanto|não se trata apenas|mais do que apenas|combina.*com|integra.*e)' index.html
```

| Padrão | Fix |
|---|---|
| "Não apenas X, mas também Y" | "X e Y" — direto |
| "Tanto X quanto Y" | "X e Y" |
| "Não se trata apenas de X, mas de Y" | Cortar abertura, dizer só Y |
| "Mais do que apenas [substantivo], é [substantivo]" | Escolher 1 dos lados |
| "Combina X com Y" | "X + Y" ou reescrever |
| "Integra X e Y de forma perfeita" | Cortar advérbio + reescrever |

### 3.3. Frases-clichê de venda

| Padrão | Severidade | Fix |
|---|---|---|
| "Sua marca/oferta/produto merece…" | Warning | Avaliar — pode ser brand voice intencional |
| "Que faz toda a diferença" | Crítico | Cortar |
| "Que realmente importa" | Warning | Substituir por específico |
| "Esses pequenos detalhes…" | Crítico | Cortar |
| "Resultados que falam por si" | Crítico | Substituir por números reais |
| "Não é só [N], é [N+1]" (declarativo) | Warning | Pode ser brand, avaliar |

---

## 4. Tells estruturais (warnings)

### 4.1. Triplets paralelos mecânicos

```
X. Y. Z.
A faz B. A faz C. A faz D.
Não X. Não Y. Não Z.
```

Três frases curtas em paralelo idêntico = tell. **Exceção:** se for o estilo declarado da marca (ex: hero copy direto), aceitar — apenas garantir que não se repete em toda seção.

**Como avaliar:** se na mesma página aparece mais de uma vez essa estrutura, marcar warning.

### 4.2. Hedging excessivo

```bash
grep -niE '\b(talvez|possivelmente|provavelmente|de certa forma|de alguma forma|em geral)\b' index.html
```

Mais de 2 ocorrências num parágrafo = warning. Copy persuasiva precisa de afirmação, não dúvida.

### 4.3. Listas paralelas com bullets idênticos

Bullets de tamanho e estrutura idênticos (4 itens, todos começam com verbo + objeto idêntico, todos com a mesma extensão) = padrão IA. Variar tamanho e estrutura.

---

## 5. Whitelist — patterns aceitáveis

Antes de marcar tudo como tell, lembrar:

- **Brand voice declarado**: se o tom-of-voice da marca é "declarativo direto" (ex: "Linear-style"), triplets curtos são intencionais
- **CTA imperative**: "Falar no WhatsApp", "Pedir orçamento" — não é tell, é imperativo de ação
- **Decorative elements**: tudo com `aria-hidden="true"` ou class `.dash`, `.eyebrow`, etc é decorativo
- **Brand statements**: pull quotes assinados (`— TK`) seguem convenção tipográfica clássica
- **Termos técnicos**: "white-label", "performance" etc, mesmo se LLM os use, são vocabulário do domínio
- **Citações reais**: depoimentos de clientes mantêm a fala original mesmo com pattern AI

---

## 6. Comando único de varredura (sample script)

```bash
#!/bin/bash
# anti-ai-lint.sh — roda os principais checks de uma vez
TARGET="${1:-index.html}"

echo "=== TRAVESSÕES INLINE (críticos) ==="
grep -nE '—' "$TARGET" | grep -v 'aria-hidden\|aria-label\|class="dash"\|pull-author' || echo "  ✓ nenhum"

echo ""
echo "=== HÍFEN COMO DASH (críticos) ==="
grep -nE '[a-zA-ZáéíóúâêôãõçÀ-ÿ] - [a-zA-ZáéíóúâêôãõçÀ-ÿ]' "$TARGET" || echo "  ✓ nenhum"

echo ""
echo "=== ABRIDEIRAS FORMULAICAS (críticos) ==="
grep -niE '\bÉ (importante|essencial|fundamental|interessante|crucial) (notar|destacar|ressaltar|mencionar|saber|entender)|\b(imagine que|imagine o)|vamos (mergulhar|explorar|descobrir)|em um mundo (onde|cada vez)|\b(em conclusão|para finalizar|para concluir|em suma)' "$TARGET" || echo "  ✓ nenhum"

echo ""
echo "=== INTENSIFICADORES ARTIFICIAIS (warnings) ==="
grep -niE '\b(verdadeiramente|de fato|genuinamente|absolutamente)\b' "$TARGET" || echo "  ✓ nenhum"

echo ""
echo "=== CONECTORES PARALELOS (warnings) ==="
grep -niE '(não apenas.*mas também|tanto.*quanto|não se trata apenas|mais do que apenas|combina.*com.*de forma|integra.*de forma)' "$TARGET" || echo "  ✓ nenhum"

echo ""
echo "=== CLICHÊS DE VENDA (mix) ==="
grep -niE '(que faz toda a diferença|que realmente importa|esses pequenos detalhes|resultados que falam por si)' "$TARGET" || echo "  ✓ nenhum"
```

---

## 7. Integração no JSON do QA Agent

Issues encontradas entram em `issues` com schema:

```json
{
  "severity": "critical" | "warning" | "info",
  "category": "copy-ai-lint",
  "description": "Travessão inline em [contexto]",
  "location": "linha 202, dentro de .entry-desc",
  "matched_pattern": "—",
  "fix": "Substituir por ponto: 'Sem template genérico. Foi feita pra você converter.'"
}
```

### Severidade por tipo

| Tipo de tell | Severidade |
|---|---|
| Em-dash inline (fora da whitelist) | **critical** |
| Hyphen-as-dash | **critical** |
| "É importante notar…", "Vamos mergulhar…", "Em um mundo onde…" | **critical** |
| "Em conclusão", "Para finalizar" | **critical** |
| "De fato", "Verdadeiramente", "Genuinamente" | warning |
| "Não apenas X, mas também Y" | warning |
| "Combina X com Y" | warning |
| Triplets paralelos repetidos | warning |
| Hedging excessivo (>2 num parágrafo) | warning |
| Bullets idênticos em estrutura | info |
| "Sua oferta merece…" (avaliar contexto) | info |

---

## 8. Princípio editorial subjacente

Copy escrita por humano brasileiro tende a:

- **Variar pontuação** — mistura ponto, vírgula, parênteses; raramente em-dash
- **Cortar abrideiras** — vai direto pro ponto
- **Variar comprimento de frase** — alterna curta-média-longa
- **Usar voz ativa** — "Eu construo" mais que "É construído"
- **Específicos sobre genéricos** — "CPL caiu de R$15 pra R$6" beats "Resultados que falam por si"
- **Coloquialismos quando o tom permite** — "pra", "tá", "rolar"

Quando em dúvida: leia em voz alta. Se você não diria isso conversando, provavelmente é tell.

---

## Limites do skill

- **Não rode em conteúdo de terceiros** (depoimentos com permissão preservam a fala original)
- **Não corrija automaticamente** — apenas reporte. A correção fica com o Copy Agent ou pelo usuário
- **Falsos positivos esperados**: o grep pega "combina" dentro de "combinado", "integra" em "integrações", etc. Reportar com contexto pra usuário avaliar
- **Brand voice tem prioridade**: se o `taste.md` do projeto declara estilo paralelista intencional, reduzir severidade dos tells estruturais a `info`
