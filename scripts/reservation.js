/* Reservation : gestion du panier de billets, calcul des totaux et
   confirmation de l'achat. Le paiement se fait sur place, ce formulaire
   ne fait que reserver les billets. */

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
    quantites[cle] = champ ? Math.max(0, parseInt(champ.value, 10) || 0) : 0;
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

    const elementSousTotal = document.getElementById(`sous-total-${cle}`);
    if (elementSousTotal) {
      elementSousTotal.textContent = formaterPrix(sousTotalLigne);
    }

    const carte = document.querySelector(`.carte-billet[data-billet="${cle}"]`);
    if (carte) {
      carte.classList.toggle("carte-billet--actif", quantite > 0);
    }

    const boutonMoins = document.querySelector(
      `.stepper-bouton[data-cible="quantite-${cle}"][data-pas="-1"]`
    );
    if (boutonMoins) {
      boutonMoins.disabled = quantite <= 0;
    }
  }

  const tps = sousTotal * TAUX_TPS;
  const tvq = sousTotal * TAUX_TVQ;
  const total = sousTotal + tps + tvq;

  document.getElementById("sous-total").textContent = formaterPrix(sousTotal);
  document.getElementById("tps").textContent = formaterPrix(tps);
  document.getElementById("tvq").textContent = formaterPrix(tvq);
  document.getElementById("total").textContent = formaterPrix(total);

  const totalBillets = calculerTotalBillets(quantites);
  const boutonConfirmer = document.getElementById("bouton-confirmer");
  const messageRecap = document.getElementById("recap-message");

  if (boutonConfirmer) {
    boutonConfirmer.disabled = totalBillets === 0;
  }
  if (messageRecap) {
    messageRecap.hidden = totalBillets > 0;
  }
}

function initialiserSteppers() {
  document.querySelectorAll(".stepper-bouton").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const idCible = bouton.dataset.cible;
      const pas = parseInt(bouton.dataset.pas, 10) || 0;
      const champ = document.getElementById(idCible);
      if (!champ) return;

      const min = parseInt(champ.min, 10) || 0;
      const max = parseInt(champ.max, 10) || Infinity;
      const valeurActuelle = parseInt(champ.value, 10) || 0;
      const nouvelleValeur = Math.min(max, Math.max(min, valeurActuelle + pas));

      champ.value = nouvelleValeur;
      champ.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  document.querySelectorAll(".stepper-champ").forEach((champ) => {
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
  if (!panier || !confirmation) return;

  panier.hidden = true;
  confirmation.hidden = false;

  requestAnimationFrame(() => {
    confirmation.classList.add("est-visible");
  });

  const titre = confirmation.querySelector("h2");
  if (titre) {
    titre.setAttribute("tabindex", "-1");
    titre.focus();
  }
  confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initialiserFormulairePanier() {
  const formulaire = document.getElementById("formulaire-panier");
  if (!formulaire) return;

  initialiserSteppers();
  mettreAJourPanier();

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    if (!formulaire.checkValidity()) {
      formulaire.reportValidity();
      return;
    }

    const quantites = obtenirQuantites();
    if (calculerTotalBillets(quantites) === 0) {
      const messageRecap = document.getElementById("recap-message");
      if (messageRecap) {
        messageRecap.hidden = false;
        messageRecap.focus?.();
      }
      return;
    }

    const boutonConfirmer = document.getElementById("bouton-confirmer");
    if (boutonConfirmer) {
      boutonConfirmer.disabled = true;
    }

    afficherConfirmation();
  });
}

document.addEventListener("DOMContentLoaded", initialiserFormulairePanier);
