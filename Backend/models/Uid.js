// models/Uid.js
const mongoose = require('mongoose');

const uidSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { 
      type: [Number],
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Coordinates must have exactly 2 elements [longitude, latitude]'
      }
    }
  },
  gemini_info: {
    symptoms: { type: [String] },
    wellness: { type: Number },
    seriousness: { type: Number },
    trust: { type: Number },
  },
});

// Add geospatial index for location-based queries
uidSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('user', uidSchema);
