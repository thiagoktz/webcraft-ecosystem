---
name: security
description: Use este skill no WebCraft Agent em toda geração de site. Garante headers de segurança, sanitização de inputs de formulários, proteção contra XSS e boas práticas de HTTPS.
---

# Skill: Security — Segurança em Websites

---

## 1. Headers de segurança (Netlify / Vercel)

### `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:;"
```

### `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 2. Sanitização de inputs

```javascript
function sanitizarInput(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Nunca usar innerHTML com input do usuário
// ❌ elemento.innerHTML = inputUsuario;
// ✅ elemento.textContent = sanitizarInput(inputUsuario);
```

---

## 3. Proteção de formulários

```html
<!-- Honeypot — detectar bots -->
<form>
  <!-- Campo invisível para humanos, visível para bots -->
  <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">

  <!-- Campos reais -->
  <input type="text" name="nome" required>
  <input type="email" name="email" required>
</form>

<script>
  document.querySelector('form').addEventListener('submit', (e) => {
    // Se honeypot preenchido, é bot
    if (e.target.querySelector('[name="website"]').value) {
      e.preventDefault();
      return;
    }
    // Continuar com envio normal
  });
</script>
```

---

## 4. Checklist de segurança

- [ ] Headers de segurança configurados (`netlify.toml` ou `vercel.json`)
- [ ] Sem `eval()` no código
- [ ] Sem `innerHTML` com input de usuário
- [ ] Inputs de formulários sanitizados antes de qualquer processamento
- [ ] Honeypot em formulários públicos
- [ ] Sem API keys ou tokens no código client-side
- [ ] Links externos com `rel="noopener noreferrer"`
- [ ] HTTPS assumido em todas as URLs (sem `http://` hardcoded)
