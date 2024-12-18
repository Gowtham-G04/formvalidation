const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '040604',
  database: 'employee_db'
});

db.connect(err => {
  if (err) console.error('DB error:', err);
  else console.log('Connected to DB');
});

app.post('/api/employees', (req, res) => {
  const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;

  if (!name || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
  }

  const checkQuery = 'SELECT * FROM employees WHERE employeeId = ? OR email = ?';
  db.query(checkQuery, [employeeId, email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking database' });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Employee ID or Email already exists' });
    }

    const insertQuery = 'INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [name, employeeId, email, phone, department, dateOfJoining, role], err => {
      if (err) return res.status(500).json({ message: 'Error adding employee' });
      res.status(200).json({ message: 'Employee added successfully' });
    });
  });
});

app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching data' });
    res.json({ employees: results });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  db.query('DELETE FROM employees WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ message: 'Error deleting employee' });
    res.status(200).json({ message: 'Employee deleted' });
  });
});
app.listen(5000, () => console.log('Server running on http://localhost:5000'));