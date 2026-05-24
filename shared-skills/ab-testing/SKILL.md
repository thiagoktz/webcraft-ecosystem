---
name: ab-testing
description: Use este skill no WebCraft Agent e no Analytics Agent quando o usuário quiser testar variações de elementos (CTAs, headlines, layouts) para otimizar conversão. Implementa testes A/B client-side sem dependência de ferramentas pagas.
---

# Skill: A/B Testing — Testes de Otimização de Conversão

---

## 1. Engine de A/B Testing client-side

```javascript
// ab-testing.js — incluir antes do script principal
const ABTest = {
  // Atribuir variante (persistida por sessão)
  getVariant(testId, variants = ['A', 'B']) {
    const key = `ab_${testId}`;
    let variant = sessionStorage.getItem(key);

    if (!variant) {
      // Distribuição aleatória equiprobável
      variant = variants[Math.floor(Math.random() * variants.length)];
      sessionStorage.setItem(key, variant);
    }

    return variant;
  },

  // Registrar impressão
  track(testId, variant, evento = 'impression') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test', {
        test_id: testId,
        variant: variant,
        event_type: evento
      });
    }
    console.log(`[AB] ${testId} | Variante ${variant} | ${evento}`);
  },

  // Registrar conversão
  convert(testId) {
    const variant = sessionStorage.getItem(`ab_${testId}`);
    if (variant) this.track(testId, variant, 'conversion');
  }
};
```

---

## 2. Implementação por elemento

### Teste de CTA (mais comum):
```html
<div id="cta-container">
  <!-- Preenchido via JS -->
</div>

<script>
  const variant = ABTest.getVariant('cta-hero-test');
  ABTest.track('cta-hero-test', variant);

  const ctas = {
    A: { texto: 'Fale conosco', cor: '#2563EB' },
    B: { texto: 'Agendar avaliação gratuita', cor: '#16A34A' }
  };

  const cta = ctas[variant];
  document.getElementById('cta-container').innerHTML = `
    <button
      onclick="ABTest.convert('cta-hero-test')"
      style="background: ${cta.cor}"
      data-ab-variant="${variant}"
    >${cta.texto}</button>
  `;
</script>
```

### Teste de headline:
```javascript
const variant = ABTest.getVariant('headline-test');
ABTest.track('headline-test', variant);

const headlines = {
  A: 'Recupere seu movimento. Recupere sua vida.',
  B: 'Fisioterapia especializada para quem quer viver sem dor.'
};

document.querySelector('h1').textContent = headlines[variant];
```

### Teste de layout de seção:
```javascript
const variant = ABTest.getVariant('layout-features');
ABTest.track('layout-features', variant);

const section = document.querySelector('.features');
if (variant === 'B') {
  section.classList.add('features--grid-2col'); // layout alternativo via CSS
}
```

---

## 3. Dashboard de resultados (simples)

```javascript
// Exportar dados de sessão para análise
function exportarResultadosAB() {
  const resultados = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith('ab_')) {
      resultados[key.replace('ab_', '')] = sessionStorage.getItem(key);
    }
  }
  return resultados;
}
```

Os resultados completos ficam no GA4:
- Evento: `ab_test`
- Dimensões: `test_id`, `variant`, `event_type`
- Métricas: contagem de impressões vs conversões por variante

---

## 4. Critérios para encerrar um teste

| Critério | Meta |
|---|---|
| Amostra mínima | 100 conversões por variante |
| Duração mínima | 2 semanas |
| Significância estatística | p < 0.05 (95% de confiança) |
| Diferença mínima relevante | ≥ 10% de melhoria |

---

## 5. O que testar primeiro (por impacto)

1. **CTA do hero** — maior impacto em conversão
2. **Headline do hero** — segunda maior influência
3. **Número de campos no formulário** — menos campos = mais conversão
4. **Posição do CTA** — acima vs abaixo do fold
5. **Cor do botão principal** — contraste e hierarquia visual

---

## 6. Checklist de A/B Test

- [ ] `ABTest.getVariant()` chamado antes de renderizar elemento
- [ ] `ABTest.track()` chamado após atribuição de variante
- [ ] `ABTest.convert()` chamado em todas as conversões relevantes
- [ ] Variante persistida em `sessionStorage` (não `localStorage`)
- [ ] GA4 configurado para receber eventos `ab_test`
- [ ] Apenas 1 teste ativo por elemento por vez
- [ ] Critério de encerramento definido antes de iniciar
