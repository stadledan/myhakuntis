# myHAKWels

Die inoffizielle Schul-App der HAK Wels als installierbare Web-App (PWA).
Vier Tabs, echte WebUntis-Daten:

- **Heute** – Dashboard: aktuelle/nächste Stunde + alle Änderungen (Entfälle, Vertretungen, Verlegungen, Raumänderungen, Schularbeiten) auf einen Blick, ohne suchen zu müssen.
- **Plan** – kompletter Stundenplan als Tages- und Wochenansicht (für Hochformat optimiert).
- **Hausübung** – alle eingetragenen Hausübungen der nächsten zwei Wochen.
- **Fehlzeiten** – Abwesenheiten des Schuljahres mit Status (offen / entschuldigt).

## Veröffentlichen (GitHub Pages)
1. Alle Dateien dieses Ordners ins GitHub-Repo laden.
2. Settings → Pages → Branch wählen → Save.
3. Am Handy öffnen → Safari: Teilen → „Zum Home-Bildschirm“. (Android/Chrome: Menü → „App installieren“.)

## Einrichtung in der App
1. Beim ersten Start: Cloudflare-Worker anlegen (Anleitung direkt im Setup-Screen, kostenlos) und Worker-URL eintragen.
2. Mit WebUntis-Benutzer + Geheimschlüssel (TOTP) anmelden.
   Den Geheimschlüssel findest du in WebUntis: Profil → Freigabe → Zwei-Faktor-Authentifizierung → Anzeigen.

## Wichtig: Worker v4
Damit **Hausübungen** und **Fehlzeiten** geladen werden, muss der aktuelle Worker-Code (v4) bei Cloudflare aktiv sein:
Cloudflare → deinen Worker → **Edit code** → Inhalt von `cloudflare-worker.js` einfügen → **Deploy**.
Der Stundenplan und die Änderungen funktionieren auch ohne das.
Die Fehlzeiten sind experimentell – wenn WebUntis sie für Apps nicht freigibt, zeigt der Tab einen Hinweis mit Link zu WebUntis.

## Dateien
- `index.html` – die komplette App
- `manifest.json`, `sw.js`, `icon-*.png`, `apple-touch-icon.png`, `logo-hak*.png`
