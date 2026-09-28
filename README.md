# Parapente Mémo

Petite application statique (HTML/CSS/JS vanilla, sans build ni dépendance) pour se remettre en mémoire les bases du parapente avant une reprise : matériel, check-list avant vol, technique de pilotage, météo, sécurité/réglementation, lexique et un quiz de révision.

⚠️ C'est un pense-bête personnel, pas une ressource officielle ni un substitut à un stage de reprise avec un moniteur diplômé en activité. La réglementation aérienne et certains usages évoluent : vérifie toujours les points de sécurité et de réglementation sur les sources officielles (FFVL, SIA/AIP France) et avec un moniteur.

## Structure

```
index.html              Page unique (onglets : Matériel, Avant le vol, Technique, Météo, Sécurité, Lexique, Quiz)
assets/css/style.css    Thème (ciel/aviation)
assets/js/app.js        Onglets, cases "révisé" persistées (localStorage), recherche lexique, moteur de quiz
```

## Aperçu en local

Aucune dépendance ni build requis :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Fonctionnement

- Les cases « révisé » sur chaque fiche et les filtres du quiz sont sauvegardés dans le `localStorage` du navigateur (rien n'est envoyé sur un serveur).
- Le quiz mélange les questions et les réponses à chaque lancement, filtrable par catégorie.
- Le lexique se filtre en direct par mot-clé.

## Pour aller plus loin

Contenu à enrichir librement (nouvelles fiches, nouvelles questions de quiz) au fil des stages de reprise — c'est fait pour évoluer avec l'expérience réelle, pas pour rester figé.
