# Guide d'installation détaillé

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 14 ou supérieure)
   - Télécharger : https://nodejs.org/
   - Vérifier l'installation : `node --version`

2. **PostgreSQL** (version 12 ou supérieure)
   - Télécharger : https://www.postgresql.org/download/
   - Vérifier l'installation : `psql --version`

3. **npm** (installé avec Node.js)
   - Vérifier l'installation : `npm --version`

## Installation étape par étape

### Étape 1 : Créer la base de données

#### Option A : Avec psql (ligne de commande)

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, créer la base de données
CREATE DATABASE location_voitures;

# Quitter psql
\q
```

#### Option B : Avec pgAdmin (interface graphique)

1. Ouvrir pgAdmin
2. Se connecter au serveur PostgreSQL
3. Clic droit sur "Databases" > "Create" > "Database"
4. Nom : `location_voitures`
5. Cliquer sur "Save"

### Étape 2 : Installer les dépendances du Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install
```

Vous devriez voir les packages suivants s'installer :
- express
- pg (PostgreSQL)
- cors
- bcryptjs
- jsonwebtoken
- dotenv

### Étape 3 : Configurer les variables d'environnement

```bash
# Dans le dossier backend, copier le fichier exemple
copy .env.example .env
```

Ouvrir le fichier `.env` avec un éditeur de texte et modifier :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=location_voitures
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRES
JWT_SECRET=generez_un_secret_aleatoire_ici
```

**Important :** Remplacez `VOTRE_MOT_DE_PASSE_POSTGRES` par votre mot de passe PostgreSQL.

Pour le `JWT_SECRET`, vous pouvez générer une chaîne aléatoire. Par exemple :
```
JWT_SECRET=5f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c
```

### Étape 4 : Initialiser la base de données

#### Option A : Avec psql

```bash
# Depuis le dossier backend
psql -U postgres -d location_voitures -f src/config/init-db.sql
```

#### Option B : Avec pgAdmin

1. Ouvrir pgAdmin
2. Se connecter à la base `location_voitures`
3. Cliquer sur "Tools" > "Query Tool"
4. Ouvrir le fichier `backend/src/config/init-db.sql`
5. Cliquer sur "Execute" (icône play)

Vous devriez voir :
- 4 tables créées : utilisateurs, vehicules, clients, locations
- 2 utilisateurs insérés
- 5 véhicules insérés
- 3 clients insérés

### Étape 5 : Vérifier la base de données

```bash
# Se connecter à la base
psql -U postgres -d location_voitures

# Vérifier les tables
\dt

# Vérifier les utilisateurs
SELECT * FROM utilisateurs;

# Quitter
\q
```

### Étape 6 : Installer les dépendances du Frontend

```bash
# Naviguer vers le dossier frontend
cd ../frontend

# Installer les dépendances
npm install
```

Vous devriez voir les packages suivants s'installer :
- react
- react-dom
- react-router-dom
- axios
- react-scripts

### Étape 7 : Démarrer le Backend

```bash
# Dans le dossier backend
cd ../backend

# Démarrer le serveur
npm start
```

Vous devriez voir :
```
Connecté à la base de données PostgreSQL
Serveur démarré sur le port 5000
```

**Ne fermez pas ce terminal !**

### Étape 8 : Démarrer le Frontend

Ouvrir un **nouveau terminal** :

```bash
# Naviguer vers le dossier frontend
cd frontend

# Démarrer l'application React
npm start
```

L'application devrait s'ouvrir automatiquement dans votre navigateur à l'adresse :
```
http://localhost:3000
```

Si elle ne s'ouvre pas automatiquement, ouvrez cette URL manuellement.

### Étape 9 : Se connecter

Vous pouvez maintenant vous connecter avec :

**Compte Administrateur :**
- Email : `admin@location.com`
- Mot de passe : `admin123`

**Compte Employé :**
- Email : `employe@location.com`
- Mot de passe : `employe123`

## Vérification de l'installation

### Backend

Vérifier que le backend fonctionne :
```bash
curl http://localhost:5000/api/health
```

Vous devriez recevoir :
```json
{"message":"API de location de voitures opérationnelle"}
```

### Frontend

1. Ouvrez http://localhost:3000
2. Vous devriez voir la page de connexion
3. Connectez-vous avec un compte de test
4. Vous devriez voir le tableau de bord avec des statistiques

## Résolution des problèmes

### Problème 1 : Erreur de connexion PostgreSQL

**Message d'erreur :**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions :**
1. Vérifier que PostgreSQL est démarré :
   - Windows : Services > PostgreSQL > Démarrer
   - Ou redémarrer votre ordinateur

2. Vérifier le port PostgreSQL :
   ```bash
   psql -U postgres -c "SHOW port;"
   ```

### Problème 2 : Mot de passe incorrect

**Message d'erreur :**
```
password authentication failed for user "postgres"
```

**Solutions :**
1. Vérifier le mot de passe dans `.env`
2. Réinitialiser le mot de passe PostgreSQL si nécessaire

### Problème 3 : Port 5000 déjà utilisé

**Message d'erreur :**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions :**
1. Changer le port dans `.env` :
   ```
   PORT=5001
   ```

2. Ou arrêter l'application qui utilise le port 5000

### Problème 4 : npm install échoue

**Message d'erreur :**
```
npm ERR! code ENOENT
```

**Solutions :**
1. Vérifier que vous êtes dans le bon dossier (backend ou frontend)
2. Supprimer le dossier `node_modules` et `package-lock.json`
3. Relancer `npm install`

### Problème 5 : La base de données existe déjà

**Message d'erreur :**
```
ERROR: database "location_voitures" already exists
```

**Solutions :**
1. Supprimer la base existante :
   ```sql
   DROP DATABASE location_voitures;
   CREATE DATABASE location_voitures;
   ```

2. Ou utiliser la base existante et réexécuter le script init-db.sql

## Commandes utiles

### Arrêter les serveurs

- Backend : `Ctrl + C` dans le terminal du backend
- Frontend : `Ctrl + C` dans le terminal du frontend

### Redémarrer les serveurs

Backend :
```bash
cd backend
npm start
```

Frontend :
```bash
cd frontend
npm start
```

### Réinitialiser la base de données

```bash
psql -U postgres -d location_voitures -f backend/src/config/init-db.sql
```

### Voir les logs du serveur

Les logs s'affichent directement dans le terminal du backend.

## Prochaines étapes

1. Consultez le fichier `README.md` pour plus d'informations
2. Lisez le `GUIDE_DEMARRAGE.md` pour apprendre à utiliser l'application
3. Modifiez le mot de passe de l'administrateur
4. Commencez à ajouter vos propres données

## Support

Si vous rencontrez d'autres problèmes :

1. Vérifiez que toutes les dépendances sont installées
2. Vérifiez les logs dans les terminaux
3. Assurez-vous que PostgreSQL est bien démarré
4. Vérifiez que les ports 3000 et 5000 sont disponibles

Bonne utilisation de l'application !
