const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  city: String,
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  condition: String
});

module.exports = mongoose.model('Weather', weatherSchema);