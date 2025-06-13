import Database from 'better-sqlite3';

// Connect to SQLite database (creates if doesn't exist)
const db = new Database('symptoms.db');

// Create symptoms table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS symptoms (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    intensity INTEGER NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  )
`);

export const getSymptoms = () => {
  return db.prepare('SELECT * FROM symptoms ORDER BY date DESC').all();
};

export const addSymptom = (symptom) => {
  const { id, category, intensity, description, date } = symptom;
  db.prepare(`
    INSERT INTO symptoms (id, category, intensity, description, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, category, intensity, description, date);
};

export const deleteSymptom = (id) => {
  db.prepare('DELETE FROM symptoms WHERE id = ?').run(id);
};

export default db;
