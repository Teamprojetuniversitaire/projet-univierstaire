# 🎓 Microservice Import/Export CSV - Étudiants & Enseignants

Un microservice complet pour gérer l'import et l'export de données CSV pour les étudiants et enseignants, avec une interface web moderne.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Format des fichiers CSV](#format-des-fichiers-csv)

## ✨ Fonctionnalités

### Backend
- ✅ Import de fichiers CSV (étudiants et enseignants)
- ✅ Export de données en format CSV
- ✅ Validation des données avec messages d'erreur détaillés
- ✅ Gestion d'erreurs centralisée
- ✅ Upload de fichiers avec Multer (max 5MB)
- ✅ Documentation API avec Swagger
- ✅ Téléchargement de templates CSV vides

### Frontend
- ✅ Interface moderne avec TailwindCSS
- ✅ Upload de fichiers avec drag & drop
- ✅ Aperçu des données CSV avant import
- ✅ Barre de progression pour les uploads
- ✅ Notifications de succès/erreur
- ✅ Téléchargement de modèles CSV
- ✅ Design responsive

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express.js** - Serveur API
- **Supabase** - Base de données PostgreSQL
- **Multer** - Upload de fichiers
- **csv-parser** - Lecture CSV
- **json2csv** - Export CSV
- **Swagger** - Documentation API
- **Morgan** - Logs HTTP
- **CORS** - Gestion des origines
- **express-validator** - Validation des données

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Axios** - Client HTTP
- **React Icons** - Icônes

## 📁 Architecture

```
.
├── backend/
│   ├── config/
│   │   ├── supabase.js          # Configuration Supabase
│   │   └── swagger.js           # Configuration Swagger
│   ├── controllers/
│   │   ├── etudiantController.js
│   │   └── enseignantController.js
│   ├── database/
│   │   └── schema.sql           # Schéma de la base de données
│   ├── middleware/
│   │   ├── errorHandler.js      # Gestion d'erreurs
│   │   ├── upload.js            # Configuration Multer
│   │   └── validation.js        # Validation des données
│   ├── models/
│   │   ├── Etudiant.js
│   │   └── Enseignant.js
│   ├── routes/
│   │   ├── etudiantRoutes.js
│   │   └── enseignantRoutes.js
│   ├── uploads/                 # Dossier temporaire uploads
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Point d'entrée
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CSVSection.jsx   # Composant section CSV
    │   │   ├── Notification.jsx # Notifications
    │   │   └── ProgressBar.jsx  # Barre de progression
    │   ├── services/
    │   │   └── api.js           # Service API
    │   ├── App.jsx              # Composant principal
    │   ├── main.jsx             # Point d'entrée
    │   └── index.css            # Styles globaux
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Un compte Supabase

### 1. Cloner le projet

```bash
cd "Import  Export CSV (Étudiants et Enseignants)"
```

### 2. Configuration de la base de données Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Exécutez le script SQL dans l'éditeur SQL de Supabase :

```bash
# Le fichier se trouve dans backend/database/schema.sql
```

Ce script crée :
- Table `etudiants` (id, nom, prenom, email, groupe, created_at, updated_at)
- Table `enseignants` (id, nom, prenom, email, departement, created_at, updated_at)
- Index pour optimiser les performances
- Triggers pour la mise à jour automatique de `updated_at`
- Politiques RLS (Row Level Security)

### 3. Installation du Backend

```bash
cd backend
npm install

# Copier le fichier de configuration
copy .env.example .env

# Éditer .env et ajouter vos credentials Supabase
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_anon_key
```

### 4. Installation du Frontend

```bash
cd ../frontend
npm install

# Copier le fichier de configuration
copy .env.example .env
```

## ⚙️ Configuration

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Utilisation

### Démarrer le Backend

```bash
cd backend

# Mode développement avec auto-reload
npm run dev

# Ou mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:3000`

### Accéder à la documentation API

Ouvrez votre navigateur : `http://localhost:5000/api-docs`

## 📡 API Documentation

### Endpoints Étudiants

#### POST `/api/etudiants/import`
Importer des étudiants depuis un fichier CSV

**Request:**
- Content-Type: `multipart/form-data`
- Body: fichier CSV avec les colonnes : `nom`, `prenom`, `email`, `groupe`

**Response:**
```json
{
  "success": true,
  "message": "5 étudiant(s) importé(s) avec succès",
  "data": {
    "imported": 5,
    "errors": 0,
    "errorDetails": []
  }
}
```

#### GET `/api/etudiants/export`
Exporter tous les étudiants en CSV

**Response:** Fichier CSV téléchargeable

#### GET `/api/etudiants/template`
Télécharger un modèle CSV vide pour les étudiants

**Response:** Fichier CSV template

#### GET `/api/etudiants`
Récupérer tous les étudiants

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Endpoints Enseignants

#### POST `/api/enseignants/import`
Importer des enseignants depuis un fichier CSV

**Request:**
- Content-Type: `multipart/form-data`
- Body: fichier CSV avec les colonnes : `nom`, `prenom`, `email`, `departement`

#### GET `/api/enseignants/export`
Exporter tous les enseignants en CSV

#### GET `/api/enseignants/template`
Télécharger un modèle CSV vide pour les enseignants

#### GET `/api/enseignants`
Récupérer tous les enseignants

## 📄 Format des fichiers CSV

### Étudiants

```csv
nom,prenom,email,groupe
Dupont,Jean,jean.dupont@example.com,Groupe A
Martin,Sophie,sophie.martin@example.com,Groupe B
Bernard,Pierre,pierre.bernard@example.com,Groupe A
```

**Colonnes requises :**
- `nom` : Nom de famille de l'étudiant
- `prenom` : Prénom de l'étudiant
- `email` : Adresse email valide (unique)
- `groupe` : Groupe ou classe de l'étudiant

### Enseignants

```csv
nom,prenom,email,departement
Dubois,Marie,marie.dubois@example.com,Informatique
Leroy,Paul,paul.leroy@example.com,Mathématiques
Moreau,Claire,claire.moreau@example.com,Physique
```

**Colonnes requises :**
- `nom` : Nom de famille de l'enseignant
- `prenom` : Prénom de l'enseignant
- `email` : Adresse email valide (unique)
- `departement` : Département d'affectation

### Règles de validation

- ✅ Tous les champs sont **obligatoires**
- ✅ L'email doit être **valide** (format standard)
- ✅ L'email doit être **unique** (pas de doublons)
- ✅ Taille maximale du fichier : **5 MB**
- ✅ Format accepté : **CSV uniquement**
- ✅ Encodage recommandé : **UTF-8**

## 🎨 Interface Frontend

### Pages principales

1. **Gestion Étudiants**
   - Import CSV avec aperçu
   - Export vers CSV
   - Téléchargement de modèle

2. **Gestion Enseignants**
   - Import CSV avec aperçu
   - Export vers CSV
   - Téléchargement de modèle

### Fonctionnalités UI

- 🎯 Upload de fichier avec zone de glisser-déposer
- 👁️ Aperçu des 5 premières lignes du CSV
- 📊 Barre de progression durant l'upload
- 🔔 Notifications toast pour succès/erreurs
- 📱 Design responsive (mobile, tablet, desktop)
- 🎨 Interface moderne avec TailwindCSS

## 🧪 Tests

### Tester l'import

1. Téléchargez un modèle CSV
2. Remplissez les données
3. Importez le fichier via l'interface
4. Vérifiez les notifications de succès/erreur

### Tester l'export

1. Cliquez sur "Exporter CSV"
2. Le fichier se télécharge automatiquement
3. Ouvrez-le avec Excel ou un éditeur de texte

## 🐛 Gestion des erreurs

### Codes d'erreur courants

- **400 Bad Request** : Fichier invalide ou données manquantes
- **404 Not Found** : Aucune donnée à exporter
- **500 Internal Server Error** : Erreur serveur

### Messages d'erreur détaillés

Le backend retourne des messages clairs :
```json
{
  "success": false,
  "message": "Aucun étudiant valide trouvé dans le fichier CSV",
  "errors": [
    {
      "line": 2,
      "message": "Email invalide",
      "data": {...}
    }
  ]
}
```

## 📦 Build pour production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Les fichiers de production sont dans `frontend/dist/`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Projet créé pour la gestion universitaire

## 🙏 Remerciements

- Supabase pour la base de données
- TailwindCSS pour le framework CSS
- Toute la communauté open-source

---

**Note:** N'oubliez pas de configurer vos variables d'environnement avant de lancer l'application !
