## Description

<!-- Ce que fait cette pull request, en une ou deux phrases -->

## User stories

<!-- Exemple : Closes #12 (US-C02) -->

## Captures d'écran

<!-- Une capture par écran ajouté ou modifié -->

## Vérifications

- [ ] `npm run lint` passe sans erreur
- [ ] `npm run build` réussit
- [ ] Testé sur la plateforme (`docker compose up -d --build`, puis http://localhost) avec le compte du rôle concerné
- [ ] Couleurs et classes de la charte (`docs/CHARTE_FRONT.md`), pas de style en ligne
- [ ] Les quatre états sont gérés : chargement, erreur, vide, succès
- [ ] Messages d'erreur communs pour 400, 401, 403, 404 et 409
- [ ] Appels en chemin relatif `/api/v1/…` avec `getToken()`
- [ ] Chaque champ a un `<label htmlFor>`, chaque erreur un `role="alert"`
- [ ] Ajout minimal dans `App.jsx`, textes en français, vérifié à 375 px de large
- [ ] Aucun secret (mot de passe, clé, jeton) dans le code
