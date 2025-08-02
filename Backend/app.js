require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./models/Uid');
const { stat } = require('fs');
const { mongoose, addEntry, getNearby, getTodayCount, netChange } = require('./db');

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

app.use(cors({
  origin: true, // Allow any origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log('Incoming request: ' + req.url);
  next();
});

// Route: public home page
app.get('/', (req, res) => {
  res.send(`<h1>Home</h1>
    <a href="/login">Login</a> |
    <a href="/profile">Profile</a> |
    <a href="/logout">Logout</a>`);
});

app.post('/api/v1/form_submit', async (req, res) => {
    const data = req.body;
    try {
        const result = await addEntry(data);
        res.status(200).send('Form submitted successfully');
    } catch (err) {
        console.error('Error storing entry:', err);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/api/v1/get_today', async (req, res) => {   
    try {
        const todayCount = await getTodayCount();
        res.status(200).json(todayCount);
    } catch (error) {
        console.error('Error fetching today\'s count:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route: profile — stores UID in MongoDB, with improved logging
app.get('/profile', async (req, res) => {
  console.log('🔒 /profile route hit');
  if (!req.oidc.isAuthenticated()) {
    console.log('❌ User not authenticated');
    return res.status(401).send('Not logged in. <a href="/login">Login here</a>');
  }

  const uid = req.oidc.user.sub;
  console.log('🔑 Authenticated user sub:', uid);

  try {
    const existing = await User.findOne({ auth0Id: uid });
    if (!existing) {
      await User.create({ auth0Id: uid });
      console.log('✅ Stored new UID in MongoDB:', uid);
    } else {
      console.log('ℹ️ UID already exists in MongoDB:', uid);
    }

    res.send(`
      <h1>User Profile</h1>
      <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
      <p>Your UID is stored in the database.</p>
      <a href="/">Home</a> | <a href="/logout">Logout</a>
    `);
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    res.status(500).send('Error storing UID');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the HTTP server
http.createServer(app).listen(port, () => {
  console.log(`HTTP server up and running on http://localhost:${port}`);
});
