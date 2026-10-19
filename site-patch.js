/* GitHub Pages additions shared by the exported marketing pages. */
(() => {
  const path = '/interesse/';
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
    for (const form of document.querySelectorAll('form.contact-form')) {
      if (form.dataset.githubContact === 'true') continue;
      form.dataset.githubContact = 'true';
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = 'Préparer ma demande ↗';
      const note = form.querySelector('.contact-submit p');
      if (note) note.textContent = 'Votre messagerie s’ouvre pour confirmer l’envoi de la demande.';
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const subject = `Projet FIDELITIZ — ${data.get('business') || 'nouveau commerce'}`;
        const body = `Bonjour FIDELITIZ,\n\nEntreprise : ${data.get('business') || ''}\nContact : ${data.get('firstName') || ''} ${data.get('lastName') || ''}\nE-mail : ${data.get('email') || ''}\nTéléphone : ${data.get('phone') || ''}\nObjet : ${data.get('interest') || ''}\n\n${data.get('message') || ''}\n\nConsentement au traitement pour répondre à cette demande : oui.`;
        const info = form.querySelector('.contact-submit p');
        if (info) info.textContent = 'Votre messagerie s’ouvre. Vérifiez puis envoyez votre e-mail.';
        window.location.href = `mailto:bonjour@fidelitiz.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
