(function () {
  const config = window.SV_CONFIG || {};
  if (config.SITE_MODE !== 'mystery' || window.location.pathname !== '/') return;

  document.open();
  document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#342828">
  <title>Super Verticale</title>
  <style>html,body{width:100%;height:100%;margin:0;overflow:hidden}iframe{display:block;width:100%;height:100vh;height:100dvh;border:0}</style>
</head>
<body><iframe title="Super Verticale" src="/mystery.html"></iframe></body>
</html>`);
  document.close();
})();