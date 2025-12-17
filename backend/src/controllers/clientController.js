const pool = require('../config/database');

// Récupérer tous les clients
const getAllClients = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
  }
};

// Récupérer un client par ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du client' });
  }
};

// Récupérer l'historique des locations d'un client
const getClientHistorique = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*, v.marque, v.modele, v.immatriculation
       FROM locations l
       JOIN vehicules v ON l.vehicule_id = v.id
       WHERE l.client_id = $1
       ORDER BY l.date_debut DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

// Créer un nouveau client
const createClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, num_piece_identite, num_permis, adresse } = req.body;

    const result = await pool.query(
      `INSERT INTO clients (nom, prenom, telephone, email, num_piece_identite, num_permis, adresse)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nom, prenom, telephone, email, num_piece_identite, num_permis, adresse]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la création du client' });
  }
};

// Mettre à jour un client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, telephone, email, num_piece_identite, num_permis, adresse } = req.body;

    const result = await pool.query(
      `UPDATE clients
       SET nom = $1, prenom = $2, telephone = $3, email = $4,
           num_piece_identite = $5, num_permis = $6, adresse = $7
       WHERE id = $8 RETURNING *`,
      [nom, prenom, telephone, email, num_piece_identite, num_permis, adresse, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du client' });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du client' });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  getClientHistorique,
  createClient,
  updateClient,
  deleteClient,
};
