/**
 * Render an input field component.
 *
 * @param {object} options
 * @param {string} options.label
 * @param {string} options.name
 * @param {string|undefined} options.error
 * @returns
 */
export function Input ({ label, name, error, ...props }) {
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} {...props} />
            {error ? <span role="alert">{error}</span> : null}
        </>
    )
}
