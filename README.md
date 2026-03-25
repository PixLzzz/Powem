# Powem

Application web full-stack de gestion et mise en valeur de contenus créatifs : poèmes, compétences et autres créations. Plateforme personnelle avec authentification et panneau d'administration.

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Frontend | Angular 17, Angular Material 17 |
| Styles | Bootstrap 5, CSS personnalisé |
| Base de données | Firebase Realtime Database |
| Authentification | Firebase Auth |
| Stockage fichiers | Firebase Cloud Storage |
| Email | Firebase Cloud Functions + Nodemailer |
| Serveur | Nginx (Alpine) |
| Conteneurisation | Docker |
| Langage | TypeScript 5.3 |

## Fonctionnalités

- Authentification utilisateur (Firebase Auth)
- CRUD complet sur les poèmes, compétences et contenus divers
- Upload d'images et de fichiers audio
- Éditeur de texte riche (CKEditor)
- Formulaire de contact avec envoi d'email
- Panneau d'administration protégé
- Pages publiques de présentation
- Design responsive (mobile + desktop)

## Installation

### Prérequis

- Node.js 20+
- npm
- Firebase CLI (pour les Cloud Functions)
- Docker (optionnel, pour le déploiement)

### Développement local

```bash
# Installer les dépendances
cd Front
npm install

# Lancer le serveur de développement
npm start
```

L'application est accessible sur `http://localhost:1400/`

### Build de production

```bash
cd Front
npm run build
```

### Déploiement Docker

```bash
# Build de l'image
docker build -t powem:latest .

# Lancer le conteneur
docker run -p 80:80 powem:latest
```

### Déploiement Firebase

```bash
# Hébergement
firebase deploy

# Cloud Functions uniquement
firebase deploy --only functions
```

## Configuration

### Firebase

La configuration Firebase se trouve dans `Front/src/environments/environment.ts`.

### Cloud Functions (email)

```bash
firebase functions:config:set gmail.email="votre-email@gmail.com" gmail.password="votre-mot-de-passe-app"
```

## Structure du projet

```
Powem/
├── Front/                  # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/     # Modèles de données
│   │   │   ├── Services/   # Services (auth, firebase, upload)
│   │   │   └── ...         # Composants (home, poems, skills, etc.)
│   │   └── environments/   # Configuration des environnements
│   └── functions/          # Firebase Cloud Functions
├── Dockerfile              # Build multi-étapes
├── nginx.conf              # Configuration Nginx
└── firebase.json           # Configuration Firebase Hosting
```

## Routes

**Pages publiques :**
`/home` · `/poemHome` · `/skillHome` · `/other` · `/contact` · `/login`

**Pages protégées (admin) :**
`/addPoem` · `/poemList` · `/singlePoem/:id` · `/addSkill` · `/skillList` · `/singleSkill/:id` · `/otherList` · `/singleOther/:id`
