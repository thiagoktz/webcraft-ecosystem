---
name: forms-backend
description: Use este skill no WebCraft Agent quando o site tiver formulários de contato, captura de leads ou pedidos. Garante que os dados enviados cheguem ao destino — via Netlify Forms, Formspree, EmailJS ou WhatsApp — sem necessidade de backend próprio.
---

# Skill: Forms Backend — Envio de Formulários sem Backend

---

## Opções por plataforma de deploy

| Plataforma | Solução recomendada | Custo |
|---|---|---|
| Netlify | Netlify Forms (nativo) | Grátis até 100/mês |
| Vercel | Formspree ou EmailJS | Grátis até 50/mês |
| Qualquer | WhatsApp redirect | Grátis |
| Qualquer | EmailJS | Grátis até 200/mês |

---

## 1. Netlify Forms (mais simples)

```html
<form name="contato" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contato">
  <input type="text" name="bot-field" style="display:none">

  <label for="nome">Nome</label>
  <input type="text" id="nome" name="nome" required>

  <label for="email">E-mail</label>
  <input type="email" id="email" name="email" required>

  <label for="mensagem">Mensagem</label>
  <textarea id="mensagem" name="mensagem" rows="4" required></textarea>

  <button type="submit">Enviar mensagem</button>
</form>

<!-- Página de sucesso (opcional) -->
<div id="sucesso" hidden>
  <p>Mensagem enviada! Retornaremos em até 24h.</p>
</div>

<script>
  const form = document.querySelector('form[name="contato"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });

    if (response.ok) {
      form.hidden = true;
      document.getElementById('sucesso').hidden = false;
    }
  });
</script>
```

---

## 2. Formspree (Vercel ou qualquer host)

```html
<form action="https://formspree.io/f/SEU-ID-AQUI" method="POST">
  <input type="text" name="nome" required>
  <input type="email" name="_replyto" required>
  <textarea name="mensagem" required></textarea>
  <input type="hidden" name="_subject" value="Novo contato pelo site">
  <input type="text" name="_gotcha" style="display:none">
  <button type="submit">Enviar</button>
</form>
```

---

## 3. EmailJS (sem backend, direto do browser)

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>
  emailjs.init('SUA-PUBLIC-KEY');

  document.querySelector('#form-contato').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      await emailjs.sendForm('SEU-SERVICE-ID', 'SEU-TEMPLATE-ID', e.target);
      btn.textContent = 'Enviado! ✓';
      e.target.reset();
    } catch (error) {
      btn.textContent = 'Erro — tente novamente';
      btn.disabled = false;
    }
  });
</script>
```

---

## 4. WhatsApp (mais comum no Brasil)

```javascript
function enviarPorWhatsApp(form) {
  const dados = new FormData(form);
  const telefone = '5511999999999';

  const mensagem = `
*Novo contato pelo site*

*Nome:* ${dados.get('nome')}
*E-mail:* ${dados.get('email')}
*Mensagem:* ${dados.get('mensagem')}
  `.trim();

  window.open(
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
    '_blank'
  );
}
```

---

## 5. Estados do formulário (UX obrigatório)

```javascript
const estados = {
  idle: () => {
    btn.textContent = 'Enviar mensagem';
    btn.disabled = false;
  },
  loading: () => {
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
  },
  success: () => {
    form.hidden = true;
    successMsg.hidden = false;
    successMsg.focus(); // acessibilidade
  },
  error: (msg) => {
    errorMsg.textContent = msg || 'Algo deu errado. Tente novamente.';
    errorMsg.hidden = false;
    errorMsg.setAttribute('role', 'alert');
    btn.textContent = 'Tentar novamente';
    btn.disabled = false;
  }
};
```

---

## 6. Checklist de formulários

- [ ] Solução de backend escolhida e configurada
- [ ] Honeypot anti-spam presente
- [ ] Validação client-side em todos os campos obrigatórios
- [ ] Estados idle / loading / success / error implementados
- [ ] Mensagem de sucesso com foco (acessibilidade)
- [ ] Erro tratado com mensagem clara ao usuário
- [ ] Labels associados a todos os inputs
- [ ] `autocomplete` configurado nos campos relevantes
