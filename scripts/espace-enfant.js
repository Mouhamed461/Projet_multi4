const intro = document.getElementById("introduction-jeu");
const jeu = document.getElementById("jeu-rail");

const btnJouer = document.getElementById("bouton-jouer");
const btnRetour = document.getElementById("bouton-retour");
const btnValider = document.getElementById("bouton-valider");
const btnSuivant = document.getElementById("bouton-niveau-suivant");
const btnRejouer = document.getElementById("bouton-rejouer");

const plateau = document.getElementById("plateau-jeu");
const compteur = document.getElementById("compteur-niveau");
const titre = document.getElementById("titre-niveau");
const msg = document.getElementById("message-jeu");
const enteteJeu = document.querySelector(".jeu-rail__entete");

const victoire = document.getElementById("fenetre-reussite");
const fin = document.getElementById("fin-jeu");

const railBtns = document.querySelectorAll(".rail-btn");

const niveaux = [
    {
        titre: "Premier trajet",
        lignes: 3,
        colonnes: 5,
        depart: 5,
        arrivee: 9,
        rails: ["h", "v"],
        solution: {
            6: "h",
            7: "h",
            8: "h"
        }
    },

    {
        titre: "Premier virage",
        lignes: 4,
        colonnes: 5,
        depart: 5,
        arrivee: 19,
        rails: ["h", "v", "courbeHD", "courbeBD", "courbeBG", "courbeHG"],
        solution: {
            6: "h",
            7: "courbeBG",
            12: "v",
            17: "courbeHD",
            18: "h"
        }
    },

    {
        titre: "Dernier trajet",
        lignes: 5,
        colonnes: 6,
        depart: 6,
        arrivee: 29,
        rails: ["h", "v", "courbeHD", "courbeBD", "courbeBG", "courbeHG"],
        solution: {
            7: "h",
            8: "courbeBG",
            14: "v",
            20: "v",
            26: "courbeHD",
            27: "h",
            28: "h"
        }
    }
];

const symboles = {
    h: "---",
    v: "|||",
    courbeHD: "└",
    courbeBD: "┌",
    courbeBG: "┐",
    courbeHG: "┘"
};

const railsVerticaux = [
    "../images/jeu/rails/vertical/rail-tile.png",
    "../images/jeu/rails/vertical/rail-tile-2.png",
    "../images/jeu/rails/vertical/rail-tile-3.png",
    "../images/jeu/rails/vertical/rail-tile-4.png",
    "../images/jeu/rails/vertical/rail-tile-5.png",
    "../images/jeu/rails/vertical/rail-tile-6.png",
    "../images/jeu/rails/vertical/rail-tile-7.png"
];

const railsHorizontaux = [
    "../images/jeu/rails/horizontal/rail-tile.png",
    "../images/jeu/rails/horizontal/rail-tile-2.png",
    "../images/jeu/rails/horizontal/rail-tile-3.png",
    "../images/jeu/rails/horizontal/rail-tile-4.png",
    "../images/jeu/rails/horizontal/rail-tile-5.png",
    "../images/jeu/rails/horizontal/rail-tile-6.png",
    "../images/jeu/rails/horizontal/rail-tile-7.png"
];

const railCourbeGauche =
    "../images/jeu/rails/courbe/left-curved-rail-minijeu.png";

const railCourbeDroite =
    "../images/jeu/rails/courbe/right-curved-rail-minijeu.png";

let niveauActuel = 0;
let railActif = "";

function recupererTypeRail(btn) {
    if (btn.dataset.type === "bas") {
        return "courbeBG";
    }

    if (btn.dataset.type === "droite") {
        return "courbeHD";
    }

    return btn.dataset.type;
}

btnJouer.onclick = () => {
    btnJouer.classList.add("animation");

    setTimeout(() => {
        intro.hidden = true;
        jeu.hidden = false;
        niveauActuel = 0;

        btnJouer.classList.remove("animation");

        chargerNiveau();
    }, 300);
};

