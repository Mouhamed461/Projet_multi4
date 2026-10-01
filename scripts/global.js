// Scripts communs à toutes les pages (chargés avec defer).

mettreAJourStatutMusee();
activerMenuMobile();
activerApparitions();
activerBarreProgression();
activerTransitionRetour();

// Affiche « ouvert » ou « fermé » sur l'accueil selon l'heure actuelle.
// Horaire : du mardi au dimanche, de 10 h à 17 h, fermé le 25 décembre et le 1er janvier.
function mettreAJourStatutMusee() {
  const statutMusee = document.querySelector("#statut-musee");
  const statutTexte = document.querySelector("#statut-texte");

  if (!statutMusee || !statutTexte) {
    return;
  }

  const maintenant = new Date();
  const mois = maintenant.getMonth();
  const jourDuMois = maintenant.getDate();
  const heure = maintenant.getHours();

  const jourFerie = (mois === 11 && jourDuMois === 25) || (mois === 0 && jourDuMois === 1);
  const lundi = maintenant.getDay() === 1;
  const ouvert = !jourFerie && !lundi && heure >= 10 && heure < 17;

  statutTexte.textContent = ouvert ? "ouvert" : "fermé";
  statutMusee.classList.toggle("ferme", !ouvert);
}

// Menu hamburger sur tablette et téléphone.
function activerMenuMobile() {
  const bouton = document.querySelector(".bouton-menu");

  if (!bouton) {
    return;
  }

  const nav = bouton.closest("nav");

  function fermerMenu() {
    nav.classList.remove("menu-ouvert");
    bouton.setAttribute("aria-expanded", "false");
  }

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

// Fait apparaître les éléments .apparition quand ils entrent à l'écran.
function activerApparitions() {
  const elements = document.querySelectorAll(".apparition");

  if (!elements.length) {
    return;
  }

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add("est-visible");
        observateur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach((element) => observateur.observe(element));
}

// Barre de progression de lecture des articles de blogue.
function activerBarreProgression() {
  const barre = document.querySelector("#progression-lecture");

  if (!barre) {
    return;
  }

  function mettreAJour() {
    const hauteurDefilable = document.documentElement.scrollHeight - window.innerHeight;
    const progression = hauteurDefilable > 0 ? window.scrollY / hauteurDefilable : 0;
    barre.style.transform = `scaleX(${progression})`;
  }

  window.addEventListener("scroll", mettreAJour, { passive: true });
  mettreAJour();
}

// Lien « Retour » (fiches et articles) : le contenu glisse vers la droite avant de changer de page.
function activerTransitionRetour() {
  const sansAnimation = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("a.retour").forEach((lien) => {
    lien.addEventListener("click", (evenement) => {
      // Ctrl/Cmd/Maj + clic : on laisse le navigateur ouvrir un nouvel onglet.
      if (sansAnimation || evenement.ctrlKey || evenement.metaKey || evenement.shiftKey) {
        return;
      }

      evenement.preventDefault();
      document.body.classList.add("sortie-retour");

      setTimeout(() => {
        window.location.href = lien.href;
      }, 300);
    });
  });

  // Bouton « Précédent » du navigateur : la page restaurée doit redevenir visible.
  window.addEventListener("pageshow", (evenement) => {
    if (evenement.persisted) {
      document.body.classList.remove("sortie-retour");
    }
  });
}
