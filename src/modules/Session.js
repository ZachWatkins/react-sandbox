/**
 * Application session state module.
 *
 * @module Session
 * @author Zachary K. Watkins
 * @version 1.0.0
 * @license MIT
 */
import {fetchWeather} from '../services/Weather'
const Key = 'Session'
const SessionState = {
    choices: [],
    weather: fetchWeather.initialState,
}
const toJSON = state => {
    return {
        choices: state.choices,
    }
}
const applyAsyncState = async (state) => {
    state.weather = await fetchWeather(state.weather)
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

const mergeValidPropsRecursive = (props, defaults) => {
    const result = {}
    for (const key in defaults) {
        if (typeof defaults[key] === 'object') {
            result[key] = mergeValidPropsRecursive(props[key], defaults[key])
        } else {
            result[key] = typeof props[key] === typeof defaults[key]
                ? props[key]
                : defaults[key]
        }
    }
    return result
}

const fromJSON = json => {
    const state = parseObjectOrIgnore(json)
    if (state === undefined) return SessionState
    return mergeValidPropsRecursive(state, SessionState)
}

/**
 * Selects the session state from an object or a JSON version of an object.
 * Returns an object merged from the default session state and the given properties.
 *
 * @param {object|string} [props] - The object or JSON version of an object.
 * @returns {object} The session state.
 */
const State = function(props) {
    if (props === null) {
        props = localStorage.getItem(Key)
        if (props === null) {
            return {...SessionState}
        }
    }
    if (typeof props === 'string') props = parseObjectOrIgnore(props)
    if (typeof props !== 'object') return SessionState
    return mergeValidPropsRecursive(props, SessionState)
}

/**
 * Create a new Session state object.
 *
 * @param {object|string|null} [props] - The session state as an object or a JSON object string. If null then the session is restored from localStorage.
 */
export const Session = function(props) {
    Object.assign(this, State(props))
    localStorage.setItem(Key, JSON.stringify(toJSON(this)))
}
Session.prototype = {
    ...SessionState,
    sync: async function() {
        await applyAsyncState(this)
    },
}

export default Session
