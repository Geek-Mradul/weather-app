import { useState, useEffect } from 'react';
import './App.css'; // Corrected Path
import WeatherIcon from './WeatherIcon'; // Corrected Path
import WeatherDisplay from './components/WeatherDisplay';
import RecentSearches from './components/RecentSearches';

function App() {
  // All your state management and functions remain the same
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setError(null);
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found. Please check the spelling.');
      }
      const data = await response.json();
      setWeatherData(data);

      setRecentSearches(prevSearches => {
        const newSearches = [data.name, ...prevSearches.filter(c => c !== data.name)];
        const updatedSearches = newSearches.slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchWeather(city);
  };

  const handleRecentSearchClick = (searchCity) => {
    setCity(searchCity);
    fetchWeather(searchCity);
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

