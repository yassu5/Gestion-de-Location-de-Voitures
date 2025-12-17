# Résumé du Projet - Application de Gestion de Location de Voitures

## Vue d'ensemble

Application web complète et simple pour gérer une agence de location de voitures, développée avec React, Node.js et PostgreSQL.

## Technologies utilisées

### Backend
- **Node.js** avec Express.js
- **PostgreSQL** pour la base de données
- **JWT** pour l'authentification
- **Bcrypt** pour le hashage des mots de passe
- **CORS** pour les requêtes cross-origin

### Frontend
- **React 18** avec Hooks
- **React Router** pour la navigation
- **Axios** pour les requêtes HTTP
- **CSS personnalisé** (pas de framework CSS)

## Fonctionnalités implémentées

### ✅ Authentification
- Connexion avec email et mot de passe
- Protection par JWT
- 2 rôles : Admin et Employé
- Session persistante (localStorage)

### ✅ Gestion des véhicules
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Informations : marque, modèle, immatriculation, kilométrage, année, couleur, prix journalier
- 3 statuts : Disponible, Loué, En maintenance
- Réservé aux administrateurs (création/modification/suppression)

### ✅ Gestion des clients
- CRUD complet
- Informations : nom, prénom, téléphone, email, pièce d'identité, permis, adresse
- Accessible à tous les utilisateurs connectés

### ✅ Gestion des locations
- Création de contrats de location
- Sélection client et véhicule
- Calcul automatique du prix (nb jours × prix journalier)
- Caution suggérée (30% du prix)
- 3 modes de paiement : Espèces, Virement, Carte
- Suivi du kilométrage (début et fin)
- 3 statuts : En cours, Terminée, Annulée
- Clôture de location avec kilométrage final
- Annulation de location

### ✅ Tableau de bord
- Statistiques en temps réel :
  - Nombre de véhicules disponibles
  - Nombre de véhicules loués
  - Nombre de véhicules en maintenance
  - Revenu du mois en cours
- Liste des locations en cours
- État du parc automobile

### ✅ Gestion des utilisateurs (Admin uniquement)
- Création de nouveaux utilisateurs
- Attribution des rôles (Admin/Employé)
- Suppression d'utilisateurs
- Protection : impossible de supprimer son propre compte

## Architecture du projet

```
Application/
├── backend/               # Serveur Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuration DB + script SQL
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Authentification JWT
│   │   ├── routes/       # Routes API REST
│   │   └── server.js     # Point d'entrée
│   └── package.json
│
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   ├── utils/       # Utilitaires
│   │   └── App.js       # Composant principal
│   └── package.json
│
└── Documentation/
    ├── README.md              # Documentation principale
    ├── GUIDE_DEMARRAGE.md     # Guide d'utilisation
    ├── INSTALLATION.md        # Guide d'installation
    └── RESUME_PROJET.md       # Ce fichier
```

## Base de données

### Schéma PostgreSQL

**Table utilisateurs**
- id, nom, prenom, email, mot_de_passe, role, created_at

**Table vehicules**
- id, marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur, created_at

**Table clients**
- id, nom, prenom, telephone, email, num_piece_identite, num_permis, adresse, created_at

**Table locations**
- id, vehicule_id, client_id, utilisateur_id, date_debut, date_fin, prix_total, caution, mode_paiement, statut, kilometrage_debut, kilometrage_fin, observations, created_at

## API REST

### Endpoints principaux

**Authentification**
- POST `/api/auth/login` - Connexion
- GET `/api/auth/profile` - Profil utilisateur

**Véhicules**
- GET `/api/vehicules` - Liste
- POST `/api/vehicules` - Créer (admin)
- PUT `/api/vehicules/:id` - Modifier (admin)
- DELETE `/api/vehicules/:id` - Supprimer (admin)

**Clients**
- GET `/api/clients` - Liste
- POST `/api/clients` - Créer
- PUT `/api/clients/:id` - Modifier
- DELETE `/api/clients/:id` - Supprimer

**Locations**
- GET `/api/locations` - Liste
- POST `/api/locations` - Créer
- PUT `/api/locations/:id/terminer` - Terminer
- PUT `/api/locations/:id/annuler` - Annuler
- GET `/api/locations/stats/dashboard` - Statistiques

## Sécurité

✅ Authentification JWT avec expiration (24h)
✅ Mots de passe hashés avec bcrypt (10 rounds)
✅ Protection des routes par middleware
✅ Validation des rôles utilisateurs
✅ Requêtes SQL paramétrées (prévention injection SQL)
✅ CORS configuré
✅ Variables sensibles dans .env

## Données de test

### Utilisateurs
- Admin : admin@location.com / admin123
- Employé : employe@location.com / employe123

### Véhicules (5)
- Renault Clio, Peugeot 208, Citroën C3, Dacia Sandero, Volkswagen Golf

### Clients (3)
- Sophie Martin, Pierre Bernard, Marie Dubois

## Points forts du projet

✅ **Simple et clair** : Pas de sur-ingénierie, code facile à comprendre
✅ **Complet** : Toutes les fonctionnalités du cahier des charges
✅ **Sécurisé** : Authentification JWT, hashage bcrypt
✅ **Responsive** : Interface adaptée tablette et PC
✅ **Données de test** : Prêt à utiliser immédiatement
✅ **Documentation** : 3 guides complets

## Cas d'usage typique

1. **Employé se connecte**
2. **Crée un nouveau client** (si nécessaire)
3. **Crée une location** :
   - Sélectionne le client
   - Choisit un véhicule disponible
   - Définit les dates
   - Le prix est calculé automatiquement
   - Enregistre le kilométrage de départ
4. **Suivi sur le tableau de bord**
5. **À la fin de la location** :
   - Termine la location
   - Enregistre le kilométrage final
   - Le véhicule redevient disponible

## Évolutions possibles

- Export PDF des contrats
- Notifications par email
- Gestion des assurances
- Rapports statistiques avancés
- Recherche et filtres avancés
- Historique des modifications
- Application mobile
- Multi-agences

## Démarrage rapide

```bash
# 1. Créer la base de données
createdb location_voitures

# 2. Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos paramètres
psql -U postgres -d location_voitures -f src/config/init-db.sql
npm start

# 3. Frontend (nouveau terminal)
cd frontend
npm install
npm start

# 4. Ouvrir http://localhost:3000
# 5. Se connecter avec admin@location.com / admin123
```

## État du projet

✅ **Projet terminé et fonctionnel**

Toutes les fonctionnalités du cahier des charges sont implémentées :
- Gestion des véhicules ✅
- Gestion des clients ✅
- Gestion des locations ✅
- Tableau de bord ✅
- Authentification et rôles ✅
- Documentation complète ✅

## Support

Consultez les fichiers de documentation :
- **README.md** : Vue d'ensemble et détails techniques
- **INSTALLATION.md** : Guide d'installation pas à pas
- **GUIDE_DEMARRAGE.md** : Guide d'utilisation

---

**Développé avec React, Node.js et PostgreSQL**
**Simple, complet et fonctionnel**
