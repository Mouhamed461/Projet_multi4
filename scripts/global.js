document.addEventListener("DOMContentLoaded", mettreAJourStatutMusee);
document.addEventListener("DOMContentLoaded", activerReplBarreProgression);
document.addEventListener("DOMContentLoaded", activerApparitionParagraphes);
document.addEventListener("DOMContentLoaded", activerMenuMobile);

// Menu de navigation en tiroir pour tablette et telephone (voir
// global.css, .nav-toggle et header nav:has(.nav-toggle) ul). Le
// bouton n'existe que sur les pages deja rendues responsives : sur
// les autres, querySelector ne trouve rien et la fonction s'arrete
// tout de suite, sans effet.
function activerMenuMobile() {
  const bouton = document.querySelector(".nav-toggle");
  const nav = bouton ? bouton.closest("nav") : null;

  if (!bouton || !nav) {
    return;
  }

  const fermerMenu = () => {
    nav.classList.remove("menu-ouvert");
    bouton.setAttribute("aria-expanded", "false");
  };

  bouton.addEventListener("click", () => {
    const estOuvert = nav.classList.toggle("menu-ouvert");
    bouton.setAttribute("aria-expanded", String(estOuvert));
  });

  nav.querySelectorAll("ul a").forEach((lien) => {
    lien.addEventListener("click", fermerMenu);
  });

  document.addEventListener("keydown", (evenement) => {
    if (evenement.key === "Escape") {
      fermerMenu();
    }
  });
}

// Fait apparaitre les paragraphes d'un article de blogue (voir
// blogue.css) au fur et a mesure qu'ils entrent dans la fenetre
// visible en defilant. Utilise IntersectionObserver plutot que
// animation-timeline: view(), car un paragraphe deja visible des le
// chargement (avant tout defilement, ex. le premier paragraphe sur
// un grand ecran) n'a alors aucune transition a jouer avec une
// timeline liee au defilement : il apparaissait tel quel, sans
// animation. Avec IntersectionObserver, meme ce premier paragraphe
// joue une vraie transition chronometree des qu'il est detecte a
// l'ecran, comme les suivants au moment ou on defile jusqu'a eux.
function activerApparitionParagraphes() {
  const paragraphes = document.querySelectorAll("main > article p:not(.etiquette)");

  if (!paragraphes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    paragraphes.forEach((paragraphe) => paragraphe.classList.add("est-visible"));
    return;
  }

  const observateur = new IntersectionObserver(
    (entrees, obs) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add("est-visible");
          obs.unobserve(entree.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  paragraphes.forEach((paragraphe) => observateur.observe(paragraphe));
}

// Repli pour la barre de progression de lecture (voir blogue.css) sur
// les navigateurs qui ne supportent pas animation-timeline (Firefox) :
// on calcule le pourcentage defile a la main au lieu de compter sur
// l'animation liee au defilement.
function activerReplBarreProgression() {
  const barre = document.querySelector("#progression-lecture");

  if (!barre || CSS.supports("animation-timeline", "scroll()")) {
    return;
  }

  const mettreAJour = () => {
    const hauteurDefilable = document.documentElement.scrollHeight - window.innerHeight;
    const pourcentage = hauteurDefilable > 0 ? window.scrollY / hauteurDefilable : 0;
    barre.style.transform = `scaleX(${pourcentage})`;
  };

  window.addEventListener("scroll", mettreAJour, { passive: true });
  mettreAJour();
}

// Transitions directionnelles entre certaines pages liees (voir
// global.css, regles :active-view-transition-type). Simple
// amelioration progressive : si le navigateur ne supporte pas la
// Navigation API ou les transitions de page, la navigation reste
// normale, sans script de remplacement.
//   - liste des expositions <-> une fiche d'exposition : glissement
//     horizontal (deja en place).
//   - liste des evenements <-> une fiche d'evenement : meme
//     glissement horizontal.
//   - page blogue <-> un article de blogue : fondu avec un leger
//     zoom, differencie du glissement des expositions.
window.addEventListener("pagereveal", (evenement) => {
  if (!evenement.viewTransition || !window.navigation?.activation) {
    return;
  }

  const depart = navigation.activation.from ? navigation.activation.from.url : "";
  const arrivee = navigation.activation.entry.url;

  const estFicheExposition = (url) => /exposition-fiche/.test(url);
  const estListeExpositions = (url) => /expositions\.html/.test(url);
  const estFicheEvenement = (url) => /evenement-fiche/.test(url);
  const estListeEvenements = (url) => /evenements\.html/.test(url);
  const estArticleBlogue = (url) => /blogue-article/.test(url);
  const estListeBlogue = (url) => /blogue\.html/.test(url);

  if (estListeExpositions(depart) && estFicheExposition(arrivee)) {
    evenement.viewTransition.types.add("expo-avant");
  } else if (estFicheExposition(depart) && estListeExpositions(arrivee)) {
    evenement.viewTransition.types.add("expo-arriere");
  } else if (estListeEvenements(depart) && estFicheEvenement(arrivee)) {
    evenement.viewTransition.types.add("evenement-avant");
  } else if (estFicheEvenement(depart) && estListeEvenements(arrivee)) {
    evenement.viewTransition.types.add("evenement-arriere");
  } else if (estListeBlogue(depart) && estArticleBlogue(arrivee)) {
    evenement.viewTransition.types.add("article-avant");
  } else if (estArticleBlogue(depart) && estListeBlogue(arrivee)) {
    evenement.viewTransition.types.add("article-arriere");
  }
});

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
