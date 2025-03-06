const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blood_b'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'blood_bank_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Routes
// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Authentication routes
app.post('/auth/login', (req, res) => {
    const { username, password, userType } = req.body;
    
    let table, idColumn;
    switch(userType) {
        case 'donor':
            table = 'donors';
            idColumn = 'donor_id';
            break;
        case 'recipient':
            table = 'recipients';
            idColumn = 'recipient_id';
            break;
        case 'doctor':
            table = 'doctors';
            idColumn = 'doctor_id';
            break;
        default:
            return res.status(400).json({ error: 'Invalid user type' });
    }
    
    // In a real application, you would store hashed passwords
    // For simplicity, we're directly comparing the password with contact_no
    // In production, implement proper password hashing
    const query = `SELECT * FROM ${table} WHERE name = ? AND contact_no = ?`;
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        req.session.user = {
            id: user[idColumn],
            name: user.name,
            userType: userType
        };
        
        res.json({ 
            success: true, 
            redirect: `/${userType}-dashboard.html` 
        });
    });
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// API Routes for Donors
app.get('/api/donors/:id', (req, res) => {
    const donorId = req.params.id;
    const query = 'SELECT * FROM donors WHERE donor_id = ?';
    
    db.query(query, [donorId], (err, results) => {
        if (err) {
            console.error('Error fetching donor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }
        
        res.json(results[0]);
    });
});

app.get('/api/donors/:id/donations', (req, res) => {
    const donorId = req.params.id;
    const query = `
        SELECT bd.*, h.name as hospital_name
        FROM blood_donations bd
        JOIN hospitals h ON bd.hospital_id = h.hospital_id
        WHERE bd.donor_id = ?
        ORDER BY bd.donation_date DESC
    `;
    
    db.query(query, [donorId], (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.post('/api/donations', (req, res) => {
    const { donor_id, hospital_id, quantity } = req.body;
    const query = `
        INSERT INTO blood_donations (donor_id, hospital_id, donation_date, quantity) 
        VALUES (?, ?, CURRENT_DATE(), ?)
    `;
    
    db.query(query, [donor_id, hospital_id, quantity], (err, result) => {
        if (err) {
            console.error('Error creating donation:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Update donor's last donation date
        const updateQuery = 'UPDATE donors SET last_donation_date = CURRENT_DATE() WHERE donor_id = ?';
        db.query(updateQuery, [donor_id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating donor:', updateErr);
            }
        });
        
        res.json({ 
            success: true, 
            donation_id: result.insertId 
        });
    });
});

// API Routes for Recipients
app.get('/api/recipients/:id', (req, res) => {
    const recipientId = req.params.id;
    const query = `
        SELECT r.*, h.name as hospital_name, d.name as doctor_name
        FROM recipients r
        LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
        LEFT JOIN doctors d ON r.doctor_id = d.doctor_id
        WHERE r.recipient_id = ?
    `;
    
    db.query(query, [recipientId], (err, results) => {
        if (err) {
            console.error('Error fetching recipient:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        
        res.json(results[0]);
    });
});

app.get('/api/recipients/:id/requests', (req, res) => {
    const recipientId = req.params.id;
    const query = `
        SELECT br.*, h.name as hospital_name
        FROM blood_requests br
        JOIN hospitals h ON br.hospital_id = h.hospital_id
        WHERE br.recipient_id = ?
        ORDER BY br.request_date DESC
    `;
    
    db.query(query, [recipientId], (err, results) => {
        if (err) {
            console.error('Error fetching blood requests:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.post('/api/requests', (req, res) => {
    const { recipient_id, hospital_id, blood_type, quantity } = req.body;
    const query = `
        INSERT INTO blood_requests 
        (recipient_id, hospital_id, blood_type, request_date, quantity, status) 
        VALUES (?, ?, ?, CURRENT_DATE(), ?, 'Pending')
    `;
    
    db.query(query, [recipient_id, hospital_id, blood_type, quantity], (err, result) => {
        if (err) {
            console.error('Error creating blood request:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            success: true, 
            request_id: result.insertId 
        });
    });
});

app.put('/api/requests/:id', (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;
    const query = 'UPDATE blood_requests SET status = ? WHERE request_id = ?';
    
    db.query(query, [status, requestId], (err) => {
        if (err) {
            console.error('Error updating blood request:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // If request is fulfilled, update recipient status
        if (status === 'Fulfilled') {
            const updateQuery = `
                UPDATE recipients r
                JOIN blood_requests br ON r.recipient_id = br.recipient_id
                SET r.request_status = 'Fulfilled'
                WHERE br.request_id = ?
            `;
            
            db.query(updateQuery, [requestId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating recipient status:', updateErr);
                }
            });
        }
        
        res.json({ success: true });
    });
});

// API Routes for Doctors
app.get('/api/doctors/:id', (req, res) => {
    const doctorId = req.params.id;
    const query = `
        SELECT d.*, h.name as hospital_name
        FROM doctors d
        JOIN hospitals h ON d.hospital_id = h.hospital_id
        WHERE d.doctor_id = ?
    `;
    
    db.query(query, [doctorId], (err, results) => {
        if (err) {
            console.error('Error fetching doctor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.json(results[0]);
    });
});

app.get('/api/hospitals/:id/inventory', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'SELECT * FROM blood_inventory WHERE hospital_id = ?';
    
    db.query(query, [hospitalId], (err, results) => {
        if (err) {
            console.error('Error fetching blood inventory:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.get('/api/hospitals/:id/requests', (req, res) => {
    const hospitalId = req.params.id;
    const query = `
        SELECT br.*, r.name as recipient_name, r.blood_type, r.contact_no
        FROM blood_requests br
        JOIN recipients r ON br.recipient_id = r.recipient_id
        WHERE br.hospital_id = ?
        ORDER BY br.request_date DESC
    `;
    
    db.query(query, [hospitalId], (err, results) => {
        if (err) {
            console.error('Error fetching hospital requests:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.put('/api/inventory/:id', (req, res) => {
    const inventoryId = req.params.id;
    const { quantity } = req.body;
    const query = 'UPDATE blood_inventory SET quantity = ? WHERE inventory_id = ?';
    
    db.query(query, [quantity, inventoryId], (err) => {
        if (err) {
            console.error('Error updating blood inventory:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ success: true });
    });
});

// Hospital routes
app.get('/api/hospitals', (req, res) => {
    const query = 'SELECT * FROM hospitals';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching hospitals:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.get('/api/hospitals/:blood_type', (req, res) => {
    const bloodType = req.params.blood_type;
    const query = `
        SELECT h.*, bi.quantity
        FROM hospitals h
        JOIN blood_inventory bi ON h.hospital_id = bi.hospital_id
        WHERE bi.blood_type = ?
    `;
    
    db.query(query, [bloodType], (err, results) => {
        if (err) {
            console.error('Error fetching compatible hospitals:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

// Registration routes
app.post('/api/register/donor', (req, res) => {
    const { name, age, gender, blood_type, contact_no, email, address, last_donation_date } = req.body;
    const query = `
        INSERT INTO donors 
        (name, age, gender, blood_type, contact_no, email, address, last_donation_date, eligible) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    db.query(query, [name, age, gender, blood_type, contact_no, email, address, last_donation_date], (err, result) => {
        if (err) {
            console.error('Error registering donor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            success: true, 
            donor_id: result.insertId 
        });
    });
});

app.post('/api/register/recipient', (req, res) => {
    const { name, age, gender, blood_type, contact_no, hospital_id } = req.body;
    const query = `
        INSERT INTO recipients 
        (name, age, gender, blood_type, contact_no, hospital_id, request_status) 
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;
    
    db.query(query, [name, age, gender, blood_type, contact_no, hospital_id], (err, result) => {
        if (err) {
            console.error('Error registering recipient:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            success: true, 
            recipient_id: result.insertId 
        });
    });
});

app.post('/api/register/doctor', (req, res) => {
    const { name, specialization, contact_no, email, hospital_id } = req.body;
    const query = `
        INSERT INTO doctors 
        (name, specialization, contact_no, email, hospital_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [name, specialization, contact_no, email, hospital_id], (err, result) => {
        if (err) {
            console.error('Error registering doctor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            success: true, 
            doctor_id: result.insertId 
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
