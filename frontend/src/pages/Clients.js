import React, { useState, useEffect } from 'react';
import { clientAPI } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    num_piece_identite: '',
    num_permis: '',
    adresse: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      setClients(response.data);
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
      if (editingClient) {
        await clientAPI.update(editingClient.id, formData);
      } else {
        await clientAPI.create(formData);
      }
      loadClients();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientAPI.delete(id);
        loadClients();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const openModal = () => {
    setEditingClient(null);
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      num_piece_identite: '',
      num_permis: '',
      adresse: '',
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setError('');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Gestion des clients</h1>
        <button onClick={openModal} className="btn btn-primary">
          Ajouter un client
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>N° Pièce d'identité</th>
              <th>N° Permis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  {client.nom} {client.prenom}
                </td>
                <td>{client.telephone}</td>
                <td>{client.email || '-'}</td>
                <td>{client.num_piece_identite}</td>
                <td>{client.num_permis}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleEdit(client)} className="btn btn-primary btn-sm">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="btn btn-danger btn-sm">
                      Supprimer
                    </button>
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
              <h2 className="modal-title">{editingClient ? 'Modifier le client' : 'Ajouter un client'}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>N° Pièce d'identité</label>
                <input
                  type="text"
                  name="num_piece_identite"
                  value={formData.num_piece_identite}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>N° Permis de conduire</label>
                <input type="text" name="num_permis" value={formData.num_permis} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Adresse</label>
                <textarea name="adresse" value={formData.adresse} onChange={handleChange} rows="3"></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
