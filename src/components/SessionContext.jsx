import React from 'react'
import {fetchWeather, initialWeatherState} from '../services/Weather'

const parseObject = json => {
  try {
    const result = JSON.parse(json)
    if (typeof result === 'object') {
      return result
    }
  } catch (error) {
    // Ignore.
  }
}

/**
 * Create a new Session state object.
 *
 * @param {object|string} [props] - The session properties as an object or as JSON.
 * @param {object[]} [props.choices] - Choices made during the session.
 * @param {object} [props.weather] - Weather data for the session.
 * @returns {object} The new session state.
 */
const Session = function(props) {
  if (typeof props === 'string') {
    props = parseObject(props)
  }
  const state = {...this.initialState, ...props}
  localStorage.setItem(this.key, JSON.stringify(state))
  return state
}
Session.key = 'Session'
Session.initialState = {
  choices: [],
  weather: initialWeatherState,
}
Session.Restore = function() {
  const state = this.initialState
  try {
    let stored = localStorage.getItem(this.key)
    if (stored !== null && stored.length) {
      stored = JSON.parse(stored)
      if (typeof stored === 'object') {
        Object.assign(state, stored)
      }
    }
  } catch (error) {
    // Ignore storage due to parsing error.
  }
  return state
}
Session.RestoreAsync = async function(state) {
  state.weather = await fetchWeather()
}

/**
 * HTTP requests related to the Session.
 */
const SessionClient = {
  updateSession: function(session, updates) {
    return Promise.resolve({ ...session, ...updates })
  },
}

const SessionContext = React.createContext()

/**
 * Reducer function for modifying the session state.
 *
 * @param {object} state - The current session state.
 * @param {object} action - The action to take when modifying the state.
 * @param {string} action.type - The type of action to take.
 * @param {object} action.payload - The payload of the action.
 * @returns {object} The new session state.
 */
function sessionReducer(state, action) {
  switch (action.type) {
  case 'update':
    return new Session({...state, ...action.payload})
  case 'reset':
    return new Session({})
  default:
    throw new Error(`Unhandled action type: ${action.type}`)
  }
}

/**
 * The SessionProvider component.
 *
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child node(s) to render.
 * @returns {React.ReactElement} The SessionProvider component.
 * @example
 * ```
 * <SessionProvider>
 *   <YourComponent />
 * </SessionProvider>
 * ```
 */
function SessionProvider({ children }) {
  const [state, dispatch] = React.useReducer(sessionReducer, Session.Restore())
  const value = { session: state, dispatchSession: dispatch }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

/**
 * A hook for consuming the session context.
 *
 * @returns {object|undefined} The session context.
 * @throws {Error} Will throw an error if the hook is used outside of a SessionProvider.
 * @example
 * ```
 * function YourComponent() {
 *   const {session, dispatchSession} = useSession();
 * }
 * ```
 */
function useSession() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

/**
 * A hook for updating the session asynchronously.
 *
 * @param {Function} dispatch - The dispatch function from the useSession hook.
 * @param {object} session - The current session state.
 * @param {any} updates - The updates to apply to the session.
 * @example `const [{session, status, error}, sessionDispatch] = useSession();`
 */
async function updateSession(dispatch, session, updates) {
  dispatch({ type: 'start update', payload: updates })
  try {
    const updatedSession = await SessionClient.updateSession(session, updates)
    dispatch({ type: 'finish update', payload: updatedSession })
  } catch (error) {
    dispatch({ type: 'fail update', payload: error })
  }
}

export { SessionProvider, useSession, updateSession }
