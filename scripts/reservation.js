// Réservation : panier de billets, calcul des taxes et confirmation.
// Le paiement se fait sur place, le formulaire ne fait que réserver.

const PRIX = {
  adulte: 12,
  aine: 10,
  etudiant: 8,
  enfant: 6,
  famille: 30,
};

const TAUX_TPS = 0.05;
const TAUX_TVQ = 0.09975;

function formaterPrix(montant) {
  return montant.toLocaleString("fr-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " $";
}

function obtenirQuantites() {
  const quantites = {};
  for (const cle of Object.keys(PRIX)) {
    const champ = document.getElementById(`quantite-${cle}`);
    quantites[cle] = Math.max(0, parseInt(champ.value, 10) || 0);
  }
  return quantites;
}

function calculerTotalBillets(quantites) {
  return Object.values(quantites).reduce((total, q) => total + q, 0);
}

function mettreAJourPanier() {
  const quantites = obtenirQuantites();
  let sousTotal = 0;

  for (const [cle, prix] of Object.entries(PRIX)) {
    const quantite = quantites[cle];
    const sousTotalLigne = quantite * prix;
    sousTotal += sousTotalLigne;

    document.getElementById(`sous-total-${cle}`).textContent = formaterPrix(sousTotalLigne);

    const carte = document.querySelector(`.carte-billet[data-billet="${cle}"]`);
    carte.classList.toggle("carte-billet--actif", quantite > 0);

    const boutonMoins = document.querySelector(`.selecteur-bouton[data-cible="quantite-${cle}"][data-pas="-1"]`);
    boutonMoins.disabled = quantite <= 0;
  }

  const tps = sousTotal * TAUX_TPS;
  const tvq = sousTotal * TAUX_TVQ;
  const total = sousTotal + tps + tvq;

  document.getElementById("sous-total").textContent = formaterPrix(sousTotal);
  document.getElementById("tps").textContent = formaterPrix(tps);
  document.getElementById("tvq").textContent = formaterPrix(tvq);
  document.getElementById("total").textContent = formaterPrix(total);

  const totalBillets = calculerTotalBillets(quantites);
  document.getElementById("bouton-confirmer").disabled = totalBillets === 0;
  document.getElementById("recap-message").hidden = totalBillets > 0;
}

function initialiserSteppers() {
  document.querySelectorAll(".selecteur-bouton").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const idCible = bouton.dataset.cible;
      const pas = parseInt(bouton.dataset.pas, 10) || 0;
      const champ = document.getElementById(idCible);

      const min = parseInt(champ.min, 10) || 0;
      const max = parseInt(champ.max, 10) || Infinity;
      const valeurActuelle = parseInt(champ.value, 10) || 0;
      const nouvelleValeur = Math.min(max, Math.max(min, valeurActuelle + pas));

      champ.value = nouvelleValeur;
      champ.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  document.querySelectorAll(".selecteur-champ").forEach((champ) => {
    champ.addEventListener("input", () => {
      const min = parseInt(champ.min, 10) || 0;
      const max = parseInt(champ.max, 10) || Infinity;
      let valeur = parseInt(champ.value, 10);

      if (isNaN(valeur) || valeur < min) {
        valeur = min;
      } else if (valeur > max) {
        valeur = max;
      }

      champ.value = valeur;
      mettreAJourPanier();
    });

    champ.addEventListener("blur", () => {
      if (champ.value === "") {
        champ.value = champ.min || 0;
        mettreAJourPanier();
      }
    });
  });
}

function afficherConfirmation() {
  const panier = document.getElementById("panier");
  const confirmation = document.getElementById("confirmation");

  panier.hidden = true;
  confirmation.hidden = false;

  requestAnimationFrame(() => {
    confirmation.classList.add("est-visible");
  });

  const titre = confirmation.querySelector("h2");
  titre.setAttribute("tabindex", "-1");
  titre.focus();
  confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initialiserFormulairePanier() {
  const formulaire = document.getElementById("formulaire-panier");

  initialiserSteppers();
  mettreAJourPanier();

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    if (!formulaire.checkValidity()) {
      formulaire.reportValidity();
      return;
    }

    if (calculerTotalBillets(obtenirQuantites()) === 0) {
      return;
    }

    document.getElementById("bouton-confirmer").disabled = true;
    afficherConfirmation();
  });
}

initialiserFormulairePanier();
