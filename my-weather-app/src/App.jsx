// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import WeatherIcon from './WeatherIcon';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);

      setRecentSearches(prevSearches => {
        const newSearches = [data.name, ...prevSearches.filter(c => c !== data.name)];
        const updatedSearches = newSearches.slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // NEW: This function handles the form submission
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading
    fetchWeather(city);       // Calls your existing search logic
  };

  const handleRecentSearchClick = (searchCity) => {
    setCity(searchCity);
    fetchWeather(searchCity);
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      {/* MODIFIED: Using a form element */}
      <form className="search-bar" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {weatherData && (
        <div className="weather-display">
          <h2>{weatherData.name}</h2>
          <WeatherIcon
            iconCode={weatherData.weather[0].icon}
            className="weather-icon"
          />
          <p className="weather-description">{weatherData.weather[0].description}</p>
          <div className="weather-details">
            <div className="detail-item"><p>Temperature</p><span>{Math.round(weatherData.main.temp)}°C</span></div>
            <div className="detail-item"><p>Humidity</p><span>{weatherData.main.humidity}%</span></div>
            <div className="detail-item"><p>Wind Speed</p><span>{weatherData.wind.speed} km/h</span></div>
          </div>
        </div>
      )}

      <div className="recent-searches">
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((searchCity, index) => (
            <li key={index} onClick={() => handleRecentSearchClick(searchCity)}>
              {searchCity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;