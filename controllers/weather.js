const { default: axios } = require('axios');
const db = require('../mongomodels/weather');
const dotenv = require("dotenv").config();
const apiKey = process.env.API_KEY;

exports.getWeather = async (req, res) => {
  const Data = {
    city: req.body.city,
  };
  console.log(req.body.city)
  if (req.body.city) {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 3);

      const mongoData = await db.findOne({ date: endDate.toISOString().split('T')[0], city: req.body.city }).lean();
      if (mongoData) {
        const allData = await db.find().lean();
        res.status(200).json({ data: allData });
      } else {
        // Get previous 3 days' dates
        const previousDates = [];
        for (let i = 3; i >= 1; i--) {
          const pastDate = new Date(today);
          pastDate.setDate(today.getDate() - i);
          previousDates.push(pastDate.toISOString().split('T')[0]);
        }

        // Fetch forecast data for the next 4 days
        const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${req.body.city}&days=4`;
        const forecastResponse = await axios.get(forecastUrl);
        const forecastData = forecastResponse?.data?.forecast?.forecastday?.map(day => ({
          date: day.date,
          day: day.day
        })) || [];

        // Fetch historical weather for each previous day
        const historyData = [];
        for (const date of previousDates) {
          console.log(date, "dates previous");
          const historyUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${req.body.city}&dt=${date}`;
          const historyResponse = await axios.get(historyUrl);
          const dayData = historyResponse?.data?.forecast?.forecastday?.[0];
          if (dayData) {
            historyData.push({
              date: dayData.date,
              day: dayData.day
            });
          }
        }

        // Fetch all existing data from MongoDB (saved dates)
        const savedData = await db.find().lean();

        // Combine all the data (historical, forecast, and saved data)
        const combinedData = [...savedData, ...historyData, ...forecastData];

        // Remove duplicates by date
        const uniqueData = combinedData.reduce((acc, current) => {
          const existing = acc.find(item => item.date === current.date);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Sort ascending by date
        uniqueData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Insert new data into MongoDB (for missing dates)
        const insertPromises = uniqueData.map(async (entry) => {
          await db.updateOne(
            { date: entry.date },
            {
              $set: {
                date: entry.date,
                city: req.body.city,
                temperature: entry?.avgtemp_c,
                humidity: entry?.avghumidity,
                windSpeed: entry?.maxwind_kph,
                condition: entry?.day?.condition?.text
              }
            },
            { upsert: true }
          );
        });

        // Wait for all insertions to complete
        await Promise.all(insertPromises);

        return res.status(200).json({ message: "Weather data saved successfully", data: uniqueData });
      }

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ message: "city is undefined" })
  }

};
