# Guide de démarrage rapide

## Installation rapide (Windows)

### 1. Installer PostgreSQL

Si PostgreSQL n'est pas installé :
1. Téléchargez PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Installez avec les paramètres par défaut
3. Notez le mot de passe du superutilisateur (postgres)

### 2. Créer la base de données

Ouvrez pgAdmin ou utilisez psql :

```sql
CREATE DATABASE location_voitures;
```

### 3. Configurer le Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier de configuration
copy .env.example .env
```

Éditez le fichier `.env` et modifiez :
```
DB_PASSWORD=votre_mot_de_passe_postgres
JWT_SECRET=changez_ce_secret_123456
```

### 4. Initialiser la base de données

Depuis le dossier backend, avec psql :

```bash
psql -U postgres -d location_voitures -f src/config/init-db.sql
```

Ou ouvrez pgAdmin :
1. Connectez-vous à la base `location_voitures`
2. Outils > Query Tool
3. Ouvrez et exécutez le fichier `backend/src/config/init-db.sql`

### 5. Configurer le Frontend

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances
npm install
```

### 6. Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm start
```

Vous devriez voir : "Serveur démarré sur le port 5000"

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

L'application s'ouvrira automatiquement sur http://localhost:3000

### 7. Se connecter

Utilisez un des comptes de test :

**Admin :**
- Email : `admin@location.com`
- Mot de passe : `admin123`

**Employé :**
- Email : `employe@location.com`
- Mot de passe : `employe123`

## Résolution des problèmes courants

### Erreur de connexion à PostgreSQL

**Erreur :** "Connection refused" ou "password authentication failed"

**Solution :**
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les paramètres dans le fichier `.env`
3. Testez la connexion avec psql :
```bash
psql -U postgres -d location_voitures
```

### Port 5000 déjà utilisé

**Erreur :** "Port 5000 is already in use"

**Solution :**
1. Changez le port dans `.env` : `PORT=5001`
2. Ou arrêtez l'application qui utilise le port 5000

### Erreur CORS

**Erreur :** "CORS policy blocked"

**Solution :**
Vérifiez que le backend est bien démarré sur http://localhost:5000

### Échec d'authentification

**Erreur :** "Email ou mot de passe incorrect"

**Solution :**
1. Vérifiez que la base de données a été initialisée avec `init-db.sql`
2. Les mots de passe de test sont : `admin123` et `employe123`

## Commandes utiles

### PostgreSQL

```bash
# Se connecter à la base
psql -U postgres -d location_voitures

# Lister les tables
\dt

# Voir les utilisateurs
SELECT * FROM utilisateurs;

# Voir les véhicules
SELECT * FROM vehicules;

# Quitter
\q
```

### Backend

```bash
# Démarrage normal
npm start

# Démarrage avec rechargement automatique
npm run dev
```

### Frontend

```bash
# Démarrage
npm start

# Build pour production
npm run build
```

## Utilisation de l'application

### 1. Ajouter un véhicule (Admin uniquement)

1. Connectez-vous en tant qu'admin
2. Allez dans "Véhicules"
3. Cliquez sur "Ajouter un véhicule"
4. Remplissez le formulaire
5. Cliquez sur "Ajouter"

### 2. Ajouter un client

1. Allez dans "Clients"
2. Cliquez sur "Ajouter un client"
3. Remplissez les informations obligatoires
4. Cliquez sur "Ajouter"

### 3. Créer une location

1. Allez dans "Locations"
2. Cliquez sur "Nouvelle location"
3. Sélectionnez un client
4. Sélectionnez un véhicule disponible
5. Choisissez les dates
6. Le prix est calculé automatiquement
7. Choisissez le mode de paiement
8. Cliquez sur "Créer la location"

### 4. Terminer une location

1. Allez dans "Locations"
2. Pour une location en cours, cliquez sur "Terminer"
3. Saisissez le kilométrage final
4. Ajoutez des observations si besoin
5. Cliquez sur "Terminer la location"

### 5. Gérer les utilisateurs (Admin uniquement)

1. Connectez-vous en tant qu'admin
2. Allez dans "Utilisateurs"
3. Cliquez sur "Ajouter un utilisateur"
4. Remplissez le formulaire
5. Choisissez le rôle (Admin ou Employé)
6. Cliquez sur "Créer"

## Données de test

L'application est livrée avec :
- 2 utilisateurs (admin et employé)
- 5 véhicules
- 3 clients

Vous pouvez commencer à créer des locations immédiatement !

## Prochaines étapes

1. Modifiez le mot de passe de l'administrateur
2. Créez vos propres employés
3. Ajoutez vos véhicules
4. Enregistrez vos clients
5. Commencez à gérer vos locations

## Support

Pour toute aide supplémentaire, consultez le fichier README.md pour plus de détails techniques.
