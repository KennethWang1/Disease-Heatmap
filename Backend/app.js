require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./models/Uid');
const { addEntry, getTodayCount, getNearby, netChange } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(authConfig));

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>Home</h1>
    <a href="/login">Login</a> |
    <a href="/profile">Profile</a> |
    <a href="/logout">Logout</a>
  `);
});

app.post('/api/v1/form_submit', async (req, res) => {
  try {
    await addEntry(req.body);
    res.status(200).send('Form submitted successfully');
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/v1/get_today', async (req, res) => {
  try {
    const count = await getTodayCount();
    res.status(200).json(count);
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send('Not logged in. <a href="/login">Login here</a>');
  }

  const uid = req.oidc.user.sub;
  try {
    const existing = await User.findOne({ auth0Id: uid });
    if (!existing) {
      await User.create({ auth0Id: uid });
    }
    res.send(`
      <h1>User Profile</h1>
      <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
      <p>Your UID is stored in the database.</p>
      <a href="/">Home</a> | <a href="/logout">Logout</a>
    `);
  } catch {
    res.status(500).send('Error storing UID');
  }
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});

http.createServer(app).listen(port);
