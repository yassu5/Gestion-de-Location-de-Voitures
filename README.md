# Application de Gestion de Location de Voitures

Application web complète pour gérer une agence de location de voitures. Développée avec React, Node.js et PostgreSQL.

## Fonctionnalités

### Gestion des véhicules
- Ajouter, modifier et supprimer des véhicules
- Suivi du statut : Disponible, Loué, En maintenance
- Informations détaillées : marque, modèle, immatriculation, kilométrage, prix journalier

### Gestion des clients
- Base de données des clients
- Informations : nom, prénom, téléphone, email, pièce d'identité, permis
- Historique des locations par client

### Gestion des locations
- Création de contrats de location
- Suivi des locations en cours
- Clôture des locations avec kilométrage final
- Annulation de locations
- Gestion des cautions et paiements (espèces, virement, carte)

### Tableau de bord
- Statistiques en temps réel
- Véhicules disponibles/loués/en maintenance
- Locations en cours
- Revenu du mois

### Gestion des utilisateurs
- Rôles : Administrateur et Employé
- Authentification JWT
- Gestion des droits d'accès

## Technologies utilisées

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT pour l'authentification
- Bcrypt pour le hashage des mots de passe

### Frontend
- React 18
- React Router pour la navigation
- Axios pour les requêtes HTTP
- CSS personnalisé

## Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- PostgreSQL (version 12 ou supérieure)
- npm ou yarn

### 1. Configuration de la base de données

Créez une base de données PostgreSQL :

```bash
createdb location_voitures
```

Ou via psql :

```sql
CREATE DATABASE location_voitures;
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=location_voitures
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt_tres_securise
```

Initialisez la base de données avec le script SQL :

```bash
psql -U postgres -d location_voitures -f src/config/init-db.sql
```

Ou connectez-vous à PostgreSQL et exécutez le script :

```sql
\i C:/Users/MSI/Desktop/Application\ de\ Gestion\ de\ Location\ de\ Voitures3/backend/src/config/init-db.sql
```

### 3. Configuration du Frontend

```bash
cd frontend
npm install
```

### 4. Démarrage de l'application

**Terminal 1 - Backend :**

```bash
cd backend
npm start
```

Le serveur démarrera sur http://localhost:5000

**Terminal 2 - Frontend :**

```bash
cd frontend
npm start
```

L'application s'ouvrira automatiquement sur http://localhost:3000

## Comptes de test

Deux comptes sont créés par défaut :

**Administrateur :**
- Email : admin@location.com
- Mot de passe : admin123

**Employé :**
- Email : employe@location.com
- Mot de passe : employe123

## Structure du projet

```
Application de Gestion de Location de Voitures3/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Configuration PostgreSQL
│   │   │   └── init-db.sql          # Script d'initialisation DB
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentification
│   │   │   ├── vehiculeController.js
│   │   │   ├── clientController.js
│   │   │   └── locationController.js
│   │   ├── middleware/
│   │   │   └── auth.js              # Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── vehicules.js
│   │   │   ├── clients.js
│   │   │   └── locations.js
│   │   └── server.js                # Point d'entrée
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── Layout.css
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Vehicules.js
│   │   │   ├── Clients.js
│   │   │   ├── Locations.js
│   │   │   └── Utilisateurs.js
│   │   ├── services/
│   │   │   └── api.js               # Services API
│   │   ├── utils/
│   │   │   └── authUtils.js         # Utilitaires auth
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `GET /api/auth/utilisateurs` - Liste des utilisateurs (admin)
- `POST /api/auth/utilisateurs` - Créer un utilisateur (admin)
- `DELETE /api/auth/utilisateurs/:id` - Supprimer un utilisateur (admin)

### Véhicules
- `GET /api/vehicules` - Liste des véhicules
- `GET /api/vehicules/:id` - Détails d'un véhicule
- `POST /api/vehicules` - Créer un véhicule (admin)
- `PUT /api/vehicules/:id` - Modifier un véhicule (admin)
- `DELETE /api/vehicules/:id` - Supprimer un véhicule (admin)

### Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `GET /api/clients/:id/historique` - Historique des locations
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Locations
- `GET /api/locations` - Liste des locations
- `GET /api/locations/:id` - Détails d'une location
- `GET /api/locations/stats/dashboard` - Statistiques
- `POST /api/locations` - Créer une location
- `PUT /api/locations/:id/terminer` - Terminer une location
- `PUT /api/locations/:id/annuler` - Annuler une location

## Droits d'accès

### Administrateur
- Accès complet à toutes les fonctionnalités
- Gestion des véhicules (CRUD)
- Gestion des clients (CRUD)
- Gestion des locations (CRUD)
- Gestion des utilisateurs (création, suppression)

### Employé
- Consultation des véhicules
- Gestion des clients (CRUD)
- Gestion des locations (création, suivi, clôture)
- Pas d'accès à la gestion des utilisateurs

## Fonctionnement des locations

1. **Création d'une location**
   - Sélectionner un client et un véhicule disponible
   - Définir les dates de début et fin
   - Le prix total est calculé automatiquement
   - La caution est suggérée (30% du prix)
   - Enregistrer le kilométrage de début

2. **Terminer une location**
   - Saisir le kilométrage final
   - Ajouter des observations si nécessaire
   - Le véhicule repasse automatiquement en statut "Disponible"

3. **Annuler une location**
   - Une location peut être annulée si elle est en cours
   - Le véhicule repasse automatiquement en statut "Disponible"

## Sécurité

- Authentification par JWT
- Mots de passe hashés avec bcrypt
- Protection des routes par middleware
- Validation des rôles utilisateurs
- Prévention des injections SQL avec requêtes paramétrées

## Support et maintenance

Pour toute question ou problème :
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les variables d'environnement dans `.env`
3. Consultez les logs du serveur backend
4. Vérifiez la connexion à la base de données

## Développement futur (optionnel)

- Export des rapports en PDF
- Notifications par email
- Gestion des assurances
- Historique détaillé des modifications
- Rapports statistiques avancés
- Application mobile

## Licence

Projet développé pour usage interne d'une agence de location de voitures.
