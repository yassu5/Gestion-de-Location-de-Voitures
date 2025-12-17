import React, { useState, useEffect } from 'react';
import { locationAPI, vehiculeAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, vehiculesRes, locationsRes] = await Promise.all([
        locationAPI.getDashboardStats(),
        vehiculeAPI.getAll(),
        locationAPI.getAll(),
      ]);

      setStats(statsRes.data);
      setVehicules(vehiculesRes.data);
      setLocations(locationsRes.data.filter((loc) => loc.statut === 'en_cours'));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const vehiculesDisponibles = vehicules.filter((v) => v.statut === 'disponible').length;
  const vehiculesLoues = vehicules.filter((v) => v.statut === 'loue').length;
  const vehiculesMaintenance = vehicules.filter((v) => v.statut === 'maintenance').length;

  return (
    <div>
      <h1 className="page-title">Tableau de bord</h1>

      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <h3>Véhicules disponibles</h3>
          <p className="stat-value">{vehiculesDisponibles}</p>
        </div>

        <div className="stat-card stat-card-green">
          <h3>Véhicules loués</h3>
          <p className="stat-value">{vehiculesLoues}</p>
        </div>

        <div className="stat-card stat-card-orange">
          <h3>En maintenance</h3>
          <p className="stat-value">{vehiculesMaintenance}</p>
        </div>

        <div className="stat-card stat-card-purple">
          <h3>Revenu du mois</h3>
          <p className="stat-value">{parseFloat(stats?.revenu_mois || 0).toFixed(2)} DH</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Locations en cours</h2>
        {locations.length === 0 ? (
          <div className="card">
            <p>Aucune location en cours</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Véhicule</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Prix total</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">État du parc automobile</h2>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Immatriculation</th>
                <th>Kilométrage</th>
                <th>Statut</th>
                <th>Prix/jour</th>
              </tr>
            </thead>
            <tbody>
              {vehicules.slice(0, 10).map((vehicule) => (
                <tr key={vehicule.id}>
                  <td>
                    {vehicule.marque} {vehicule.modele}
                  </td>
                  <td>{vehicule.immatriculation}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
