const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'your_database'
});

connection.connect();

app.use(express.json());

// Create
app.post('/api/data', (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO your_table (name, description) VALUES (?, ?)';
    connection.query(sql, [name, description], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to create data' });
        } else {
            res.status(201).json({ message: 'Data created successfully', id: results.insertId });
        }
    });
});

// Read
app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM your_table', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to retrieve data' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Update
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const sql = 'UPDATE your_table SET name = ?, description = ? WHERE id = ?';
    connection.query(sql, [name, description, id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to update data' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Data not found' });
        } else {
            res.status(200).json({ message: 'Data updated successfully' });
        }
    });
});

// Delete
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM your_table WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to delete data' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Data not found' });
        } else {
            res.status(200).json({ message: 'Data deleted successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
