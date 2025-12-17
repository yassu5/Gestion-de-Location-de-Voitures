const bcrypt = require('bcryptjs');

// Génération des hash pour les mots de passe de test
const adminPassword = bcrypt.hashSync('admin123', 10);
const employePassword = bcrypt.hashSync('employe123', 10);

console.log('\nMots de passe hashés pour init-db.sql:\n');
console.log('Admin (admin123):');
console.log(adminPassword);
console.log('\nEmployé (employe123):');
console.log(employePassword);
console.log('\n');
