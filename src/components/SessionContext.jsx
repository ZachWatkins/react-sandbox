import React from 'react'

const DEFAULT_SESSION = { collections: {} }
const parseStoredObject = function(key, initial = '{}') {
  try {
    return JSON.parse(localStorage.getItem(key) || initial)
  } catch (error) {
    return JSON.parse(initial)
  }
}
const sessionClient = {
  updateSession: function(session, updates) {
    return Promise.resolve({ ...session, ...updates })
  },
}

/**
 * Create a new Session state object.
 *
 * @param {object} [props] - The session properties as JSON or an object.
 */
function Session(props) {
  if (props === undefined) {
    props = parseStoredObject(this.name)
  }
  Object.assign(this, props)
  localStorage.setItem(this.name, JSON.stringify(this))
}
Session.prototype = DEFAULT_SESSION

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
    return new Session(Object.assign(state, action.payload))
  case 'reset':
    return new Session(DEFAULT_SESSION)
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
  const [state, dispatch] = React.useReducer(sessionReducer, DEFAULT_SESSION)
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
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
  dispatch({ type: 'update:start', payload: updates })
  try {
    const updatedSession = await sessionClient.updateSession(session, updates)
    dispatch({ type: 'update:finish', payload: updatedSession })
  } catch (error) {
    dispatch({ type: 'update:error', payload: error })
  }
}

export { SessionProvider, useSession, updateSession }
