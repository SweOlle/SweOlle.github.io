import { useState, useEffect } from 'react';
import './WeatherApp.css';

function WeatherApp() {
    const [query, setQuery] = useState('');
    const [cityList, setCityList] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = "78952acfa0f927fb170c5fef0b17bca5";
    let lat = 59.3194903
    let lon = 18.075060000000007

    useEffect(() => {
        if (cityList && cityList.length > 0) {
          // If there are matching cities, get weather data for the first one
          const city = cityList[0];
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => setWeatherData(data));
        }
    }, [cityList]);

    const handleSearch = () => {
        fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => setCityList(data.list.slice(0, 5)));
    };

    const handleCityClick = (city) => {
        setQuery('');
        setCityList(null);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => setWeatherData(data));
    };

    return (
        <div className="weather-app">
          <div className="search-bar">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter a city name" />
            <button onClick={handleSearch}>Search</button>
          </div>
          {cityList && cityList.length > 0 ? (
            <ul className="city-list">
              {cityList.map(city => (
                <li key={city.id} onClick={() => handleCityClick(city)}>
                  {city.name}, {city.sys.country}
                </li>
              ))}
            </ul>
          ) : null}
          {weatherData ? (
            <>
              <h1>{weatherData.name}</h1>
              <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
            </>
          ) : (
            <div>No weather data available</div>
          )}
        </div>
      );
}

export default WeatherApp;