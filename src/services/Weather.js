/**
 * A service for getting weather data.
 *
 * @file Weather.js
 * @author Zachary K. Watkins
 * @version 1.0.0
 * @license MIT
 * @see
 * https://www.weather.gov/documentation/services-web-api
 */
const API = {
  url: 'https://api.weather.gov',
  demo: {
    latitude: 39.7456,
    longitude: -97.0892,
  },
}

export const initialWeatherState = {
  latitude: NaN,
  longitude: NaN,
}

/**
 * A point on the map.
 *
 * @typedef {object} Point
 * @param {object} response - The response object of an API call for the point.
 * @param {object} response.properties - The properties of the point.
 * @param {object} response.properties.relativeLocation - The relative location of the point.
 * @param {object} response.properties.relativeLocation.geometry - The geometry of the relative location.
 * @param {number[]} response.properties.relativeLocation.geometry.coordinates - The latitude and longitude of the relative location.
 * @param {string} response.properties.gridId - The grid ID of the point.
 * @param {number} response.properties.gridX - The grid X coordinate of the point.
 * @param {number} response.properties.gridY - The grid Y coordinate of the point.
 * @property {number} latitude - The latitude of the point.
 * @property {number} longitude - The longitude of the point.
 * @property {string} gridId - The grid ID of the point.
 * @property {number} gridX - The grid X coordinate of the point.
 * @property {number} gridY - The grid Y coordinate of the point.
 * @property {string} forecastURL - The URL of the forecast for the point.
 */
const Point = function({properties}) {
  this.latitude = properties.relativeLocation.geometry.coordinates[0]
  this.longitude = properties.relativeLocation.geometry.coordinates[1]
  this.gridId = properties.gridId // Office.
  this.gridX = properties.gridX
  this.gridY = properties.gridY
  this.forecastURL = properties.forecast
}
Point.url = function(latitude, longitude) {
  return `${API.url}/points/${latitude},${longitude}`
}

/**
 * A forecast period.
 *
 * @typedef {object} ForecastPeriod
 * @param {object} period - A period object in the forecast API response properties.
 * @param {string} period.name - The name of the period.
 * @param {number} period.temperature - The temperature of the period.
 * @param {string} period.temperatureUnit - The unit of the temperature.
 * @param {string} period.icon - The icon of the period.
 * @param {string} period.shortForecast - The short forecast of the period.
 * @param {string} period.detailedForecast - The detailed forecast of the period.
 * @property {number} temperature - The temperature of the period.
 * @property {string} temperatureUnit - The unit of the temperature.
 * @property {string} name - The name of the period.
 * @property {string} icon - The icon of the period.
 * @property {string} shortForecast - The short forecast of the period.
 * @property {string} detailedForecast - The detailed forecast of the period.
 */
const ForecastPeriod = function(period) {
  this.name = period.name
  this.temperature = period.temperature
  this.temperatureUnit = period.temperatureUnit
  this.icon = period.icon
  this.shortForecast = period.shortForecast
  this.detailedForecast = period.detailedForecast
}

const Weather = (pointResponse, forecastResponse) => {
  const point = new Point(pointResponse)
  const forecastTonight = new ForecastPeriod(forecastResponse.properties.periods[0])
  return {
    updated: forecastResponse.properties.updated,
    ...point,
    ...forecastTonight,
  }
}

/**
 * Get the weather for a latitude and longitude in the United States in degrees farenheit.
 *
 * @function FetchForecast
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<number>} A promise that resolves to the temperature in degrees Celsius.
 */
export const fetchWeather = async (latitude, longitude) => {
  if (!latitude && !longitude) {
    latitude = API.demo.latitude
    longitude = API.demo.longitude
  }
  const pointURL = Point.url(latitude, longitude)
  const pointResponse = await fetch(pointURL).then(response => response.json())
  const forecastResponse = await fetch(pointResponse.properties.forecast).then(response => response.json())
  return new Weather(pointResponse, forecastResponse)
}

export default {fetchWeather, initialWeatherState}
