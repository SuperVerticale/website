# Mystery launch

## Routing

`index.html` remains the single implementation of the complete website. Its early entry script replaces the root view with `mystery.html` only when `SITE_MODE` is `mystery`. The static `test/index.html` entry works on GitHub Pages directory routes and reveals the existing `index.html` in an iframe only after the configured password hash matches. Root-relative asset URLs keep both entry paths working.

## Preview gate

Set `PREVIEW_PASSWORD_SHA256` in `js/site-config.js` to the lowercase SHA-256 hex digest of the preview password. The gate stays disabled until this value is configured. Generate it locally with:

```sh
printf %s 'your-preview-password' | sha256sum
```

Copy only the first output field into the setting. Do not put the actual password in the repository. The hash is still public client-side data and can be guessed or bypassed; this is only a temporary deterrent, not access control. In particular, `/index.html`, its source, and its assets remain directly accessible on static GitHub Pages. Use Cloudflare Access or another server-side gate before sharing confidential previews.

## Brevo signup

Configure `BREVO_SIGNUP_ENDPOINT` in `js/site-config.js` with an HTTPS endpoint you control. The page sends `POST` JSON `{ "email": "..." }` and reports success only for a successful HTTP response. If unset or unsuccessful, it displays an error and does not claim the address was saved. A cross-origin endpoint must allow this site's origin through CORS; a same-origin endpoint avoids that requirement.

The endpoint must keep the Brevo API key server-side, validate requests, and add the contact through a Brevo double-opt-in flow. Configure the endpoint to return a successful status only after Brevo has accepted the DOI request. No Brevo endpoint or credentials are currently present in this repository.

## Release switch

To launch the complete website at `/`, change only `SITE_MODE` in `js/site-config.js` from `'mystery'` to `'live'`, then deploy. The original `index.html` is rendered directly; `/test/` redirects to `/`. To reverse the release, restore `'mystery'` and deploy again. The preview hash and signup endpoint are independent settings.

GitHub Pages serves `/test/` from `test/index.html`; `/test` may first redirect to the trailing-slash URL. This repository has a GitHub remote and custom-domain `CNAME`, but no tracked Pages workflow, Cloudflare Worker, Functions, or server-side configuration. The routing therefore uses static files and requires JavaScript. The `<noscript>` fallback sends root visitors to the Mystery page if scripts are disabled.