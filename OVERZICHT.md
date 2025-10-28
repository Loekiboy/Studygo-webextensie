# Browser Extensie - StudyGo & JojoSchool Woordenlijst Kopiëren

## 📦 Wat zit er in deze extensie?

Deze browser extensie voegt automatisch een "Kopieer Woordenlijst" knop toe aan woordenlijsten op StudyGo.com en JojoSchool.nl websites.

## 🎯 Doel

Het doel van deze extensie is om het kopiëren van woordenlijsten te vereenvoudigen, zodat je ze gemakkelijk kunt gebruiken in andere programma's zoals Quizlet, Anki, Excel, of Google Sheets.

## 📁 Bestandsstructuur

```
Studygo-webextensie/
├── manifest.json           # Extensie configuratie (Manifest V3)
├── content.js             # Hoofdscript dat knoppen toevoegt en kopieert
├── styles.css             # Styling voor de kopieer-knop
├── icons/                 # Extensie iconen
│   ├── icon16.png        # 16x16 icoon
│   ├── icon48.png        # 48x48 icoon
│   └── icon128.png       # 128x128 icoon
├── README.md              # Algemene documentatie
├── INSTALLATIE.md         # Gedetailleerde installatie instructies
├── VOORBEELDEN.md         # Gebruik voorbeelden en tips
├── demo.html              # Demo pagina met verschillende list formaten
└── test-extension.html    # Test pagina met werkende functionaliteit
```

## 🔧 Hoe werkt het?

1. **Content Script** (`content.js`):
   - Detecteert automatisch woordenlijsten op de pagina
   - Voegt een groene knop toe: "📋 Kopieer Woordenlijst"
   - Extraheert woordparen uit verschillende HTML structuren
   - Kopieert de woorden in Quizlet-formaat naar je klembord

2. **Formattering**:
   - Elk woordpaar wordt gescheiden door een TAB karakter
   - Elk paar staat op een nieuwe regel
   - Formaat: `woord[TAB]vertaling`

3. **Compatibiliteit**:
   - Werkt met tabellen (`<table>`)
   - Werkt met lijsten (`<ul>`, `<li>`)
   - Werkt met div-gebaseerde layouts
   - Automatische detectie van meerdere HTML structuren

## 🌐 Ondersteunde Websites

- **StudyGo.com** - Alle woordenlijsten
- **JojoSchool.nl** - Alle woordenlijsten

De extensie gebruikt flexibele selectors die automatisch verschillende woordenlijst formaten detecteren.

## 🚀 Installatie

Zie `INSTALLATIE.md` voor gedetailleerde stap-voor-stap instructies voor:
- Google Chrome
- Microsoft Edge
- Brave Browser
- Mozilla Firefox

## 📖 Gebruik

Zie `VOORBEELDEN.md` voor:
- Voorbeeld output formaten
- Gebruik in Quizlet, Anki, Excel, enz.
- Tips en tricks
- Veelgestelde vragen

## 🧪 Testen

1. Open `test-extension.html` in je browser
2. Klik op de "📋 Kopieer Woordenlijst" knop
3. Zie de geformatteerde output
4. Test het plakken in verschillende programma's

Of gebruik `demo.html` voor een meer uitgebreide test met verschillende lijst formaten.

## 🔒 Privacy & Beveiliging

- De extensie vraagt alleen om `clipboardWrite` permissie
- Er worden GEEN gegevens verzonden naar externe servers
- Alle verwerking gebeurt lokaal in je browser
- Open source - je kunt de code zelf inspecteren

## 🛠️ Technische Details

- **Manifest Version**: 3 (nieuwste standaard)
- **Permissies**: `clipboardWrite` (alleen om naar klembord te schrijven)
- **Content Scripts**: Werkt op `*.studygo.com/*` en `*.jojoschool.nl/*`
- **Browser Compatibiliteit**: Chrome, Edge, Brave, Firefox (alle moderne browsers)

## 🔄 Updates

De extensie ondersteunt:
- Dynamisch geladen inhoud (via MutationObserver)
- Meerdere woordenlijsten op één pagina
- Automatische detectie van nieuwe lijsten

## 🐛 Problemen Melden

Als je een probleem tegenkomt:
1. Check de browser console (F12 → Console) voor foutmeldingen
2. Verifieer dat je op een ondersteunde website bent
3. Controleer of de extensie is ingeschakeld
4. Open een issue op GitHub met details

## 🤝 Bijdragen

Bijdragen zijn welkom! Je kunt:
- Verbeteringen voorstellen
- Bugs rapporteren
- Nieuwe features toevoegen
- Ondersteuning voor andere websites toevoegen

## 📄 Licentie

Open source - vrij te gebruiken en aan te passen.

## ⚠️ Disclaimer

Deze extensie is niet officieel geassocieerd met StudyGo of JojoSchool.
