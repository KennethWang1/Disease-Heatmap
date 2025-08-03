const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./models/Uid');
const { stat } = require('fs');
const { mongoose, addEntry, getDisease, getTodayCount, netChange, getNearby, get7days } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

var accounts = [];

// Auth0 config
app.use(auth({
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
}));

app.use(cors({
  origin: true,
  methods: true,
  allowedHeaders: true,
  credentials: true,
}));

app.use(auth(authConfig));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log('Incoming request: ' + req.url);
  next();
});

// Route: public home page
app.get('/', (req, res) => {
  res.send(`
    <h1>Home</h1>
    <a href="/login">Login</a> |
    <a href="/profile">Profile</a> |
    <a href="/logout">Logout</a>
  `);
});

app.post('/api/v1/form_submit', async (req, res) => {
    const data = req.body;
    try {
        const result = await addEntry(data);
        if(result){
          res.status(200).send('Form submitted successfully');
        } else {
          res.status(400).send('Form submission failed: User has already submitted today');
        }
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

app.get('/api/v1/net_change', async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        const change = await netChange(longitude, latitude);
        res.status(200).json(change);
    } catch (error) {
        console.error('Error fetching net change:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/v1/find_disease', async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        const change = await getDisease(longitude, latitude);
        res.status(200).json(change);
    } catch (error) {
        console.error('Error fetching disease information:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/v1/get_nearby', async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const nearby = getNearby(longitude, latitude);
    const nearbyEntries = await nearby;
    res.status(200).send(nearbyEntries);
  } catch (error) {
    
  }
});

app.post('/api/v1/make_account', async (req, res) => {
  const { username, password } = req.body;
  if(accounts[username]) {
    return res.status(400).send('Account already exists');
  }
  accounts[username] = { password };
  res.status(201).send('Account created');
});

app.get('/api/v1/get_account', (req, res) => {
  console.log(accounts);
  const { username, password } = req.body;
  const pwd = accounts[username];
  if (pwd && password && pwd.password == password) {
    return res.status(200).json({ message: 'Login Successful' });
  }
  res.status(404).send('Login Failed');
});

app.get('/api/v1/get_7_days', async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const graph = await get7days(longitude, latitude);
    res.status(200).json(graph);
  } catch (error) {
    console.error('Error fetching 7-day data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route: profile — stores UID in MongoDB, with improved logging
app.get('/profile', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send('Not logged in. <a href="/login">Login here</a>');
  }

  const uid = req.oidc.user.sub;

  try {
    let user = await User.findOne({ auth0Id: uid });
    if (!user) {
      user = await User.create({ auth0Id: uid });
    }
    res.status(200).json({ success: true, uid: user.auth0Id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store user UID.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});