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

    let alder = 0;
    let fulltnavn = "";
    let fornavn = "";
    /*
     * @param {event} e
     */
    function hentVerdierFraSkjema(e) {
        // Hindrer siden å reloade når brukeren sender skjema
        e.preventDefault();

        // Henter input-elementene
        const inpNavnEl = document.querySelector("#inpNavnEl");
        const inpAlderEl = document.querySelector("#inpAlderEl");
        const formContainerEl = document.querySelector(".formContainer");
        const overskrift = document.querySelector("#overskrift");

        // Finner ulike deler informasjon fra brukeren
        fulltnavn = inpNavnEl.value;

        // Gjør at første bokstav i hvert navn blir stor
        let deltNavn = fulltnavn.split(" ");
        for (let i = 0; i < deltNavn.length; i++) {
            if (deltNavn[i] !== "") {
                let forbokstav = deltNavn[i][0].toUpperCase();
                let nyArr = deltNavn[i].split("");
                nyArr.shift();
                nyArr.unshift(forbokstav);
                deltNavn[i] = nyArr.join("");
            }
        }
        fulltnavn = deltNavn.join(" ");
        // Bestemmer fornavn
        fornavn = deltNavn[0];
        // Legger til de andre navnene som etternavn
        // Dette brukes ikke i applikasjonen, men er med pga. kravspesifikasjon
        let etternavn = "";
        for (let i = 1; i < deltNavn.length; i++) {
            etternavn += `${deltNavn[i]} `;
        }

        alder = Number(inpAlderEl.value);

        formContainerEl.style.display = "none";
        document.querySelector("footer").style.display = "none";
        document.querySelector("nav").style.display = "none";

        overskrift.innerHTML = `Velkommen til fugleappen, ${fornavn}!`;

        // Venter med å vise første fugl i 1sek. 
        setTimeout(visFugl, 1000);
    }

    // For å velge riktig fugl fra hver enkelt array. 
    // Oppdateres når man trykker på neste eller forrige
    let iterator = 0;
    // Global pga. at lengden til arrayen brukes av lyttefunksjonene 
    // til "neste" og "forrige"-knappene
    const fugleNavnArray = ["Gråspurv", "Gulspurv", "Blåmeis", "Pilfink", "Kjøttmeis", "Flaggspett", "Dompap", "Svartmeis"];

    /* Legger til informasjon om en bestemt fugl bestemt av iteratoren 
     * og alderen.
     */
    function visFugl() {
        document.querySelector("footer").style.display = "block";
        document.querySelector("nav").style.display = "flex";

        // Henter Html-elementer
        const fugleContainer = document.querySelector("#fugleContainer");
        const fuglebildeEl = document.querySelector("#fuglebilde");
        const fuglenavnEl = document.querySelector("#fuglenavn");
        const fugletekstEl = document.querySelector("#fugletekst");

        // Informasjon som skal vises
        const fugleInfoArray = ["Gråspurv eller spurv er en fugleart i spurvefamilien. Den er hjemmehørende i Europa, Asia og Nord-Afrika, men arten har også blitt innført til eller utilsiktet spredt til andre deler av Afrika, Amerika og Australia. Som følge av dette er den i dag verdens mest utbredte fugleart. Den globale bestanden av gråspurv utgjorde i 2004 cirka 540 millioner individer. Den er blant annet utbredt i det meste av Europa, inkludert i Skandinavia og store deler av Russland.",
            "Den er 17-18 cm lang og har et vingespenn på 23-30 cm. Vekten kan komme opp i 30 gram. Gulspurven finnes i åpent terreng med busker el. nær dyrket mark over det meste av landet. Stand- og streiffugl, enkelte overvintrer på Kontinentet. Hannen er gul på hodet, med mørkere flekker og strek på halsen og brystet. Buken er helt gul. På ryggen og skuldrene er den gråaktig rødbrun med svarte flekker. Hunnen har en noe mindre fargerik fjærdrakt.",
            "Blåmeisen er en fugl i meisefamilien. Den er lyseblå på issen, vingene og stjerten. Brystet og buken er gul. Hunnens farger er mye blekere enn hannen. Ungfuglene har gulaktige kinn og grågrønn isse. Blåmeisen er hardfør og svært nysgjerrig fugl. Nysgjerrigheten og oppfinnsomheten gjør at blåmeisen kan finne nye ting å spise når den er nødt. Det fortelles at blåmeisen enkelte steder har hakket løs vinduskitt og spist dette for å overleve.",
            "Pilfink tilhører spurvefamilien. Lever i Europa, Sibir og andre deler av Asia, har blitt satt ut i Australia. Pilfinken er 139-155 mm lang, med ett vingespenn på 20-22 cm og veier 20 gram. Pilfinken ligner gråspurvhannen, men kjennes igjen på den den svarte flekken på kinnet og den rødbrune pannen og issen (gråspurvhannen har ett rødbrunt band fra øyet til bak i nakken). På oversiden er pilfinken stripete i rødbrun, svart, gulbrunt og grått. Strupen er svart. Nebbet er konisk og ganske grovt. Munnvikene har tydelige børstehår.",
            "Kjøttmeis er en fugl i meisefamilien. I Norge finnes den i hele landet. Kalles også kjøtterik, tertitt, musvitt og talgokse. Lengden er cirka 15 cm, og vekten er fra 14 til 20 g. Fuglen er den største i meisefamilien. Kjøttmeisen har et svart hode med hvite kinn og en svart stripe langs den gule undersiden. Hos hannen er denne stripen breiere enn hos hunnene. Ryggen er grønnaktig, mens stjerten og vingene er blåaktige. Unge fugler har ofte litt mattere farger enn de eldre fuglene.",
            "Flaggspetten er en mellomstor spette og den mest tallrike av spettene i Europa. Ryggen er svart med et stort hvitt felt på hver vinge. Undersiden er hvit med kraftig rød undergump. Hannen skilles fra hunnen ved et rødfarget parti i nakken. Unge flaggspetter kjennetegnes med en rød hette med sort kant. Flaggspetten er ca 25 cm lang, og veier 70-90 g. Nebbet er kraftig og meiselformet.",
            "Dompap er en fugl i finkefamilien. Lengden er ca 16 cm, og vekten er rundt 21 gram, altså på størrelse med de mindre trostefuglene. Dompapen er lett å kjenne igjen når man først får øye på den. Hannen har rosenrødt bryst, blåsvart hette på hodet og oksegrå rygg. Hunnen ligner hannen, men har et gråbrunt bryst. Vingene har gråhvite bånd hos begge kjønn. Nebbet er kort og kraftig med skarpe kanter slik at den kan ta av skallet av frø og knopper.",
            "Svartmeis er en fugl i meisefamilien. Lengden er ca 11 cm, og vekten er ca 9 gram. Den er med dette den minste i meisefamilien. Svartmeisen har en kort stjert. Hodet er svart med hvite kinnflekker og fuglen har en hvit flekk i nakken. På oversiden er den grå med hvite vingebånd og på undersiden har den en lys gråbeige farge. Den kan forveksles med granmeis og løvmeis, men disse har ikke en hvit nakkeflekk. Svartmeisen er en sosial fugl som gjerne holder seg sammen med andre fugler om vinteren. Ofte kan man se den i flokker sammen med granmeis og fuglekonger."];
        const fuglefilNavn = ["graspurv", "gulspurv", "blameis", "pilfink", "kjottmeis", "flaggspett", "dompap", "svartmeis"];

        fugleContainer.style.display = "flex";
        overskrift.innerHTML = `Her er en oversikt over fuglene!`;

        fuglebildeEl.src = `images/${fuglefilNavn[iterator]}.jpg`;
        fuglenavnEl.innerHTML = fugleNavnArray[iterator];

        // Viser ulik tekst avhengig av alder
        if (alder <= 10 && alder >= 0) {
            let kortInfoArr = fugleInfoArray[iterator].split(". ");
            fugletekstEl.innerHTML = kortInfoArr[0] + ". " + kortInfoArr[1] + ". ";
        } else {
            fugletekstEl.innerHTML = fugleInfoArray[iterator];
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

    // Lyttefunksjoner
    document.querySelector("form").addEventListener("submit", hentVerdierFraSkjema);
    document.querySelector("#knappNeste").addEventListener("click", () => {
        // For å loope visningen av fuglene
        // Gjør slik at vi ikke får en negativ index til arrayen med informasjon.
        if (iterator === fugleNavnArray.length - 1) {
            iterator = 0;
        } else {
            iterator++;
        }
        visFugl();
    });
    document.querySelector("#knappForrige").addEventListener("click", () => {
        // For å loope visningen av fuglene
        // Gjør slik at vi ikke får en for stor index til arrayen med informasjon.
        if (iterator === 0) {
            iterator = fugleNavnArray.length - 1;
        } else {
            iterator--;
        }
        visFugl();
    });
    document.querySelector("#knappAvslutt").addEventListener("click", () => {
        // Skjuler de andre elementene
        document.querySelector(".formContainer").style.display = "none";
        document.querySelector("#fugleContainer").style.display = "none";
        document.querySelector("#knappAvslutt").style.display = "none";
        document.querySelector("footer").style.display = "none";
        document.querySelector("nav").style.display = "none";
        // Skriver en personlig hilsen dersom vi har et navn
        if (fulltnavn) {
            document.querySelector("#overskrift").innerHTML = `Takk for at du så på fuglene, ${fornavn}! God jul!`;
        } else {
            document.querySelector("#overskrift").innerHTML = `Hei og hå! Ingen fugler du så! Er du en fugl? Uansett, god jul!`;
        }
        setTimeout(() => { window.location.reload(); }, 4000);
    });
})();