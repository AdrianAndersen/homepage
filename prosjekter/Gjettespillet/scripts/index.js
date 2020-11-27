// Henter roten til databasen
const database = firebase.database();
const lb = database.ref("lb")

// Henter HTML-elementer
const startside = document.getElementById("startside");
const ingameside = document.getElementById("ingameside");
const resultatside = document.getElementById("resultatside");
const topp5Container = document.getElementById("topp5Container");
const gameOverside = document.getElementById("gameOver");

// audio
var lydFeil = new Audio('audio/feil.mp3');
var lydStartside = new Audio('audio/startside.mp3');
var lydIngame = new Audio('audio/ingame.mp3');
var lydGameOver = new Audio('audio/gameOver.mp3');
var lydVictory = new Audio('audio/victory.mp3');

// Knapper
const knappDifLett = document.getElementById("knappDifLett");
const knappDifMiddels = document.getElementById("knappDifMiddels");
const knappDifVanskelig = document.getElementById("knappDifVanskelig");
const knappDifGodTid = document.getElementById("knappDifGodTid");
const knappDifEgendefinert = document.getElementById("knappDifEgendefinert");
const knappGjetning = document.getElementById("knappGjetning");

// Input-elementer
const inpMinValVinnertall = document.getElementById("inpMinValVinnertall");
const inpMaxValVinnertall = document.getElementById("inpMaxValVinnertall");
const inpGjetning = document.getElementById("inpGjetning");

// Elementer til den grafiske tallfremstillingen
const defMinVal = document.getElementById("defMinVal");
const defMaxVal = document.getElementById("defMaxVal");

// Variabler 
var minVal, maxVal, vinnertall, valgtVanskelighetsgrad, tallmengde;
var tempMaxVal;
var tempMinVal;
var maxAntallGjetninger = 10;
var brukteGjetninger = 0;
var tidKlokke = 30;
var spilletErIGang = false;

// Fyller inn input felt med forh�ndsdefinerte verdier
function setVanskelighetsgradLett(event) {
    if (event) {
        event.preventDefault();

        inpMinValVinnertall.value = "-10";
        inpMaxValVinnertall.value = "10";
    }

    knappDifLett.className = "difknapper difknappValgt";
    knappDifMiddels.className = "difknapper";
    knappDifVanskelig.className = "difknapper";
    knappDifGodTid.className = "difknapper";
    knappDifEgendefinert.className = "kol-2 difknapper";

    valgtVanskelighetsgrad = "Lett";
}
function setVanskelighetsgradMiddels(event) {
    if (event) {
        event.preventDefault();

        inpMinValVinnertall.value = "-100";
        inpMaxValVinnertall.value = "100";
    }
    knappDifLett.className = "difknapper";
    knappDifMiddels.className = "difknapper difknappValgt";
    knappDifVanskelig.className = "difknapper";
    knappDifGodTid.className = "difknapper";
    knappDifEgendefinert.className = "kol-2 difknapper";

    valgtVanskelighetsgrad = "Middels";
}
function setVanskelighetsgradVanskelig(event) {
    if (event) {
        event.preventDefault();

        inpMinValVinnertall.value = "-1000";
        inpMaxValVinnertall.value = "1000";
    }
    knappDifLett.className = "difknapper";
    knappDifMiddels.className = "difknapper";
    knappDifVanskelig.className = "difknapper difknappValgt";
    knappDifGodTid.className = "difknapper";
    knappDifEgendefinert.className = "kol-2 difknapper";

    valgtVanskelighetsgrad = "Vanskelig";
}
function setVanskelighetsgradGodTid(event) {
    if (event) {
        event.preventDefault();

        inpMinValVinnertall.value = "-1000000";
        inpMaxValVinnertall.value = "1000000";
    }
    knappDifLett.className = "difknapper";
    knappDifMiddels.className = "difknapper";
    knappDifVanskelig.className = "difknapper";
    knappDifGodTid.className = "difknapper difknappValgt";
    knappDifEgendefinert.className = "kol-2 difknapper";

    valgtVanskelighetsgrad = "S� du har god tid?";
}
function setVanskelighetsgradEgendefinert(event) {
    if (event) {
        event.preventDefault();

        inpMinValVinnertall.value = "";
        inpMaxValVinnertall.value = "";
        inpMinValVinnertall.focus();
    }
    knappDifLett.className = "difknapper";
    knappDifMiddels.className = "difknapper";
    knappDifVanskelig.className = "difknapper";
    knappDifGodTid.className = "difknapper";
    knappDifEgendefinert.className = "kol-2 difknapper difknappValgt";

    valgtVanskelighetsgrad = "Egendefinert";
}
function setStandardVanskelighetsgrad() {
    inpMinValVinnertall.value = "-10";
    inpMaxValVinnertall.value = "10";
    setVanskelighetsgradLett();
}

