# Notes Importantes - Configuration Actuelle

## ✅ Configuration terminée !

Votre application est prête à fonctionner avec la configuration suivante :

### Serveur Backend
- **Port** : 5001 (modifié car le port 5000 était occupé)
- **URL API** : http://localhost:5001/api

### Base de données PostgreSQL
- **Port** : 5434
- **Base** : location_voitures
- **Utilisateur** : postgres
- **Statut** : ✅ Initialisée avec succès

### Frontend React
- **Port** : 3000 (par défaut)
- **URL** : http://localhost:3000

---

## 🔐 Comptes de connexion

### Administrateur
- **Email** : admin@location.com
- **Mot de passe** : admin123
- **Droits** : Accès complet à toutes les fonctionnalités

### Employé
- **Email** : employe@location.com
- **Mot de passe** : employe123
- **Droits** : Gestion des clients et locations (pas de gestion des véhicules ni utilisateurs)

---

## 📊 Données de test disponibles

✅ **5 Véhicules** :
- Renault Clio (AB-123-CD) - 350 DH/jour
- Peugeot 208 (EF-456-GH) - 380 DH/jour
- Citroën C3 (IJ-789-KL) - 360 DH/jour
- Dacia Sandero (MN-012-OP) - 300 DH/jour
- Volkswagen Golf (QR-345-ST) - 450 DH/jour

✅ **3 Clients** :
- Sophie Martin
- Pierre Bernard
- Marie Dubois

---

## 🚀 Démarrage

### Première fois
1. Le backend tourne déjà sur le port 5001
2. Démarrez le frontend :
   ```bash
   cd frontend
   npm start
   ```
3. Connectez-vous à http://localhost:3000

### Prochaines fois
**Terminal 1 - Backend :**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

---

## ⚠️ Points à retenir

1. **Port modifié** : Le backend utilise le port **5001** au lieu de 5000
2. **PostgreSQL** : Votre installation utilise le port **5434** (non standard)
3. **Mot de passe** : Les hash bcrypt ont été correctement générés
4. **Base initialisée** : Vous n'avez plus besoin d'exécuter le script SQL

---

## 🔧 En cas de problème

### Le backend ne démarre pas
```bash
# Vérifier si le port 5001 est libre
netstat -ano | findstr :5001

# Si occupé, changez le port dans backend/.env
PORT=5002
```

### Problème de connexion
- Vérifiez que le backend est démarré (port 5001)
- Utilisez exactement les emails et mots de passe ci-dessus
- Vérifiez que PostgreSQL est démarré

### Réinitialiser la base de données
```bash
cd backend
node src/config/setup-database.js
```

---

## 📝 Prochaines étapes

1. ✅ Backend configuré et démarré
2. ⏳ Démarrer le frontend
3. ⏳ Tester la connexion
4. ⏳ Créer votre première location

---

## 🎯 Utilisation

Une fois connecté, vous pouvez :

### En tant qu'Admin
- Gérer les véhicules (ajouter, modifier, supprimer)
- Gérer les clients
- Créer et gérer les locations
- Créer des utilisateurs
- Consulter le tableau de bord

### En tant qu'Employé
- Consulter les véhicules
- Gérer les clients
- Créer et gérer les locations
- Consulter le tableau de bord

---

## 📚 Documentation

- **README.md** - Documentation complète
- **INSTALLATION.md** - Guide d'installation détaillé
- **GUIDE_DEMARRAGE.md** - Guide d'utilisation
- **DEMARRAGE_RAPIDE.md** - Démarrage en 3 étapes
- **RESUME_PROJET.md** - Résumé du projet
- **STRUCTURE_PROJET.txt** - Architecture du projet

---

**Date de configuration** : 17 décembre 2025
**Statut** : ✅ Prêt à l'emploi
