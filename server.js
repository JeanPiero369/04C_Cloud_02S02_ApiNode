const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 8000;

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET and POST for /students
app.route('/students')
    .get((req, res) => {
        db.all('SELECT * FROM students', [], (err, rows) => {
            if (err) {
                return res.status(500).send('Error retrieving students');
            }
            res.json(rows);
        });
    })
    .post((req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        db.run('INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)', [firstname, lastname, gender, age], function (err) {
            if (err) {
                return res.status(500).send('Error inserting student');
            }
            res.status(201).send(`Student with id: ${this.lastID} created successfully`);
        });
    });

// GET, PUT, and DELETE for /student/:id
app.route('/student/:id')
    .get((req, res) => {
        const id = req.params.id;
        db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).send('Error retrieving student');
            }
            if (row) {
                res.json(row);
            } else {
                res.status(404).send('Student not found');
            }
        });
    })
    .put((req, res) => {
        const id = req.params.id;
        const { firstname, lastname, gender, age } = req.body;
        db.run('UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?', [firstname, lastname, gender, age, id], function (err) {
            if (err) {
                return res.status(500).send('Error updating student');
            }
            if (this.changes > 0) {
                res.json({ id, firstname, lastname, gender, age });
            } else {
                res.status(404).send('Student not found');
            }
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).send('Error deleting student');
            }
            if (this.changes > 0) {
                res.send(`The Student with id: ${id} has been deleted.`);
            } else {
                res.status(404).send('Student not found');
            }
        });
    });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
