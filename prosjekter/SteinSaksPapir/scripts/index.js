const txtForklaringSpiller1 = document.querySelector("#txtForklaringSpiller1");
const txtForklaringSpiller2 = document.querySelector("#txtForklaringSpiller2");
const containerScore = document.querySelector("#containerScore");
const containerSpill = document.querySelector("#containerSpill");
const scoreSpiller1EL = document.querySelector("#scoreSpiller1");
const scoreSpiller2EL = document.querySelector("#scoreSpiller2");
const txtSpiller1 = document.querySelector("#txtSpiller1");
const txtSpiller2 = document.querySelector("#txtSpiller2");
const vaapenP1 = document.querySelectorAll(".p1vaapen");
const vaapenP2 = document.querySelectorAll(".p2vaapen");
const txtResultat = document.querySelector("#resultat");
const resultatOS = document.querySelector("#resultatOS");
const resultatStilling = document.querySelector("#resultatStilling");
const txtValgTekstSpiller1 = document.querySelector("#txtValgTekstSpiller1");
const txtValgTekstSpiller2 = document.querySelector("#txtValgTekstSpiller2");
const valgtVaapenP1 = document.querySelectorAll(".valgtVaapenP1");
const valgtVaapenP2 = document.querySelectorAll(".valgtVaapenP2");

let scoreSpiller1 = 0;
let scoreSpiller2 = 0;
let mittValgteVaapen;
let vaapenSpiller2;
let antallRotasjoner;
let vinner;
let spilltype;

let cheatMode = false;
const theCreator = "Adrian";

let tidspunktSistMotspillersAktivitet;
const db = firebase.database();
const spill = db.ref("spill/");
let spillID;
let dittNavn;
let motspillersNavn;
let spillerNr;
let motspillerNr;
let motspillerVaapen;

