# Super Verticale Website

Statische Website für [superverticale.com](https://superverticale.com), ausgeliefert über GitHub Pages (`CNAME`). Es gibt keinen Build-Schritt und keine Abhängigkeiten.

## Lokal starten

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000/` öffnen. Nicht per Doppelklick öffnen, da Root-Pfade und `fetch()` HTTP benötigen.

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Die vollständige Website (einzige Implementierung) |
| `mystery.html` | Öffentliche Mystery-Landingpage mit E-Mail-Signup |
| `test/index.html` | Passwort-Gate für die Vorschau unter `/test/` |
| `event.html` | Event-Seite mit Route (passwortgeschützt) |
| `dashboard.html` | Privates Dashboard (passwortgeschützt) |
| `alternative/` | Alternative Variante der Startseite |
| `css/` | Stylesheets; `mystery.css` gehört zur Mystery-Seite und zum Gate |
| `js/` | Skripte; `site-config.js` ist die zentrale Konfiguration |
| `assets/` | Schriften, Logos, Bilder, Videos, Routen-Daten |
| `backup/` | Frühere Stände |

## Launch-Modus

Die zentrale Einstellung ist `SITE_MODE` in [js/site-config.js](js/site-config.js):

- `'mystery'`: `/` zeigt die Mystery-Landingpage, `/test/` die Vollseite hinter dem Passwort-Gate.
- `'live'`: `/` zeigt die Vollseite, `/test/` leitet auf `/` um.

Zum Veröffentlichen `SITE_MODE` auf `'live'` setzen und deployen; zum Zurücknehmen wieder auf `'mystery'`.

Weitere Einstellungen in derselben Datei:

- `PREVIEW_PASSWORD_SHA256`: SHA-256-Hash des Vorschau-Passworts, erzeugt mit `printf %s 'passwort' | sha256sum`. Das Passwort selbst gehört nicht ins Repository.
- `BREVO_SIGNUP_ENDPOINT`: HTTPS-Endpunkt für das E-Mail-Signup. Solange er leer ist, zeigt das Formular einen Fehler.

Details zu Routing, Brevo-Anbindung und Sicherheitsgrenzen: [MYSTERY_LAUNCH.md](MYSTERY_LAUNCH.md).

## Passwortschutz

Alle Passwortabfragen (`/test/`, `dashboard.html`, `event.html`) laufen clientseitig. Sie sind nur eine dezente Hürde: Quelltext und Assets bleiben auf GitHub Pages direkt abrufbar. Für vertrauliche Inhalte ist ein serverseitiger Schutz nötig, etwa Cloudflare Access.

- `dashboard.html` erwartet die Plotly-Datei unter `assets/plotly-dashboard.html`. Das Passwort wird über den SHA-256-Hash in der Konstante `passwordHash` der Datei festgelegt.
- `event.html` nutzt die Konstante `passwordHash` in [js/event.js](js/event.js).

## Neue Events und Routen

Der Ablauf von der GPX-Datei bis zur interaktiven Route steht in [ROUTE_WORKFLOW.md](ROUTE_WORKFLOW.md).
