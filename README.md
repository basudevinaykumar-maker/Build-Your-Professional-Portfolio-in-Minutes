# PortfolioAI - Backend Setup Guide

This is a complete full-stack authentication system for PortfolioAI with Node.js/Express backend and SQLite database.

## 📋 Project Structure

```
├── server.js              # Express server & API endpoints
├── package.json           # Dependencies
├── .env                   # Environment variables
├── users.db               # SQLite database (created automatically)
├── login.html             # Login page
├── signup.html            # Registration page
└── hero_page.html         # Dashboard (protected)
```

## 🚀 Setup Instructions

### Step 1: Install Node.js
Download and install Node.js from https://nodejs.org (LTS version recommended)

### Step 2: Install Dependencies
Open terminal/PowerShell in the project directory and run:

```bash
npm install
```

This will install:
- **express** - Web framework
- **sqlite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Step 3: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
✅ PortfolioAI Backend Server running on http://localhost:5000
```

### Step 4: Open the Application

1. Open your browser and go to: `http://localhost:5000/login`
2. Or directly open the HTML files (they'll redirect to login if not authenticated)

## 🔐 API Endpoints

### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "userId": 1,
  "email": "john@example.com"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!",
  "rememberMe": true
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullname": "John Doe"
  },
  "rememberMe": true
}
```

### Get User Profile (Protected)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "message": "User profile retrieved",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-06-06 10:30:00"
  }
}
```

### Verify Token
```bash
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "message": "Token is valid",
  "user": {
    "userId": 1,
    "email": "john@example.com",
    "fullname": "John Doe"
  }
}
```

### Logout
```bash
POST /api/auth/logout
```

**Response (Success - 200):**
```json
{
  "message": "Logout successful"
}
```

## 💾 Database

The SQLite database (`users.db`) is created automatically on first run with the following schema:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔒 Security Features

✅ **Password Hashing** - Passwords are hashed using bcryptjs
✅ **JWT Authentication** - Secure token-based authentication
✅ **CORS Enabled** - Secure cross-origin requests
✅ **Token Expiration** - Tokens expire after 24 hours
✅ **Email Validation** - Duplicate email prevention
✅ **Input Validation** - Server-side validation for all inputs
✅ **Password Strength** - Minimum 6 characters required

## 🧪 Testing the System

### Test Signup Flow:
1. Go to `http://localhost:5000/signup`
2. Create a new account with:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPass123!
3. Click "Create Account"

### Test Login Flow:
1. Go to `http://localhost:5000/login`
2. Enter credentials from signup
3. Check "Remember me" (optional)
4. Click "Login"
5. Should redirect to dashboard with your email displayed

### Test Protected Route:
1. After login, manually navigate to hero_page.html
2. It should work (you're authenticated)
3. Open DevTools console and check: `localStorage.getItem('authToken')`

## 🛠️ Troubleshooting

### "Connection error" on frontend
- Make sure backend is running: `npm start`
- Check if port 5000 is available
- Look for errors in terminal

### "Email already registered"
- This email already has an account in the database
- Use a different email or check users.db

### Token errors on logout
- Clear browser localStorage: DevTools > Application > Storage > Local Storage > Clear
- Or restart the browser

### Database locked error
- Close any other connections to users.db
- Delete users.db and restart (it will be recreated)

## 📦 Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` in `.env` to a strong random value
2. Set `NODE_ENV=production`
3. Use a production database (PostgreSQL, MySQL)
4. Enable HTTPS
5. Set up environment variables securely
6. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

## 📝 Environment Variables

Edit `.env` file:
```
PORT=5000                                              # Server port
JWT_SECRET=your_random_secret_key                     # JWT secret key
NODE_ENV=development                                  # Environment
```

## 🎯 Next Steps

- Implement email verification
- Add password reset functionality
- Integrate OAuth (Google, GitHub)
- Add user profile editing
- Implement portfolio creation
- Add payment processing

---

**Happy coding! 🚀**
