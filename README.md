# website
Website for Super Verticale

## Privates Dashboard

Die geschützte Dashboard-Seite liegt unter `dashboard.html`. Die Plotly-Datei muss als `assets/plotly-dashboard.html` abgelegt werden.

Das Passwort lautet `ilovemoritz`. Für ein anderes Passwort muss der SHA-256-Hash in `dashboard.html` ersetzt werden.

Der Zugang ist clientseitig umgesetzt und deshalb nur für eine dezente Zugangshürde geeignet. Für vertrauliche Daten sollte zusätzlich ein echter Server- oder Hosting-Schutz verwendet werden.

## Neue Events und Routen

Der komplette Ablauf von der GPX-Datei bis zur interaktiven Route ist in [ROUTE_WORKFLOW.md](ROUTE_WORKFLOW.md) dokumentiert.

## Geschützte Event-Seite

Auch `events.html` ist passwortgeschützt. Sie verwendet dasselbe Passwort wie das Dashboard:

```text
ilovemoritz
```

Die Event-Inhalte werden erst nach erfolgreicher clientseitiger Passwortprüfung angezeigt. Für vertrauliche Inhalte ist zusätzlich ein echter Server- oder Hosting-Schutz erforderlich.
