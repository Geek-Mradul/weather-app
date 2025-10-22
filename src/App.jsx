// Import necessary hooks from React, the main stylesheet, and all child components.
import { useState, useEffect } from 'react';
import './App.css';
import WeatherDisplay from './components/WeatherDisplay';
import RecentSearches from './components/RecentSearches';
import Forecast from './components/Forecast';

/**
 * The main App component that orchestrates the entire weather application.
 * It manages state, fetches data from the OpenWeather API, and renders all sub-components.
 */
function App() {
  // --- STATE MANAGEMENT ---
  // A group of state variables to manage the application's data and UI status.
  const [city, setCity] = useState(''); // Manages the value of the search input.
  const [weatherData, setWeatherData] = useState(null); // Stores the current weather API response.
  const [forecastData, setForecastData] = useState(null); // Stores the 5-day forecast API response.
  const [recentSearches, setRecentSearches] = useState([]); // Tracks the last 5 unique city searches.
  const [error, setError] = useState(null); // Holds any error messages from API calls.
  const [isLoading, setIsLoading] = useState(false); // A flag for showing loading indicators during fetches.
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Tracks focus state for mobile UI.

  // --- THEME LOGIC ---
  // State for the application's theme ('light' or 'dark').
  // It's initialized lazily by first checking localStorage for a saved theme,
  // and if none is found, it defaults to the user's system preference.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('weather-app-theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  // This effect runs whenever the `theme` state changes. It updates the body's class
  // to apply the correct CSS styles and saves the new theme to localStorage.
  useEffect(() => {
    document.body.className = ''; // Clear existing classes to avoid conflicts.
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('weather-app-theme', theme);
  }, [theme]);

  // A simple function to toggle the theme between 'light' and 'dark'.
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- DATA PERSISTENCE & FETCHING ---
  // This effect runs only once when the component mounts.
  // It retrieves the list of recent searches from localStorage, if it exists.
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  /**
   * Fetches current weather and 5-day forecast data from the OpenWeather API.
   * It handles setting loading states, parsing responses, updating recent searches,
   * and catching any potential errors during the process.
   * @param {string} cityName - The name of the city to fetch weather for.
   */
  const fetchWeather = async (cityName) => {
    if (!cityName) return; // Exit if the city name is empty.

    setIsLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    try {
      // First, fetch the current weather to get basic data and coordinates.
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const weatherResponse = await fetch(currentWeatherUrl);
      if (!weatherResponse.ok) throw new Error('City not found. Please check the spelling.');
      const currentData = await weatherResponse.json();
      setWeatherData(currentData);

      // Next, use the coordinates from the first call to get a more accurate forecast.
      const { lat, lon } = currentData.coord;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastResult = await forecastResponse.json();
      // Filter the forecast list to get one data point per day (at noon).
      const dailyForecasts = forecastResult.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecastData(dailyForecasts);

      // Finally, update the recent searches list, ensuring no duplicates and limiting to 5 items.
      setRecentSearches(prevSearches => {
        const newSearches = [currentData.name, ...prevSearches.filter(c => c !== currentData.name)];
        const updatedSearches = newSearches.slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    } catch (error) {
      setError(error.message); // Store any errors to display to the user.
    } finally {
      setIsLoading(false); // Ensure the loading state is turned off after the fetch completes.
    }
  };

  // --- EVENT HANDLERS ---
  // Handles the form submission, preventing page reload and initiating the weather fetch.
  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchWeather(city);
    setIsSearchFocused(false);
  };

  // Handles clicks on a city from the recent searches list, triggering a new fetch.
  const handleRecentSearchClick = (searchCity) => {
    setCity(searchCity);
    fetchWeather(searchCity);
    setIsSearchFocused(false);
  };

  // Handles the input's blur event. A timeout is used to delay hiding the recent
  // searches list, allowing a click event on a search item to register first.
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 150);
  };

  // --- JSX RENDER ---
  return (
    <div className="weather-app">
      {/* Left panel contains the main display and mobile controls. */}
      <div className="left-panel">
        <h1 className="app-title">Weather App</h1>

        {/* The button to toggle between light and dark themes. */}
        <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
          {theme === 'light' ? '☽' : '☀︎'}
        </button>

        {/* This block contains controls that are primarily for the mobile layout. */}
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

          {/* Conditionally render recent searches below the input when it's focused. */}
          {isSearchFocused && (
            <RecentSearches
              recentSearches={recentSearches}
              onRecentSearchClick={handleRecentSearchClick}
            />
          )}
        </div>

        {/* This is the main area for displaying weather information. */}
        <div className="main-content-display">
          {/* Conditional rendering based on the application's state. */}
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

      {/* Right panel contains the search and recent searches for desktop layout. */}
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