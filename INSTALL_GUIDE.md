# Guide d'Installation - AvocatManager Pro

## Prérequis

- Node.js v16+
- MySQL 5.7+
- npm ou yarn

## Installation

### 1. Configuration de la Base de Données

```bash
# Créer la base de données
mysql -u root -p

# Dans MySQL:
CREATE DATABASE avocat_manager;
USE avocat_manager;
source database-schema.sql;
```

### 2. Configuration du Backend

```bash
# Mettre à jour le fichier .env avec vos paramètres MySQL
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=avocat_manager
JWT_SECRET=your_secret_key
```

### 3. Installation des Dépendances

```bash
npm install
```

### 4. Configuration du Frontend

Mettre à jour `.env.local`:

```
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_key
```

## Démarrage

### Mode Développement

**Terminal 1 - Backend (Express):**
```bash
npm start
```

**Terminal 2 - Frontend (Vite):**
```bash
npm run dev
```

### Mode Production

```bash
npm run build
npm start
```

## Structure du Projet

```
project/
├── server.js              # API Express backend
├── auth.ts                # Système d'authentification
├── App.tsx                # Composant principal
├── components/            # Composants React (82 fichiers)
├── database-schema.sql    # Schéma MySQL
├── .env                   # Variables backend
├── .env.local             # Variables frontend
├── package.json           # Dépendances
└── tsconfig.json          # Configuration TypeScript
```

## Problèmes Résolus

✅ Parenthèse manquante dans App.tsx (ligne 101)
✅ API backend avec Express + MySQL créée
✅ Système d'authentification JWT implémenté
✅ Schéma de base de données complète
✅ Variables d'environnement configurées
✅ Tous les composants React existent (82 fichiers)

## Notes Importantes

1. **Authentication**: Utilise JWT tokens stockés dans localStorage
2. **Database**: MySQL avec connexion pool pour performances
3. **API**: RESTful API sur port 3000
4. **Frontend**: React 18 + Vite sur port 5173 (par défaut)

## Prochaines Étapes

1. Implémenter les endpoints d'authentification dans le backend
2. Intégrer l'API client dans les composants React
3. Tester l'authentification complète
4. Configurer CORS correctement en production
5. Ajouter validation de sécurité (CSRF, XSS, etc.)