function startSpillEnkeltspiller() {
    spilltype = "enkeltSpiller";
    resetSpill();
    for (let i = 0; i < vaapenP1.length; i++) {
        vaapenP1[i].addEventListener("click", () => {
            document.querySelector("#knappHovedmeny").style.display = "none";
            mittValgteVaapen = vaapenP1[i].dataset.vaapen;
            vaapenSpiller2 = vaapenP1[Math.floor(Math.random() * 3)].dataset.vaapen;
            kalkulerScore(mittValgteVaapen, vaapenSpiller2);
            gjorValgAnimasjon();
        });
    }
}
function starSpillLokalFlerspiller() {
    spilltype = "lokalFlerspiller";
    resetSpill();
    txtForklaringSpiller1.style.color = "red";
    txtSpiller1.style.color = "blue";
    for (let i = 0; i < vaapenP1.length; i++) {
        vaapenP1[i].addEventListener("click", () => {
            mittValgteVaapen = vaapenP1[i].dataset.vaapen;
            document.querySelector("#containerSpiller1").style.display = "none";
            document.querySelector("#containerSpiller2").style.display = "grid";
            spillLyd("ding");
            txtForklaringSpiller2.style.color = "blue";
            txtSpiller2.style.color = "red";
        });
    }
    for (let i = 0; i < vaapenP2.length; i++) {
        vaapenP2[i].addEventListener("click", () => {
            vaapenSpiller2 = vaapenP2[i].dataset.vaapen;
            kalkulerScore(mittValgteVaapen, vaapenSpiller2);
            gjorValgAnimasjon();
        });
    }
}
function startSpillOnline() {
    spilltype = "online";
    resetSpill();
    startEventListeners();
}
function startEventListeners() {
    setTimeout(varsleOmAFK, 12000);
    db.ref(`spill/${spillID}`).on("child_added", (s) => {
        if (s.key === `vaapenSpiller${motspillerNr}` && !motspillerVaapen) {
            tidspunktSistMotspillersAktivitet = Date.now();
            vaapenP2[4].src = "images/question.png";
            txtSpiller2.innerHTML = `${motspillersNavn} har valgt våpen`;
            txtForklaringSpiller2.innerHTML = `${motspillersNavn} venter på deg...`;
            motspillerVaapen = s.val();
            if (motspillerVaapen === "cm") {
                if (mittValgteVaapen === "stein") {
                    motspillerVaapen = "papir";
                } else if (mittValgteVaapen === "saks") {
                    motspillerVaapen = "stein";
                } else if (mittValgteVaapen === "papir") {
                    motspillerVaapen = "saks";
                }
            }
            if (mittValgteVaapen === "cm") {
                if (motspillerVaapen === "stein") {
                    mittValgteVaapen = "papir";
                } else if (motspillerVaapen === "saks") {
                    mittValgteVaapen = "stein";
                } else if (motspillerVaapen === "papir") {
                    mittValgteVaapen = "saks";
                }
            }
            if (cheatMode === true) {
                txtSpiller2.innerHTML += `</br>CM: ${motspillerVaapen}`;
            }
            db.ref(`spill/${spillID}/vaapenSpiller${motspillerNr}`).remove();
            if (mittValgteVaapen) {
                if (mittValgteVaapen === "cm") {
                    if (motspillerVaapen === "stein") {
                        mittValgteVaapen = "papir";
                    } else if (motspillerVaapen === "saks") {
                        mittValgteVaapen = "stein";
                    } else if (motspillerVaapen === "papir") {
                        mittValgteVaapen = "saks";
                    }
                }
                fullfoerSpill();
            }
        }
    });

    for (let i = 0; i < vaapenP1.length; i++) {
        vaapenP1[i].addEventListener("click", () => {
            if (!mittValgteVaapen) {
                mittValgteVaapen = vaapenP1[i].dataset.vaapen;
                if (motspillerVaapen === "cm") {
                    if (mittValgteVaapen === "stein") {
                        motspillerVaapen = "papir";
                    } else if (mittValgteVaapen === "saks") {
                        motspillerVaapen = "stein";
                    } else if (mittValgteVaapen === "papir") {
                        motspillerVaapen = "saks";
                    }
                }
                if (mittValgteVaapen === "cm") {
                    if (motspillerVaapen === "stein") {
                        mittValgteVaapen = "papir";
                    } else if (motspillerVaapen === "saks") {
                        mittValgteVaapen = "stein";
                    } else if (motspillerVaapen === "papir") {
                        mittValgteVaapen = "saks";
                    }
                }
                gjorValgAnimasjon();
                if (spillerNr === 1) {
                    db.ref(`spill/${spillID}`).update({
                        vaapenSpiller1: mittValgteVaapen
                    });
                } else {
                    db.ref(`spill/${spillID}`).update({
                        vaapenSpiller2: mittValgteVaapen
                    });
                }

                if (motspillerVaapen) {
                    if (motspillerVaapen === "cm") {
                        if (mittValgteVaapen === "stein") {
                            motspillerVaapen = "papir";
                        } else if (mittValgteVaapen === "saks") {
                            motspillerVaapen = "stein";
                        } else if (mittValgteVaapen === "papir") {
                            motspillerVaapen = "saks";
                        }
                    }
                    fullfoerSpill();
                }
            }
        });
    }
}
function fullfoerSpill() {
    kalkulerScore(mittValgteVaapen, motspillerVaapen);
    visResultat();
}
function gjorValgAnimasjon() {
    document.querySelector("#containerSpiller1").style.display = "none";
    document.querySelector("#containerSpiller2").style.display = "none";
    document.querySelector("#valgContainer").style.display = "flex";
    if (spilltype === "enkeltSpiller") {
        txtValgTekstSpiller1.innerHTML = `<i>${mittValgteVaapen}</i>`;
        valgtVaapenP1[3].style.display = "none";
        valgtVaapenP2[3].style.display = "none";
        if (mittValgteVaapen === "stein") {
            valgtVaapenP1[0].style.display = "flex";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "none";
        } else if (mittValgteVaapen === "saks") {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "flex";
            valgtVaapenP1[2].style.display = "none";
        } else {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "flex";
        }
        startRotasjon();
    } else if (spilltype === "lokalFlerspiller") {
        startRotasjon();
    } else if (spilltype === "online") {
        txtValgTekstSpiller1.innerHTML = `<i>${mittValgteVaapen}</i>`;
        valgtVaapenP1[3].style.display = "none";
        valgtVaapenP2[0].style.display = "none";
        valgtVaapenP2[1].style.display = "none";
        valgtVaapenP2[2].style.display = "none";
        valgtVaapenP2[3].style.display = "none";
        if (mittValgteVaapen === "stein") {
            valgtVaapenP1[0].style.display = "flex";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "none";
        } else if (mittValgteVaapen === "saks") {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "flex";
            valgtVaapenP1[2].style.display = "none";
        } else if (mittValgteVaapen === "cm") {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "none";
            valgtVaapenP1[4].style.display = "flex";
        } else {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "flex";
        }
    }
}
function startRotasjon() {
    antallRotasjoner = Math.floor(Math.random() * 7 + 6);
    roter();
    document.body.style.cursor = "wait";

}
function roter() {
    if (spilltype === "enkeltSpiller") {
        settVerktoy(antallRotasjoner % 3, "p2");
    } else if (spilltype === "lokalFlerspiller") {
        settVerktoy(antallRotasjoner % 3, "p1");
        settVerktoy(antallRotasjoner % 3, "p2");
    }
    spillLyd("ding");
    antallRotasjoner -= 1;
    if (antallRotasjoner === 0) {
        visResultat();
    } else {
        setTimeout(roter, 200 - antallRotasjoner * 25);
    }
}
function settVerktoy(verktoy, spiller) {
    valgtVaapenP2[3].style.display = "none";
    valgtVaapenP2[4].style.display = "none";
    if (spiller === "p1") {
        valgtVaapenP1[0].style.display = "none";
        valgtVaapenP1[1].style.display = "none";
        valgtVaapenP1[2].style.display = "none";
        document.querySelector("#dotwait").style.display = "none";
        valgtVaapenP1[verktoy].style.display = "block";
    } else if (spiller === "p2") {
        valgtVaapenP2[0].style.display = "none";
        valgtVaapenP2[1].style.display = "none";
        valgtVaapenP2[2].style.display = "none";
        document.querySelector("#dotwait").style.display = "none";
        valgtVaapenP2[verktoy].style.display = "block";
    }
}
function visResultat() {
    document.body.style.cursor = "auto";
    valgtVaapenP2[3].style.display = "none";
    valgtVaapenP2[4].style.display = "none";
    if (spilltype === "enkeltSpiller") {

        txtValgSpiller2.innerHTML = "Datamaskinen valgte:";
        txtValgTekstSpiller2.innerHTML = `<i>${vaapenSpiller2}</i>`;
        if (vaapenSpiller2 === "stein") {
            valgtVaapenP2[0].style.display = "flex";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "none";
        } else if (vaapenSpiller2 === "saks") {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "flex";
            valgtVaapenP2[2].style.display = "none";
        } else {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "flex";
        }
        if (vinner === "spiller1") {
            spillLyd("yay");
            resultatOS.innerHTML = "Du vant, stillingen er nå: ";
        } else if (vinner === "spiller2") {
            spillLyd("aww");
            resultatOS.innerHTML = "Du tapte, stillingen er nå: ";
        } else {
            spillLyd("draw");
            resultatOS.innerHTML = "Det ble likt, stillingen er nå: ";
        }

        setTimeout(() => {
            document.querySelector("#valgContainer").style.display = "none";
            resultatStilling.innerHTML = `${scoreSpiller1} - ${scoreSpiller2}`;
            txtResultat.style.display = "block";
            setTimeout(() => {
                resetSpill();
            }, 1500);
        }, 2000);
    } else if (spilltype === "lokalFlerspiller") {
        if (mittValgteVaapen === "stein") {
            valgtVaapenP1[0].style.display = "flex";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "none";
        } else if (mittValgteVaapen === "saks") {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "flex";
            valgtVaapenP1[2].style.display = "none";
        } else {
            valgtVaapenP1[0].style.display = "none";
            valgtVaapenP1[1].style.display = "none";
            valgtVaapenP1[2].style.display = "flex";
        }
        if (vaapenSpiller2 === "stein") {
            valgtVaapenP2[0].style.display = "flex";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "none";
        } else if (vaapenSpiller2 === "saks") {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "flex";
            valgtVaapenP2[2].style.display = "none";
        } else {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "flex";
        }
        if (vinner === "spiller1") {
            resultatOS.innerHTML = "Spiller 1 vant, stillingen er nå: ";
        } else if (vinner === "spiller2") {
            resultatOS.innerHTML = "Spiller 2 vant, stillingen er nå: ";
        } else {
            spillLyd("draw");
            resultatOS.innerHTML = "Det ble likt, stillingen er nå: ";
        }
        setTimeout(() => {
            document.querySelector("#valgContainer").style.display = "none";
            resultatStilling.innerHTML = `${scoreSpiller1} - ${scoreSpiller2}`;
            txtResultat.style.display = "block";
            setTimeout(() => {
                resetSpill();
            }, 1500);
        }, 2000);
    } else if (spilltype === "online") {
        txtValgSpiller2.innerHTML = `${motspillersNavn} valgte: `;
        txtValgTekstSpiller2.innerHTML = `<i>${motspillerVaapen}</i>`;
        if (motspillerVaapen === "stein") {
            valgtVaapenP2[0].style.display = "flex";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "none";
        } else if (motspillerVaapen === "saks") {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "flex";
            valgtVaapenP2[2].style.display = "none";
        } else {
            valgtVaapenP2[0].style.display = "none";
            valgtVaapenP2[1].style.display = "none";
            valgtVaapenP2[2].style.display = "flex";
        }
        if (vinner === "spiller1") {
            spillLyd("yay");
            resultatOS.innerHTML = "Du vant, stillingen er nå: ";
        } else if (vinner === "spiller2") {
            spillLyd("aww");
            resultatOS.innerHTML = "Du tapte, stillingen er nå: ";
        } else {
            spillLyd("draw");
            resultatOS.innerHTML = "Det ble likt, stillingen er nå: ";
        }
        setTimeout(() => {
            document.querySelector("#valgContainer").style.display = "none";
            resultatStilling.innerHTML = `${scoreSpiller1} - ${scoreSpiller2}`;
            txtResultat.style.display = "block";
            setTimeout(() => {
                resetSpill();
            }, 1500);
        }, 2000);
    }
}
function resetSpill() {
    containerMeny.style.display = "none";
    document.querySelector("#knappHovedmeny").style.display = "block";
    containerScore.style.display = "grid";
    document.querySelector("#valgContainer").style.display = "none";
    txtResultat.style.display = "none";
    valgtVaapenP1[4].style.display = "none";
    if (spilltype === "enkeltSpiller") {
        document.querySelector("#containerSpiller1").style.display = "block";
        document.querySelector("#containerSpiller2").style.display = "block";
        document.querySelector("#dotwait").style.display = "none";
        vaapenP1[3].style.display = "none";
        vaapenP1[4].style.display = "none";
        vaapenP2[0].style.display = "none";
        vaapenP2[1].style.display = "none";
        vaapenP2[2].style.display = "none";
        oppdaterSpilltekst();
    } else if (spilltype === "lokalFlerspiller") {
        document.querySelector("#containerSpiller1").style.display = "block";
        document.querySelector("#containerSpiller1").style.gridColumn = "span 2";
        document.querySelector("#containerSpiller2").style.gridColumn = "span 2";
        document.querySelector("#dotwait").style.display = "none";
        vaapenP1[3].style.display = "none";
        vaapenP1[4].style.display = "none";
        vaapenP2[3].style.display = "none";
        valgtVaapenP1[3].style.display = "none";
        valgtVaapenP2[3].style.display = "none";
        oppdaterSpilltekst();
    } else if (spilltype === "online") {
        document.querySelector("#containerFinnMotspiller").style.display = "none";
        document.querySelector("#containerBliMotspiller").style.display = "none";
        document.querySelector("#containerSpiller1").style.display = "block";
        document.querySelector("#containerSpiller2").style.display = "block";
        vaapenP2[0].style.display = "none";
        vaapenP2[1].style.display = "none";
        vaapenP2[2].style.display = "none";
        vaapenP2[3].style.display = "none";
        vaapenP1[3].style.display = "none";
        valgtVaapenP2[4].src = "images/onlinewait.gif";
        vaapenP2[4].src = "images/onlinewait.gif";
        if (cheatMode === true) {
            vaapenP1[4].style.display = "flex";
        } else {
            vaapenP1[4].style.display = "none";
            valgtVaapenP1[4].style.display = "none";
        }
        valgtVaapenP2[4].style.display = "flex";
        oppdaterSpilltekst();
        motspillerVaapen = undefined;
        mittValgteVaapen = undefined;
    }
}
function oppdaterSpilltekst() {
    const overskrift = document.querySelector("#overskrift");
    const txtScoreSpiller1 = document.querySelector("#txtScoreSpiller1");
    const txtScoreSpiller2 = document.querySelector("#txtScoreSpiller2");
    const txtValgSpiller1 = document.querySelector("#txtValgSpiller1");
    const txtValgSpiller2 = document.querySelector("#txtValgSpiller2");
    scoreSpiller1EL.innerHTML = scoreSpiller1;
    scoreSpiller2EL.innerHTML = scoreSpiller2;
    txtValgTekstSpiller1.innerHTML = "";
    txtValgTekstSpiller2.innerHTML = "";
    if (spilltype === "enkeltSpiller") {
        overskrift.innerHTML = "Stein, Saks, Papir! - Enkeltspiller";
        txtScoreSpiller1.innerHTML = "Din score";
        txtScoreSpiller2.innerHTML = "Datamaskinens score";
        txtSpiller1.innerHTML = "Velg et våpen";
        txtSpiller2.innerHTML = "Datamaskinens valg";
        txtForklaringSpiller1.innerHTML = "Trykk på det våpnet du vil bruke";
        txtForklaringSpiller2.innerHTML = "Her kommer datamaskinens valg";
        txtValgSpiller1.innerHTML = "Du valgte: ";
        txtValgSpiller2.innerHTML = "Datamaskinen velger...";
    } else if (spilltype === "lokalFlerspiller") {
        overskrift.innerHTML = "Stein, Saks, Papir! - Lokal Flerspiller";
        txtScoreSpiller1.innerHTML = "Score spiller 1";
        txtScoreSpiller2.innerHTML = "Score spiller 2";
        txtSpiller1.innerHTML = "Spiller 1 velger våpen";
        txtSpiller2.innerHTML = "Spiller 2 velger våpen";
        txtForklaringSpiller1.innerHTML = "Spiller 2 ser bort";
        txtForklaringSpiller2.innerHTML = "Spiller 1 ser bort";
        txtValgSpiller1.innerHTML = "Spiller 1 valgte: ";
        txtValgSpiller2.innerHTML = "Spiller 2 valgte: ";
    } else if (spilltype === "online") {
        overskrift.innerHTML = `Kamp mot ${motspillersNavn}`;
        txtScoreSpiller1.innerHTML = `Din score`;
        txtScoreSpiller2.innerHTML = `${motspillersNavn}s score`;
        txtSpiller1.innerHTML = "Ditt våpen";
        txtSpiller2.innerHTML = `${motspillersNavn}s våpen`;
        txtForklaringSpiller1.innerHTML = "Trykk på det våpenet du vil bruke";
        txtForklaringSpiller2.innerHTML = `${motspillersNavn} velger våpen`;
        txtValgSpiller1.innerHTML = "Du valgte: ";
        txtValgSpiller2.innerHTML = `${motspillersNavn} velger... `;
    }
}
function kalkulerScore(input1, input2) {
    if (input1 === input2) {
        vinner = "likt";
        return vinner;
    } else if (input1 === "stein" && input2 === "saks") {
        scoreSpiller1++;
        vinner = "spiller1";
    } else if (input1 === "stein" && input2 === "papir") {
        scoreSpiller2++;
        vinner = "spiller2";
    } else if (input1 === "saks" && input2 === "stein") {
        scoreSpiller2++;
        vinner = "spiller2";
    } else if (input1 === "saks" && input2 === "papir") {
        scoreSpiller1++;
        vinner = "spiller1";
    } else if (input1 === "papir" && input2 === "stein") {
        scoreSpiller1++;
        vinner = "spiller1";
    } else if (input1 === "papir" && input2 === "saks") {
        scoreSpiller2++;
        vinner = "spiller2";
    }
}
function lyttPaaKnapper() {
    const knapper = document.querySelectorAll("button");
    const menyKnapper = document.querySelectorAll(".menyknapp");
    for (let i = 0; i < menyKnapper.length; i++) {
        menyKnapper[i].addEventListener("click", (evt) => {
            location.replace("index.html");
        });
    }
    for (let i = 0; i < knapper.length; i++) {
        knapper[i].addEventListener("click", (e) => {
            const containerMeny = document.querySelector("#containerMeny");
            const knappEnkeltspiller = document.querySelector("#knappEnkeltspiller");
            const knappFlerspiller = document.querySelector("#knappFlerspiller");
            const knappLokalFlerspiller = document.querySelector("#knappLokalFlerspiller");
            const knappOnlineFlerspiller = document.querySelector("#knappOnlineFlerspiller");
            const containerLagNyttSpill = document.querySelector("#containerLagNyttSpill");
            const knapp = e.target;
            if (knapp === knappEnkeltspiller) {
                startSpillEnkeltspiller();
            }
            else if (knapp === knappLokalFlerspiller) {
                starSpillLokalFlerspiller();
            }
            else if (knapp === knappOnlineFlerspiller) {
                containerLagNyttSpill.style.display = "flex";
                containerMeny.style.display = "none";
            }
        });
    }
}
function lagNyttSpill() {
    slettGamleSpill();
    spillerNr = 1;
    motspillerNr = 2;
    let navnP1 = document.querySelector("#inpNavnP1").value;
    dittNavn = navnP1;
    if (dittNavn === theCreator) {
        cheatMode = true;
    }
    let tidspunktOpprettet = Date.now();
    spill.push(
        {
            "navnP1": navnP1,
            "tidspunktOpprettet": tidspunktOpprettet
        }
    );
    let onGameAdded = spill.once("child_added", (s) => {
        spillID = s.key;
    });
    let link = `ssp.skineser.no/?id=${spillID}`;
    document.querySelector("#ContainerSpillLenke").value = link;
    document.querySelector("#copycat").addEventListener("click", () => {
        document.querySelector("#ContainerSpillLenke").select();
        document.execCommand("copy");
    });
    let onChildAdded = db.ref(`spill/${spillID}`).on("child_added", (s) => {
        if (s.key === "harAnkommet") {
            document.querySelector("#onlineStatus").innerHTML = "Motspilleren har ankommet. Venter på navn...";
        } else if (s.key === "navnP2") {
            motspillersNavn = s.val();
            startSpillOnline();
        }
    });
}
function slettGamleSpill() {
    spill.once("value", (s) => {
        s.forEach((ss) => {
            let lagretTidspunkt = ss.val().tidspunktOpprettet;
            let Naatid = Date.now();
            let forskjell = Naatid - lagretTidspunkt;
            let ettDogn = 1000 * 60 * 60 * 24; // Millisekunder
            if (forskjell > ettDogn) {
                let ref = db.ref(`spill/${ss.key}`);
                ref.remove();
            }
        });
    });
}
function registrerMotspiller() {
    spillLyd("ding");
    let navnP2 = document.querySelector("#inpNavnP2").value;
    dittNavn = navnP2;
    if (dittNavn === theCreator) {
        cheatMode = true;
    }
    db.ref(`spill/${spillID}`).update({
        navnP2: navnP2
    });
    startSpillOnline();

}
function sjekkURL() {
    let urlParams = new URLSearchParams(window.location.search);
    spillID = urlParams.get('id');
    if (spillID) {
        sjekkGyldigURL();
    } else {
        containerMeny.style.display = "block";
    }
}
function sjekkGyldigURL() {
    let gyldigLink = false;
    document.querySelector("#containerSjekkGyldigURL").style.display = "block";
    spill.once("value", (s) => {
        s.forEach((ss) => {
            if (spillID === ss.key) {
                document.querySelector("#containerSjekkGyldigURL").style.display = "none";
                sjekkOmLobbyErLedig();
                gyldigLink = true;
            }
        });
        if (gyldigLink === false) {
            document.querySelector("#containerSjekkGyldigURL").style.display = "none";
            document.querySelector("#containerOpptattLobby").style.display = "block";
            setTimeout(() => {
                location.replace("index.html");
            }, 4000);
        }
    });

}
function joinGame() {
    spillerNr = 2;
    motspillerNr = 1;
    document.querySelector("#containerBliMotspiller").style.display = "flex";
    db.ref(`spill/${spillID}`).on("child_added", (s) => {
        if (s.key === "navnP1") {
            motspillersNavn = s.val();
            document.querySelector("#utfordrer").innerHTML = s.val();
        }
    });
}
function sjekkOmLobbyErLedig() {
    db.ref(`spill/${spillID}`).once("child_added", (s) => {
        if (s.key !== "harAnkommet") {
            db.ref(`spill/${spillID}`).update({
                harAnkommet: true
            });
            joinGame();
        } else {
            document.querySelector("#containerBliMotspiller").style.display = "none";
            document.querySelector("#containerOpptattLobby").style.display = "block";
            spillLyd("aww");
            setTimeout(() => {
                location.replace("index.html");
            }, 4000);

        }
    });
}
function spillLyd(lydfil) {
    let num = Math.floor(Math.random() * 2);
    if (lydfil === "yay" || lydfil === "aww") {
        lyd = new Audio(`audio/${lydfil}${num}.mp3`);
        lyd.play();
    } else {
        lyd = new Audio(`audio/${lydfil}.mp3`);
        lyd.play();
    }
}
function varsleOmAFK() {
    setTimeout(varsleOmAFK, 12000);
    if (tidspunktSistMotspillersAktivitet + 12000 > Date.now()) {
        return;
    }
    txtSpiller2.innerHTML = `${motspillersNavn} er utålmodig...`;
    txtForklaringSpiller2.innerHTML = `- Har du tenkt til å gjøre noe???`;
    vaapenP2[4].src = "images/waiting.gif";
    txtValgSpiller2.innerHTML = `${motspillersNavn} har ikke gjort noe på en stund.`;
    txtValgTekstSpiller2.innerHTML = `Har du blitt forlatt?`;
    valgtVaapenP2[4].src = "images/waiting.gif";
}
window.onload = sjekkURL;
lyttPaaKnapper();
document.querySelector("#skjemaLagNyttSpill").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector("#containerLagNyttSpill").style.display = "none";
    document.querySelector("#containerFinnMotspiller").style.display = "flex";
    lagNyttSpill();
});
document.querySelector("#skjemaRegistrerMotspiller").addEventListener("submit", (e) => {
    e.preventDefault();
    registrerMotspiller();
    document.querySelector("#containerBliMotspiller").style.display = "none";
});