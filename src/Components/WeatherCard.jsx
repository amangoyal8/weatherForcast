import React from 'react'

function WeatherCard({ weather }) {
  const date = new Date(weather.date).toDateString();

  return (
    <div className="card">
      <h3>{date}</h3>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} km/h</p>
      <p>Condition: {weather.condition}</p>
    </div>
  )
}

export default WeatherCard
