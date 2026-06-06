const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({limit:'10mb'}));
app.use(express.static('public'));

const DB_FILE = path.join(__dirname, '.data', 'db.json');

// Ensure .data directory and db file exist
if (!fs.existsSync(path.join(__dirname, '.data'))) {
  fs.mkdirSync(path.join(__dirname, '.data'));
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ meetings:[], actions:[], evaluations:[], moms:[] }));
}

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE,'utf8')); }
  catch(e) { return { meetings:[], actions:[], evaluations:[], moms:[] }; }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET all data
app.get('/api/data', (req, res) => {
  res.json(readDB());
});

// SAVE all data (full sync)
app.post('/api/data', (req, res) => {
  try {
    writeDB(req.body);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check / wake-up ping
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WICI HCMS running on port ${PORT}`));
