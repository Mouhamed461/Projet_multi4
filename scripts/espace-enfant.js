// Récupération des éléments principaux de la page
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

// Variables utilisées pendant la partie
let niveauActuel = 0;
let puzzleActuel;
let railActif = "";

// Bouton "Jouer" pour lancer le jeu
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

// Retourne au menu principal et réinitialise le jeu
btnRetour.onclick = () => {
    btnRetour.classList.add("animation");

    setTimeout(() => {
        jeu.hidden = true;
        intro.hidden = false;

        victoire.hidden = true;
        fin.hidden = true;

        railActif = "";
        msg.innerText = "";
        msg.classList.remove("erreur");

        btnRetour.classList.remove("animation");

        intro.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 300);
};

// Passe au niveau suivant
btnSuivant.onclick = () => {
    btnSuivant.classList.add("animation");

    setTimeout(() => {
        niveauActuel++;

        btnSuivant.classList.remove("animation");

        chargerNiveau();
    }, 300);
};

//Recommence le jeu depuis le premier niveau (même texture que le bouton "Jouer")
btnRejouer.onclick = () => {
    btnRejouer.classList.add("animation");

    setTimeout(() => {
        niveauActuel = 0;
        fin.hidden = true;

        btnRejouer.classList.remove("animation");

        chargerNiveau();
    }, 300);
};

// Permet de sélectionner le type de rail à placer
railBtns.forEach(btn => {

    btn.onclick = () => {

        railActif = btn.dataset.type;

        railBtns.forEach(b => {
            b.classList.remove("selected");
        });

        btn.classList.add("selected");

        msg.classList.remove("erreur");
        msg.innerText = "Rail sélectionné";
    };

});


// Charge un puzzle aléatoire correspondant au niveau actuel
function chargerNiveau() {

    const niveau = niveaux[niveauActuel];

    puzzleActuel =
        niveau.puzzles[Math.floor(Math.random() * niveau.puzzles.length)];

    compteur.innerText = `Niveau ${niveauActuel + 1} / 3`;
    titre.innerText = niveau.titre;

    victoire.hidden = true;
    fin.hidden = true;

    msg.innerText = "";
    msg.classList.remove("erreur");
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

    setTimeout(() => {
        enteteJeu.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}


// Génère les cases du plateau selon le puzzle choisi
function creerPlateau() {

    plateau.innerHTML = "";

    plateau.style.gridTemplateColumns =
        `repeat(${puzzleActuel.colonnes}, 80px)`;

    const totalCases =
        puzzleActuel.lignes * puzzleActuel.colonnes;

    for (let i = 0; i < totalCases; i++) {

        const c = document.createElement("button");

        c.type = "button";
        c.className = "case";

        if (i === puzzleActuel.depart) {

            c.classList.add("fixe", "case-train");
            c.disabled = true;

            const img = document.createElement("img");

            img.src = imageTrain;
            img.alt = "Train";
            img.className = "element-fixe element-fixe--train";

            c.appendChild(img);

        } else if (i === puzzleActuel.arrivee) {

            c.classList.add("fixe", "case-gare");
            c.disabled = true;

            const img = document.createElement("img");

            img.src = imageGare;
            img.alt = "Gare";
            img.className = "element-fixe element-fixe--gare";

            c.appendChild(img);

        } else if (puzzleActuel.fixes[i]) {

            c.classList.add("fixe");
            c.disabled = true;

            afficherRail(c, puzzleActuel.fixes[i]);

        } else if (puzzleActuel.solution[i]) {

            c.onclick = () => placerRail(c);

        } else {

            c.classList.add("cachee");
            c.disabled = true;

        }

        plateau.appendChild(c);
    }
}

// Affiche l'image correspondant au type de rail demandé
function afficherRail(c, type) {

    const img = document.createElement("img");

    if (type === "v") {

        img.src =
            railsVerticaux[Math.floor(Math.random() * railsVerticaux.length)];

        img.className =
            "texture-rail texture-rail--vertical";

    } else if (type === "h") {

        img.src =
            railsHorizontaux[Math.floor(Math.random() * railsHorizontaux.length)];

        img.className =
            "texture-rail texture-rail--horizontal";

    } else if (type === "courbeBG") {

        img.src = railCourbeGauche;
        img.className = "texture-rail courbe-bg";

    } else if (type === "courbeHD") {

        img.src = railCourbeGauche;
        img.className = "texture-rail courbe-hd";

    } else if (type === "courbeBD") {

        img.src = railCourbeDroite;
        img.className = "texture-rail courbe-bd";

    } else if (type === "courbeHG") {

        img.src = railCourbeDroite;
        img.className = "texture-rail courbe-hg";

    }

    img.alt = "Rail";

    c.appendChild(img);
}

// Place le rail sélectionné dans une case du plateau
function placerRail(c) {

    if (!railActif) {
        msg.innerText = "Choisis d'abord un rail !";
        return;
    }

    c.innerHTML = "";
    c.dataset.val = railActif;

    afficherRail(c, railActif);

    msg.classList.remove("erreur");
    msg.innerText = "";
}

btnValider.onclick = () => {
    btnValider.classList.add("animation");

    setTimeout(() => {
        verifierNiveau();
        btnValider.classList.remove("animation");
    }, 300);
};


// Déplace le train case par case jusqu'à la gare
async function animerTrain() {

    const train = document.querySelector(".element-fixe--train");
    const caseDepart = plateau.children[puzzleActuel.depart];

    for (let i = 1; i < puzzleActuel.chemin.length; i++) {

        const caseCible =
            plateau.children[puzzleActuel.chemin[i]];

        const x =
            caseCible.offsetLeft - caseDepart.offsetLeft;

        const y =
            caseCible.offsetTop - caseDepart.offsetTop;

        train.style.transform =
            `translate(${x - 60}px, ${y}px)`;

        await new Promise(resolve => {
            setTimeout(resolve, 350);
        });
    }
}


// Vérifie si tous les rails placés correspondent à la solution
async function verifierNiveau() {

    let correct = true;

    for (const position in puzzleActuel.solution) {

        const c = plateau.children[position];

        if (c.dataset.val !== puzzleActuel.solution[position]) {
            correct = false;
        }

    }

    if (!correct) {

        msg.innerText = "Presque ! Vérifie l'orientation de tes rails.";
        msg.classList.add("erreur");
        return;

    }

    msg.innerText = "";
    msg.classList.remove("erreur");

    await animerTrain();

    // Affiche soit le niveau suivant, soit l'écran de fin
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