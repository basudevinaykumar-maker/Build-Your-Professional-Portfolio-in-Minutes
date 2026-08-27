<<<<<<< HEAD
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table ready');
        }
    });
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Routes

// User Registration (Signup)
app.post('/api/auth/register', (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (row) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password', error: err });
            }

            // Insert user into database
            db.run(
                'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
                [fullname, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error creating user', error: err });
                    }

                    res.status(201).json({
                        message: 'User registered successfully',
                        userId: this.lastID,
                        email: email
                    });
                }
            );
        });
    });
});

// User Login
app.post('/api/auth/login', (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords', error: err });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, fullname: user.fullname },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname
                },
                rememberMe: rememberMe || false
            });
        });
    });
});

// Get User Profile (Protected Route)
app.get('/api/auth/profile', verifyToken, (req, res) => {
    db.get('SELECT id, fullname, email, created_at FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User profile retrieved',
            user: user
        });
    });
});

// Verify Token (Check if token is still valid)
app.get('/api/auth/verify', verifyToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});

// Logout (Token invalidation - optional, handled on frontend)
app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend server is running', status: 'OK' });
});

// Serve HTML files
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/hero', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ PortfolioAI Backend Server running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation:`);
    console.log(`   POST /api/auth/register - Register new user`);
    console.log(`   POST /api/auth/login - Login user`);
    console.log(`   GET /api/auth/profile - Get user profile (requires token)`);
    console.log(`   GET /api/auth/verify - Verify token`);
    console.log(`   POST /api/auth/logout - Logout user`);
});

// Handle server errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Close database connection on process exit
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
});
=======
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT || 5000, 10);
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Fullname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table ready');
        }
    });
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Routes

// User Registration (Signup)
app.post('/api/auth/register', (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (row) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password', error: err });
            }

            // Insert user into database
            db.run(
                'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
                [fullname, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error creating user', error: err });
                    }

                    res.status(201).json({
                        message: 'User registered successfully',
                        userId: this.lastID,
                        email: email
                    });
                }
            );
        });
    });
});

// User Login
app.post('/api/auth/login', (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords', error: err });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, fullname: user.fullname },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname
                },
                rememberMe: rememberMe || false
            });
        });
    });
});

// Get User Profile (Protected Route)
app.get('/api/auth/profile', verifyToken, (req, res) => {
    db.get('SELECT id, fullname, email, created_at FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User profile retrieved',
            user: user
        });
    });
});

// Verify Token (Check if token is still valid)
app.get('/api/auth/verify', verifyToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});

// Logout (Token invalidation - optional, handled on frontend)
app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend server is running', status: 'OK' });
});

// Serve HTML files
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/hero', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`✅ PortfolioAI Backend Server running on http://localhost:${10000}`);
        console.log(`📝 API Documentation:`);
        console.log(`   POST /api/auth/register - Register new user`);
        console.log(`   POST /api/auth/login - Login user`);
        console.log(`   GET /api/auth/profile - Get user profile (requires token)`);
        console.log(`   GET /api/auth/verify - Verify token`);
        console.log(`   POST /api/auth/logout - Logout user`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

startServer(PORT);

// Handle server errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Close database connection on process exit
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
});
>>>>>>> 0cb7fd533fff23beb569350e585f722e38d9d4fb
