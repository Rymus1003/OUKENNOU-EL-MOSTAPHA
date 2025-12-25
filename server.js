
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// الاتصال بقاعدة البيانات مع معالجة فشل الاتصال
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'avocat_db'
});

db.connect((err) => {
  if (err) {
    console.error('CRITICAL: Could not connect to MySQL. Database features will fail:', err.message);
  } else {
    console.log('SUCCESS: Connected to MySQL (avocat_db)');
  }
});

// Helper for DB Queries to avoid repetitive try-catch
const query = (sql, params, res) => {
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('DB Query Error:', err.message);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
};

// --- API Routes ---

app.get('/api/clients', (req, res) => {
  query('SELECT * FROM clients ORDER BY nom_complet ASC', [], res);
});

app.post('/api/clients', (req, res) => {
  const { nom_complet, cin, telephone, email, adresse } = req.body;
  const sql = 'INSERT INTO clients (nom_complet, cin, telephone, email, adresse) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nom_complet, cin, telephone, email, adresse], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Client saved successfully' });
  });
});

app.get('/api/dossiers', (req, res) => {
  // استخدام الـ View التي صممناها أو Query مباشرة لضمان اسم الموكل
  const sql = `
    SELECT d.*, c.nom_complet as client_name 
    FROM dossiers d 
    LEFT JOIN clients c ON d.client_id = c.id 
    ORDER BY d.date_ouverture DESC
  `;
  query(sql, [], res);
});

app.post('/api/dossiers', (req, res) => {
  const { numero_mahakim, titre_affaire, type_affaire, statut, tribunal, client_id, juge, date_ouverture } = req.body;
  const sql = 'INSERT INTO dossiers (numero_mahakim, titre_affaire, type_affaire, statut, tribunal, client_id, juge, date_ouverture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [numero_mahakim, titre_affaire, type_affaire, statut || 'En cours', tribunal, client_id, juge, date_ouverture], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Dossier opened successfully' });
  });
});

// تحديث حالة الملف (مثلاً للأرشفة)
app.patch('/api/dossiers/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE dossiers SET statut = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Status updated' });
  });
});

app.get('/api/audiences', (req, res) => {
  const sql = 'SELECT a.*, d.numero_mahakim, d.titre_affaire FROM audiences a JOIN dossiers d ON a.dossier_id = d.id ORDER BY a.date_audience DESC';
  query(sql, [], res);
});

app.post('/api/audiences', (req, res) => {
  const { dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience } = req.body;
  const sql = 'INSERT INTO audiences (dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [dossier_id, date_audience, salle, juge_audience, decision_intermediaire, notes_audience], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Audience scheduled' });
  });
});

app.post('/api/honoraires', (req, res) => {
  const { dossier_id, montant_total, avance } = req.body;
  const sql = 'INSERT INTO honoraires (dossier_id, montant_total, avance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE montant_total = ?, avance = ?';
  db.query(sql, [dossier_id, montant_total, avance, montant_total, avance], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
