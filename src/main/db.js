const sqlite3 = require('sqlite3').verbose();

export default function createDb (dbPath) {
    const db = new sqlite3.Database(dbPath);
    const sql = "CREATE TABLE if not exists user(account text, password text)";
    db.exec(sql);
    return db;
}