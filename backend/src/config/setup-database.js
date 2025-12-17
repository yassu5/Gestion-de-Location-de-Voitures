const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Connexion à PostgreSQL...');
    await client.connect();
    console.log('✓ Connecté à PostgreSQL\n');

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'init-db.sql');
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Générer les vrais hash bcrypt
    console.log('Génération des mots de passe sécurisés...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const employeHash = await bcrypt.hash('employe123', 10);

    // Remplacer les hash dans le SQL
    sql = sql.replace(
      /VALUES \('Admin', 'Système', 'admin@location\.com', '.*?', 'admin'\)/,
      `VALUES ('Admin', 'Système', 'admin@location.com', '${adminHash}', 'admin')`
    );
    sql = sql.replace(
      /VALUES \('Dupont', 'Jean', 'employe@location\.com', '.*?', 'employe'\)/,
      `VALUES ('Dupont', 'Jean', 'employe@location.com', '${employeHash}', 'employe')`
    );

    console.log('✓ Mots de passe générés\n');

    console.log('Exécution du script SQL...');
    await client.query(sql);
    console.log('✓ Base de données initialisée\n');

    // Vérifier les tables créées
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Tables créées :');
    result.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    // Vérifier les utilisateurs
    const users = await client.query('SELECT id, email, role FROM utilisateurs');
    console.log('\nUtilisateurs créés :');
    users.rows.forEach((user) => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    // Vérifier les véhicules
    const vehicules = await client.query('SELECT COUNT(*) as count FROM vehicules');
    console.log(`\n${vehicules.rows[0].count} véhicules de test créés`);

    // Vérifier les clients
    const clients = await client.query('SELECT COUNT(*) as count FROM clients');
    console.log(`${clients.rows[0].count} clients de test créés`);

    console.log('\n✓ Configuration terminée avec succès !');
    console.log('\nVous pouvez maintenant :');
    console.log('1. Démarrer le serveur backend : npm start');
    console.log('2. Vous connecter avec :');
    console.log('   - Admin: admin@location.com / admin123');
    console.log('   - Employé: employe@location.com / employe123');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\nVérifiez que PostgreSQL est démarré et que le port est correct.');
    } else if (error.code === '28P01') {
      console.error('\nMot de passe incorrect. Vérifiez votre fichier .env');
    } else if (error.code === '3D000') {
      console.error(`\nLa base de données "${process.env.DB_NAME}" n'existe pas.`);
      console.error('Créez-la avec : createdb location_voitures');
    }
  } finally {
    await client.end();
  }
}

setupDatabase();
