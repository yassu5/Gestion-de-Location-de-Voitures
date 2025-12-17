import React, { useState, useEffect } from 'react';
import { locationAPI, vehiculeAPI, clientAPI } from '../services/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTerminerModal, setShowTerminerModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    vehicule_id: '',
    client_id: '',
    date_debut: '',
    date_fin: '',
    prix_total: '',
    caution: '',
    mode_paiement: 'especes',
    kilometrage_debut: '',
    observations: '',
  });
  const [terminerData, setTerminerData] = useState({
    kilometrage_fin: '',
    observations: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [locationsRes, vehiculesRes, clientsRes] = await Promise.all([
        locationAPI.getAll(),
        vehiculeAPI.getAll(),
        clientAPI.getAll(),
      ]);
      setLocations(locationsRes.data);
      setVehicules(vehiculesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Calculer automatiquement le prix total
    if (name === 'vehicule_id' || name === 'date_debut' || name === 'date_fin') {
      calculatePrix(name === 'vehicule_id' ? value : formData.vehicule_id, name === 'date_debut' ? value : formData.date_debut, name === 'date_fin' ? value : formData.date_fin);
    }
  };

  const calculatePrix = (vehiculeId, dateDebut, dateFin) => {
    if (vehiculeId && dateDebut && dateFin) {
      const vehicule = vehicules.find((v) => v.id === parseInt(vehiculeId));
      if (vehicule) {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        const jours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
        if (jours > 0) {
          const prixTotal = jours * parseFloat(vehicule.prix_journalier);
          setFormData((prev) => ({
            ...prev,
            prix_total: prixTotal.toFixed(2),
            caution: (prixTotal * 0.3).toFixed(2), // 30% de caution
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await locationAPI.create(formData);
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la location');
    }
  };

  const handleTerminer = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await locationAPI.terminer(selectedLocation.id, terminerData);
      loadData();
      closeTerminerModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la clôture de la location');
    }
  };

  const handleAnnuler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette location ?')) {
      try {
        await locationAPI.annuler(id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
      }
    }
  };

  const openModal = () => {
    setFormData({
      vehicule_id: '',
      client_id: '',
      date_debut: '',
      date_fin: '',
      prix_total: '',
      caution: '',
      mode_paiement: 'especes',
      kilometrage_debut: '',
      observations: '',
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const openTerminerModal = (location) => {
    setSelectedLocation(location);
    setTerminerData({
      kilometrage_fin: '',
      observations: '',
    });
    setError('');
    setShowTerminerModal(true);
  };

  const closeTerminerModal = () => {
    setShowTerminerModal(false);
    setSelectedLocation(null);
    setError('');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const vehiculesDisponibles = vehicules.filter((v) => v.statut === 'disponible');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Gestion des locations</h1>
        <button onClick={openModal} className="btn btn-primary">
          Nouvelle location
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Véhicule</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Prix total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td>
                  {location.client_nom} {location.client_prenom}
                </td>
                <td>
                  {location.marque} {location.modele} ({location.immatriculation})
                </td>
                <td>{new Date(location.date_debut).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(location.date_fin).toLocaleDateString('fr-FR')}</td>
                <td>{parseFloat(location.prix_total).toFixed(2)} DH</td>
                <td>
                  <span
                    className={`badge ${
                      location.statut === 'en_cours'
                        ? 'badge-info'
                        : location.statut === 'terminee'
                        ? 'badge-success'
                        : 'badge-danger'
                    }`}
                  >
                    {location.statut}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {location.statut === 'en_cours' && (
                      <>
                        <button onClick={() => openTerminerModal(location)} className="btn btn-success btn-sm">
                          Terminer
                        </button>
                        <button onClick={() => handleAnnuler(location.id)} className="btn btn-danger btn-sm">
                          Annuler
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouvelle location</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client</label>
                <select name="client_id" value={formData.client_id} onChange={handleChange} required>
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.prenom} - {client.telephone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Véhicule</label>
                <select name="vehicule_id" value={formData.vehicule_id} onChange={handleChange} required>
                  <option value="">Sélectionner un véhicule</option>
                  {vehiculesDisponibles.map((vehicule) => (
                    <option key={vehicule.id} value={vehicule.id}>
                      {vehicule.marque} {vehicule.modele} ({vehicule.immatriculation}) - {vehicule.prix_journalier}{' '}
                      DH/jour
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date de début</label>
                <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Date de fin</label>
                <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Prix total (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  name="prix_total"
                  value={formData.prix_total}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Caution (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  name="caution"
                  value={formData.caution}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mode de paiement</label>
                <select name="mode_paiement" value={formData.mode_paiement} onChange={handleChange} required>
                  <option value="especes">Espèces</option>
                  <option value="virement">Virement</option>
                  <option value="carte">Carte bancaire</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kilométrage de début</label>
                <input
                  type="number"
                  name="kilometrage_debut"
                  value={formData.kilometrage_debut}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Observations</label>
                <textarea name="observations" value={formData.observations} onChange={handleChange} rows="3"></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer la location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTerminerModal && selectedLocation && (
        <div className="modal-overlay" onClick={closeTerminerModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Terminer la location</h2>
              <button className="modal-close" onClick={closeTerminerModal}>
                ×
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleTerminer}>
              <div className="form-group">
                <label>Kilométrage de fin</label>
                <input
                  type="number"
                  name="kilometrage_fin"
                  value={terminerData.kilometrage_fin}
                  onChange={(e) => setTerminerData({ ...terminerData, kilometrage_fin: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Observations finales</label>
                <textarea
                  name="observations"
                  value={terminerData.observations}
                  onChange={(e) => setTerminerData({ ...terminerData, observations: e.target.value })}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeTerminerModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-success">
                  Terminer la location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
