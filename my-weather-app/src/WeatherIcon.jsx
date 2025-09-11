// src/WeatherIcon.jsx
import React from 'react';
import {
    WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiShowers,
    WiRain, WiThunderstorm, WiSnow, WiFog, WiNightClear,
    WiNightCloudy, WiNightShowers, WiNightRain, WiNightThunderstorm,
    WiNightSnow, WiNightFog
} from 'react-icons/wi';

const WeatherIcon = ({ iconCode, className }) => {
    const iconMap = {
        '01d': <WiDaySunny />,
        '01n': <WiNightClear />,
        '02d': <WiDayCloudy />,
        '02n': <WiNightCloudy />,
        '03d': <WiCloud />,
        '03n': <WiCloud />,
        '04d': <WiCloudy />,
        '04n': <WiCloudy />,
        '09d': <WiShowers />,
        '09n': <WiNightShowers />,
        '10d': <WiRain />,
        '10n': <WiNightRain />,
        '11d': <WiThunderstorm />,
        '11n': <WiNightThunderstorm />,
        '13d': <WiSnow />,
        '13n': <WiNightSnow />,
        '50d': <WiFog />,
        '50n': <WiNightFog />,
    };

    // Select the icon from the map, or show a default if not found
    const icon = iconMap[iconCode] || <WiDaySunny />;

    // Clone the icon element to add the className
    return React.cloneElement(icon, { className });
};

export default WeatherIcon;