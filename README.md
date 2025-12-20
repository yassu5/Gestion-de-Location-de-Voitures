# Gestion de Location de Voitures

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/yassu5/Gestion-de-Location-de-Voitures.git
cd Gestion-de-Location-de-Voitures
```

### 2. Configurer la base de données
Créer une base de données PostgreSQL nommée `location_voitures`, puis exécuter le script `backend/src/config/init-db.sql`

### 3. Configurer le backend
```bash
cd backend
npm install
cp .env.example .env
node fix-passwords.js
```

### 4. Configurer le frontend
```bash
cd ../frontend
npm install
```

## Démarrage

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

## Accès

- Application : http://localhost:3000
- API : http://localhost:5000

**Comptes de test :**
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@location.com | admin123 |
| Employé | employe@location.com | employe123 |
