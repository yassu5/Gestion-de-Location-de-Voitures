import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAdmin } from '../utils/authUtils';
import './Layout.css';

const Layout = ({ children, setAuth }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>Location Voitures</h2>
          </div>

          <ul className="navbar-menu">
            <li>
              <Link to="/">Tableau de bord</Link>
            </li>
            <li>
              <Link to="/vehicules">Véhicules</Link>
            </li>
            <li>
              <Link to="/clients">Clients</Link>
            </li>
            <li>
              <Link to="/locations">Locations</Link>
            </li>
            {isAdmin() && (
              <li>
                <Link to="/utilisateurs">Utilisateurs</Link>
              </li>
            )}
          </ul>

          <div className="navbar-user">
            <span className="user-name">
              {user?.prenom} {user?.nom}
            </span>
            <span className="user-role badge badge-info">{user?.role}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
