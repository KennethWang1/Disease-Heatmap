const radiusInMeters = 25000; // 25km
const mongoose = require('mongoose');
const User = require('./models/Uid');
const { findDiseaseOutbreak } = require('./ai'); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  User.collection.createIndex({ "location": "2dsphere" });
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function addEntry(data) {
  try {
    // Handle the case where 'uid' is sent instead of 'auth0Id'
    if (data.uid && !data.auth0Id) {
      data.auth0Id = data.uid;
      delete data.uid; // Remove the old field
    }

    // Ensure date is a proper Date object
    if (data.date && typeof data.date === 'string') {
      data.date = new Date(data.date);
    }

    // Fix coordinates typo if present
    if (data.location && data.location.cordinates) {
      data.location.coordinates = data.location.cordinates;
      delete data.location.cordinates;
    }

    // Ensure location type is capitalized correctly
    if (data.location && data.location.type) {
      data.location.type = 'Point';
    }

    // Validate coordinates are within valid bounds
    if (data.location && data.location.coordinates) {
      const [longitude, latitude] = data.location.coordinates;
      
      if (longitude < -180 || longitude > 180) {
        throw new Error(`Invalid longitude: ${longitude}. Must be between -180 and 180 degrees.`);
      }
      
      if (latitude < -90 || latitude > 90) {
        throw new Error(`Invalid latitude: ${latitude}. Must be between -90 and 90 degrees.`);
      }
    }
    const result = await User.findOneAndUpdate(
      { auth0Id: data.auth0Id },
      data,
      { upsert: true, new: true }
    );
    
    return result;
  } catch (error) {
    console.error('Error in addEntry:', error);
    throw error;
  }
}

async function getDisease(longitude, latitude) {
  try {
    const centerPoint = [longitude, latitude];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const nearbyRecentEntries = await User.find({
      $and: [
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: centerPoint
              },
              $maxDistance: radiusInMeters
            }
          }
        },
        {
          date: {
            $gte: sevenDaysAgo
          }
        }
      ]
    });
    var symptomsArray = [];
    nearbyRecentEntries.forEach(entry => {
      if (entry.gemini_info) {
        symptomsArray.push(entry.gemini_info);
      }
    });

    return await findDiseaseOutbreak(symptomsArray);
  } catch (error) {
    console.error('Error finding nearby entries:', error);
    throw error;
  }
}

async function getTodayCount(){
  try {
    const today = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    const count = await User.countDocuments({
      date: {
        $gte: today
      }
    });

    return count;
  } catch (error) {
    console.error('Error getting today\'s count:', error);
    throw error;
  }
}

async function netChange(longitude, latitude){
  try {
    const deltaTime = 7; //days
    const past = new Date(Date.now() - deltaTime * 2 * 24 * 60 * 60 * 1000);
    const current = new Date(Date.now() - deltaTime * 24 * 60 * 60 * 1000);
    const centerPoint = [longitude, latitude];

    const pastReports = await User.find({
      $and: [
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: centerPoint
              },
              $maxDistance: radiusInMeters
            }
          }
        },
        {
          date: {
            $gte: past, 
            $lt: current
          }
        }
      ]
    });

    const currentReports = await User.find({
      $and: [
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: centerPoint
              },
              $maxDistance: radiusInMeters
            }
          }
        },
        {
          date: {
            $gte: current
          }
        }
      ]
    });

    const pastCount = pastReports.length;
    const currentCount = currentReports.length;

    if(pastCount == 0 || currentCount == 0){
      throw new Error('Not enough data to calculate net change');
    }

    var pastSeverity = 0;
    var currentSeverity = 0;

    pastReports.forEach(report => {
      if (report.gemini_info && report.gemini_info.seriousness) {
        pastSeverity += report.gemini_info.seriousness;
      }
    });

    currentReports.forEach(report => {
      if (report.gemini_info && report.gemini_info.seriousness) {
        currentSeverity += report.gemini_info.seriousness;
      }
    });

    const pastAvgSeverity = pastSeverity / pastCount;
    const currentAvgSeverity = currentSeverity / currentCount;
    const netChangeValue = currentAvgSeverity - pastAvgSeverity;

    return netChangeValue;
  } catch (error) {
    console.error('Error calculating net change:', error);
    throw error;
  }
}

module.exports = { mongoose, addEntry, getDisease, getTodayCount, netChange };