import { useState, useEffect } from 'react';
import './App.css';
import WeatherDisplay from './components/WeatherDisplay';
import RecentSearches from './components/RecentSearches';
import Forecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // --- NEW THEME LOGIC ---
  // 1. Add state for the theme, defaulting to the user's saved choice or system preference.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('weather-app-theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  // 2. Effect to apply theme class to body and save to localStorage whenever the theme changes.
  useEffect(() => {
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('weather-app-theme', theme);
  }, [theme]);

  // 3. Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  // --- END NEW THEME LOGIC ---

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setIsLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const weatherResponse = await fetch(currentWeatherUrl);
      if (!weatherResponse.ok) throw new Error('City not found. Please check the spelling.');
      const currentData = await weatherResponse.json();
      setWeatherData(currentData);

      const { lat, lon } = currentData.coord;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastResult = await forecastResponse.json();
      const dailyForecasts = forecastResult.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecastData(dailyForecasts);

      setRecentSearches(prevSearches => {
        const newSearches = [currentData.name, ...prevSearches.filter(c => c !== currentData.name)];
        const updatedSearches = newSearches.slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchWeather(city);
    setIsSearchFocused(false);
  };

  const handleRecentSearchClick = (searchCity) => {
    setCity(searchCity);
    fetchWeather(searchCity);
    setIsSearchFocused(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 150);
  };

  return (
    <div className="weather-app">
      <div className="left-panel">
        <h1 className="app-title">Weather App</h1>

        {/* --- NEW: THEME TOGGLE BUTTON --- */}
        <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="mobile-controls">
          <form className="search-bar" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Search for a city..."
              aria-label="Search for a city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={handleInputBlur}
            />
            <button type="submit" aria-label="Submit search">Search</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {isSearchFocused && (
            <RecentSearches
              recentSearches={recentSearches}
              onRecentSearchClick={handleRecentSearchClick}
            />
          )}
        </div>

        <div className="main-content-display">
          {isLoading ? (
            <div className="placeholder-text">Loading...</div>
          ) : weatherData ? (
            <>
              <WeatherDisplay weatherData={weatherData} />
              {forecastData && <Forecast forecastData={forecastData} />}
            </>
          ) : !isSearchFocused ? (
            <div className="placeholder-text">Search for a city to see the weather.</div>
          ) : null}
        </div>
      </div>

      <div className="right-panel">
        <form className="search-bar" onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Search for a city..."
            aria-label="Search for a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" aria-label="Submit search">Search</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <RecentSearches
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
        />
      </div>
    </div>
  );
}

export default App;