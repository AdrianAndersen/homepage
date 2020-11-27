const alfabetString = "abcdefghijklmnopqrstuvwxyzæøå";
const alfabetArray = Array.from(alfabetString);

const skjemaKryptering = document.getElementById("skjemaKryptering");
const inpCrypt = document.getElementById("inpCrypt");
const outCrypt = document.getElementById("outCrypt");

const decryptForm = document.getElementById("decryptForm");
const inpDecrypt = document.getElementById("inpDecrypt");
const outDecrypt = document.getElementById("outDecrypt");

const selectEncryptionMethod = document.getElementById("selectEncryptionMethod");

function KrypterCaesarCipher(tekst) {
    let kryptertTekst = "";
    for (var i = 0; i < tekst.length; i++) {
        let bokstavIndex = tekst.charCodeAt(i) + 3;
        kryptertTekst += String.fromCharCode(bokstavIndex);
    }
    return kryptertTekst;
}
function DekrypterCaesarCipher(tekst) {
    let DekryptertTekst = "";
    for (var i = 0; i < tekst.length; i++) {
        let bokstavIndex = tekst.charCodeAt(i) - 3;
        DekryptertTekst += String.fromCharCode(bokstavIndex);
    }
    return DekryptertTekst;
}
let arrListe = [];

function KrypterScytaleCipher(tekst) {
    let kryptertTekst = "";
    let antallBlokker = Math.ceil(tekst.length / 5);
    let minSubString = 0;
    let maxSubString = 5;
    //let arrListe = [];
    let nyTekstBlokk = "";
    console.log("antallBlokker: " + antallBlokker);

    for (var i = 0; i < antallBlokker; i++) {
        nyTekstBlokk = tekst.substring(minSubString, maxSubString) + "####";
        arrListe[i] = nyTekstBlokk;
        minSubString += 5;
        maxSubString += 5;
        console.log('arrListe' + "[" + i + "]: " + arrListe[i]);
        console.log("min: " + minSubString + " max: " + maxSubString);
    }
    for (var q = 0; q < antallBlokker; q++) {
        kryptertTekst += arrListe[q][0];
    }
    for (var m = 0; m < antallBlokker; m++) {
        kryptertTekst += arrListe[m][1];
    }
    for (var n = 0; n < antallBlokker; n++) {
        kryptertTekst += arrListe[n][2];
    }
    for (var s = 0; s < antallBlokker; s++) {
        kryptertTekst += arrListe[s][3];
    }
    for (var z = 0; z < antallBlokker; z++) {
        kryptertTekst += arrListe[z][4];
    }
    return kryptertTekst;
}
function DekrypterScytaleCipher(kryptertTekst) {
    debugger;
    let dekryptertTekst = "";
    let antallRader = Math.ceil(kryptertTekst.length / 5);

    for (var i = 0; i < antallRader; i++) {
        for (var j = 0; j < 5; j++) {
            pos = i + j*5;
            if (pos < kryptertTekst.length) {
                dekryptertTekst += kryptertTekst.charAt(pos);
            }
        }
    }
    return dekryptertTekst;
}

function Krypter(event) {
    event.preventDefault();
    if (selectEncryptionMethod.value === "CaesarCipher") {
        kryptertTekst = KrypterCaesarCipher(inpCrypt.value);
    }
    else if (selectEncryptionMethod.value === "ScytaleCipher") {
        kryptertTekst = KrypterScytaleCipher(inpCrypt.value);
    }
    outCrypt.innerText = kryptertTekst;
}
function Dekrypter(event) {
    event.preventDefault();
    if (selectEncryptionMethod.value === "CaesarCipher") {
        DekryptertTekst = DekrypterCaesarCipher(inpDecrypt.value);
    }
    else if (selectEncryptionMethod.value === "ScytaleCipher") {
        DekryptertTekst = DekrypterScytaleCipher(inpDecrypt.value);
    }
    outDecrypt.innerText = DekryptertTekst;
}


inpCrypt.addEventListener("keyup", Krypter);
inpDecrypt.addEventListener("keyup", Dekrypter);