btnRetour.onclick = () => {
    btnRetour.classList.add("animation");

    setTimeout(() => {
        jeu.hidden = true;
        intro.hidden = false;

        victoire.hidden = true;
        fin.hidden = true;

        railActif = "";
        msg.innerText = "";

        btnRetour.classList.remove("animation");

        intro.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 300);
};

btnSuivant.onclick = () => {
    btnSuivant.classList.add("animation");

    setTimeout(() => {
        niveauActuel++;
        btnSuivant.classList.remove("animation");

        chargerNiveau();
    }, 300);
};

btnRejouer.onclick = () => {
    btnRejouer.classList.add("animation");

    setTimeout(() => {
        niveauActuel = 0;
        fin.hidden = true;

        btnRejouer.classList.remove("animation");

        chargerNiveau();
    }, 300);
};

railBtns.forEach(btn => {

    btn.onclick = () => {

        railActif = recupererTypeRail(btn);

        railBtns.forEach(b => {
            b.classList.remove("selected");
        });

        btn.classList.add("selected");

        msg.innerText = "Rail sélectionné";
    };

});

function chargerNiveau() {

    const niveau = niveaux[niveauActuel];

    compteur.innerText = `Niveau ${niveauActuel + 1} / 3`;
    titre.innerText = niveau.titre;

    victoire.hidden = true;
    fin.hidden = true;

    msg.innerText = "";
    railActif = "";

    railBtns.forEach(btn => {

        btn.classList.remove("selected");

        const type = recupererTypeRail(btn);

        if (niveau.rails.includes(type)) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }

    });

    creerPlateau();

    setTimeout(() => {
        enteteJeu.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}

function creerPlateau() {

    const niveau = niveaux[niveauActuel];

    plateau.innerHTML = "";
    plateau.style.gridTemplateColumns = `repeat(${niveau.colonnes}, 80px)`;

    const totalCases = niveau.lignes * niveau.colonnes;

    for (let i = 0; i < totalCases; i++) {

        const c = document.createElement("button");

        c.type = "button";
        c.className = "case";

        if (i === niveau.depart) {

            c.innerText = "Train";
            c.classList.add("fixe");
            c.disabled = true;

        } else if (i === niveau.arrivee) {

            c.innerText = "Gare";
            c.classList.add("fixe");
            c.disabled = true;

        } else if (niveau.solution[i]) {

            c.onclick = () => placerRail(c);

        } else {

            c.classList.add("cachee");
            c.disabled = true;

        }

        plateau.appendChild(c);
    }
}

function placerRail(c) {

    if (!railActif) {
        msg.innerText = "Choisis d'abord un rail !";
        return;
    }

    c.innerHTML = "";
    c.dataset.val = railActif;

    if (railActif === "v") {

        const img = document.createElement("img");

        const texture =
            railsVerticaux[Math.floor(Math.random() * railsVerticaux.length)];

        img.src = texture;
        img.alt = "Rail vertical";
        img.className = "texture-rail texture-rail--vertical";

        c.appendChild(img);

    } else if (railActif === "h") {

        const img = document.createElement("img");

        const texture =
            railsHorizontaux[Math.floor(Math.random() * railsHorizontaux.length)];

        img.src = texture;
        img.alt = "Rail horizontal";
        img.className = "texture-rail texture-rail--horizontal";

        c.appendChild(img);

    } else if (railActif === "courbeBG") {

        const img = document.createElement("img");

        img.src = railCourbeGauche;
        img.alt = "Rail courbé";
        img.className = "texture-rail courbe-bg";

        c.appendChild(img);

    } else if (railActif === "courbeHD") {

        const img = document.createElement("img");

        img.src = railCourbeGauche;
        img.alt = "Rail courbé";
        img.className = "texture-rail courbe-hd";

        c.appendChild(img);

    } else if (railActif === "courbeBD") {

        const img = document.createElement("img");

        img.src = railCourbeDroite;
        img.alt = "Rail courbé";
        img.className = "texture-rail courbe-bd";

        c.appendChild(img);

    } else if (railActif === "courbeHG") {

        const img = document.createElement("img");

        img.src = railCourbeDroite;
        img.alt = "Rail courbé";
        img.className = "texture-rail courbe-hg";

        c.appendChild(img);

    } else {

        c.innerText = symboles[railActif];

    }

    msg.innerText = "";
}

btnValider.onclick = () => {
    btnValider.classList.add("animation");

    setTimeout(() => {
        verifierNiveau();
        btnValider.classList.remove("animation");
    }, 300);
};

function verifierNiveau() {

    const niveau = niveaux[niveauActuel];

    let correct = true;

    for (const position in niveau.solution) {

        const c = plateau.children[position];

        if (c.dataset.val !== niveau.solution[position]) {
            correct = false;
        }

    }

    if (!correct) {

        msg.innerText = "Le chemin n'est pas correct.";
        return;

    }

    msg.innerText = "";

    if (niveauActuel === niveaux.length - 1) {

        fin.hidden = false;

        fin.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } else {

        victoire.hidden = false;

        victoire.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
}