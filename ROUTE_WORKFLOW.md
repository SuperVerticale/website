# Route-Workflow

Diese Anleitung beschreibt den Ablauf von einer neuen GPX-Datei bis zur interaktiven Route auf der Event-Seite.

## 1. GPX ablegen

Die neue Datei kommt nach:

```text
assets/route/<EventName>.gpx
```

Am besten einen kurzen, eindeutigen Dateinamen ohne Leerzeichen verwenden, zum Beispiel:

```text
assets/route/Adventlauf2028.gpx
```

Die GPX sollte `trkpt`-Punkte mit `lat`, `lon` und `ele` enthalten. Wegpunkte (`wpt`) können später für Start, Ziel oder Verpflegungspunkte ergänzt werden.

## 2. GPX prüfen

Im Workspace ausführen:

```bash
wc -l assets/route/Adventlauf2028.gpx
```

Die Datei sollte viele Trackpunkte und Höhenwerte enthalten. Eine schnelle Prüfung der Struktur:

```bash
grep -o '<trkpt\|<ele>[^<]*' assets/route/Adventlauf2028.gpx | head -30
```

## 3. Detail-JSON erstellen

Aus jedem GPX-Trackpunkt werden folgende Werte erzeugt:

```json
{
  "distanceKm": 0.06,
  "elevationM": 657.6,
  "lat": 46.5406,
  "lon": 14.77459
}
```

`distanceKm` ist die kumulierte horizontale Entfernung zwischen den GPS-Punkten. Für jedes benachbarte Punktpaar wird zusätzlich berechnet:

```text
slopePct = elevationChangeM / distanceM * 100
```

Die Detaildatei enthält:

```text
assets/route/<EventName>-detailed.json
```

Empfohlene Struktur:

```json
{
  "name": "Event name",
  "source": "EventName.gpx",
  "type": "trail_running",
  "resolution": "original GPX trackpoints",
  "stats": {
    "distanceKm": 10.1,
    "elevationGainM": 1074,
    "elevationLossM": 21,
    "startElevationM": 653,
    "finishElevationM": 1707,
    "highestPointM": 1711,
    "lowestPointM": 653
  },
  "classification": {
    "flach": "-5 bis 5%",
    "moderat": "5 bis unter 10%",
    "steil": "10 bis unter 15%",
    "sehr steil": "ab 15%",
    "bergab": "unter -5%"
  },
  "points": [],
  "segments": []
}
```

Wichtig: Für die interaktive Darstellung alle Originalpunkte verwenden, nicht nur eine geglättete Auswahl. Sonst verschwinden kurze steile Rampen.

## 4. Interaktive HTML kopieren

Die bestehende Datei kopieren:

```text
assets/route/PetzensuperVerticale-interactive.html
```

Neue Datei:

```text
assets/route/<EventName>-interactive.html
```

In der kopierten Datei mindestens diese Werte ersetzen:

```js
const dataUrl = '<EventName>-detailed.json';
```

Falls die neue Strecke eine andere Ausrichtung braucht, den Wert bei `angle` anpassen. Die Route wird aktuell mit der effektiven Rotation von `513` Grad dargestellt:

```js
const angle = 513 * Math.PI / 180;
```

Der Kompass muss dieselbe Kartenrotation verwenden:

```js
transform: 'rotate(513 1060 125)'
```

Die vorhandenen Hover-Funktionen können unverändert bleiben. Route und Höhenprofil greifen auf denselben `index` zu. Dadurch sind Kilometer, kumulierter Höhengewinn und Steigung synchron.

## 5. Event-Seite anpassen

In `events.html` die Bildquelle der interaktiven Darstellung ersetzen:

```html
<iframe
  class="interactive-route"
  src="assets/route/<EventName>-interactive.html"
  title="Interactive GPS route and elevation profile">
</iframe>
```

Danach die vier Kennzahlen aktualisieren:

```html
Distance
Elevation gain
Start elevation
Finish elevation
```

Auch Eventname, Ort und Browser-Titel in `events.html` anpassen.

## 6. Lokalen Test starten

```bash
python3 -m http.server 8000
```

Dann öffnen:

```text
http://localhost:8000/events.html
```

Nicht per Doppelklick öffnen: `fetch()` der JSON-Datei funktioniert zuverlässig nur über HTTP.

## 7. Test-Checkliste

- Route wird vollständig angezeigt.
- Start und Finish liegen im sichtbaren Bereich.
- Kompass zeigt passend zur Kartenrotation.
- Hover über Route zeigt Kilometer, elevation gain und Steigung.
- Hover über Profil markiert dieselbe Kilometerposition auf der Route.
- Tooltip wird am rechten und unteren Fensterrand nicht abgeschnitten.
- Mobile Breite prüfen.
- Alle vorhandenen statischen SVGs bleiben erhalten.

## Aktueller Petzen-Stand

```text
GPX: assets/route/PetzensuperVerticale.gpx
Detaildaten: assets/route/PetzensuperVerticale-detailed.json
Interaktiv: assets/route/PetzensuperVerticale-interactive.html
Statische Route: assets/route/PetzensuperVerticale-route.svg
Statisches Profil: assets/route/PetzensuperVerticale-profile.svg
Kombinierte Grafik: assets/route/PetzensuperVerticale-combined.svg
```

Die interaktive Datei nutzt die relative Datenquelle `PetzensuperVerticale-detailed.json`, weil HTML und JSON im selben Ordner liegen.
