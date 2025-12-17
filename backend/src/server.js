const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const vehiculeRoutes = require('./routes/vehicules');
const clientRoutes = require('./routes/clients');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/locations', locationRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ message: 'API de location de voitures opérationnelle' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
