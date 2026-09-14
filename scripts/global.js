document.addEventListener("DOMContentLoaded", mettreAJourStatutMusee);

function mettreAJourStatutMusee() {
  const statutTexte = document.querySelector("#statut-texte");
  const statutMusee = document.querySelector("#statut-musee");

  if (!statutTexte || !statutMusee) {
    return;
  }

  const maintenant = new Date();
  const jour = maintenant.getDay();
  const heure = maintenant.getHours();
  const mois = maintenant.getMonth();
  const jourDuMois = maintenant.getDate();

  const jourFerie = (mois === 11 && jourDuMois === 25) || (mois === 0 && jourDuMois === 1);
  const ouvert = !jourFerie && jour !== 1 && heure >= 10 && heure < 17;

  statutTexte.textContent = ouvert ? "ouvert" : "fermé";
  statutMusee.classList.toggle("ferme", !ouvert);
}
