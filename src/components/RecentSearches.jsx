import React from 'react';

const RecentSearches = ({ recentSearches, onRecentSearchClick }) => {
    return (
        <div className="recent-searches">
            <h3>Recent Searches</h3>
            <ul>
                {recentSearches.map((searchCity, index) => (
                    <li key={index} onClick={() => onRecentSearchClick(searchCity)}>
                        {searchCity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentSearches;