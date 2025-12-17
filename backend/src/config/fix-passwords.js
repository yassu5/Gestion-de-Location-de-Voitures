const bcrypt = require('bcryptjs');
const pool = require('./database');

async function fixPasswords() {
  try {
    console.log('Mise à jour des mots de passe...');

    // Hash pour admin123
    const adminHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      "UPDATE utilisateurs SET mot_de_passe = $1 WHERE email = 'admin@location.com'",
      [adminHash]
    );
    console.log('✓ Mot de passe admin mis à jour');

    // Hash pour employe123
    const employeHash = await bcrypt.hash('employe123', 10);
    await pool.query(
      "UPDATE utilisateurs SET mot_de_passe = $1 WHERE email = 'employe@location.com'",
      [employeHash]
    );
    console.log('✓ Mot de passe employé mis à jour');

    console.log('\nMots de passe mis à jour avec succès !');
    console.log('Vous pouvez maintenant vous connecter avec :');
    console.log('- Admin: admin@location.com / admin123');
    console.log('- Employé: employe@location.com / employe123');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

fixPasswords();
