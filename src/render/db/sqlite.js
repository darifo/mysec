
import path from "path";

export default function createDb (dbPath, sqlite3) {
    const dbName = path.join(dbPath, 'data.db');
    const db = new sqlite3.Database(dbName);
    // const sql = "CREATE TABLE if not exists user(account text, password text)";
    // db.exec(sql);
    return db;
}