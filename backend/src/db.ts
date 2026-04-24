import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bazani loyihaning ildizidagi 'data' papkasiga joylashtiramiz
const dbPath = path.resolve(__dirname, '../../data/kindergarden.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run("PRAGMA foreign_keys = ON");
    initDb();
  }
});

function addColumnIfNotExists(tableName: string, columnName: string, columnType: string) {
  db.get(`PRAGMA table_info(${tableName})`, (err, info) => {
    // This only gets the first column, we need to check all
    db.all(`PRAGMA table_info(${tableName})`, (err, columns: any[]) => {
      if (err) return;
      const exists = columns.some(col => col.name === columnName);
      if (!exists) {
        db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
      }
    });
  });
}

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teacher_name TEXT,
        capacity INTEGER,
        age_limit TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS parents (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        workplace TEXT,
        phone TEXT NOT NULL,
        passport_no TEXT,
        role TEXT NOT NULL
      )
    `);
    addColumnIfNotExists('parents', 'passport_no', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS parent_accounts (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        age_category TEXT NOT NULL,
        gender TEXT NOT NULL,
        address TEXT,
        weight REAL,
        height REAL,
        allergies TEXT,
        passport_info TEXT,
        birth_certificate_number TEXT NOT NULL,
        medical_notes TEXT,
        status TEXT DEFAULT 'DRAFT',
        father_id TEXT,
        mother_id TEXT,
        parent_account_id TEXT,
        group_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (father_id) REFERENCES parents(id),
        FOREIGN KEY (mother_id) REFERENCES parents(id),
        FOREIGN KEY (parent_account_id) REFERENCES parent_accounts(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);
    addColumnIfNotExists('children', 'address', 'TEXT');
    addColumnIfNotExists('children', 'weight', 'REAL');
    addColumnIfNotExists('children', 'height', 'REAL');
    addColumnIfNotExists('children', 'allergies', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        meal_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        iron REAL,
        carbohydrates REAL,
        vitamins TEXT,
        calories REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'SENT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        receipt_url TEXT,
        status TEXT DEFAULT 'PAID',
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        reason TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        file_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS authorized_pickups (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        relation TEXT NOT NULL,
        phone TEXT NOT NULL,
        photo_url TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS progress_reports (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        subject TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS vaccinations (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        vaccine_name TEXT NOT NULL,
        planned_date TEXT NOT NULL,
        taken_date TEXT,
        status TEXT DEFAULT 'PLANNED',
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        position TEXT,
        phone TEXT,
        email TEXT,
        passport_no TEXT,
        group_id TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        full_name TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS operations_log (
        id TEXT PRIMARY KEY,
        operation_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_name TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}
