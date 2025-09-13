// src/components/WeatherDisplay.jsx
import React from 'react';
import WeatherIcon from '../WeatherIcon'; // Reverted to use your original icon component

const WeatherDisplay = ({ weatherData }) => {
    if (!weatherData) return null;

    return (
        <div className="weather-display-grid">
            {/* Main info: Icon, Temp, Description */}
            <div className="main-temp-display">
                <WeatherIcon
                    iconCode={weatherData.weather[0].icon}
                    className="weather-icon-large"
                />
                <div className="temp-details">
                    <div className="temp-value">
                        {Math.round(weatherData.main.temp)}
                        <span className="temp-unit">°C</span>
                    </div>
                    <p className="weather-description">{weatherData.weather[0].description}</p>
                </div>
            </div>

            {/* City and detailed stats */}
            <div className="side-details">
                <h2 className="current-city-name">{weatherData.name}</h2>
                <div className="detail-item">
                    <p>Temperature</p>
                    <span>{Math.round(weatherData.main.temp)}°C</span>
                </div>
                <div className="detail-item">
                    <p>Humidity</p>
                    <span>{weatherData.main.humidity}%</span>
                </div>
                <div className="detail-item">
                    <p>Wind Speed</p>
                    <span>{weatherData.wind.speed} km/h</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherDisplay;