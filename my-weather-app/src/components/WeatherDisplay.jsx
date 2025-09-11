import React from 'react';
import WeatherIcon from '../WeatherIcon'; // Note the path is now '../WeatherIcon'

const WeatherDisplay = ({ weatherData }) => {
    return (
        <div className="weather-display">
            <h2>{weatherData.name}</h2>
            <WeatherIcon
                iconCode={weatherData.weather[0].icon}
                className="weather-icon"
            />
            <p className="weather-description">{weatherData.weather[0].description}</p>
            <div className="weather-details">
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