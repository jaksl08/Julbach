# THE ARCHIVE — Privates Party-Archiv

Ein statisches, passwortgeschütztes Foto-, Video- und Story-Archiv für dich und deine Freunde. Läuft komplett ohne Backend, ohne Datenbank, ohne Server — direkt auf **GitHub Pages**.

---

## ⚠️ Wichtiger Hinweis zur Sicherheit

Diese Website prüft das Passwort **nur im Browser mit JavaScript**. Das bedeutet:

- Der komplette Quellcode — inklusive des Passworts in `script.js` — liegt öffentlich auf GitHub und ist für jeden einsehbar, der das Repository (auch als "privat" markiert, sobald die Seite live ist) oder die veröffentlichten Dateien anschaut.
- Eine technisch versierte Person kann das Passwort im Code finden oder die Passwortabfrage komplett umgehen (z. B. über die Browser-Entwicklertools).
- Es gibt **keinen echten Server**, der prüft, wer Zugriff bekommt — die "Tür" ist nur so sicher wie die Bereitschaft der Leute, den Code nicht anzuschauen.

**Das ist für eine private Spaß-Seite unter Freunden völlig okay** — es hält zufällige Besucher und Suchmaschinen fern und sorgt für ein schönes Login-Erlebnis. Es ist aber **kein echter Schutz für wirklich vertrauliche oder sensible Daten**. Lade hier nichts hoch, das nicht in falsche Hände geraten darf.

Wenn du später echten Schutz willst, bräuchtest du ein privates Repository mit einem echten Login-System (z. B. GitHub Pages + Cloudflare Access, oder ein Hosting mit Backend/Login).

---

## 1. Ordnerstruktur

```
/
├── index.html          ← Hauptseite (Login + gesamte App)
├── style.css            ← Design (dunkles Glassmorphism-Theme)
├── script.js             ← Logik, Passwort, Rendering, Lightbox, Player
├── images/               ← Deine Fotos kommen hierhin
│   └── placeholder.jpg   ← Platzhalter, falls ein Bild fehlt
├── videos/               ← Deine Videos + Vorschaubilder kommen hierhin
└── data/
    ├── photos.js         ← Liste aller Fotos (bearbeitbar)
    ├── videos.js         ← Liste aller Videos (bearbeitbar)
    ├── stories.js        ← Liste aller Stories (bearbeitbar)
    └── events.js         ← Liste aller Events / Timeline (bearbeitbar)
```

Die Seite ist bereits mit Beispiel-Inhalten (Platzhalter-Grafiken, keine externen Bilder) befüllt und **funktioniert sofort**, wenn du sie hochlädst.

---

## 2. Repository auf GitHub erstellen

