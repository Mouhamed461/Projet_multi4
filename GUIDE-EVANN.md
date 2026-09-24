# Guide pour Evann

## Ta branche

Ta branche s'appelle `evann`. Tu travailles toujours dessus, jamais directement sur `main`.

## Ce que tu dois faire

Pages HTML/CSS a integrer :
- pages/expositions.html + styles/pages/expositions.css
- pages/evenements.html + styles/pages/evenements.css
- pages/information-visiteurs.html + styles/pages/information-visiteurs.css

Logique JavaScript :
- scripts/espace-enfant.js (l'activite interactive du casse-tete ferroviaire)

Le concept de l'activite est deja approuve par l'enseignant : guider un train jusqu'a une gare en placant les bons rails aux bons emplacements. Niveaux progressifs de 2, 3, 4 puis 7 rails. Glisser-deposer pour placer les pieces, un bouton pour lancer le train, retour visuel si la piece est bonne ou pas.

Ne jamais appeler ca un "jeu" dans les textes ou les commentaires, c'est une "activite interactive" ou "activite ludo-educative".

## Commandes de base

Recuperer le projet la premiere fois :
```
git clone https://github.com/Mouhamed461/Projet_multi4.git
cd Projet_multi4
git checkout evann
```

Avant de commencer a travailler, toujours remettre ta branche a jour :
```
git checkout evann
git pull origin main
```

Une fois un bout de travail termine :
```
git add .
git commit -m "description courte de ce que tu as fait"
git push origin evann
```

## Envoyer ton travail vers main

Quand une partie est prete, va sur GitHub et ouvre une Pull Request de `evann` vers `main`. Mouhamed regarde et fait le merge. Ne jamais merger directement sans passer par une Pull Request.

## Si ta branche a du retard sur main

Si Mouhamed a deja merge des changements dans `main` pendant que tu travaillais :
```
git checkout evann
git pull origin main
```
Git va combiner les changements automatiquement dans la majorite des cas puisque vous ne touchez pas aux memes fichiers.
