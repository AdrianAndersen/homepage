// Enkapsulerer koden, slik at variablene får et lokalt scope i denne .js-filen
(() => {
    // Kjører settInnVariabelInfo med ulike typer informasjon
    function oppdaterVariabelInfo() {
        settInnVariabelInfo(".copyright", "https://www.skineser.no/", "\u00A9" + new Date().getFullYear() + " Skineser.no");
        settInnVariabelInfo(".fa-facebook", "https://www.facebook.com/Adrian.AAA.Andersen");
        settInnVariabelInfo(".fa-youtube", "https://www.youtube.com/user/DenEkteAdrian");
        settInnVariabelInfo(".fa-linkedin", "https://www.linkedin.com/in/adrian-arthur-andersen-468575131/");
        settInnVariabelInfo(".fa-address-book", "tel:92831582");
        settInnVariabelInfo(".fa-envelope", "mailto:adrian@skineser.no");

        settInnVariabelInfo(".linkPhone", "tel:92831582", "telefon: 928 31 582");
        settInnVariabelInfo(".linkMail", "mailto:adrian@skineser.no", "adrian@skineser.no");
    }

    /*
     * Legger inn kontaktinformasjonen i HTML-dokumentet
     * 
     * @param {string} query
     * @param {string} link
     * @param {string} text
     */
    function settInnVariabelInfo(query, link, text) {
        let navn = document.querySelectorAll(query);
        for (let i = 0; i < navn.length; i++) {
            navn[i].setAttribute("href", `${link}`);
            if (text) {
                navn[i].innerHTML += text;
            }
        }
    }
    // Legger til kontaktinformasjon når siden lastes.
    oppdaterVariabelInfo();

    // Viser og skjuler responsiv navbar.
    document.querySelector("#hamKnapp").addEventListener("click", () => {
        const hamKnapp = document.querySelector("#hamKnapp");
        if (document.querySelector(".mobileNavActive").style.display === "none") {
            document.querySelector(".mobileNavActive").style.display = "flex";
            hamKnapp.style.transform = "rotate(90deg)";
        } else {
            hamKnapp.style.transform = "";
            document.querySelector(".mobileNavActive").style.display = "none";

        }
    });

    // "Pakker sammen" nedtrekksmeny når bredden på skjermen endres.
    window.addEventListener("resize", () => {
        hamKnapp.style.transform = "";
        document.querySelector(".mobileNavActive").style.display = "none";
    });

    /* Valgte å flytte alt som ikke har med quizen ovenfor denne,
     * pga. mer ryddig kode, og bedre lesbarhet for sensor...
     * 
     *
     * 
     * HER BEGYNNER SELVE QUIZ-APPLIKASJONEN
     * 
     * */



    // Blir brukt som fasit på hvilken fugl spørsmålet dreier seg om.
    // Endres avhengig av spørsmål
    let riktigIndex = 0;

    // Øker med 1 hver gang en bruker svarer på et spørsmål 
    //(Spørsmålsnummer)
    let spmNr = 0;

    // Globale variabler fordi de brukes mange steder i koden
    const fugleNavnArray = ["Gråspurv", "Gulspurv", "Blåmeis", "Pilfink", "Kjøttmeis", "Flaggspett", "Dompap", "Svartmeis"];
    let riktigsvar = "";
    let antallRette = 0;
    let antallGale = 0;

    /*
     * Viser et nytt bilde (altså et nytt spørsmål), 
     * og kaller på funksjoner som legger til
     * svaralternativer.
     * */
    function visFugleSpm() {
        // Henter noen Html-elementer
        const fugleContainer = document.querySelector("#fugleContainer");
        const fuglebildeEl = document.querySelector("#fuglebilde");

        // Viser html-elementene
        fugleContainer.style.display = "flex";
        document.querySelector("footer").style.display = "block";
        document.querySelector("nav").style.display = "flex";

        // Finner riktig svar avhengig av hvilken index vi er på
        riktigsvar = fugleNavnArray[riktigIndex];

        // Populerer svaralternativene
        leggTilAlternativer();

        // Lytter på click-eventet på svar-alternativene
        lyttPaaAlternativer();

        // Array med filnavnene til fuglene
        const fuglefilNavn = ["graspurv", "gulspurv", "blameis", "pilfink", "kjottmeis", "flaggspett", "dompap", "svartmeis"];

        // Resetter overskriften
        overskrift.innerHTML = `Hva heter fuglen?`;

        // Endrer src til bildet på siden
        fuglebildeEl.src = `images/${fuglefilNavn[riktigIndex]}.jpg`;
    }

    /* Legger til tre unike tilfeldige alternativer, 
     * der et av dem er det riktige
     **/
    function leggTilAlternativer() {

        // Legger til farger på spørsmålsalternativene :)
        leggTilTilfeldigeFargerPaaAlternativer();

        let indexArr = [];
        for (let i = 0; i < 3; i++) {
            let tilfeldigIndex = Math.floor(Math.random() * fugleNavnArray.length);
            for (let q = 0; q < 3; q++) {
                // Sjekker om de tilfeldige indexene er unike og ikke 
                // det samme som riktig index
                if (tilfeldigIndex === indexArr[q] || tilfeldigIndex === riktigIndex) {
                    leggTilAlternativer();
                    return;
                }
            }
            indexArr.push(tilfeldigIndex);
        }
        // Finner et tilfeldig alternativ som skal være vinnerknappen
        let vinnerAlternativIndex = Math.floor(Math.random() * 3);

        // Bytter ut dette alternativet med riktig index (Vinnerfuglens 
        // index)
        indexArr.splice(vinnerAlternativIndex, 1, riktigIndex);

        // Legger til svaralternativene i html-dokumentet
        const alternativer = document.querySelectorAll(".alternativ");
        for (let i = 0; i < alternativer.length; i++) {
            alternativer[i].innerHTML = fugleNavnArray[indexArr[i]];
        }
    }

    /*
     * Legger til tilfeldige farger på svaralternativene :)
     * */
    function leggTilTilfeldigeFargerPaaAlternativer() {
        const alternativer = document.querySelectorAll(".alternativ");
        for (let i = 0; i < 3; i++) {
            // Finner tilfeldige verdier for hsl
            let tilfeldigHue = Math.floor(Math.random() * 360);
            let tilfeldigSaturation = Math.floor(Math.random() * 100);
            let tilfeldigLightness = Math.floor(Math.random() * 40) + 60;

            // Endrer bakgrunnsfargen avhengig av overnevnte parametere.
            alternativer[i].style.backgroundColor = `hsl(${tilfeldigHue}, ${tilfeldigSaturation}%, ${tilfeldigLightness}%)`;
        }
    }

    /*
     * Legger til lyttefunksjoner på de ulike divene, og kaller på sjekkSvar
     * Dersom noen trykker på dem
     * */
    function lyttPaaAlternativer() {
        const alternativer = document.querySelectorAll(".alternativ");
        for (let i = 0; i < alternativer.length; i++) {
            alternativer[i].addEventListener("click", sjekkSvar);
        }
    }

    /*
     * Sjekker om man har valgt riktig svar, holder orden på score,
     * og kaller på "lagTilfeldigSporsmaalsrekke()" dersom vi 
     * har gått gjennom en hel rekke med tilfeldige fugler.
     * 
     * @param {event} e
     */
    function sjekkSvar(e) {
        const svar = e.target.innerHTML;
        // Gir tilbakemelding avhengig av svar og legger til antall
        // rette og gale.
        if (svar === riktigsvar) {
            antallRette++;
            document.querySelector("#overskrift").innerHTML = "Du fikk rett!";
            setTimeout(visFugleSpm, 1000);
        } else {
            antallGale++;
            document.querySelector("#overskrift").innerHTML = `Du tok feil, riktig svar var: "${riktigsvar}"!`;
            setTimeout(visFugleSpm, 2500);
        }

        // Sjekker om vi har gått gjennom en hel tilfeldig rekke, og 
        // lager en ny dersom vi har gjort det.
        if (spmNr === fugleNavnArray.length-1) {
            spmNr = 0;
            lagTilfeldigSporsmaalsrekke();
        } else {
            // Hvis ikke, så fortsetter vi med neste index i rekken
            spmNr++;
        }
        // Angir neste riktige svar (neste fugl)
        riktigIndex = SpmIndexArr[spmNr];

        // Skjuler andre elementer mens vi ser svaret
        document.querySelector("footer").style.display = "none";
        document.querySelector("nav").style.display = "none";
        document.querySelector("#fugleContainer").style.display = "none";
    }

    // Global variabel slik at den lett kan brukes senere
    let SpmIndexArr = [];

    /*
     * Generer en tilfeldig rekke med unike tall, 
     * der tallene representerer en index i arrayen med navn på fuglene.
     * (En fugl sitt tall)
     * 
     * Rekken har bare unike tall, dvs. at du aldri vil få feks.
     * [...,2,2,...]
     * 
     * Dermed vises hvert bilde bare en gang per rotasjon
     * 
     * */
    function lagTilfeldigSporsmaalsrekke() {
        let indexArr = [];
        for (let i = 0; i < fugleNavnArray.length; i++) {
            let tilfeldigIterator = Math.floor(Math.random() * fugleNavnArray.length);
            for (let q = 0; q < fugleNavnArray.length; q++) {
                /* Dersom et tilfeldig generert tall er likt
                * som et tall allerede i arrayen,
                * kjøres funksjonen på nytt
                */
                if (tilfeldigIterator === indexArr[q]) {
                    lagTilfeldigSporsmaalsrekke();
                    return;
                }
            }
            // Dersom tallet ikke er brukt før, legges den til i arrayen
            indexArr.push(tilfeldigIterator);
        }
        // Her blir den lokale arrayen tilgjengelig globalt gjennom SpmIndexArr
        SpmIndexArr = indexArr;

        // Angir den første indexen
        riktigIndex = SpmIndexArr[spmNr];

        // Viser første spørsmålet
        // Her angir riktigIndex hvilken fugl dette blir 
        visFugleSpm();
    }

    // Finner første rekkefølge på spørsmålene
    lagTilfeldigSporsmaalsrekke();

    // Lytter på om noen trykker på avsluttknappen, 
    // og viser i så fall score
    document.querySelector("#knappAvslutt").addEventListener("click", () => {

        // Skjuler de andre elementene
        document.querySelector("#fugleContainer").style.display = "none";
        document.querySelector("#knappAvslutt").style.display = "none";
        document.querySelector("footer").style.display = "none";
        document.querySelector("nav").style.display = "none";

        // Skriver ut x antall hvite fjær avhengig av hvor mange rette du har
        document.querySelector("#overskrift").innerHTML = `Ditt resultat ble:`;
        for (let i = 0; i < antallRette; i++) {
            document.querySelector("#antallRetteDiv").innerHTML += `<img src="images/hvit_fjar.jpg"/>`;
        }

        // Skriver ut x antall sorte fjær avhengig av hvor mange rette du har
        for (let i = 0; i < antallGale; i++) {
            document.querySelector("#antallGaleDiv").innerHTML += `<img src="images/sort_fjar.jpg"/>`;
        }

        // Reloader siden...
        setTimeout(() => { window.location.reload(); }, 4000);
    });
})();