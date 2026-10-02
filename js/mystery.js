(function () {
  if (window.SV_CONFIG?.SITE_MODE === 'mystery' && window.location.pathname === '/mystery.html') {
    window.history.replaceState(null, '', '/');
  }

  const form = document.querySelector('.signup-form');
  const emailInput = document.querySelector('#signup-email');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.querySelector('.signup-status');
  let submitting = false;

  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (submitting) return;

    if (!form.reportValidity()) return;

    const email = emailInput.value.trim();
    const endpoint = window.SV_CONFIG?.BREVO_SIGNUP_ENDPOINT;
    if (!endpoint) {
      showStatus('SIGNUP IS NOT CONFIGURED YET. PLEASE TRY AGAIN LATER.', 'error');
      return;
    }

    submitting = true;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    showStatus('SENDING...', 'loading');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Signup request failed');
      form.reset();
      showStatus("YOU'RE ON THE LIST. WE'LL BE IN TOUCH.", 'success');
    } catch {
      showStatus('WE COULD NOT COMPLETE YOUR SIGNUP. PLEASE TRY AGAIN.', 'error');
    } finally {
      submitting = false;
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
})();