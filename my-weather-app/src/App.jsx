import { useState, useEffect } from 'react';
import '../App.css'; // Note: The path is now ../App.css if you moved App.jsx
import WeatherIcon from '../WeatherIcon'; // Adjust path if you move App.jsx
import WeatherDisplay from './components/WeatherDisplay';
import RecentSearches from './components/RecentSearches';

function App() {
  // All your state management stays here
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);

  // All your functions (useEffect, fetchWeather, etc.) stay here
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchWeather = async (cityName) => {
    // ... (your existing fetchWeather function code)
  };

  const handleFormSubmit = (event) => {
    // ... (your existing handleFormSubmit function code)
  };

  const handleRecentSearchClick = (searchCity) => {
    // ... (your existing handleRecentSearchClick function code)
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <form className="search-bar" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {weatherData && <WeatherDisplay weatherData={weatherData} />}

      <RecentSearches
        recentSearches={recentSearches}
        onRecentSearchClick={handleRecentSearchClick}
      />
    </div>
  );
}

export default App;