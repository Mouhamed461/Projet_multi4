// Activité interactive : guider le train jusqu'à la gare en plaçant les bons rails.
// Les niveaux et les images viennent de donnees-jeu.js.

// Éléments principaux de la page
const intro = document.getElementById("introduction-jeu");
const jeu = document.getElementById("jeu-rail");
const enteteJeu = document.querySelector(".jeu-rail__entete");

const boutonJouer = document.getElementById("bouton-jouer");
const boutonRetour = document.getElementById("bouton-retour");
const boutonValider = document.getElementById("bouton-valider");
const boutonSuivant = document.getElementById("bouton-niveau-suivant");
const boutonRejouer = document.getElementById("bouton-rejouer");
const boutonsRails = document.querySelectorAll(".bouton-rail");

const plateau = document.getElementById("plateau-jeu");
const compteur = document.getElementById("compteur-niveau");
const titre = document.getElementById("titre-niveau");
const message = document.getElementById("message-jeu");
const fenetreReussite = document.getElementById("fenetre-reussite");
const fenetreFin = document.getElementById("fin-jeu");

// État de la partie en cours
let niveauActuel = 0;
let puzzleActuel = null;
let railActif = "";

// Joue l'animation du bouton (sprite), puis lance l'action.
function animerBouton(bouton, action) {
  bouton.classList.add("animation");

  setTimeout(() => {
    bouton.classList.remove("animation");
    action();
  }, 300);
}

// Affiche un message sous les rails (en rouge si c'est une erreur).
function afficherMessage(texte, estErreur = false) {
  message.textContent = texte;
  message.classList.toggle("erreur", estErreur);
}

