import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
    cleanup()
})

/**
 * Custom render function to wrap providers.
 *
 * @param {any} ui - The UI to render.
 * @param {object} [options] - The options to pass to the render function.
 * @returns {object} The render result.
 */
function customRender (ui, options = {}) {
    return render(ui, {
    // wrap provider(s) here if needed
        wrapper: ({ children }) => children,
        ...options,
    })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
