const hamKnapp = document.querySelector("#hamKnapp");
const navEL = document.querySelector("nav");
const HBlinje = document.querySelectorAll(".HBlinje");
const responsivLogo = document.querySelector("#responsivLogo");

function oppdaterVariabelInfo() {
    settInnVariabelInfo(".copyright", "", "\u00A9" + new Date().getFullYear() + " Skineser.no");
    settInnVariabelInfo(".fa-facebook", "https://www.facebook.com/Adrian.AAA.Andersen");
    settInnVariabelInfo(".fa-youtube", "https://www.youtube.com/user/DenEkteAdrian");
    settInnVariabelInfo(".fa-linkedin", "https://www.linkedin.com/in/adrian-arthur-andersen-468575131/");
    settInnVariabelInfo(".fa-address-book", "tel:92831582");
    settInnVariabelInfo(".fa-envelope", "mailto:adrian@skineser.no");

    settInnVariabelInfo(".linkPhone", "tel:92831582", "telefon: 928 31 582");
    settInnVariabelInfo(".linkMail", "mailto:adrian@skineser.no", "adrian@skineser.no");
}
function settInnVariabelInfo(query, link, text) {
    let navn = document.querySelectorAll(query);
    for (let i = 0; i < navn.length; i++) {
        navn[i].setAttribute("href", `${link}`);
        if (text) {
            navn[i].innerHTML += text;
        }
    }
}
oppdaterVariabelInfo();
hamKnapp.addEventListener("click", () => {
    if (navEL.className === "") {
        hamKnapp.style.transform = "rotate(90deg)";
        for (let i = 0; i < HBlinje.length; i++) {
            HBlinje[i].className = "HBlinje HBlinjeActive";
        }
        navEL.className = "visMenyHamburger";
        responsivLogo.style.display = "none";
    } else {
        hamKnapp.style.transform = "";
        for (let i = 0; i < HBlinje.length; i++) {
            HBlinje[i].className = "HBlinje";
        }
        navEL.className = "";
        responsivLogo.style.display = "block";
    }
});
window.addEventListener("resize", () => {
    hamKnapp.style.transform = "";
    for (let i = 0; i < HBlinje.length; i++) {
        HBlinje[i].className = "HBlinje";
    }
    navEL.className = "";
    responsivLogo.style.display = "block";
});