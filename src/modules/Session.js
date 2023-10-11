/**
 * Application session state module.
 *
 * @module Session
 * @author Zachary K. Watkins
 * @version 1.0.0
 * @license MIT
 */
import {fetchWeather} from '../services/Weather'

/**
 * Create a new Session state object.
 *
 * @param {object} [props] - The session state.
 * @param {Array} [props.choices] - The session choices.
 * @param {object} [props.weather] - The session weather.
 */
export const Session = function({ choices, weather }) {
    const initialState = {
        choices: choices || [],
        weather: weather || {},
    }
    Object.assign(this, initialState)
    this.getInitialState = () => initialState
    this.fetchAsyncState = async () => this.weather = await fetchWeather(this.weather)

    localStorage.setItem(Session.key, JSON.stringify(this))
    this.fetchAsyncState().then(() => localStorage.setItem(Session.key, JSON.stringify(this)))
}
Session.key = 'Session'
Session.restore = () => {
    if (!localStorage[Session.key]) {
        return new Session({})
    }
    return new Session(JSON.parse(localStorage.getItem(Session.key)))
}

export default Session