// Sjekker om min og max-verdiene for tallet stemmer med noen forh�ndsbestemte vanskelighetsgrader
function finnVanskelighetsgrad() {
    if (inpMinValVinnertall.value == -10 && inpMaxValVinnertall.value == 10) {
        setVanskelighetsgradLett();
    }
    else if (inpMinValVinnertall.value == -100 && inpMaxValVinnertall.value == 100) {
        setVanskelighetsgradMiddels();
    }
    else if (inpMinValVinnertall.value == -1000 && inpMaxValVinnertall.value == 1000) {
        setVanskelighetsgradVanskelig();
    }
    else if (inpMinValVinnertall.value == -1000000 && inpMaxValVinnertall.value == 1000000) {
        setVanskelighetsgradGodTid();
    }
    else {
        setVanskelighetsgradEgendefinert();
    }
}

// Lager et tall fra input-elementene dersom maxvalue er mer enn minvalue
function lagVinnertall(event) {
    event.preventDefault();
    minVal = Number(inpMinValVinnertall.value);
    maxVal = Number(inpMaxValVinnertall.value);
    if (minVal < maxVal) {
        vinnertall = Math.floor(Math.random() * (maxVal - minVal)) + minVal;
        defMinVal.innerHTML = minVal;
        defMaxVal.innerHTML = maxVal;
        tallmengde = maxVal - minVal;
        startSpill();
    } else {
        alert("Fra-verdien m\u00e5 v\u00e6re st\u00f8rre enn til-verdien!")
    }
}

// Viser spillsiden
function startSpill() {
    spilletErIGang = true;
    startside.style.display = "none";
    ingameside.style.display = "grid";
    lydHandler()
    inpGjetning.value = "";
    inpGjetning.focus();
    document.getElementById("ingamegjetninger").innerHTML = maxAntallGjetninger;
    startTimer()
    tempMinVal = minVal;
    tempMaxVal = maxVal;
}

// H�ndterer den grafiske fremstillingene av mulige tall

function setDefmengde() {
    var topLeft = document.getElementById("topLeft");
    var topMiddle = document.getElementById("topMiddle");
    var topRight = document.getElementById("topRight");
    var bottomLeft = document.getElementById("bottomLeft");
    var bottomMiddle = document.getElementById("bottomMiddle");
    var bottomRight = document.getElementById("bottomRight");
}


// H�ndterer 30-sekundersklokken og avslutter spillet dersom tiden er ute
function startTimer() {
    var interval = 1000; // ms
    setTimeout(step, interval);
    function step() {
        document.getElementById("ingamesekunder").innerHTML = tidKlokke;
        tidKlokke--;
        if (tidKlokke <= -1 && spilletErIGang == true) {
            spilletErIGang = false;
            ingameside.style.display = "none";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("gameOverTid").style.display = "block";
            document.getElementById("gameOverRiktigTall").innerHTML = vinnertall;
            lydHandler()
        }
        setTimeout(step, interval);
    }
}

// H�ndterer begrensningene ved antall gjetninger
function oppdaterAntallGjetninger() {
    maxAntallGjetninger--;
    brukteGjetninger++;
    document.getElementById("ingamegjetninger").innerHTML = maxAntallGjetninger;
    if (maxAntallGjetninger == 0 && spilletErIGang == true) {
        spilletErIGang = false;
        ingameside.style.display = "none";
        document.getElementById("gameOver").style.display = "block";
        document.getElementById("gameOverForsok").style.display = "block";
        document.getElementById("gameOverRiktigTall").innerHTML = vinnertall;
        lydHandler()
    }
}

// Lytter funksjon som kalles n�r noen har gjort en gjetning.
function gjett() {

    // Henter ut tallet brukeren har gjettet og gj�r om det til et tall
    var gjettetTall = Number(inpGjetning.value);
    if (gjettetTall === vinnertall && spilletErIGang == true) {
        spilletErIGang = false;
        genererScore();
        maxAntallGjetninger--;
        brukteGjetninger++;
        visResultater();
    }
    else if (gjettetTall > vinnertall && gjettetTall <= tempMaxVal) {
        defMaxVal.innerHTML = gjettetTall;
        inpGjetning.value = "";
        tempMaxVal = gjettetTall;
        oppdaterAntallGjetninger()
        inpGjetning.focus();
        lydFeil.play();

    }
    else if (gjettetTall < vinnertall && gjettetTall >= tempMinVal) {
        defMinVal.innerHTML = gjettetTall;
        inpGjetning.value = "";
        tempMinVal = gjettetTall;
        oppdaterAntallGjetninger()
        inpGjetning.focus();
        lydFeil.play();
    }
    else {
        inpGjetning.value = "";
        oppdaterAntallGjetninger()
        inpGjetning.focus();
        lydFeil.play();
    }
}

