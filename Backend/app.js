require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { auth, requiresAuth } = require('express-openid-connect');
const cors = require('cors');
const bodyParser = require('body-parser');

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
  authRequired: false,
  auth0Logout: true,
}));

// Endpoint to test server is running
app.get('/ping', (req, res) => {
  res.send('Server is up');
});

// Endpoint to store or confirm Auth0 UID
app.get('/profile', requiresAuth(), async (req, res) => {
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
