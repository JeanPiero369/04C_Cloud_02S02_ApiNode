const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('students.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to the database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            gender TEXT NOT NULL,
            age TEXT
        )`, (err) => {
            if (err) {
                console.error('Could not create table', err.message);
            }
        });
    }
});

module.exports = db;
