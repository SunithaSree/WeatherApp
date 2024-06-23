import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import Clear from "./assests/clear.png";
import Cloudy from "./assests/cloudy.jpg";
import Drizzle from "./assests/drizzle.jpg";
import Humidity from "./assests/humidity.png";
import Rain from "./assests/rain.png";
import Search from "./assests/search.jpg";
import Windy from "./assests/windy.jpg";
import Snow from "./assests/snow.jpg";
const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  latitude,
  longitude,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather image"></img>
      </div>
      <div className="temperature">{temp} celcius</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="coordinates">
        <div>
          <span className="latitude">latitude</span>
          <span>{latitude}</span>
        </div>
        <div>
          <span className="longitude">longitude</span>
          <span>{longitude}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={Humidity} alt="humidity" className="icon"></img>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={Windy} alt="windy" className="icon"></img>
          <div className="data">
            <div className="wind-percent">{wind}km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = "304555ba5e1e7485a1ff3ad9c5df0495";
  const [text, setText] = useState("Coimbatore");
  const [icon, setIcon] = useState(Clear);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  // check variables
  const [cityNotFound, setCityNotFound] = new useState(false);
  const [loading, setLoading] = new useState(false);
  const [error, SetError] = useState(null);
  //  for icons-openweather weather conditions
  const weatherIconMap = {
    "01d": Clear,
    "01n": Clear,
    "02d": Cloudy,
    "02n": Cloudy,
    "03d": Drizzle,
    "03n": Drizzle,
    "04d": Drizzle,
    "04n": Drizzle,
    "09d": Rain,
    "10d": Rain,
    "10n": Rain,
    "13d": Snow,
    "13n": Snow,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let result = await fetch(url);
      //to convert readable stream to json
      let data = await result.json();
      // console.log(data);
      if (data.cod === "404") {
        setCityNotFound(true);
        console.log("City not found");
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      const weatherIcon = data.weather[0].icon;
      // by default clear icon
      setIcon(weatherIconMap[weatherIcon] || Clear);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      SetError("An error occured while fetching data");
    } finally {
      setLoading(false);
    }
  };
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  // to mount default city value while starting the app
  useEffect(function () {
    search();
  }, []);
  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div
          className="search-icon"
          onClick={() => {
            search();
          }}
        >
          <img src={Search} alt="search icon" height="30" width="30"></img>
        </div>
      </div>
      {loading && <div className="loading-message">Loading...</div>}{" "}
      {error && <div className="error-message">{error}</div>}{" "}
      {cityNotFound && <div className="city-not-found">City not found</div>}
      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          latitude={latitude}
          longitude={longitude}
          humidity={humidity}
          wind={wind}
        />
      )}
      <p className="copyright">
        Designed by <span>Sunitha Sree</span>
      </p>
    </div>
  );
}

export default App;
