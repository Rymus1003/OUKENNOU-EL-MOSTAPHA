-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom_complet VARCHAR(255) NOT NULL,
  role ENUM('avocat', 'secretaire', 'assistant') DEFAULT 'assistant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom_complet VARCHAR(255) NOT NULL,
  cin VARCHAR(20) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(255),
  adresse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dossiers (Cases) table
CREATE TABLE IF NOT EXISTS dossiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_mahakim VARCHAR(100) UNIQUE NOT NULL,
  titre_affaire VARCHAR(255) NOT NULL,
  type_affaire VARCHAR(100),
  statut VARCHAR(100),
  tribunal VARCHAR(255),
  client_id INT NOT NULL,
  montant_total DECIMAL(10,2) DEFAULT 0,
  avance DECIMAL(10,2) DEFAULT 0,
  reste DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dossier_id INT NOT NULL,
  type VARCHAR(255),
  date_debut DATE,
  statut VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dossier_id) REFERENCES dossiers(id) ON DELETE CASCADE
);

-- Audiences table
CREATE TABLE IF NOT EXISTS audiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dossier_id INT NOT NULL,
  date_audience DATE NOT NULL,
  salle VARCHAR(100),
  type_audience VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dossier_id) REFERENCES dossiers(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dossier_id INT,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(100),
  deadline DATE,
  priority VARCHAR(100),
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dossier_id) REFERENCES dossiers(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
