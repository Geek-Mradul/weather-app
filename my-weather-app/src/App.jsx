// src/App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState(''); // State for the input field
  const [weatherData, setWeatherData] = useState(null); // State for the API response
  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      // For today, we just want to see the data
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      {/* Search bar for city input */}
      <div className="search-bar">
        <input type="text"
          placeholder="Enter city name..."
          value={city} // The input's value is now controlled by our 'city' state
          onChange={(e) => setCity(e.target.value)} // When the user types, update the 'city' state
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Section to display weather data */}
      <div className="weather-display">
        <h2>Weather in Hyderabad</h2>
        <p>☀️ Clear Sky</p> {/* Placeholder for description and icon */}

        <div className="weather-details">
          <div>
            <p>Temperature</p>
            <span>28°C</span> {/* Placeholder for temperature */}
          </div>
          <div>
            <p>Humidity</p>
            <span>74%</span> {/* Placeholder for humidity */}
          </div>
          <div>
            <p>Wind Speed</p>
            <span>10 km/h</span> {/* Placeholder for wind speed */}
          </div>
        </div>
      </div>

      {/* Section for recent searches list */}
      <div className="recent-searches">
        <h3>Recent Searches</h3>
        <ul>
          <li>Mumbai</li>
          <li>Delhi</li>
          <li>Bangalore</li>
        </ul>
      </div>
    </div>
  );
}

export default App;