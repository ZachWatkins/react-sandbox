/**
 * Helper function to get the resolved type of a value.
 *
 * @param {any} value - The value to test.
 * @returns {string} The type of the value.
 */
function typeOf(value) {
    const result = typeof value
    if ('object' !== result) return result
    const return_value = Object.prototype.toString.call(value)
    return return_value
        .substring(return_value.indexOf(' ') + 1, return_value.indexOf(']'))
        .toLowerCase()
}

/**
 * Check type of value against allow list.
 *
 * @param  {any}       value   - The value to test.
 * @param  {...string} allowed - The allowed types.
 * @returns {boolean} True if the type is allowed.
 */
export function typeIs(value, ...allowed) {
    return 0 > allowed.indexOf(typeOf(value)) ? false : true
}

/**
 * Return a new object having the given key values of the target.
 *
 * @param {any}   data   - The source of returned values.
 * @param {any[]} select - One or more values.
 * @returns {object} A new object with the selected values.
 */
export function reduce(data, select) {
    return select.reduce(function (previousValue, key) {
        previousValue[key] = data[key]
        return previousValue
    }, {})
}

/**
 * Assign key values between objects if types match.
 *
 * @param {object}  target  - The object to modify.
 * @param {object}  source  - The values assigned.
 */
export function typedAssign(target, source) {
    if (undefined === source) return
    const keys = Object.keys(target)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = source[key]
        if (typeOf(target[key]) === typeOf(value)) {
            target[key] = value
        }
    }
}

/**
 * Assign key values between objects if types match.
 *
 * @param {object}  target  - The object to modify.
 * @param {object}  source  - The values assigned.
 */
export function typedCopy(target, source) {
    if (undefined === source) return
    const keys = Object.keys(target)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = source[key]
        if (typeOf(target[key]) === typeOf(value)) {
            target[key] = value
        }
    }
}

/**
 * Apply object properties from a source to a destination in a nested way, limited to 4 levels of properties.
 *
 * @param {object} source  - An object with values to copy.
 * @param {object} dest    - An object to receive values.
 * @param {number} [depth] - The depth of properties handled in the previous call.
 * @returns {object} The destination object.
 */
export function applyPropsRecursive(source, dest, depth) {
    depth = undefined === depth ? 0 : depth + 1
    if (depth > 3) return source
    const keys = Object.keys(source)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = source[key]
        if (typeof value !== 'object' || Array.isArray(value)) {
            dest[key] = source[key]
        } else {
            applyPropsRecursive(source[key], dest[key], depth)
        }
    }
    return dest
}

/**
 * Clone an object, ignoring its function properties and others in an ignore list.
 *
 * @param  {object}   obj    - The object to clone.
 * @param  {string[]} ignore - One or more properties to ignore.
 * @returns {object} A new object with the same properties as the source.
 */
export function copyReducedObject(obj, ignore) {
    if (!ignore) ignore = []
    const shape = {}
    for (const prop in obj) {
        if (
            typeof obj[prop] !== 'function' &&
      (!ignore.length || 0 > ignore.indexOf(prop))
        ) {
            shape[prop] = undefined
        }
    }
    return shape
}

/**
 * Get an array of method names for a given object.
 *
 * @param {object} source - The object to evaluate.
 * @returns {string[]} An array of method names.
 */
export function listMethods(source) {
    return Object.keys(source).filter(function (key) {
        return typeof source[key] === 'function'
    })
}

/**
 * Get an array of property names for a given object.
 *
 * @param {object} target - The object to evaluate.
 * @param {object} source - The object to evaluate.
 * @returns {string[]} An array of property names.
 */
export function listProperties(target, source) {
    return Object.keys(source).filter(function (key) {
        return typeof source[key] !== 'function'
    })
}

/**
 * Create an object containing `[method]: true` key values for target object's methods.
 *
 * @param {object}   target - The method source.
 * @param {string[]} props  - The property names to evaluate. If undefined, evaluates all own properties.
 * @returns {object} An object containing `[method]: true` key values.
 */
export function methodsObject(target, props) {
    const results = {}
    for (let index = 0; index < props.length; index++) {
        const prop = props[index]
        if (typeof target[prop] === 'function') {
            results[prop] = true
        }
    }
    return results
}

/**
 * Create an object containing `[property]: true` key values for target object's properties.
 *
 * @param {object} source - The property source.
 * @param {string} tag - The property name to evaluate.
 * @returns {boolean} True if the type is allowed.
 */
export function matched(source, tag) {
    return this[tag] === source[tag]
}

/**
 * Create an object containing `[property]: true` key values for target object's properties.
 *
 * @param {object} source - The property source.
 * @param {string} tag - The property name to evaluate.
 * @returns {boolean} True if the type is allowed.
 */
function unmatched(source, tag) {
    return this[tag] !== source[tag]
}
/**
 * Assign a property to this object using a source object and property name.
 *
 * @param {object} source - The property source.
 * @param {string} tag - The property name to evaluate.
 */
function tag(source, tag) {
    this[tag] = source[tag]
}

/**
 * Apply object properties from a source to a destination.
 *
 * @param {object} source - An object with values to copy.
 * @param {object} item - An object to receive values.
 */
export function applyTags(source, item) {
    source.filter(unmatched, item).forEach(tag, item)
}

/**
 * Conditionally apply tags from a source object to an item using a condition.
 *
 * @param {object} source - An object with values to copy.
 * @param {Function} condition - A function that returns true if the tags should be applied.
 * @param {object} item - An object to receive values.
 */
export function applyTagsIf(source, condition, item) {
    if (condition(item, source)) {
        source.filter(unmatched, item).forEach(tag, item)
    }
}

/**
 * Evaluate presence of object properties deeply.
 *
 * @param {any} full - Value taken from the full set of properties.
 * @param {any} sparse - Value taken from the sparse set of properties.
 * @returns {boolean} True if any property used, false otherwise.
 */
export function objectsShareOnePrimitiveRecursive(full, sparse) {
    const keys = Object.getOwnPropertyNames(full)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (typeof sparse[key] === 'object') {
            return objectsShareOnePrimitiveRecursive(full[key], sparse[key])
        } else if (sparse[key]) {
            return true
        }
    }
    return false
}

/**
 * Clone object properties deeply.
 *
 * @param {any} source - An object with values to copy.
 * @returns {any | object} A new object with the same properties as the source.
 */
export function cloneObjectRecursive(source) {
    const type = {}.toString.call(source).slice(8, -1)
    if (type !== 'Array' && type !== 'Object') {
        return source
    }
    if (type === 'Set') {
        return new Set([...source].map(value => cloneObjectRecursive(value)))
    }
    if (type === 'Map') {
        return new Map(
            [...source].map(kv => [
                cloneObjectRecursive(kv[0]),
                cloneObjectRecursive(kv[1]),
            ]),
        )
    }
    if (type === 'Date') {
        return new Date(source.getTime())
    }
    let dest = {}
    dest = Array.isArray(source) ? [] : {}
    for (var key in source) {
        dest[key] = cloneObjectRecursive(source[key])
    }
    return dest
}
