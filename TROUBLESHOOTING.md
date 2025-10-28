# Troubleshooting Guide - StudyGo & JojoSchool Extension

## 🔍 De extensie doet het niet - waar begin ik?

Als de extensie niet werkt, volg dan deze stappen om het probleem te identificeren:

### Stap 1: Controleer of je op de juiste website bent

De extensie werkt **alleen** op:
- `*.studygo.com` (bijv. www.studygo.com, app.studygo.com)
- `*.jojoschool.nl` (bijv. www.jojoschool.nl)

✅ **Test**: Kijk naar de URL in je adresbalk. Als deze niet één van bovenstaande domeinen bevat, werkt de extensie niet.

### Stap 2: Open de Browser Console

De extensie geeft uitgebreide debug informatie in de browser console:

**Hoe open je de console:**
- **Chrome/Edge/Brave**: Druk op `F12` of `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Druk op `F12` of `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

**Wat moet je zien:**
```
[StudyGo Extension] Extension loaded on studygo
[StudyGo Extension] Extension version: 1.0
[StudyGo Extension] URL: https://www.studygo.com/...
[StudyGo Extension] Running on studygo
[StudyGo Extension] Found X potential word lists using selector: ...
```

### Stap 3: Controleer of de extensie is geladen

**In de console moet je zien:**
- ✅ `Extension loaded on studygo` of `Extension loaded on jojoschool`
- ❌ Als je dit niet ziet, is de extensie niet actief op deze pagina

**Mogelijke oorzaken:**
1. De extensie is uitgeschakeld in je browser
2. Je bent niet op studygo.com of jojoschool.nl
3. De pagina moet mogelijk worden ververst

**Oplossing:**
1. Ga naar je extensies pagina:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Firefox: `about:addons`
2. Controleer of de extensie is ingeschakeld
3. Ververs de pagina met `F5` of `Ctrl+R`

### Stap 4: Controleer of woordenlijsten worden gevonden

**In de console zoek je naar:**
```
[StudyGo Extension] Found X potential word lists using selector: table
[StudyGo Extension] Processing list with Y rows
[StudyGo Extension] Adding copy button for list with Z word pairs
```

**Als je ziet:**
```
[StudyGo Extension] No word lists found on this page.
```

Dit betekent dat:
1. De pagina geen woordenlijsten bevat, OF
2. De HTML structuur van de website is veranderd

**Oplossing:**
1. Zorg dat je op een pagina bent met een woordenlijst
2. Als de structuur is veranderd, open een issue op GitHub met de URL

### Stap 5: Test het kopiëren

Als de knop verschijnt maar kopiëren niet werkt:

**Controleer de console voor foutmeldingen:**
```
[StudyGo Extension] Failed to copy to clipboard: ...
```

**Mogelijke oorzaken:**
1. Browser heeft geen toestemming voor klembord toegang
2. HTTPS/beveiligingsprobleem

**Oplossing:**
1. Zorg dat je op een HTTPS pagina bent (niet HTTP)
2. Geef toestemming voor klembord toegang in je browser instellingen

## 🐛 Veelvoorkomende Problemen

### Probleem: "Geen woordparen gevonden in deze lijst"

**Oorzaak:** De HTML structuur komt niet overeen met de verwachte selectors.

**Debug stappen:**
1. Open de console
2. Zoek naar: `[StudyGo Extension] Row X: Skipping - term="...", definition="..."`
3. Dit toont waarom bepaalde rijen worden overgeslagen

**Mogelijke redenen:**
- De term en definitie zijn hetzelfde (bijv. "pardon" - "pardon")
- Er is geen definitie gevonden
- De rijen bevatten alleen headers, geen woordparen

### Probleem: De knop verschijnt meerdere keren

**Oorzaak:** De MutationObserver detecteert meerdere DOM wijzigingen.

**Dit is normaal gedrag** - de extensie controleert op dubbele knoppen en voegt ze maar één keer toe.

In de console zie je:
```
[StudyGo Extension] Button already exists for this list, skipping
```

### Probleem: De knop verdwijnt na een tijdje

**Oorzaak:** De website vernieuwt de content dynamisch.

**Oplossing:** Ververs de pagina met `F5`.

### Probleem: Kopiëren werkt in Chrome maar niet in Firefox

**Oorzaak:** Firefox heeft strengere beveiligingsregels voor klembord toegang.

**Oplossing:** 
1. Zorg dat je op een HTTPS pagina bent
2. Firefox moet expliciet toestemming vragen - klik op "Toestaan" als deze prompt verschijnt

## 📋 Debug Checklist

Gebruik deze checklist om systematisch te debuggen:

- [ ] Ik ben op studygo.com of jojoschool.nl
- [ ] De URL bevat een woordenlijst pagina
- [ ] De extensie is ingeschakeld in mijn browser
- [ ] Ik heb de pagina ververst met F5
- [ ] Ik heb de browser console geopend (F12)
- [ ] Ik zie `[StudyGo Extension] Extension loaded on ...` in de console
- [ ] Ik zie berichten over gevonden woordenlijsten
- [ ] Ik zie groene "📋 Kopieer Woordenlijst" knoppen op de pagina
- [ ] Als ik op de knop klik, zie ik geen foutmeldingen in de console

## 🆘 Nog steeds problemen?

Als de extensie nog steeds niet werkt na deze stappen:

1. **Verzamel informatie:**
   - Welke browser gebruik je? (Chrome/Firefox/Edge + versie)
   - Wat is de exacte URL van de pagina?
   - Kopieer alle `[StudyGo Extension]` berichten uit de console
   - Maak een screenshot van de pagina

2. **Open een issue op GitHub:**
   - Ga naar: https://github.com/Loekiboy/Studygo-webextensie/issues
   - Klik op "New Issue"
   - Voeg alle verzamelde informatie toe

## 💡 Tips voor Ontwikkelaars

Als je de extensie wilt aanpassen voor een nieuwe website of structuur:

1. **Inspecteer de HTML:**
   - Rechtsklik op een woord → "Inspect Element"
   - Bekijk de HTML structuur van de woordenlijst

2. **Pas de selectors aan in `content.js`:**
   - Zoek naar `wordListSelectors` en `wordPairSelectors`
   - Voeg je eigen selectors toe aan de lijst

3. **Test met de console:**
   - Gebruik `document.querySelectorAll('jouw-selector')` in de console
   - Controleer of dit de juiste elementen vindt

4. **Enable DEBUG mode:**
   - In `content.js` staat bovenaan: `const DEBUG = true;`
   - Dit geeft uitgebreide logging in de console

## 🔄 Versie Informatie

Deze troubleshooting guide is voor extensie versie **1.0.1** en hoger.

Als je een oudere versie hebt:
1. Download de nieuwste versie van GitHub
2. Verwijder de oude extensie
3. Installeer de nieuwe versie

## 📞 Contact

Voor verdere hulp, open een issue op GitHub of neem contact op via de repository.
