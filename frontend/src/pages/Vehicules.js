import React, { useState, useEffect } from 'react';
import { vehiculeAPI } from '../services/api';
import { isAdmin } from '../utils/authUtils';

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicule, setEditingVehicule] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    kilometrage: 0,
    statut: 'disponible',
    prix_journalier: '',
    annee: '',
    couleur: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicules();
  }, []);

  const loadVehicules = async () => {
    try {
      setLoading(true);
      const response = await vehiculeAPI.getAll();
      setVehicules(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingVehicule) {
        await vehiculeAPI.update(editingVehicule.id, formData);
      } else {
        await vehiculeAPI.create(formData);
      }
      loadVehicules();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (vehicule) => {
    setEditingVehicule(vehicule);
    setFormData(vehicule);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await vehiculeAPI.delete(id);
        loadVehicules();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const openModal = () => {
    setEditingVehicule(null);
    setFormData({
      marque: '',
      modele: '',
      immatriculation: '',
      kilometrage: 0,
      statut: 'disponible',
      prix_journalier: '',
      annee: '',
      couleur: '',
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicule(null);
    setError('');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Gestion des véhicules</h1>
        {isAdmin() && (
          <button onClick={openModal} className="btn btn-primary">
            Ajouter un véhicule
          </button>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Véhicule</th>
              <th>Immatriculation</th>
              <th>Année</th>
              <th>Couleur</th>
              <th>Kilométrage</th>
              <th>Statut</th>
              <th>Prix/jour</th>
              {isAdmin() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {vehicules.map((vehicule) => (
              <tr key={vehicule.id}>
                <td>
                  {vehicule.marque} {vehicule.modele}
                </td>
                <td>{vehicule.immatriculation}</td>
                <td>{vehicule.annee}</td>
                <td>{vehicule.couleur}</td>
                <td>{vehicule.kilometrage} km</td>
                <td>
                  <span
                    className={`badge ${
                      vehicule.statut === 'disponible'
                        ? 'badge-success'
                        : vehicule.statut === 'loue'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                  >
                    {vehicule.statut}
                  </span>
                </td>
                <td>{parseFloat(vehicule.prix_journalier).toFixed(2)} DH</td>
                {isAdmin() && (
                  <td>
                    <div className="actions">
                      <button onClick={() => handleEdit(vehicule)} className="btn btn-primary btn-sm">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(vehicule.id)} className="btn btn-danger btn-sm">
                        Supprimer
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingVehicule ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Marque</label>
                <input type="text" name="marque" value={formData.marque} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Modèle</label>
                <input type="text" name="modele" value={formData.modele} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Immatriculation</label>
                <input
                  type="text"
                  name="immatriculation"
                  value={formData.immatriculation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Année</label>
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Couleur</label>
                <input type="text" name="couleur" value={formData.couleur} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Kilométrage</label>
                <input type="number" name="kilometrage" value={formData.kilometrage} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange} required>
                  <option value="disponible">Disponible</option>
                  <option value="loue">Loué</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prix journalier (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  name="prix_journalier"
                  value={formData.prix_journalier}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVehicule ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicules;
