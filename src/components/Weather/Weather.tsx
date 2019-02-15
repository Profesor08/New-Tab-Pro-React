import React, { Component } from "react";
import "./weather.scss";
import { cache } from "../../lib/cache";
import icons from "./icons";
import Icon from "./Icon";

const openWeatherMapAPI = `6a3811c0c201a60032a60c243e832cf1`;

interface UrlParams {
  [key: string]: string | number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherForecast {
  list: WeatherForecastItem[];
}

interface WeatherForecaseItemMainInfo {
  grnd_level: number;
  humidity: number;
  pressure: number;
  sea_level: number;
  temp: number;
  temp_kf: number;
  temp_max: number;
  temp_min: number;
}

interface WeatherForecaseWeatherInfo {
  description: string;
  icon: string;
  id: number;
  main: string;
}

interface WeatherForecastItem {
  dt: number;
  dt_txt: string;
  main: WeatherForecaseItemMainInfo;
  weather: WeatherForecaseWeatherInfo[];
}

interface GeoPosition {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface WeatherInfo {
  weather: WeatherForecaseWeatherInfo[];
  main: WeatherMainInfo;
}

interface WeatherMainInfo {
  humidity: number;
  pressure: number;
  temp: number;
  temp_max: number;
  temp_min: number;
}

interface State {
  position: GeoPosition;
  weather: WeatherInfo;
  forecast: WeatherForecast;
  loaded: boolean;
}

interface Props {}

async function getJson(url: string, params: UrlParams = {}) {
  const query = Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");

  const response = await fetch(url + query);

  return await response.json();
}

async function getWeatherData(coords: Coordinates) {
  const language = navigator.language.substr(0, 2);

  const data = {
    lat: coords.latitude,
    lon: coords.longitude,
    num_of_days: 5,
    format: "json",
    units: "Metric",
    appid: openWeatherMapAPI,
    lang: language,
  };

  return {
    weather: await getJson(
      `http://api.openweathermap.org/data/2.5/weather?`,
      data,
    ),
    forecast: await getJson(
      `http://api.openweathermap.org/data/2.5/forecast?`,
      data,
    ),
  };
}

async function getSypexGeoPosition() {
  const { city, country } = await getJson("https://api.sypexgeo.net/json/");

  const language = navigator.language.substr(0, 2);

  return {
    latitude: city.lat,
    longitude: city.lon,
    city: city["name_" + language] ? city["name_" + language] : city["name_en"],
    country: country["name_" + language]
      ? country["name_" + language]
      : country["name_en"],
  };
}

async function getGeoPosition() {
  return await getSypexGeoPosition();
}

function getWeatherIcon(icon: string) {
  try {
    icon = icon.substr(0, 2);
  } catch (err) {
    return icons.sunny;
  }

  switch (icon) {
    case "01":
      return icons.sunny;
    case "02":
      return icons.mostlySunny;
    case "03":
      return icons.mostlyCloudy;
    case "04":
      return icons.cloudyDay;
    case "09":
      return icons.showersDay;
    case "10":
      return icons.scatteredShowersDay;
    case "11":
      return icons.isolatedStormsDay;
    case "13":
      return icons.snowShowersDay;
    case "50":
      return icons.mist;
    default:
      return icons.partlyCloudy;
  }
}

class Weather extends Component<Props, State> {
  icon: React.RefObject<HTMLElement>;

  constructor(props: Props) {
    super(props);

    this.icon = React.createRef();
  }

  componentDidMount = async () => {
    let position = await cache("geoPosition", async () => {
      return await getGeoPosition();
    });

    let { weather, forecast } = await cache("weatherData", async () => {
      return await getWeatherData(position);
    });

    this.setState({
      position,
      weather,
      forecast,
      loaded: true,
    });
  };

  render() {
    if (this.state && this.state.loaded) {
      let forecast = this.state.forecast.list

        .filter((weather: WeatherForecastItem) => {
          let arr = weather.dt_txt.split(/\s+/);

          return arr[1] === "00:00:00";
        })

        .map(weather => {
          let day = new Date(weather.dt * 1000).toLocaleDateString(
            window.navigator.language,
            {
              weekday: "short",
            },
          );

          return {
            temperature: Math.floor(weather.main.temp),
            weather: weather.weather[0].description,
            icon: weather.weather[0].icon,
            day: day,
          };
        });

      return (
        <div className="weather-widget">
          <div className="current-weather">
            <div className="location">
              {this.state.position.city}, {this.state.position.country}
            </div>
            <div className="info-wrapper">
              <Icon
                animationData={getWeatherIcon(
                  this.state.weather.weather[0].icon,
                )}
              />
              <div className="info">
                <div className="description">
                  {this.state.weather.weather[0].description}
                </div>
                <div className="temperature">
                  {this.state.weather.main.temp}°
                </div>
              </div>
            </div>
          </div>
          <div className="weather-forecast">
            {forecast.map((weather, index: number) => {
              return (
                <div key={index} className="day-weather">
                  <div className="day">{weather.day}</div>
                  <Icon animationData={getWeatherIcon(weather.icon)} />
                  <div className="temperature">{weather.temperature}°</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="weather">
        <div className="location">...</div>
      </div>
    );
  }
}

export default Weather;
