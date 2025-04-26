const express = require('express');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/index');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/weather-app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/weather', weatherRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));