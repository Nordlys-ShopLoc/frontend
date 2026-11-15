# frontend
Application web React

## Connexion

La page d'accueil affiche un formulaire de connexion (US-T01). Le jeton renvoyé par `POST /api/v1/auth/login` est gardé dans le `sessionStorage` : il reste après un rechargement et disparaît à la fermeture de l'onglet.

Pour appeler une route protégée, envoyer le jeton dans l'en-tête `Authorization` :

```js
import { getToken } from './auth.js'

fetch('/api/v1/cards/me', { headers: { Authorization: `Bearer ${getToken()}` } })
```
