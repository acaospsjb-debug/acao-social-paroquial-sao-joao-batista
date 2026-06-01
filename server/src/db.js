const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const projectRoot = path.resolve(__dirname, '..', '..');
const databaseFile = process.env.DATABASE_PATH || './database/site.db';
const dbPath = path.isAbsolute(databaseFile)
  ? databaseFile
  : path.resolve(projectRoot, databaseFile);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row)));
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
  });
}

module.exports = { db, dbPath, run, get, all };
