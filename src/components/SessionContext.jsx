import React from 'react'
import {Session, fetchSessionState} from '../modules/Session'

const SessionContext = React.createContext()

/**
 * Reducer function for modifying the session state.
 *
 * @param {object} state - The current session state.
 * @param {object} action - The action to take when modifying the state.
 * @param {string} action.type - The type of action to take.
 * @param {object} action.payload - The payload of the action.
 * @returns {object} The new session state.
 * @throws {Error} Will throw an error if the action type is not handled.
 */
function sessionReducer(state, action) {
    switch (action.type) {
    case 'update':
        return new Session({...state, ...action.payload})
    case 'sync':
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
    const [state, dispatch] = React.useReducer(sessionReducer, Session.restore() || Session.initialState)
    const value = {
        session: state,
        dispatchSession: dispatch,
        fetchSession: fetchSessionState,
    }
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

export { SessionProvider, useSession }
