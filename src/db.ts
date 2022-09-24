const sqlite3 = require('sqlite3').verbose();

export default function createDb(dbPath: string) {
    const db = new sqlite3.Database(dbPath);
    return db;
}