// Inkapsler scriptet slik at dette ikke er tilgjengelig utenfra
(function () {
    // Henter referansene til databasene
    const database = firebase.database();
    const romtyper = database.ref("romtyper/");
    const bestillinger = database.ref("bestillinger/");
    // Henter HTML-elementer fra siden
    const selRomtypeBestilling = document.getElementById("selRomtypeBestilling");
    const skjemaBooking = document.getElementById("skjemaBooking");
    const inpNavn = document.getElementById("inpNavn");
    const inpFraDato = document.getElementById("inpFraDato");
    const inpTilDato = document.getElementById("inpTilDato");
    const divBookingOverskrifter = document.getElementById("bookingOverskrifter");
    // Henter komponenter til lydavspilling
    const audio = new Audio('audio/california.mp3');
    const musicControl = document.getElementById("musicControl");
    const submitOK = document.getElementById("submitOK");
    // Lager en array for alle romtypene
    const romtypeListe = [];

    // Lagrer verdier fra romtype-databasen og populerer select romtype-elementene
    function leggTilRomtype(snapshot) {
        let key = snapshot.key;
        let nyttRom = snapshot.val();
        romtypeListe.push({ "key": key, "romtype": nyttRom });
        let option = `<option value="${key}">${nyttRom.beskrivelse}</option>`;
        selRomtypeBestilling.innerHTML += option;
        document.getElementById("selRomtypeOversikt").innerHTML += option;
        // Oppdaterer prisen som vises
        visPris();
    }

    // Lyttefunksjon som blir kalt når bestillingsskjema blir sendt
    function nyBestilling(event) {
        event.preventDefault();
        let navn = inpNavn.value;
        let romtype = selRomtypeBestilling.value;
        let fraDato = inpFraDato.value;
        let tilDato = inpTilDato.value;
        bestillinger.push(
            {
                "navn": navn,
                "romtype": romtype,
                "fraDato": fraDato,
                "tilDato": tilDato
            }
        );
        inpNavn.value = "";
        inpFraDato.value = "";
        inpTilDato.value = "";
        // Spiller av "Hotel Califoria" av the Eagles
        startMusikk();
        // Oppdaterer listen over bestillinger
        visSorterteBestillinger();
    }

    // Håndterer musikkknappen
    function startMusikk() {
        audio.play();
        musicControl.style.display = "grid";
        submitOK.style.display = "grid";
    }
    function stoppMusikk(event) {
        event.preventDefault();
        audio.pause();
        musicControl.style.display = "none";
        submitOK.style.display = "none";
    }

    // Viser bestillingene, sortert og filtrert
    function visSorterteBestillinger() {
        let romtypeId = document.getElementById("selRomtypeOversikt").value;
        let orderby = document.getElementById("orderby").value;
        bookingliste.innerHTML = "";
        // Sorterer etter valgt felt ved å bruke en anonym funksjon
        bestillinger.orderByChild(orderby).on("child_added", (snapshot) => {
            let nyBestilling = snapshot.val();
            // Filtrer slik at enten alle eller valgt romtype vises
            if (romtypeId == "" || nyBestilling.romtype === romtypeId) {
                // Finner valgt romtype i array med romtyper
                let romtype = romtypeListe.find(r => r.key == nyBestilling.romtype).romtype;
                bookingliste.innerHTML += `
            <div class="kol-2"></div>
            <p class="kol-2">${nyBestilling.navn}</p>
            <p class="kol-2">${romtype.beskrivelse}</p>
            <p class="kol-2">${nyBestilling.fraDato}</p>
            <p class="kol-3">${nyBestilling.tilDato}</p>
            <div class="kol-1"></div>`;
            }
            // Viser overskriftene ettersom det finnes bestillinger
            divBookingOverskrifter.style.display = "grid";
        });
    }

    // Henter pris fra array med informasjon om romtyper og viser dem
    function visPris() {
        let romtypeId = document.getElementById("selRomtypeBestilling").value;
        if (romtypeId) {
            let pris = romtypeListe.find(romtype => romtype.key == romtypeId).romtype.dognpris;
            document.getElementById("pris").innerText = pris;
        }
    }

    // Lyttefunksjoner
    skjemaBooking.onsubmit = nyBestilling;
    romtyper.on("child_added", leggTilRomtype);

    // Lytter etter et bestemt event
    document.getElementById("selRomtypeOversikt").addEventListener("change", visSorterteBestillinger);
    document.getElementById("selRomtypeBestilling").addEventListener("change", visPris);
    document.getElementById("orderby").addEventListener("change", visSorterteBestillinger);
    document.getElementById("musicButton").addEventListener("click", stoppMusikk);
    // Viser bestillinger når du går inn på siden
    visSorterteBestillinger();
}());