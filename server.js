
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'avocat_db'
});

db.connect((err) => {
  if (err) console.error('CRITICAL: DB Connection Failed:', err.message);
  else console.log('SUCCESS: Connected to MySQL (avocat_db)');
});

// --- API ---

app.get('/api/stats', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM dossiers WHERE statut = 'En cours') as active_cases,
      (SELECT COUNT(*) FROM audiences WHERE DATE(date_audience) = CURDATE()) as today_hearings,
      (SELECT COUNT(*) FROM clients) as total_clients,
      (SELECT IFNULL(SUM(reste), 0) FROM honoraires) as total_pending_fees,
      (SELECT IFNULL(SUM(avance), 0) FROM honoraires) as total_collected_fees,
      (SELECT COUNT(*) FROM tasks WHERE status = 'pending') as pending_tasks
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Clients
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients ORDER BY nom_complet ASC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/clients', (req, res) => {
  const { nom_complet, cin, telephone, email, adresse } = req.body;
  db.query('INSERT INTO clients (nom_complet, cin, telephone, email, adresse) VALUES (?, ?, ?, ?, ?)', 
    [nom_complet, cin, telephone, email, adresse], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    });
});

app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Dossiers
app.get('/api/dossiers', (req, res) => {
  db.query('SELECT * FROM vue_dossiers_complets ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/dossiers', (req, res) => {
  const { numero_mahakim, titre_affaire, partie_adverse, type_affaire, statut, tribunal, client_id, juge, date_ouverture } = req.body;
  const sql = 'INSERT INTO dossiers (numero_mahakim, titre_affaire, partie_adverse, type_affaire, statut, tribunal, client_id, juge, date_ouverture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [numero_mahakim, titre_affaire, partie_adverse, type_affaire, statut, tribunal, client_id, juge, date_ouverture], (err, result) => {
    if (err) return res.status(500).json(err);
    // تهيئة جدول الأتعاب لهذا الملف فوراً
    db.query('INSERT INTO honoraires (dossier_id, montant_total, avance) VALUES (?, 0, 0)', [result.insertId]);
    res.json({ id: result.insertId });
  });
});

app.put('/api/dossiers/:id/status', (req, res) => {
  db.query('UPDATE dossiers SET statut = ? WHERE id = ?', [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.delete('/api/dossiers/:id', (req, res) => {
  db.query('DELETE FROM dossiers WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Audiences
app.get('/api/audiences', (req, res) => {
  const sql = `
    SELECT a.*, d.numero_mahakim, d.titre_affaire, d.tribunal, c.nom_complet as client_name, c.telephone as client_phone
    FROM audiences a
    JOIN dossiers d ON a.dossier_id = d.id
    JOIN clients c ON d.client_id = c.id
    ORDER BY a.date_audience ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/audiences', (req, res) => {
  const { dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience } = req.body;
  const sql = 'INSERT INTO audiences (dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

app.delete('/api/audiences/:id', (req, res) => {
  db.query('DELETE FROM audiences WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT t.*, d.numero_mahakim FROM tasks t LEFT JOIN dossiers d ON t.dossier_id = d.id ORDER BY t.deadline ASC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { dossier_id, title, deadline, priority } = req.body;
  db.query('INSERT INTO tasks (dossier_id, title, deadline, priority, status) VALUES (?, ?, ?, ?, "pending")', 
    [dossier_id || null, title, deadline || null, priority], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    });
});

app.put('/api/tasks/:id', (req, res) => {
  db.query('UPDATE tasks SET status = ? WHERE id = ?', [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Honoraires
app.post('/api/honoraires', (req, res) => {
  const { dossier_id, montant_total, avance } = req.body;
  db.query('INSERT INTO honoraires (dossier_id, montant_total, avance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE montant_total = ?, avance = ?',
    [dossier_id, montant_total, avance, montant_total, avance], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    });
});

app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
