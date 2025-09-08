// src/App.jsx
import './App.css';

function App() {
  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      {/* Search bar for city input */}
      <div className="search-bar">
        <input type="text" placeholder="Enter city name..." />
        <button>Search</button>
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