(function () {
  const config = window.SV_CONFIG || {};
  if (config.SITE_MODE !== 'mystery' || window.location.pathname !== '/') return;

  // The full site is never parsed in Mystery mode; the landing page restores "/" in the address bar.
  window.location.replace('/mystery.html' + window.location.search + window.location.hash);
})();
