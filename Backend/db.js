// db.js
const mongoose = require('mongoose');
const User = require('./models/Uid');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function addEntry(json){
  const result = await User.findOneAndUpdate(
    { auth0Id: json.auth0Id },
    json,
    { upsert: true, new: true }
  );
  return result;
}

module.exports = { mongoose, addEntry };