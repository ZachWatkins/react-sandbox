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

/**
 * @typedef {object} PointsResponseItem
 * @property {object} properties - The properties of the point.
 * @property {object} properties.relativeLocation - The relative location of the point.
 * @property {object} properties.relativeLocation.geometry - The geometry of the relative location.
 * @property {number[]} properties.relativeLocation.geometry.coordinates - The latitude and longitude of the relative location.
 * @property {string} properties.gridId - The grid ID of the point.
 * @property {number} properties.gridX - The grid X coordinate of the point.
 * @property {number} properties.gridY - The grid Y coordinate of the point.
 */

/**
 * A point on the map.
 *
 * @param {object} properties - The properties of the point.
 * @param {object} properties.relativeLocation - The relative location of the point.
 * @param {number} properties.gridId - The grid ID of the point.
 * @param {number} properties.gridX - The grid X coordinate of the point.
 * @param {number} properties.gridY - The grid Y coordinate of the point.
 * @param {string} properties.forecast - The URL of the forecast for the point.
 */
const Point = function({relativeLocation, gridId, gridX, gridY, forecast}) {
    if (relativeLocation) {
        this.latitude = relativeLocation.geometry.coordinates[0]
        this.longitude = relativeLocation.geometry.coordinates[1]
    }
    this.gridId = gridId // Office.
    this.gridX = gridX
    this.gridY = gridY
    this.forecastURL = forecast
}
Point.url = (latitude, longitude) => `${API.url}/points/${latitude},${longitude}`

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

export const getWeather = (pointResponse, forecastResponse) => {
    return {
        /** @type {Point} */
        point: new Point(pointResponse),
        /** @type {ForecastPeriod} */
        forecastTonight: new ForecastPeriod(forecastResponse.properties.periods[0]),
        /** @type {string} */
        updated: forecastResponse.properties.updated,
    }
}
getWeather.initialState = {
    latitude: 39.7456,
    longitude: -97.0892,
    point: new Point({}),
    forecastTonight: new ForecastPeriod({}),
    updated: '',
}

/**
 * Get the weather for a latitude and longitude in the United States in degrees farenheit.
 *
 * @function FetchForecast
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<number>} A promise that resolves to the temperature in degrees Celsius.
 */
export const fetchWeather = async ({latitude, longitude}) => {
    if (!latitude && !longitude) {
        latitude = API.demo.latitude
        longitude = API.demo.longitude
    }
    const pointResponse = await fetch(Point.url(latitude, longitude))
        .then(response => response.json())

    const forecastResponse = await fetch(pointResponse.properties.forecast)
        .then(response => response.json())

    console.log(pointResponse, forecastResponse)
    console.log('getWeather', getWeather(pointResponse, forecastResponse))

    return getWeather(pointResponse, forecastResponse)
}
fetchWeather.initialState = {...getWeather.initialState}

export default {fetchWeather}
