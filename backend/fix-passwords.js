// Script pour corriger les mots de passe des utilisateurs
// Exécuter avec: node fix-passwords.js

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixPasswords() {
  try {
    console.log('Connexion à la base de données...');
    
    // Générer les vrais hash bcrypt
    const adminHash = await bcrypt.hash('admin123', 10);
    const employeHash = await bcrypt.hash('employe123', 10);
    
    console.log('Hash admin généré:', adminHash);
    console.log('Hash employé généré:', employeHash);
    
    // Mettre à jour le mot de passe admin
    await pool.query(
      'UPDATE utilisateurs SET mot_de_passe = $1 WHERE email = $2',
      [adminHash, 'admin@location.com']
    );
    console.log('✓ Mot de passe admin mis à jour');
    
    // Mettre à jour le mot de passe employé
    await pool.query(
      'UPDATE utilisateurs SET mot_de_passe = $1 WHERE email = $2',
      [employeHash, 'employe@location.com']
    );
    console.log('✓ Mot de passe employé mis à jour');
    
    console.log('\n✅ Terminé ! Vous pouvez maintenant vous connecter avec:');
    console.log('   Admin: admin@location.com / admin123');
    console.log('   Employé: employe@location.com / employe123');
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

fixPasswords();
