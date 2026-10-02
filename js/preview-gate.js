(function () {
  const config = window.SV_CONFIG || {};
  if (config.SITE_MODE === 'live') {
    window.location.replace('/');
    return;
  }

  const form = document.querySelector('#access-form');
  const passwordInput = document.querySelector('#preview-password');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#access-status');
  const expectedHash = config.PREVIEW_PASSWORD_SHA256;

  if (!expectedHash) {
    status.textContent = 'PREVIEW PASSWORD IS NOT CONFIGURED. SEE MYSTERY_LAUNCH.MD.';
    submitButton.disabled = true;
    return;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    status.textContent = 'CHECKING...';

    try {
      const bytes = new TextEncoder().encode(passwordInput.value);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const actualHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');

      if (actualHash !== expectedHash.toLowerCase()) {
        status.textContent = 'INCORRECT PASSWORD. PLEASE TRY AGAIN.';
        passwordInput.focus();
        return;
      }

      const preview = document.createElement('iframe');
      preview.title = 'Super Verticale website preview';
      preview.src = '/index.html';
      preview.style.cssText = 'display:block;width:100%;height:100vh;height:100dvh;border:0';
      document.body.replaceChildren(preview);
    } catch {
      status.textContent = 'PREVIEW CHECK FAILED. USE HTTPS AND TRY AGAIN.';
    } finally {
      if (document.body.contains(form)) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
})();