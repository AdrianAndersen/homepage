(() => {
    "use strict";

    /*
     * Dette verktøyet er laget av Adrian A. Andersen,
     * for Skineser.no. (C) 2019
     *
     * Versjon: 1.2
     *
     *
     * Verktøyet kan brukes fritt, på følgende måte:
     *
     * For å bruke bildestyring, må Font Awsome inkluderes i head-elementet i HTML-filen
     * https://fontawesome.com/start
     * Kopier linken og legg den i head, eller last den ned offline
     *
     */

// Fyll inn innstillingene til bildekarusellen du skal lage:

    // Eksempel
    const options = {
        selector: "#bildekarusell",
        byttemetode: "slide-left",
        bildestyring: true,
        visningstid: 4000,
        byttetid: 1000
    };
    lagBildekarusell(options);

    // Kildekode
    function lagBildekarusell(options) {

        // Globale variabler --------------------------------------------------------------------------

        let bildeintervall;
        const container = document.querySelector(options.selector);
        const cards = document.querySelectorAll(options.selector + " > *");
        const antallBilder = cards.length;


        // Funksjoner ----------------------------------------------------------------------------------

        function validerInndata() {
            const defaults = {
                byttemetoder: ["slide-left", "slide-up"],
                bildestyring: true,
                visningstid: 4000,
                byttetid: 1000,
            };

            let status = true;

            if (options === undefined || options === null) {
                status = false;
                console.error("ProjectBildekarusell: Options er ikke definert. Vennligst se bildekarusellens dokumentasjon for hjelp.");
                return status;
            }

            if (document.querySelector(options.selector) === undefined || document.querySelector(options.selector) === null) {
                status = false;
                console.error("ProjectBildekarusell: Finner ikke bildekarusellens container. Vennligst kontroller at selector er riktig.");
            }

            if (defaults.byttemetoder.indexOf(options.byttemetode) === -1 || options.byttemetode === undefined || options.byttemetode === null) {
                options.byttemetode = defaults.byttemetoder[0];
                console.warn("ProjectBildekarusell: Byttemetode er ikke definert riktig. Default verdi er satt.");
            }

            if (typeof options.bildestyring !== "boolean") {
                options.bildestyring = defaults.bildestyring;
                console.warn("ProjectBildekarusell: Bildestyring er ikke definert riktig. Default verdi er satt.");
            }

            if (isNaN(options.visningstid) || options.visningstid === null) {
                options.visningstid = defaults.visningstid;
                console.warn("ProjectBildekarusell: Visningstiden er ikke definert riktig. Default verdi er satt.");
            }

            if (isNaN(options.byttetid) || options.byttetid === null) {
                options.byttetid = defaults.byttetid;
                console.warn("ProjectBildekarusell: Byttetiden er ikke definert riktig. Default verdi er satt.");
            }
            if (cards[0] === null || cards[0] === undefined) {
                status = false;
                console.error("ProjectBildekarusell: Det er ikke lagt inn bilder i bildekarusellen. Vennligst legg inn bilder, eller se bildekarusellens dokumentasjon for hjelp.");
            }

            return status;
        }

        function leggTilStyling() {
            container.style.position = "relative";
            container.style.display = "flex";
            container.flexDirection = "column";
            container.style.justifyContent = "center";
            container.style.alignItems = "center";
            container.style.overflow = "hidden";
            cards.forEach((card) => {
               card.style.display = "none";
               card.style.maxWidth = "100%";
               card.style.maxHeight = "100%";
               card.style.zIndex = "1";
               card.style.position = "absolute";
               card.style.flexDirection = "column";
               card.style.justifyContent = "center";
               card.style.alignItems = "center";
            });
            cards[0].style.display = "flex";


        }

        function lagBildestyring() {
            // Lager html-elementer for styring av
            let kontrollContainer = document.createElement("div");
            container.appendChild(kontrollContainer);
            kontrollContainer.style.position = "absolute";
            kontrollContainer.style.zIndex = "100";
            kontrollContainer.style.bottom = "0";
            kontrollContainer.style.cursor = "pointer";

            let tilbakeKnapp = document.createElement("i");
            tilbakeKnapp.classList = "fas fa-chevron-left BKknapper BKTilbake";
            tilbakeKnapp.style.padding = ".5rem";

            kontrollContainer.appendChild(tilbakeKnapp);
            for (let i = 0; i < antallBilder; i++) {
                const nyBildelink = document.createElement("i");
                nyBildelink.classList = "far fa-circle BKknapper";
                kontrollContainer.appendChild(nyBildelink);
            }
            let fremKnapp = document.createElement("i");
            fremKnapp.classList = "fas fa-chevron-right BKknapper BKFrem";
            fremKnapp.style.padding = ".5rem";

            kontrollContainer.appendChild(fremKnapp);

            const sirkelLenker = document.querySelectorAll(`${options.selector} .fa-circle`);
            for (let i = 0; i < sirkelLenker.length; i++) {
                sirkelLenker[i].dataset.BKIndex = i;
                sirkelLenker[i].style.padding = ".5rem";
            }

        }

        function startBildekarusell() {
            // Bytter bilde for hvert intervall
            bildeintervall = setInterval(byttBilde, options.visningstid);
            let nesteIndex = 1;
            let forrigeBildeIndex = 0;

            // For å forhindre at man kan bytte bilde under ennest animasjon
            let bytterBilde = false;

            // Kobler opp bildestyring dersom dette er valgt
            let sirkelLenker;
            if (options.bildestyring) {
                sirkelLenker = document.querySelectorAll(`${options.selector} .fa-circle`);

                const knapper = document.querySelectorAll(`${options.selector} .BKknapper`);
                for (let i = 0; i < knapper.length; i++) {
                    knapper[i].addEventListener("click", byttBildeEvt);
                }
                sirkelLenker[0].classList = "fas fa-circle";

            }

            function byttBilde(nyIndex, nyRetning, nyByttetid) {
                bytterBilde = true;

                let retning = "normal";
                let byttetid = options.byttetid;

                // Dersom det sendes med argumenter, velges disse
                if (nyIndex !== undefined) nesteIndex = Number(nyIndex);
                if (nyRetning !== undefined) retning = nyRetning;
                if (nyByttetid !== undefined) byttetid = nyByttetid;

                // Bytteanimasjonen
                cards[nesteIndex].style.display = "flex";
                console.log(options.byttemetode);
                if (options.byttemetode === "slide-left") {
                    cards[forrigeBildeIndex].animate([{ right: 0, offset: 0 }, { right: `${container.offsetWidth}px`, offset: 1 }], { duration: byttetid, easing: "ease-in", direction: retning });
                    cards[nesteIndex].animate([{ right: `${-container.offsetWidth}px`, offset: 0 }, { right: 0, offset: 1 }], { duration: byttetid, easing: "ease-in", direction: retning });
                } else if (options.byttemetode === "slide-up") {
                    cards[forrigeBildeIndex].animate([{ bottom: 0, offset: 0 }, { bottom: `${container.offsetHeight}px`, offset: 1 }], { duration: byttetid, easing: "ease-in", direction: retning });
                    cards[nesteIndex].animate([{ bottom: `${-container.offsetHeight}px`, offset: 0 }, { bottom: 0, offset: 1 }], { duration: byttetid, easing: "ease-in", direction: retning });
                }


                // Endrer hvilken knapp som indikerer det aktive bildet
                if (options.bildestyring) {
                    setTimeout(() => {
                        sirkelLenker[nesteIndex].classList = "fas fa-circle BKknapper";
                        sirkelLenker[forrigeBildeIndex].classList = "far fa-circle BKknapper";
                    }, byttetid / 2);
                }

                // Skjuler forrige bilde, og oppdaterer index-variablene etter byttet
                setTimeout(() => {
                    bytterBilde = false;
                    cards[forrigeBildeIndex].style.display = "none";
                    forrigeBildeIndex = nesteIndex;
                    if (nesteIndex === cards.length - 1) {
                        nesteIndex = 0;
                    } else {
                        nesteIndex++;
                    }
                }, byttetid);
            }

            // Rekursiv metode som kaller på byttBilde helt til vi når det bildet brukeren ville se
            function blaTil(maalIndex) {
                let nyByttetid = 75;

                if (!bytterBilde) {
                    clearInterval(bildeintervall);

                    if (maalIndex > forrigeBildeIndex) {
                        byttBilde(forrigeBildeIndex + 1, "normal", nyByttetid);
                        setTimeout(() => {
                            blaTil(maalIndex);
                        }, nyByttetid);

                    } else if (maalIndex < forrigeBildeIndex) {
                        byttBilde(forrigeBildeIndex - 1, "reverse", nyByttetid);
                        setTimeout(() => {
                            blaTil(maalIndex);
                        }, nyByttetid);

                    } else {
                        // maalIndex === forrigeBildeIndex, altså har vi nådd bildet brukeren ønsker, og
                        // intervallbyttingen av bilder kan fortsette
                        bildeintervall = setInterval(byttBilde, options.visningstid);
                    }
                }

            }

            // Finner hvilken knapp som trykkes ved å se på det siste klassenavnet til objektet
            function byttBildeEvt(e) {
                const sisteKlasseindex = e.target.classList.length - 1;

                switch (e.target.classList[sisteKlasseindex]) {
                    case "BKTilbake":
                        if (!bytterBilde) {
                            if (forrigeBildeIndex > 0) {
                                blaTil(forrigeBildeIndex - 1);
                            } else {
                                blaTil(antallBilder - 1);
                            }
                        }
                        break;
                    case "BKFrem":
                        if (!bytterBilde) {
                            blaTil(nesteIndex);
                        }
                        break;
                    case "BKknapper":
                        if (!bytterBilde) {
                            blaTil(e.target.dataset.BKIndex);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        // Program flow -----------------------------------------------------------------------

        if (!validerInndata()) {
            return;
        }

        leggTilStyling();

        if (antallBilder > 1) {
            if (options.bildestyring === true) {
                lagBildestyring();
            }

            startBildekarusell();
        }
    }
})();