const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weather.js');

router.post('/forecast', getWeather);

module.exports = router;