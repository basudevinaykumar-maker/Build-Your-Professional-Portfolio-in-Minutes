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

    db.run(`
        CREATE TABLE IF NOT EXISTS portfolios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT NOT NULL UNIQUE,
            user_id INTEGER,
            full_name TEXT NOT NULL,
            title TEXT,
            email TEXT,
            data_json TEXT NOT NULL,
            views INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating portfolios table:', err);
        } else {
            console.log('Portfolios table ready');
            db.run(`CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);`);
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
app.get("/", (req, res) => {
  res.json({
    message: "PortfolioAI Backend is Live 🚀"
  });
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

app.get('/portfolio-builder', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio-generator.html'));
});

// Helper functions for slug generation
function sanitizeSlugPart(str) {
    return (str || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'portfolio';
}

function generateRandomHash(length = 5) {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateUniqueSlug(dbInstance, fullName) {
    return new Promise((resolve, reject) => {
        const base = sanitizeSlugPart(fullName);
        const tryGenerate = (attempts = 0) => {
            if (attempts > 25) {
                return reject(new Error('Failed to generate unique slug after multiple attempts'));
            }
            const candidateSlug = `${base}-${generateRandomHash(5)}`;
            dbInstance.get('SELECT id FROM portfolios WHERE slug = ?', [candidateSlug], (err, row) => {
                if (err) return reject(err);
                if (row) {
                    return tryGenerate(attempts + 1);
                }
                resolve(candidateSlug);
            });
        };
        tryGenerate();
    });
}

// Optional user extractor from token
const optionalUser = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

// ==========================================
// PORTFOLIO API ENDPOINTS (PERMANENT URLS)
// ==========================================

// Create or update a portfolio
app.post('/api/portfolios', async (req, res) => {
    try {
        const { slug: existingSlug, ...portfolioData } = req.body;
        const personalInfo = portfolioData.personalInfo || portfolioData;
        const fullName = (personalInfo.fullName || personalInfo.name || '').trim();
        const title = (personalInfo.title || '').trim();
        const email = (personalInfo.email || '').trim();

        if (!fullName || !title || !email) {
            return res.status(400).json({
                success: false,
                message: 'Full name, professional title, and email are required.'
            });
        }

        const user = optionalUser(req);
        const userId = user ? user.userId : null;
        const dataJson = JSON.stringify(portfolioData);

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        // Check if an existing valid slug is provided for update
        if (existingSlug && typeof existingSlug === 'string' && existingSlug.trim()) {
            const cleanSlug = existingSlug.trim().toLowerCase();
            db.get('SELECT id, slug FROM portfolios WHERE slug = ?', [cleanSlug], (err, existing) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                }

                if (existing) {
                    db.run(
                        `UPDATE portfolios 
                         SET full_name = ?, title = ?, email = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
                         WHERE id = ?`,
                        [fullName, title, email, dataJson, existing.id],
                        function(updateErr) {
                            if (updateErr) {
                                return res.status(500).json({ success: false, message: 'Failed to update portfolio', error: updateErr.message });
                            }
                            const portfolioUrl = `${protocol}://${host}/portfolio/${existing.slug}`;
                            return res.json({
                                success: true,
                                message: 'Portfolio updated successfully',
                                slug: existing.slug,
                                url: portfolioUrl,
                                isNew: false
                            });
                        }
                    );
                } else {
                    createNewPortfolio();
                }
            });
        } else {
            createNewPortfolio();
        }

        async function createNewPortfolio() {
            try {
                const uniqueSlug = await generateUniqueSlug(db, fullName);
                db.run(
                    `INSERT INTO portfolios (slug, user_id, full_name, title, email, data_json)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [uniqueSlug, userId, fullName, title, email, dataJson],
                    function(insertErr) {
                        if (insertErr) {
                            return res.status(500).json({ success: false, message: 'Failed to save portfolio', error: insertErr.message });
                        }
                        const portfolioUrl = `${protocol}://${host}/portfolio/${uniqueSlug}`;
                        return res.status(201).json({
                            success: true,
                            message: 'Portfolio created successfully',
                            id: this.lastID,
                            slug: uniqueSlug,
                            url: portfolioUrl,
                            isNew: true
                        });
                    }
                );
            } catch (err) {
                return res.status(500).json({ success: false, message: 'Slug generation failed', error: err.message });
            }
        }
    } catch (err) {
        console.error('Portfolio save error:', err);
        return res.status(500).json({ success: false, message: 'Server error saving portfolio', error: err.message });
    }
});

// Get Portfolio by Slug (Permanent URL lookup with view counter)
app.get('/api/portfolios/:slug', (req, res) => {
    const slug = (req.params.slug || '').trim().toLowerCase();
    db.get(
        'SELECT id, slug, full_name, title, email, data_json, views, created_at, updated_at FROM portfolios WHERE slug = ?',
        [slug],
        (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err.message });
            }

            if (!row) {
                return res.status(404).json({ success: false, message: 'Portfolio not found' });
            }

            // Asynchronously increment view count
            db.run('UPDATE portfolios SET views = views + 1 WHERE id = ?', [row.id], (viewErr) => {
                if (viewErr) console.warn('Could not increment views for', slug, viewErr);
            });

            let parsedData = {};
            try {
                parsedData = JSON.parse(row.data_json);
            } catch (e) {
                parsedData = {};
            }

            res.json({
                success: true,
                slug: row.slug,
                fullName: row.full_name,
                title: row.title,
                email: row.email,
                data: parsedData,
                views: (row.views || 0) + 1,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            });
        }
    );
});

// Serve portfolio website dynamically for any permanent slug URL
app.get('/portfolio/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio-website.html'));
});

// Start Server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`✅ PortfolioAI Backend Server running on http://localhost:${port}`);
        console.log(`📝 API Documentation:`);
        console.log(`   POST /api/auth/register`);
        console.log(`   POST /api/auth/login`);
        console.log(`   GET /api/auth/profile`);
        console.log(`   GET /api/auth/verify`);
        console.log(`   POST /api/auth/logout`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use. Trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(err);
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
