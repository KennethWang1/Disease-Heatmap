const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./models/Uid');
const { addEntry, getTodayCount, getNearby, netChange } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);

// Auth0 config
app.use(auth({
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
  try {
    await addEntry(req.body);
    res.status(200).send('Form submitted successfully');
  } catch {
    res.status(500).send('Internal Server Error');
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