1. Auf [github.com](https://github.com) einloggen.
2. Oben rechts auf das **„+“** klicken → **„New repository“**.
3. Einen Namen vergeben, z. B. `friends-party-archive`.
4. Sichtbarkeit: **Public** wählen (GitHub Pages ist mit kostenlosen Accounts nur bei öffentlichen Repos verfügbar — denk an den Sicherheitshinweis oben!).
5. **Nicht** „Add a README“ ankreuzen, da du bereits Dateien hochlädst.
6. Auf **„Create repository“** klicken.

---

## 3. Dateien hochladen

**Variante A — im Browser (am einfachsten):**

1. Im neu erstellten Repository auf **„uploading an existing file“** (oder **„Add file“ → „Upload files“**) klicken.
2. Alle Dateien und Ordner aus diesem Projekt hineinziehen (`index.html`, `style.css`, `script.js`, sowie die Ordner `images/`, `videos/`, `data/`).
3. Unten einen Commit-Kommentar eingeben, z. B. „Erste Version der Website“.
4. Auf **„Commit changes“** klicken.

**Variante B — mit Git (für Fortgeschrittene):**

```bash
git clone https://github.com/DEIN-USERNAME/friends-party-archive.git
cd friends-party-archive
# alle Projektdateien hier hineinkopieren
git add .
git commit -m "Erste Version der Website"
git push
```

---

## 4. GitHub Pages aktivieren

1. Im Repository oben auf **„Settings“** klicken.
2. Im linken Menü auf **„Pages“** klicken.
3. Unter **„Build and deployment“** → **„Source“** die Option **„Deploy from a branch“** wählen.
4. Branch: **`main`**, Ordner: **`/ (root)`** auswählen.
5. Auf **„Save“** klicken.
6. Nach ein bis zwei Minuten erscheint oben eine grüne Box mit dem Link zu deiner Seite:
   `https://DEIN-USERNAME.github.io/friends-party-archive/`

---

## 5. Website öffnen

Einfach den Link aus Schritt 4 öffnen. Du solltest zuerst die Login-Seite sehen. Passwort eingeben (Standard: siehe Abschnitt 10) und schon bist du drin.

---

## 6. Eigene Fotos hinzufügen

1. Lege deine Bilddatei in den Ordner `images/`, z. B. `images/urlaub-2027.jpg`.
2. Öffne `data/photos.js` und füge einen neuen Block in die Liste `PHOTOS` ein:

```js
{
  id: "photo-7",
  image: "images/urlaub-2027.jpg",
  title: "Sonnenuntergang in Kroatien",
  date: "2027-07-20",
  location: "Split",
  people: "Lisa, Tom",
  description: "Der beste Abend des Urlaubs.",
  eventId: ""            // optional, siehe Abschnitt 9
}
```

3. Datei speichern, hochladen/committen — fertig. Die `id` muss bei jedem Foto einzigartig sein.

---

## 7. Eigene Videos hinzufügen

1. Lege deine Videodatei in den Ordner `videos/`, z. B. `videos/urlaub-2027.mp4` (empfohlenes Format: **MP4/H.264**, läuft überall).
2. Optional: ein Vorschaubild (Poster) ebenfalls in `videos/` ablegen, z. B. `videos/urlaub-2027-poster.jpg`.
3. Öffne `data/videos.js` und füge einen neuen Block ein:

```js
{
  id: "video-4",
  video: "videos/urlaub-2027.mp4",
  poster: "videos/urlaub-2027-poster.jpg",
  title: "Roadtrip Kroatien",
  date: "2027-07-20",
  location: "Split",
  description: "Die Highlights in 90 Sekunden.",
  eventId: ""
}
```

**Hinweis:** GitHub hat ein Limit von 100 MB pro Datei (bzw. empfohlen unter 25 MB für schnelles Laden). Komprimiere große Videos vorher, z. B. mit HandBrake.

---

## 8. Neue Stories hinzufügen

1. Öffne `data/stories.js` und füge einen neuen Block in die Liste `STORIES` ein:

```js
{
  id: "story-4",
  title: "Der Roadtrip",
  date: "2027-07-20",
  location: "Kroatien",
  cover: "images/urlaub-2027.jpg",
  text:
    "Erster Absatz deiner Geschichte …\n\n" +
    "Zweiter Absatz …",
  photos: ["images/urlaub-2027.jpg"],   // kleine Galerie in der Story, optional
  eventId: ""
}
```

Absätze werden mit `\n\n` getrennt (wie im Beispiel oben).

---

## 9. Neue Events hinzufügen

1. Öffne `data/events.js` und füge einen neuen Block in die Liste `EVENTS` ein:

```js
{
  id: "kroatien-2027",
  title: "Kroatien Roadtrip",
  date: "2027-07-20",
  year: 2027,
  location: "Split, Kroatien",
  cover: "images/urlaub-2027.jpg",
  description: "Eine Woche Küste, Sonne und viel zu wenig Schlaf."
}
```

2. Damit Fotos, Videos und Stories automatisch auf der Event-Seite erscheinen, trage bei ihnen die passende `eventId` ein — in diesem Beispiel also `eventId: "kroatien-2027"`.

---

## 10. Passwort ändern

1. Öffne die Datei `script.js`.
2. Ganz oben findest du diese Zeile:

```js
const SITE_PASSWORD = "unsereparty2026";
```

3. Ersetze `"unsereparty2026"` durch dein eigenes Passwort, z. B.:

```js
const SITE_PASSWORD = "meinNeuesPasswort";
```

4. Datei speichern, hochladen/committen — fertig. Denk daran: siehe Sicherheitshinweis ganz oben — jeder, der den Code einsieht, kann das neue Passwort ebenfalls sehen.

---

## Sonstiges

- Alle Pfade in der Seite sind **relativ** (`images/foto.jpg` statt `/images/foto.jpg`), damit die Seite auch unter `username.github.io/repo-name/` korrekt funktioniert.
- Der Login-Status wird **nirgendwo gespeichert** (kein `localStorage`, kein `sessionStorage`, kein Cookie) — bei jedem Aufrufen, Neuladen oder erneuten Öffnen der Seite muss das Passwort neu eingegeben werden.
- Änderungen an `data/*.js` erscheinen sofort nach dem Neuladen der Seite — kein Build-Schritt nötig.
- Fehlt ein Bild (z. B. falscher Dateiname), zeigt die Seite automatisch `images/placeholder.jpg` an, statt kaputt auszusehen.
