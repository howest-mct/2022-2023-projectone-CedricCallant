# Projectgegevens

**VOORNAAM NAAM:** Cédric Callant

**Sparringpartner:** Sybrin Pypaert

**Projectsamenvatting in max 10 woorden:** Berichtjes systeem met tekst en lichtkleuren

**Projecttitel:** Communication Cubes

# Tips voor feedbackgesprekken

## Voorbereiding

> Bepaal voor jezelf waar je graag feedback op wil. Schrijf op voorhand een aantal punten op waar je zeker feedback over wil krijgen. Op die manier zal het feedbackgesprek gerichter verlopen en zullen vragen, die je zeker beantwoord wil hebben, aan bod komen.

## Tijdens het gesprek:

> **Luister actief:** Schiet niet onmiddellijk in de verdediging maar probeer goed te luisteren. Laat verbaal en non-verbaal ook zien dat je aandacht hebt voor de feedback door een open houding (oogcontact, rechte houding), door het maken van aantekeningen, knikken...

> **Maak notities:** Schrijf de feedback op zo heb je ze nog nadien. Noteer de kernwoorden en zoek naar een snelle noteer methode voor jezelf. Als je goed noteert,kan je op het einde van het gesprek je belangrijkste feedback punten kort overlopen.

> **Vat samen:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.

> **Sta open voor de feedback:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.`

> **Denk erover na:** Denk na over wat je met de feedback gaat doen en koppel terug. Vind je de opmerkingen terecht of onterecht? Herken je je in de feedback? Op welke manier ga je dit aanpakken?

## NA HET GESPREK

> Herlees je notities en maak actiepunten. Maak keuzes uit alle feedback die je kreeg: Waar kan je mee aan de slag en wat laat je even rusten. Wat waren de prioriteiten? Neem de opdrachtfiche er nog eens bij om je focuspunten te bepalen.Noteer je actiepunten op de feedbackfiche.

# Feedforward gesprekken

## Gesprek 1 (Datum: 22/05/2023)

Lector: Geert

Vragen voor dit gesprek:

- vraag 1: Gebruik libraries bij RFID en Ledstrip

Dit is de feedback op mijn vragen.

- feedback 1: Ik moet hiervoor een mail sturen naar Geert

- vraag 2: Hoe goed is mijn fritzing?

Dit is de feedback op mijn vragen.

- feedback 2: Weerstand en diode bij de motor zetten, de breadboard power supply mag niet doorverbonden zijn naar de 3.3V van de pi

## Gesprek 2 (Datum: 24/05/2023)

Lector: Geert,Dieter en Stijn

Vragen voor dit gesprek: Tourmoment

-  vraag 1: V

/

- feedback 1: 
Databank: naamgeving in orde brengen, cubedevice linken met history

## Gesprek 3 (Datum: 30/05/2023)

Lector: Christophe en Hans

Vragen voor dit gesprek: Toermoment

/

Dit is de feedback op mijn vragen.

- feedback 1: Werken aan het pitchen van het project.
- feedback 2: power this cube off -> power off this cube.
- feedback 3: types en kleur een soort gevoel meegeven.
- feedback 4: communicatie over wifi mogelijk, aangezien bluetooth short ranged is.

## Gesprek 4 (Datum: 30/05/2023)

Lector: Frederik

Vragen voor dit gesprek:
Error wanneer ik mijn sql databse wil updaten.

- feedback: Je kan lijntjes met foutcode gewoon uit de statement halen wanneer je via gui code genereerd.

## Gesprek 5 (Datum: 30/05/2023)

Lector: Geert

Vragen voor dit gesprek:
Kan/mg ik gebruik maken van Mqtt?
Mag ik micropython gebruiken op de esp32?
Krijg ik toestemming om oled display library te gebruiken?

- feedback 1: Mqtt is ideaal, maar dat zien we pas in het 2de jaar.
              Eerst een seriele/bluetooth verbinding maken en daarmee je project maken, werkt dit kan ik terugkomen om te bewijzen dat ik de leerstof ken en ik Mqtt mag gebruiken.
- feedback 2: Micropython mag, maar is (nog) luier dan python.
             micropython is een scripttaal, wordt niet op voorhand gecompileerd, compiler neemt de helft van het devices' rekenkracht in waardoor het trager is
- feedback 3: Het kan niet anders, maar het is wel een zeer kleine display en moeilijk te lezen dus voor mij is het eerder aangeraden om een lcd display te gebruiken. 

## Gesprek 5 (Datum: 31/05/2023)

Lector: Pieter-Jan

Vragen voor dit gesprek:
Het lukt niet meer om dingen te uploaden naar mijn esp32, hoe los ik dit op?

- feedback: Een bepaalde pin was hoog of laag getrokken terwijl deze nodig was om te booten.

## Gesprek 6 (Datum: 01/06/2023)

Lector: Geert

Vragen voor dit gesprek:
Esp32 wil geen code meer uploaden wanneer ik de rx en tx pin aansluit aan de rpi.

- feedback: Je zit te uploaden op dezelfde seriele poort die je gebruikt bij het uploaden via de pc.
            Esp32 heeft 3 seriele poorten, seriele poort staat ook op andere pinnen die niet gemarkeerd zijn als rx en tx
            Gebruik dus uart2 ipv uart0 want deze wordt gebruikt door usb.
