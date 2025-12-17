const pool = require('../config/database');

// Récupérer tous les véhicules
const getAllVehicules = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vehicules ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des véhicules' });
  }
};

// Récupérer un véhicule par ID
const getVehiculeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicules WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du véhicule' });
  }
};

// Créer un nouveau véhicule
const createVehicule = async (req, res) => {
  try {
    const { marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur } = req.body;

    const result = await pool.query(
      `INSERT INTO vehicules (marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [marque, modele, immatriculation, kilometrage || 0, statut || 'disponible', prix_journalier, annee, couleur]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cette immatriculation existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du véhicule' });
  }
};

// Mettre à jour un véhicule
const updateVehicule = async (req, res) => {
  try {
    const { id } = req.params;
    const { marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur } = req.body;

    const result = await pool.query(
      `UPDATE vehicules
       SET marque = $1, modele = $2, immatriculation = $3, kilometrage = $4,
           statut = $5, prix_journalier = $6, annee = $7, couleur = $8
       WHERE id = $9 RETURNING *`,
      [marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cette immatriculation existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du véhicule' });
  }
};

// Supprimer un véhicule
const deleteVehicule = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM vehicules WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    res.json({ message: 'Véhicule supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du véhicule' });
  }
};

module.exports = {
  getAllVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule,
};
