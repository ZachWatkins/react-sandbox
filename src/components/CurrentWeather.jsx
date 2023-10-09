import React from 'react'
import { useSession } from './SessionContext'

let renders = 0

/**
 * The CurrentWeather component visualizes weather data stored in the Session state.
 *
 * @returns {React.ReactElement} The CurrentWeather component.
 */
export function CurrentWeather() {
    const { session, dispatchSession, fetchSession } = useSession()
    const sessionString = JSON.stringify(session, null, 2)
    renders++
    return (
        <>
            <p>Renders: {renders}</p>
            <pre style={{textAlign: 'left'}}>{sessionString}</pre>
            <button
                type="button"
                onClick={async () => fetchSession(session)
                    .then((freshSession) => dispatchSession({type: 'update', payload: freshSession}))
                }
            >
                Update
            </button>
        </>
    )
}

export default CurrentWeather
