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

const victoire = document.getElementById("fenetre-reussite");
const fin = document.getElementById("fin-jeu");

const railBtns = document.querySelectorAll(".rail-btn");

const niveaux = [
    {
        titre: "Premier trajet",
        lignes: 3,
        colonnes: 4,
        depart: 4,
        arrivee: 7,
        rails: ["h", "v"],
        solution: {
            5: "h",
            6: "h"
        }
    },

    {
        titre: "Premier virage",
        lignes: 4,
        colonnes: 4,
        depart: 4,
        arrivee: 15,
        rails: ["h", "v", "bas", "droite"],
        solution: {
            5: "h",
            6: "bas",
            10: "v",
            14: "droite"
        }
    },

    {
        titre: "Dernier trajet",
        lignes: 5,
        colonnes: 6,
        depart: 6,
        arrivee: 29,
        rails: ["h", "v", "bas", "droite"],
        solution: {
            7: "h",
            8: "bas",
            14: "v",
            20: "v",
            26: "droite",
            27: "h",
            28: "h"
        }
    }
];

const symboles = {
    h: "---",
    v: "|||",
    bas: "┐",
    droite: "└"
};

let niveauActuel = 0;
let railActif = "";

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

        railActif = btn.dataset.type;

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

        if (niveau.rails.includes(btn.dataset.type)) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }

    });

    creerPlateau();
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

    c.innerText = symboles[railActif];
    c.dataset.val = railActif;

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
    } else {
        victoire.hidden = false;
    }
}