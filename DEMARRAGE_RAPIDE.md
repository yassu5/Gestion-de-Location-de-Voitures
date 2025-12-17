# Démarrage Rapide - 3 Étapes

## ✅ Votre base de données est déjà configurée !

Les tables et les données de test ont été créées. Vous pouvez maintenant démarrer l'application.

## Étape 1 : Démarrer le Backend

Ouvrez un terminal et exécutez :

```bash
cd backend
npm start
```

Vous devriez voir :
```
Connecté à la base de données PostgreSQL
Serveur démarré sur le port 5001
```

**⚠️ Laissez ce terminal ouvert !**

## Étape 2 : Démarrer le Frontend

Ouvrez un **NOUVEAU** terminal et exécutez :

```bash
cd frontend
npm start
```

L'application s'ouvrira automatiquement dans votre navigateur à :
```
http://localhost:3000
```

## Étape 3 : Se connecter

Utilisez un des comptes de test :

### Compte Administrateur
- **Email** : `admin@location.com`
- **Mot de passe** : `admin123`

### Compte Employé
- **Email** : `employe@location.com`
- **Mot de passe** : `employe123`

---

## ✨ C'est tout !

Vous pouvez maintenant :
- Consulter le tableau de bord
- Gérer les véhicules (admin uniquement)
- Gérer les clients
- Créer des locations
- Gérer les utilisateurs (admin uniquement)

## 📊 Données de test disponibles

- ✅ 2 utilisateurs (admin + employé)
- ✅ 5 véhicules
- ✅ 3 clients

Commencez dès maintenant à créer vos premières locations !

---

## 🔄 Pour redémarrer l'application

Si vous fermez les terminaux, redémarrez simplement :

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

## ❓ Problème ?

Si vous ne pouvez pas vous connecter :

1. Vérifiez que le backend est démarré (terminal 1)
2. Vérifiez que le frontend est démarré (terminal 2)
3. Utilisez exactement les identifiants ci-dessus
4. Vérifiez que vous êtes sur http://localhost:3000

Pour plus d'aide, consultez **INSTALLATION.md**