// Lager variabler for resultater som skal sendes til Firebase
function genererScore() {
    slutttid = tidKlokke;
    lbTid = 30 - slutttid;
    lbGjetninger = maxAntallGjetninger;
    lbAntallMuligeTall = tallmengde;
    lbVinnertall = vinnertall;
    lbVanskelighetsgrad = valgtVanskelighetsgrad;
    lbScore = lbAntallMuligeTall * lbGjetninger * slutttid;
    document.getElementById("resultatScore").innerHTML = lbScore;
    document.getElementById("inpNavnResultater").value = "";
    document.getElementById("inpEpostResultater").value = "";
}

// Henter ut og viser resultatene
function visResultater() {
    document.getElementById("resultatside").style.display = "grid";
    ingameside.style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("vinnertallResultat").innerHTML = vinnertall;
    document.getElementById("resultatVanskelighetsgrad").innerHTML = valgtVanskelighetsgrad;
    document.getElementById("resultatAntallForsok").innerHTML = brukteGjetninger;
    document.getElementById("resultatAntallMuligeTall").innerHTML = tallmengde;
    document.getElementById("resultatBruktTid").innerHTML = lbTid;
    lydHandler();
}

// Sender resultatet til Firebase
function nyttResultat(event) {
    event.preventDefault();
    let navn = document.getElementById("inpNavnResultater").value;
    let epost = document.getElementById("inpEpostResultater").value;
    lb.push(
        {
            "navn": navn,
            "epost": epost,
            "score": lbScore,
            "antallMuligeTall": lbAntallMuligeTall,
            "antallGjetninger": lbGjetninger,
            "bruktTid": lbTid,
            "vinnertall": lbVinnertall,
            "vanskelighetsgrad": lbVanskelighetsgrad
        }
    );
    var skjemaRegResultat = document.getElementById("skjemaRegResultat");
    skjemaRegResultat.style.display = "block";
    skjemaRegResultat.style.textAlign = "center";
    skjemaRegResultat.style.margin = "1rem 0";
    skjemaRegResultat.innerHTML = "<h2>Ditt resultat ble registrert!</h2>";
}

function leggTilResultatIndex(snapshot) {
    let nyttResultat = snapshot.val();
    let entry = `<div>${nyttResultat.navn}</div><div>${nyttResultat.score}</div>`;
    topp5Container.innerHTML = entry + topp5Container.innerHTML;
}

// Håndterer lyd
function lydHandler() {
    if (startside.style.display == "grid") {
        lydStartside.play();
        lydFeil.pause();
        lydIngame.pause();
        lydGameOver.pause();
        lydVictory.pause();
    } else if (ingameside.style.display == "grid") {
        lydStartside.pause();
        lydFeil.pause();
        lydIngame.play();
        lydGameOver.pause();
        lydVictory.pause();
    }
    else if (gameOverside.style.display == "block") {
        lydStartside.pause();
        lydFeil.pause();
        lydIngame.pause();
        lydGameOver.play();
        lydVictory.pause();
    } else if (resultatside.style.display == "grid") {
        lydStartside.pause();
        lydFeil.pause();
        lydIngame.pause();
        lydGameOver.pause();
        lydVictory.play();
    } 
}

// Lyttefunksjoner
document.getElementById("skjemaLagVinnertall").onsubmit = lagVinnertall;
knappDifLett.addEventListener("click", setVanskelighetsgradLett);
knappDifMiddels.addEventListener("click", setVanskelighetsgradMiddels);
knappDifVanskelig.addEventListener("click", setVanskelighetsgradVanskelig);
knappDifGodTid.addEventListener("click", setVanskelighetsgradGodTid);
knappDifEgendefinert.addEventListener("click", setVanskelighetsgradEgendefinert);
document.getElementById("knappSendResultat").addEventListener("click", nyttResultat);
lb.orderByChild("score").limitToLast(5).on("child_added", leggTilResultatIndex);

// Lytter etter endringer i input-elementene for vanskelighetsgrad
inpMinValVinnertall.addEventListener("input", finnVanskelighetsgrad);
inpMaxValVinnertall.addEventListener("input", finnVanskelighetsgrad);

// Lytter etter at noen sender inn en gjetning
inpGjetning.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        gjett()
    }
});
knappGjetning.addEventListener("click", gjett);

// Setter standard vanskelighetsgrad n�r siden �pnes
setStandardVanskelighetsgrad();
document.body.addEventListener("click", lydHandler);
lydHandler();
lydStartside.play();