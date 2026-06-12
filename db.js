const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

const db = new sqlite3.Database(path.join(DB_DIR, 'reviews.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      app_id TEXT,
      author_name TEXT,
      author_uri TEXT,
      version TEXT,
      rating INTEGER,
      title TEXT,
      content TEXT,
      updated_at TEXT
    )`);
  }
});

module.exports = db;
