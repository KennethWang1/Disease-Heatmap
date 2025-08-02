// models/Uid.js
const mongoose = require('mongoose');

const uidSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Uid', uidSchema);
