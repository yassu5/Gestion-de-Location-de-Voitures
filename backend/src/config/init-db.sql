-- Script d'initialisation de la base de données

-- Suppression des tables existantes
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS vehicules CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Table des utilisateurs (employés et admin)
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employe')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules
CREATE TABLE vehicules (
  id SERIAL PRIMARY KEY,
  marque VARCHAR(100) NOT NULL,
  modele VARCHAR(100) NOT NULL,
  immatriculation VARCHAR(20) UNIQUE NOT NULL,
  kilometrage INTEGER DEFAULT 0,
  statut VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'loue', 'maintenance')),
  prix_journalier DECIMAL(10, 2) NOT NULL,
  annee INTEGER,
  couleur VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  num_piece_identite VARCHAR(50) NOT NULL,
  num_permis VARCHAR(50) NOT NULL,
  adresse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des locations
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  vehicule_id INTEGER NOT NULL REFERENCES vehicules(id),
  client_id INTEGER NOT NULL REFERENCES clients(id),
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  prix_total DECIMAL(10, 2) NOT NULL,
  caution DECIMAL(10, 2) NOT NULL,
  mode_paiement VARCHAR(20) NOT NULL CHECK (mode_paiement IN ('especes', 'virement', 'carte')),
  statut VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'terminee', 'annulee')),
  kilometrage_debut INTEGER,
  kilometrage_fin INTEGER,
  observations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES ('Admin', 'Système', 'admin@location.com', '$2a$10$K9M8qF.oE.JzGqQWqF5YOeX5MZJ4cGBYQJvKvGZJ4cGBYQJvKvGZJ', 'admin');

-- Insertion d'un employé par défaut (mot de passe: employe123)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES ('Dupont', 'Jean', 'employe@location.com', '$2a$10$L8N9rG.pF.KaHrRXrG6ZPfY6NAK5dHCZRKwLwHAK5dHCZRKwLwHAK', 'employe');

-- Insertion de quelques véhicules de test
INSERT INTO vehicules (marque, modele, immatriculation, kilometrage, statut, prix_journalier, annee, couleur)
VALUES
  ('Renault', 'Clio', 'AB-123-CD', 45000, 'disponible', 350.00, 2020, 'Blanc'),
  ('Peugeot', '208', 'EF-456-GH', 32000, 'disponible', 380.00, 2021, 'Noir'),
  ('Citroën', 'C3', 'IJ-789-KL', 28000, 'disponible', 360.00, 2022, 'Rouge'),
  ('Dacia', 'Sandero', 'MN-012-OP', 55000, 'disponible', 300.00, 2019, 'Gris'),
  ('Volkswagen', 'Golf', 'QR-345-ST', 40000, 'maintenance', 450.00, 2021, 'Bleu');

-- Insertion de quelques clients de test
INSERT INTO clients (nom, prenom, telephone, email, num_piece_identite, num_permis, adresse)
VALUES
  ('Martin', 'Sophie', '0612345678', 'sophie.martin@email.com', 'CI123456', 'P987654321', '12 Rue de la Paix, Paris'),
  ('Bernard', 'Pierre', '0623456789', 'pierre.bernard@email.com', 'CI234567', 'P876543210', '45 Avenue Victor Hugo, Lyon'),
  ('Dubois', 'Marie', '0634567890', 'marie.dubois@email.com', 'CI345678', 'P765432109', '8 Boulevard Saint-Michel, Marseille');
