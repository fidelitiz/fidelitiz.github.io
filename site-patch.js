/* GitHub Pages additions shared by the exported marketing pages. */
(() => {
  const path = 'https://fidelitiz-pro-beta.github.io/#contact';
  const style = document.createElement('style');
  style.textContent = '.nav-links>.interest-nav{background:#1c1712;color:#fff8e9;white-space:nowrap}.nav-links>.interest-nav:hover,.nav-links>.interest-nav:focus-visible{background:#5b2f22;color:#fff8e9}@media(max-width:1050px){.nav-links>a[href="#commerces"]{display:none}}@media(max-width:760px){.nav-links .solutions-menu{display:none}.nav-links>.interest-nav{display:inline-flex!important;padding:9px 11px;font-size:12px}.nav-end,.nav-links{gap:9px!important}}@media(max-width:390px){.nav>.brand-logo{transform:scale(.94);transform-origin:left center}.nav{width:calc(100% - 26px)!important}.nav-end .account-trigger{width:41px;min-height:41px}}';
  document.head.append(style);

  function patch() {
    for (const img of document.querySelectorAll('img[data-nimg]')) {
      const encoded = new URL(img.getAttribute('src') || '', location.origin).searchParams.get('url');
      if (!encoded?.startsWith('/') || !img.getAttribute('src')?.includes('/_next/image?')) continue;
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src = encoded;
    }
    for (const nav of document.querySelectorAll('nav.nav')) {
      const links = nav.querySelector('.nav-links');
      if (!links || links.querySelector('.interest-nav')) continue;
      const anchor = document.createElement('a');
      anchor.className = 'nav-cta interest-nav';
      anchor.href = path;
      anchor.textContent = 'Intéressé ?';
      links.append(anchor);
    }
    for (const link of document.querySelectorAll('a[href^="mailto:"]')) {
      if (!link.href.includes('@fidelitiz.fr')) continue;
      link.href = path;
      if (link.textContent?.includes('@fidelitiz.fr')) link.textContent = 'Nous contacter';
      else if (link.textContent?.trim() === 'Écrire à l’équipe') link.textContent = 'Contacter l’équipe';
    }
    for (const form of document.querySelectorAll('form.contact-form')) {
      if (form.dataset.githubContact === 'true') continue;
      form.dataset.githubContact = 'true';
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = 'Envoyer ma demande ↗';
      const note = form.querySelector('.contact-submit p');
      if (note) note.textContent = 'Nous vous recontacterons après réception de votre demande.';
      const phone = form.elements.namedItem('phone');
      if (phone) phone.required = true;
      form.addEventListener('submit', async event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const info = form.querySelector('.contact-submit p');
        if (button) button.disabled = true;
        if (info) info.textContent = 'Envoi en cours…';
        try {
          const response = await fetch('https://fidelitiz-api.lesbazeilles-robin.workers.dev/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ mode: 'manual', business: data.get('business'), firstName: data.get('firstName'), lastName: data.get('lastName'), email: data.get('email'), phone: data.get('phone'), message: data.get('message') || '', consent: data.get('consent') !== null }),
          });
          if (!response.ok) throw new Error('Envoi indisponible. Réessayez dans un instant.');
          form.reset();
          if (info) info.textContent = 'Votre demande a bien été envoyée. Nous vous contacterons rapidement.';
        } catch (error) {
          if (info) info.textContent = error.message || 'Connexion indisponible. Réessayez dans un instant.';
        } finally {
          if (button) button.disabled = false;
        }
      }, true);
    }
  }
  patch();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patch, { once: true });
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; patch(); });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
