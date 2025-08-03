// app.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./models/Uid');
const { mongoose } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Auth0 config
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// Initialize Auth0 middleware
app.use(auth(authConfig));

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route: Automatically redirects to Auth0 Universal Login
app.get('/login', (req, res) => {
  res.oidc.login();
});

// Route: Save UID after login, send minimal response
app.get('/profile', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const uid = req.oidc.user.sub;

  try {
    const existing = await User.findOne({ auth0Id: uid });
    if (!existing) {
      await User.create({ auth0Id: uid });
    }

    res.status(200).json({ uid }); // send UID to frontend
  } catch (err) {
    res.status(500).json({ error: 'Error storing UID' });
  }
});

// Health check (optional)
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

http.createServer(app).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