// Retourne un élément au hasard dans une liste.
function choisirAuHasard(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

// Bouton « Jouer » : lance l'activité au premier niveau.
boutonJouer.addEventListener("click", () => {
  animerBouton(boutonJouer, () => {
    intro.hidden = true;
    jeu.hidden = false;
    niveauActuel = 0;
    chargerNiveau();
  });
});

// Retour au menu de départ, l'activité est réinitialisée.
boutonRetour.addEventListener("click", () => {
  animerBouton(boutonRetour, () => {
    jeu.hidden = true;
    intro.hidden = false;
    fenetreReussite.hidden = true;
    fenetreFin.hidden = true;
    railActif = "";
    afficherMessage("");
    intro.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Passe au niveau suivant.
boutonSuivant.addEventListener("click", () => {
  animerBouton(boutonSuivant, () => {
    niveauActuel++;
    chargerNiveau();
  });
});

// Recommence depuis le premier niveau (même sprite que le bouton « Jouer »).
boutonRejouer.addEventListener("click", () => {
  animerBouton(boutonRejouer, () => {
    niveauActuel = 0;
    chargerNiveau();
  });
});

// Vérifie les rails placés.
boutonValider.addEventListener("click", () => {
  animerBouton(boutonValider, verifierNiveau);
});

// Sélection du type de rail à placer.
boutonsRails.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    railActif = bouton.dataset.type;
    boutonsRails.forEach((autre) => autre.classList.toggle("selectionne", autre === bouton));
    afficherMessage("Rail sélectionné");
  });
});

// Charge un trajet au hasard pour le niveau actuel.
function chargerNiveau() {
  const niveau = niveaux[niveauActuel];
  puzzleActuel = choisirAuHasard(niveau.puzzles);

  compteur.textContent = `Niveau ${niveauActuel + 1} / ${niveaux.length}`;
  titre.textContent = niveau.titre;

  fenetreReussite.hidden = true;
  fenetreFin.hidden = true;
  boutonValider.disabled = false;
  railActif = "";
  afficherMessage("");

  // Seuls les rails utiles au niveau sont proposés.
  boutonsRails.forEach((bouton) => {
    bouton.classList.remove("selectionne");
    bouton.hidden = !niveau.rails.includes(bouton.dataset.type);
  });

  creerPlateau();

  setTimeout(() => {
    enteteJeu.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

// Crée les cases du plateau selon le trajet choisi.
function creerPlateau() {
  plateau.innerHTML = "";
  plateau.style.gridTemplateColumns = `repeat(${puzzleActuel.colonnes}, 80px)`;

  const totalCases = puzzleActuel.lignes * puzzleActuel.colonnes;

  for (let i = 0; i < totalCases; i++) {
    const caseJeu = document.createElement("button");
    caseJeu.type = "button";
    caseJeu.className = "case";

    if (i === puzzleActuel.depart) {
      caseJeu.classList.add("fixe", "case-train");
      caseJeu.disabled = true;
      caseJeu.appendChild(creerImage(imageTrain, "Train", "element-fixe element-fixe--train"));
    } else if (i === puzzleActuel.arrivee) {
      caseJeu.classList.add("fixe", "case-gare");
      caseJeu.disabled = true;
      caseJeu.appendChild(creerImage(imageGare, "Gare", "element-fixe element-fixe--gare"));
    } else if (puzzleActuel.fixes[i]) {
      caseJeu.classList.add("fixe");
      caseJeu.disabled = true;
      afficherRail(caseJeu, puzzleActuel.fixes[i]);
    } else if (puzzleActuel.solution[i]) {
      caseJeu.addEventListener("click", () => placerRail(caseJeu));
    } else {
      caseJeu.classList.add("cachee");
      caseJeu.disabled = true;
    }

    plateau.appendChild(caseJeu);
  }
}

// Crée une image (train, gare ou rail) pour une case.
function creerImage(source, texteAlternatif, classes) {
  const image = document.createElement("img");
  image.src = source;
  image.alt = texteAlternatif;
  image.className = classes;
  return image;
}

// Image et classe CSS (orientation) de chaque type de rail.
function afficherRail(caseJeu, type) {
  const rails = {
    h: [choisirAuHasard(railsHorizontaux), "texture-rail--horizontal"],
    v: [choisirAuHasard(railsVerticaux), "texture-rail--vertical"],
    courbeBG: [railCourbeGauche, "courbe-bg"],
    courbeHD: [railCourbeGauche, "courbe-hd"],
    courbeBD: [railCourbeDroite, "courbe-bd"],
    courbeHG: [railCourbeDroite, "courbe-hg"],
  };

  const [source, classe] = rails[type];
  caseJeu.appendChild(creerImage(source, "Rail", `texture-rail ${classe}`));
}

// Place le rail sélectionné dans la case cliquée.
function placerRail(caseJeu) {
  if (!railActif) {
    afficherMessage("Choisis d'abord un rail !");
    return;
  }

  caseJeu.innerHTML = "";
  caseJeu.dataset.val = railActif;
  afficherRail(caseJeu, railActif);
  afficherMessage("");
}

// Une fois le trajet réussi, le train roule case par case jusqu'à la gare.
async function animerTrain() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const train = plateau.querySelector(".element-fixe--train");
  const caseDepart = plateau.children[puzzleActuel.depart];

  for (const position of puzzleActuel.chemin.slice(1)) {
    const caseCible = plateau.children[position];
    const x = caseCible.offsetLeft - caseDepart.offsetLeft;
    const y = caseCible.offsetTop - caseDepart.offsetTop;

    // -60px : même décalage que dans le CSS (.element-fixe--train).
    train.style.transform = `translate(${x - 60}px, ${y}px)`;
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

// Vérifie que chaque rail placé correspond à la solution.
async function verifierNiveau() {
  const correct = Object.keys(puzzleActuel.solution).every((position) => {
    return plateau.children[position].dataset.val === puzzleActuel.solution[position];
  });

  if (!correct) {
    afficherMessage("Presque ! Vérifie l'orientation de tes rails.", true);
    return;
  }

  afficherMessage("");

  // Pendant que le train roule, on bloque le plateau et le bouton Valider.
  boutonValider.disabled = true;
  plateau.querySelectorAll(".case").forEach((caseJeu) => {
    caseJeu.disabled = true;
  });

  await animerTrain();

  // Affiche la fenêtre du niveau suivant, ou celle de fin.
  const dernierNiveau = niveauActuel === niveaux.length - 1;
  const fenetre = dernierNiveau ? fenetreFin : fenetreReussite;

  fenetre.hidden = false;
  fenetre.scrollIntoView({ behavior: "smooth", block: "center" });
}
