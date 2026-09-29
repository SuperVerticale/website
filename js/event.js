const passwordHash = 'c7f696b2751c1bbe935f635ff41a16093996544796b30089446717509807af12';
const form = document.querySelector('#login-form');
const passwordInput = document.querySelector('#password');
const status = document.querySelector('#status');
const gate = document.querySelector('#gate');
const eventContent = document.querySelector('#event-content');

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '';

  try {
    if (await sha256(passwordInput.value) !== passwordHash) {
      status.textContent = 'Passwort nicht erkannt.';
      passwordInput.select();
      return;
    }

    gate.classList.add('is-hidden');
    gate.setAttribute('aria-hidden', 'true');
    eventContent.hidden = false;
  } catch (error) {
    status.textContent = 'Passwortprüfung konnte nicht ausgeführt werden.';
  }
});
