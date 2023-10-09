/**
 * Application session state module.
 *
 * @module Session
 * @author Zachary K. Watkins
 * @version 1.0.0
 * @license MIT
 */
import {fetchWeather} from '../services/Weather'
const KEY = 'Session'
const INITIAL_STATE = {
    choices: [],
    weather: fetchWeather.initialState,
}
export const fetchSessionState = async (state) => {
    const newWeather = await fetchWeather(state.weather)
    console.log('new state', {...state, weather: newWeather})
    return {...state, weather: {...newWeather}}
}

// You do not need to edit below this line to modify the tracked session state properties.

/**
 * Parse a JSON string as an object or return undefined.
 *
 * @param {string} [json] - The JSON string to parse.
 * @returns {object|undefined} The parsed object or undefined.
 */
const parseObjectOrIgnore = json => {
    try {
        const result = JSON.parse(json)
        if (typeof result === 'object') {
            return result
        }
    } catch (error) {
    // Ignore.
    }
}

const mergePropsRecursive = (props, defaults) => {
    const result = {}
    for (const key in defaults) {
        if (typeof defaults[key] === 'object') {
            result[key] = mergePropsRecursive(props[key], defaults[key])
        } else {
            result[key] = props[key]
        }
    }
    return result
}

/**
 * Selects the session state from an object or a JSON version of an object.
 * Returns an object merged from the default session state and the given properties.
 *
 * @param {object|string} [props] - The object or JSON version of an object.
 * @returns {object} The session state.
 */
const State = function(props = null) {
    if (props === null) {
        props = localStorage.getItem(KEY)
        if (props === null) {
            return {...INITIAL_STATE}
        }
    }

    if (typeof props === 'string') {
        props = parseObjectOrIgnore(props)
    }

    return mergePropsRecursive(props, INITIAL_STATE)
}

/**
 * Create a new Session state object.
 *
 * @param {object|string|null} [props] - The session state as an object or a JSON object string. If null then the session is restored from localStorage.
 */
export const Session = function(props) {
    const initialState = State(props)
    console.log('New Session state', initialState)
    this.getInitialState = () => initialState
    Object.assign(this, initialState)
    localStorage.setItem(KEY, JSON.stringify(this))
    if (!props) {
        fetchSessionState(this).then(() => localStorage.setItem(KEY, JSON.stringify(this)))
    }
}
Session.restore = () => new Session()

export default Session
