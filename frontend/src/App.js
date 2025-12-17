import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicules from './pages/Vehicules';
import Clients from './pages/Clients';
import Locations from './pages/Locations';
import Utilisateurs from './pages/Utilisateurs';
import Layout from './components/Layout';
import { isAuthenticated } from './utils/authUtils';

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  const PrivateRoute = ({ children }) => {
    return auth ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout setAuth={setAuth}>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/vehicules"
          element={
            <PrivateRoute>
              <Layout setAuth={setAuth}>
                <Vehicules />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <Layout setAuth={setAuth}>
                <Clients />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <PrivateRoute>
              <Layout setAuth={setAuth}>
                <Locations />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/utilisateurs"
          element={
            <PrivateRoute>
              <Layout setAuth={setAuth}>
                <Utilisateurs />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
