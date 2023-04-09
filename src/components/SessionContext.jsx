import React from 'react'

const DEFAULT_SESSION = { color: 'blue', items: [] }

const SessionContext = React.createContext()
const A = false

const sessionClient = {
  updateSession(session, updates) {
    return Promise.resolve({ ...session, ...updates })
  },
}

/**
 *
 * @param state
 * @param action
 */
function sessionReducer(state, action) {
  switch (action.type) {
  case 'update':
    return { ...state, ...action.payload }
  default:
    throw new Error(`Unhandled action type: ${action.type}`)
  }
}

/**
 * @param root0
 * @param root0.children
 * @example
 *
 * ```
 * <SessionProvider>
 *     <MyComponent />
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
 * @example
 *
 * ```
 * function YourComponent() {
 *     const {session, dispatchSession} = useSession();
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
 * @param dispatch
 * @param session
 * @param updates
 * @example `const [{session, status, error}, sessionDispatch] = useSession();`
 */
async function updateSession(dispatch, session, updates) {
  dispatch({ type: 'start update', updates })
  try {
    const updatedSession = await sessionClient.updateSession(session, updates)
    dispatch({ type: 'finish update', updatedSession })
  } catch (error) {
    dispatch({ type: 'fail update', error })
  }
}

export { SessionProvider, useSession, updateSession }
