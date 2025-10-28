# StudyGo & JojoSchool Woordenlijst Kopiëren

Een browser extensie die een "Kopieer Woordenlijst" knop toevoegt aan StudyGo en JojoSchool websites, waarmee je eenvoudig woordenlijsten kunt kopiëren in Quizlet-formaat.

## ✨ Functies

- 📋 Voegt een "Kopieer Woordenlijst" knop toe aan woordenlijsten op StudyGo en JojoSchool
- 🔄 Kopieert woordenlijsten in Quizlet-compatibel formaat (woord TAB definitie)
- ✅ Eenvoudig te gebruiken - één klik om te kopiëren
- 🎨 Visuele feedback bij succesvol kopiëren
- 🌐 Werkt op meerdere websites (StudyGo en JojoSchool)

## 📥 Installatie

### Chrome/Edge/Brave

1. Download deze repository (klik op "Code" → "Download ZIP" en pak uit)
2. Open Chrome en ga naar `chrome://extensions/`
3. Schakel "Ontwikkelaarsmodus" in (rechtsboven)
4. Klik op "Uitgepakte extensie laden"
5. Selecteer de map met de extensiebestanden
6. De extensie is nu geïnstalleerd!

### Firefox

1. Download deze repository (klik op "Code" → "Download ZIP" en pak uit)
2. Open Firefox en ga naar `about:debugging#/runtime/this-firefox`
3. Klik op "Tijdelijke add-on laden"
4. Navigeer naar de extensiemap en selecteer het `manifest.json` bestand
5. De extensie is nu geïnstalleerd!

## 🚀 Gebruik

1. Ga naar een woordenlijst op StudyGo.com of JojoSchool.nl
2. Je ziet een groene knop "📋 Kopieer Woordenlijst" boven of bij de woordenlijst
3. Klik op de knop om de woordenlijst te kopiëren
4. De woordenlijst staat nu in je klembord in Quizlet-formaat
5. Plak de woordenlijst in je gewenste programma (bijv. Quizlet, Anki, Excel, etc.)

## 📋 Formaat

De woordenlijsten worden gekopieerd in het volgende formaat:
```
woord1	definitie1
woord2	definitie2
woord3	definitie3
```

Dit formaat is compatibel met:
- Quizlet (direct plakken bij het maken van een set)
- Anki (importeren met tab als scheidingsteken)
- Excel/Google Sheets (plakken in twee kolommen)
- Andere flashcard programma's

## 🔧 Technische Details

De extensie gebruikt:
- **Manifest V3** - de nieuwste standaard voor browser extensies
- **Content Scripts** - om de website te analyseren en knoppen toe te voegen
- **Clipboard API** - om tekst veilig naar het klembord te kopiëren
- **MutationObserver** - om dynamisch geladen inhoud te detecteren

## 🛠️ Ontwikkeling

De extensie bestaat uit de volgende bestanden:
- `manifest.json` - Extensie configuratie
- `content.js` - Hoofdlogica voor het detecteren en kopiëren van woordenlijsten
- `styles.css` - Styling voor de kopieer-knop
- `icons/` - Extensie iconen

## 🤝 Bijdragen

Bijdragen zijn welkom! Voel je vrij om:
- Issues te rapporteren
- Feature requests in te dienen
- Pull requests te maken

## 📄 Licentie

Dit project is open source en beschikbaar onder de MIT License.

## ⚠️ Disclaimer

Deze extensie is niet officieel geassocieerd met StudyGo of JojoSchool. Het is een onafhankelijk hulpmiddel gemaakt om het kopiëren van woordenlijsten te vergemakkelijken.