// src/App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = async () => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data); // <-- THE KEY CHANGE!
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Conditionally rendered weather display */}
      {weatherData && (
        <div className="weather-display">
          <h2>Weather in {weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <div className="weather-details">
            <div><p>Temperature</p><span>{Math.round(weatherData.main.temp)}°C</span></div>
            <div><p>Humidity</p><span>{weatherData.main.humidity}%</span></div>
            <div><p>Wind Speed</p><span>{weatherData.wind.speed} km/h</span></div>
          </div>
        </div>
      )}

      {/* Static recent searches list (we will make this dynamic later) */}
      <div className="recent-searches">
        <h3>Recent Searches</h3>
        <ul><li>Mumbai</li><li>Delhi</li><li>Bangalore</li></ul>
      </div>
    </div>
  );
}

export default App;