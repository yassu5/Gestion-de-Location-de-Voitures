const pool = require('../config/database');

// Récupérer toutes les locations
const getAllLocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*,
              v.marque, v.modele, v.immatriculation,
              c.nom as client_nom, c.prenom as client_prenom,
              u.nom as employe_nom, u.prenom as employe_prenom
       FROM locations l
       JOIN vehicules v ON l.vehicule_id = v.id
       JOIN clients c ON l.client_id = c.id
       JOIN utilisateurs u ON l.utilisateur_id = u.id
       ORDER BY l.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des locations' });
  }
};

// Récupérer une location par ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*,
              v.marque, v.modele, v.immatriculation,
              c.nom as client_nom, c.prenom as client_prenom, c.telephone,
              u.nom as employe_nom, u.prenom as employe_prenom
       FROM locations l
       JOIN vehicules v ON l.vehicule_id = v.id
       JOIN clients c ON l.client_id = c.id
       JOIN utilisateurs u ON l.utilisateur_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la location' });
  }
};

// Récupérer les statistiques pour le tableau de bord
const getDashboardStats = async (req, res) => {
  try {
    const vehiculesStats = await pool.query(
      `SELECT statut, COUNT(*) as count
       FROM vehicules
       GROUP BY statut`
    );

    const locationsEnCours = await pool.query(
      `SELECT COUNT(*) as count
       FROM locations
       WHERE statut = 'en_cours'`
    );

    const revenuMois = await pool.query(
      `SELECT COALESCE(SUM(prix_total), 0) as total
       FROM locations
       WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
       AND statut != 'annulee'`
    );

    res.json({
      vehicules: vehiculesStats.rows,
      locations_en_cours: locationsEnCours.rows[0].count,
      revenu_mois: revenuMois.rows[0].total,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

// Créer une nouvelle location
const createLocation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      vehicule_id,
      client_id,
      date_debut,
      date_fin,
      prix_total,
      caution,
      mode_paiement,
      kilometrage_debut,
      observations,
    } = req.body;

    const utilisateur_id = req.user.id;

    // Vérifier que le véhicule est disponible
    const vehiculeCheck = await client.query(
      'SELECT statut FROM vehicules WHERE id = $1',
      [vehicule_id]
    );

    if (vehiculeCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    if (vehiculeCheck.rows[0].statut !== 'disponible') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Ce véhicule n\'est pas disponible' });
    }

    // Créer la location
    const result = await client.query(
      `INSERT INTO locations
       (vehicule_id, client_id, utilisateur_id, date_debut, date_fin, prix_total,
        caution, mode_paiement, kilometrage_debut, observations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        vehicule_id,
        client_id,
        utilisateur_id,
        date_debut,
        date_fin,
        prix_total,
        caution,
        mode_paiement,
        kilometrage_debut,
        observations,
      ]
    );

    // Mettre à jour le statut du véhicule
    await client.query(
      'UPDATE vehicules SET statut = $1 WHERE id = $2',
      ['loue', vehicule_id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la location' });
  } finally {
    client.release();
  }
};

// Terminer une location
const terminerLocation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { kilometrage_fin, observations } = req.body;

    // Récupérer la location
    const locationResult = await client.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (locationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    const location = locationResult.rows[0];

    // Mettre à jour la location
    const result = await client.query(
      `UPDATE locations
       SET statut = 'terminee', kilometrage_fin = $1, observations = $2
       WHERE id = $3 RETURNING *`,
      [kilometrage_fin, observations, id]
    );

    // Mettre à jour le véhicule
    await client.query(
      'UPDATE vehicules SET statut = $1, kilometrage = $2 WHERE id = $3',
      ['disponible', kilometrage_fin, location.vehicule_id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la clôture de la location' });
  } finally {
    client.release();
  }
};

// Annuler une location
const annulerLocation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Récupérer la location
    const locationResult = await client.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (locationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    const location = locationResult.rows[0];

    // Mettre à jour la location
    const result = await client.query(
      `UPDATE locations SET statut = 'annulee' WHERE id = $1 RETURNING *`,
      [id]
    );

    // Remettre le véhicule en disponible
    await client.query(
      'UPDATE vehicules SET statut = $1 WHERE id = $2',
      ['disponible', location.vehicule_id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la location' });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  getDashboardStats,
  createLocation,
  terminerLocation,
  annulerLocation,
};
