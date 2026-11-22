# Charte front-end ShopLoc

**Référence :** CHF-V1 — validée par l'équipe Nordlys le 16/11/2026
**Rédaction :** Yuliia LOS, responsable de l'architecture front-office
**Version mise en page :** `Nordlys_CHF-V1_Charte_front-end.pdf` (documentation du projet)

Cette charte est la référence pour tout le code de ce dépôt. Toute PR front la respecte, et la responsable front-office la vérifie à la relecture. Pour modifier une règle, on ouvre une PR sur ce fichier et on en parle en revue de sprint.

Statut des règles :

- **En place** : déjà respectée sur `develop`.
- **À venir** : appliquée par la PR « base commune » (voir [Plan de mise en place](#9-plan-de-mise-en-place)). En attendant, les nouvelles pages s'y conforment autant que possible.

## La charte en 10 règles

1. Style flat, thème clair unique : violet pour les actions, turquoise pour le décor, couleurs de la palette uniquement.
2. Une seule feuille de style commune, mêmes classes pour tout le monde.
3. Un composant par fichier, nommé en `PascalCase`.
4. Appels API en chemin relatif `/api/v1/…`, jeton via `getToken()`.
5. Chaque écran gère quatre états : chargement, erreur, vide, succès.
6. Mêmes messages en français pour les codes 400, 401, 403, 404, 409.
7. Le rôle (`getRole()`) choisit l'affichage, jamais la sécurité.
8. Chaque champ a un `<label htmlFor>`, chaque erreur un `role="alert"`.
9. `npm run lint` et `npm run build` passent avant tout push.
10. Toute PR front est testée sur la plateforme et relue par la responsable front-office.

## 1. Organisation du code

```
src/
├── main.jsx          point d'entrée
├── App.jsx           assemble les écrans, rien d'autre
├── auth.js           jeton et rôle (getToken, getRole, login, logout)
├── api.js            apiFetch() : jeton + messages d'erreur      (à venir)
├── assets/          illustrations SVG                            (à venir)
├── styles/
│   ├── theme.css     variables de couleur, typographie            (à venir)
│   └── ui.css        classes communes (card, btn, msg…)          (à venir)
└── components/       un fichier .jsx par écran ou bloc d'écran
```

- `auth.js` est le seul fichier qui lit ou écrit le jeton dans le `sessionStorage`. *(En place)*
- `App.jsx` n'assemble que des composants ; pas de logique métier ni d'appel API, sauf la liste publique des commerces.
- Quand l'application aura plusieurs pages, on ajoutera `react-router` et un dossier `pages/`, après accord de l'équipe.

### Nommage

| Élément | Convention | Exemple |
| --- | --- | --- |
| Composant et son fichier | PascalCase | `PendingShops.jsx` exporte `PendingShops` |
| Fonction, variable, état | camelCase, verbe pour une action | `handleSubmit`, `[loading, setLoading]` |
| Constante de module | UPPER_SNAKE_CASE | `const EMPTY_FORM = {…}` |
| Classe CSS | kebab-case, préfixe du bloc | `card`, `card-title`, `btn-primary` |
| Identifiant de champ | camelCase, unique dans la page | `id="shopName"` + `htmlFor="shopName"` |
| Branche | une par user story | `feature/US-S13-A01-shop-screens` |
| Commit | Conventional Commits, en anglais | `feat: add the pending shops list` |

Le code (identifiants, commentaires, commits) est en anglais ; tout ce que l'utilisateur lit est en français.

## 2. Identité visuelle

ShopLoc adopte un style « flat design » clair et aéré, proche des sites de commerce en ligne actuels : grands titres fins en majuscules, boutons arrondis en forme de pilule, illustrations plates et formes décoratives turquoise. Le violet porte les actions, le turquoise porte l'ambiance. Les maquettes de référence sont dans le PDF de la charte (figures 1 à 3).

### Direction artistique

- **Clair et aéré** : fonds blancs, beaucoup d'espace autour des titres et des cartes, une seule action principale par bloc.
- **Flat design** : aplats de couleur, sans dégradé ni effet 3D ; seules les cartes portent une ombre très légère.
- **Deux couleurs de marque** : le violet pour tout ce qui se clique (boutons, liens, onglet actif), le turquoise pour le décor.
- **Formes décoratives** : cercles cyan, bandes blanches en diagonale et grandes formes arrondies, réservés à la page d'accueil et aux en-têtes de section, jamais sous un texte.
- **Illustrations plates** : en SVG, aux couleurs de la palette, pour la page d'accueil, les listes vides et les pages d'erreur.

### Palette

Les couleurs d'interface servent au texte et aux composants ; les couleurs de décor ne servent qu'aux formes et aux illustrations.

| Rôle | Couleur | Usage |
| --- | --- | --- |
| Primaire (violet) | `#6c5ce7` | boutons, liens, onglet actif, focus |
| Primaire survol | `#5a4fcf` | survol des boutons et des liens |
| Texte | `#2d3142` | titres et texte courant |
| Texte secondaire | `#6b7280` | descriptions, liens de navigation, aides |
| Bordure | `#e2e5ee` | champs, séparateurs |
| Fond de page | `#f6f7fb` | arrière-plan des pages internes |
| Surface | `#ffffff` | cartes, champs, en-tête |
| Erreur / danger | `#c62828` | messages d'erreur, suppression |
| Succès | `#0f7b5f` | confirmations, statut « Validé » |
| Indication | `#9aa0ad` | texte d'exemple des champs (placeholder) seulement |
| Décor : turquoise | `#21b6c6` | grands fonds de la page d'accueil, formes |
| Décor : cyan | `#3fd9f5` | cercles décoratifs |
| Décor : corail | `#e8505b` | illustrations |
| Décor : jaune | `#ffc542` | illustrations |
| Décor : menthe | `#2ec4a5` | illustrations, plantes |

**Règle :** une couleur de décor n'est jamais utilisée pour un texte, ni comme seul moyen de transmettre une information.

### Contrastes

Les textes de l'interface respectent le niveau AA des WCAG 2.1 (rapport d'au moins 4,5:1) : texte 12,9:1, texte secondaire 4,8:1 (4,5:1 sur le fond de page), blanc sur violet 4,9:1, violet sur blanc 4,9:1, rouge 5,6:1, succès 5,2:1. Le blanc sur turquoise ne donne que 2,5:1 : il est interdit.

### Typographie

Une seule police, **Montserrat**, déjà utilisée par l'identité Nordlys. Elle est installée avec le paquet `@fontsource/montserrat` et servie par l'application elle-même, sans appel à Google Fonts. Trois graisses seulement : 300, 400 et 600.

| Usage | Taille | Graisse | Casse |
| --- | --- | --- | --- |
| Titre d'accueil | 44 px (30 px mobile) | 300 | MAJUSCULES |
| Titre de page | 32 px (24 px mobile) | 300 | MAJUSCULES |
| Titre de carte | 20 px | 600 | normale |
| Texte, champs | 15 px | 400 | normale |
| Libellé de champ | 13 px | 600 | normale |
| Bouton, badge | 12 px, espacé de 0,08 em | 600 | MAJUSCULES |

### Formes, espacements et thème

- **Boutons et badges** : forme de pilule (`border-radius: 999px`).
- **Champs** : rayon de 10 px, bordure de 1,5 px ; au focus, bordure violette et halo `0 0 0 3px rgba(108,92,231,.18)`.
- **Cartes** : blanches, rayon de 16 px, ombre unique `0 10px 30px rgba(45,49,66,.08)`.
- **Espacements** : 4, 8, 12, 16, 24, 32 et 48 px, aucune autre valeur.
- **Thème clair unique** : le mode sombre du gabarit Vite (`color-scheme: light dark` dans `index.css`) est retiré. *(À venir)*

Les couleurs passent par des variables CSS *(à venir)* :

```css
/* À faire — styles/theme.css */
:root {
  --color-primary: #6c5ce7;
  --color-text: #2d3142;
  --color-error: #c62828;
  --color-decor-teal: #21b6c6;
}
.msg-error { color: var(--color-error); }

/* À éviter — une couleur en dur, différente dans chaque composant */
.login-error { color: #c0392b; }
.form-error  { color: red; }

/* À éviter — texte blanc sur turquoise : contraste insuffisant */
.banner { background: #21b6c6; color: #fff; }
```

## 3. Composants communs

| Composant | Classe cible | Usage |
| --- | --- | --- |
| Carte | `card`, `card-title`, `card-description` | conteneur blanc de chaque bloc |
| Formulaire | `form`, `field` | colonne de champs, libellé au-dessus du champ |
| Bouton principal | `btn btn-primary` | pilule violette pleine : l'action principale, une seule par carte |
| Bouton secondaire | `btn btn-secondary` | pilule en contour violet : en savoir plus, annuler, refuser |
| Bouton danger | `btn btn-danger` | pilule rouge : action irréversible, toujours avec confirmation |
| Badge de statut | `badge badge-success`, `badge badge-pending` | « Validé », « En attente » dans une liste |
| Messages | `msg-error`, `msg-success` | retour d'une action, sous le formulaire |
| Texte discret | `muted` | liste vide, aide |
| Illustration | `illustration` | image SVG de la page d'accueil et des listes vides |

**Transition.** Aujourd'hui, une partie de ces styles existe sous les noms `registration-card`, `registration-error`… dans `RegistrationForm.css`. Tant que la PR « base commune » n'est pas fusionnée, les nouvelles pages importent ce fichier et utilisent ces classes ; la PR les renommera partout en une fois et appliquera le nouveau style.

```jsx
// À faire
<section className="card">
  <h3 className="card-title">Mes données</h3>
  <button className="btn btn-primary">Enregistrer</button>
  <button className="btn btn-danger">Supprimer mon compte</button>
</section>

// À éviter : style en ligne, et l'action destructrice ressemble à l'action principale
<div style={{ background: 'white', padding: 30, borderRadius: 12 }}>
  <button>Enregistrer</button>
  <button>Supprimer mon compte</button>
</div>
```

## 4. Mise en page

L'application a deux types de pages : la page d'accueil, avec son grand titre, son illustration et ses formes de décor, et les pages internes (espaces client, commerçant, administrateur), sobres et sans décor.

| Règle | Détail | Statut |
| --- | --- | --- |
| En-tête commun | Logo « SHOPLOC » à gauche (« SHOP » violet en 600, « LOC » en 300) ; à droite, les liens de navigation, l'onglet actif en violet, la personne connectée et « Se déconnecter », ou « Se connecter » | À venir |
| Page d'accueil | Titre à gauche, texte court, deux boutons (« En savoir plus » ou « Voir les commerces »), illustration à droite ; formes de décor autour | À venir |
| Pages internes | Fond `#f6f7fb`, titre de page et sous-titre, cartes séparées de 24 à 32 px ; colonne de 1 100 px maximum, formulaires de 460 px ; aucun décor | À venir |
| Un écran par rôle | Chaque rôle ne voit que ses blocs ; la liste publique des commerces reste visible par tous | En place |
| Responsive | Sous 640 px : une colonne, titres et boutons centrés, boutons empilés, navigation dans le menu ≡ ; pas de largeur fixe hors `max-width` | À venir |
| Pas de défilement horizontal | Vérifié à 375 px de large avant chaque PR | À venir |

### Ajouter un écran dans App.jsx

`App.jsx` est modifié par presque toutes les user stories : c'est la première source de conflits du front. On y ajoute le minimum, sans réécrire le reste du fichier :

```jsx
// 1. une ligne d'import
import PendingShops from './components/PendingShops.jsx'

// 2. une ligne d'affichage, juste avant </main>
{getRole() === 'ADMIN' && <PendingShops />}
```

## 5. Règles de développement React

### Composants

- Composants fonctions et hooks uniquement ; un composant exporté par défaut par fichier.
- Un composant fait une chose : `ShopRegistrationForm` inscrit un commerce, `PendingShops` liste les demandes.
- L'état reste local ; il remonte dans `App.jsx` seulement s'il est partagé (le jeton, par exemple).
- On ne désactive jamais une règle du linter (`eslint-plugin-react-hooks`) par un commentaire.

### Appels à l'API (en place)

Toujours un chemin relatif `/api/v1/…` : Vite (en développement) et nginx (dans docker compose) le redirigent vers la gateway. Le jeton vient de `getToken()` et part dans `Authorization: Bearer`.

```jsx
// À faire
import { getToken } from '../auth.js'

const response = await fetch('/api/v1/shops', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
  body: JSON.stringify(form),
})

// À éviter : adresse en dur, jeton lu à la main, en-tête d'identité inventé
fetch('http://localhost:8080/api/v1/shops', {
  headers: { 'X-User-Role': 'MERCHANT' }, // effacé par la gateway
})
```

### Rôles et sécurité

`getRole()` lit le rôle dans le jeton pour choisir quoi afficher : c'est une aide à l'affichage, pas une protection. La gateway vérifie le jeton, puis chaque service vérifie le rôle et la propriété des données. Un écran traite donc toujours le cas 403, même si le bouton n'est visible que pour le bon rôle.

### Les quatre états d'un écran

| État | Ce que voit l'utilisateur | Exemple |
| --- | --- | --- |
| Chargement | Un texte court ; le bouton d'envoi est désactivé | « Envoi en cours... » |
| Erreur | Le message commun, en rouge, avec `role="alert"` | « Veuillez vous reconnecter. » |
| Vide | Une phrase en texte discret | « Aucune demande en attente. » |
| Succès | Une confirmation en vert, avec `role="status"` | « Demande envoyée ! » |

### Messages d'erreur communs

| Code | Signification | Message affiché |
| --- | --- | --- |
| 400 | Données invalides | Le champ concerné : « Le nom, l'adresse et la catégorie sont obligatoires. » |
| 401 | Jeton absent ou expiré | « Veuillez vous reconnecter. » |
| 403 | Rôle non autorisé | « Cette action est réservée à … » (le rôle concerné) |
| 404 | Élément introuvable | « Cet élément n'existe plus. » |
| 409 | Conflit métier | La règle en clair : « Cette demande a déjà été traitée. » |
| 5xx / réseau | Panne | « Impossible de … pour le moment. Réessayez plus tard. » |

Les erreurs réseau sont toujours attrapées :

```jsx
// À faire
setLoading(true)
try {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(messageFor(response.status))
  setSuccess(true)
} catch (err) {
  setError(err.message)
} finally {
  setLoading(false)
}

// À éviter : si le réseau coupe, rien ne s'affiche et le bouton reste bloqué
const response = await fetch(url, options)
if (response.ok) setMessage('OK')
else setError('Erreur')
```

### Formulaires

- Champs obligatoires avec `required` ; les `maxLength` reprennent les limites du back (par exemple 120 caractères pour le nom d'un commerce).
- Valeurs nettoyées avant l'envoi (`trim()`) ; un champ facultatif vide part en `null`.
- Après un succès, le formulaire est vidé et la confirmation s'affiche.
- Une action irréversible demande une confirmation (`window.confirm` en attendant une boîte de dialogue commune).

## 6. Accessibilité

Objectif : niveau AA des WCAG 2.1 sur les écrans livrés.

| Règle | Mise en œuvre | Statut |
| --- | --- | --- |
| Chaque champ a un libellé | `<label htmlFor="shopName">` lié à `<input id="shopName">` ; pas de placeholder à la place du libellé | En place |
| Messages annoncés | `role="alert"` sur les erreurs, `role="status"` sur les confirmations | En place |
| Contrastes AA | Uniquement les couleurs d'interface de la palette, jamais de texte sur une couleur de décor | À venir |
| Navigation au clavier | Tout se fait avec Tab et Entrée ; focus visible (bordure violette et halo) | En place |
| Vrais boutons | `<button>` pour une action, `type="button"` s'il n'envoie pas le formulaire ; jamais un `div` cliquable | En place |
| Langue et titre | `<html lang="fr">` et `<title>ShopLoc</title>` dans `index.html` | À venir |
| Hiérarchie des titres | Un seul `h1` par page (le titre d'accueil), `h2` pour les sections, `h3` pour les cartes | À venir |
| Images | `alt` descriptif, ou `alt=""` si l'image est décorative | En place |

## 7. Textes, performances et éco-conception

**Textes de l'interface**

- Français, vouvoiement, phrases courtes, majuscule en début de phrase seulement.
- Un bouton dit ce qu'il fait (« Envoyer la demande », pas « OK »).
- Un message d'erreur dit quoi faire (« Veuillez vous reconnecter », pas « Erreur 401 »).
- Les mêmes mots que le cahier des charges : commerce partenaire, carte de fidélité, commerçant.

**Performances et éco-conception**

- Pas de nouvelle dépendance sans accord en revue (Recharts est déjà prévu pour les tableaux de bord).
- Montserrat seule, servie par l'application en trois graisses woff2 (environ 60 Ko) ; aucune police chargée depuis un service externe.
- Illustrations en SVG, réutilisées d'une page à l'autre ; toute image compressée, 200 Ko maximum.
- Pas d'interrogation périodique de l'API : on recharge après une action de l'utilisateur.
- `useEffect` avec ses dépendances exactes, pour ne pas rappeler l'API à chaque rendu.
- Taille du bundle lue dans la sortie de `npm run build` (environ 230 Ko de JavaScript au sprint 1).

## 8. Processus

Une user story n'est terminée que si son front est fusionné et visible sur la plateforme (`docker compose up`).

1. Partir de `develop` à jour : `git checkout develop`, `git pull`, `git checkout -b feature/US-XXX-…`
2. Développer dans `src/components/`, ajout minimal dans `App.jsx`.
3. Vérifier : `npm run lint` sans erreur et `npm run build` réussi.
4. Tester sur la plateforme : `docker compose up -d --build`, puis le scénario de la user story sur `http://localhost` avec les comptes de test du rôle concerné.
5. Synchroniser : `git pull origin develop` dans sa branche, résoudre les conflits.
6. Ouvrir la PR vers `develop` : description en français, captures d'écran, user stories liées. La checklist du modèle de PR s'affiche automatiquement.
7. Relecture par la responsable front-office ; CI verte obligatoire.
8. Fusion par l'auteur, avec « Create a merge commit », dans l'ordre annoncé sur Discord.

## 9. Plan de mise en place

PR « base commune », ouverte par la responsable front-office une fois les PR front en cours fusionnées :

1. Thème clair unique, suppression du gabarit Vite — `src/index.css`, `src/App.css`
2. Variables de couleur et classes communes — `src/styles/theme.css`, `src/styles/ui.css`
3. Renommage des classes `registration-*`, boutons pilule et badges — composants existants
4. Gabarit commun : en-tête avec navigation et menu ≡, page d'accueil, colonne des pages internes — `src/components/Layout.jsx`, `App.jsx`
5. Fonction `apiFetch()` et messages d'erreur communs — `src/api.js`
6. Police Montserrat et illustrations — `package.json` (`@fontsource/montserrat`), `src/assets/`
7. Langue et titre — `index.html`

