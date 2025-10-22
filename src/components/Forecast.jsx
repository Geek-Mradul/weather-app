// src/components/Forecast.jsx
import React from 'react';
import WeatherIcon from '../WeatherIcon';

const Forecast = ({ forecastData }) => {
    // Helper function to get the day of the week from a date string
    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast-cards">
                {forecastData.map((day, index) => (
                    <div key={index} className="forecast-card">
                        <p className="forecast-day">{getDayOfWeek(day.dt_txt)}</p>
                        <WeatherIcon
                            iconCode={day.weather[0].icon}
                            className="forecast-icon"
                        />
                        <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;