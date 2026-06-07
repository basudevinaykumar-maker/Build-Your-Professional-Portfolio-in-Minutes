# ⚡ Quick Start Guide

## 1️⃣ Install Dependencies
Open PowerShell/Command Prompt in this folder and run:
```
npm install
```
Wait for it to complete (about 1-2 minutes)

## 2️⃣ Start the Backend Server
```
npm start
```

You should see:
```
✅ PortfolioAI Backend Server running on http://localhost:5000
```

## 3️⃣ Open Your Browser
Go to: **http://localhost:5000/login**

## 4️⃣ Create an Account or Login

### Create New Account:
- Click "Sign up here"
- Fill in your details
- Click "Create Account"
- You'll be redirected to login

### Login:
- Enter your email and password
- Click "Login"
- You'll see the dashboard with your email in the header

## 5️⃣ Test Features
- ✅ User registration with password strength checker
- ✅ Secure login with JWT tokens
- ✅ Remember me functionality
- ✅ Protected dashboard
- ✅ Logout functionality
- ✅ Automatic token expiration (24 hours)

---

## 🆘 Issues?

### Backend not starting?
- Check if Node.js is installed: `node --version`
- Make sure port 5000 is free
- Delete `node_modules` and run `npm install` again

### Can't login?
- Make sure backend is running in another terminal
- Check browser console for errors (F12)
- Try creating a new account

### Forgot password?
- Delete `users.db` to reset the database
- Restart the server (new users.db will be created)

---

## 📚 API Documentation

See `README.md` for full API documentation and endpoints

---

**Ready to code? Let's go! 🚀**
