/**
 * A module for safely interacting with LocalStorage.
 *
 * @author Zachary K. Watkins, <watkinza@gmail.com>
 */

/**
 * Construct a new localStorage item interface.
 *
 * @param {string} key
 */
export function LocalStorageItem(key = '') {
    const state = {
        key: String(key),
        full: false,
        bytes: 0,
    }
    Object.defineProperties(this, {
        key: {
            get: () => state.key,
        },
        full: {
            get: () => state.full,
        },
        bytes: {
            get: () => state.bytes,
        },
    })
    this.setState = (key, value) => state[key] = value
}
LocalStorageItem.prototype = {
    /**
     * Retrieve an object property identified by a key.
     *
     * @returns {string|null} The value of the item, or null if the item does not exist.
     */
    get: function() {
        return localStorage.getItem(this.key)
    },
    /**
     * Retrieve the item from localStorage and parse it be,fore returning the valid.
     *
     * @returns {any|null} The value of the item, or null if the item does not exist.
     */
    getParsed: function() {
        const item = this.get()
        if (null === item) {
            return item
        }
        try {
            return JSON.parse(item)
        } catch (error) {
            return error
        }
    },
    /**
     * Store an object property identified by a key.
     *
     * @param   {any} value - The value to store.
     * @returns {true|Error} True if the value was set, or a DOMException if the
     * @throws  {Error} DOMException exception of type `QuotaExceededError` if the new
     *          value couldn't be set. (Setting could fail if, e.g., the user has
     *          disabled storage for the site, or if the quota has been exceeded.)
     *          Dispatches a StorageEvent on Window objects holding an equivalent
     *          Storage object.
     */
    set: function(value) {
        if (this.full) {
            return this.full
        }
        try {
            if (typeof value !== 'string') {
                localStorage.setItem(key, JSON.stringify(value))
            } else {
                localStorage.setItem(key, value)
            }
            return true
        } catch (error) {
            this.setState('full', error)
            alert(error.message)
            return error
        }
    },
    /**
     * Get the number of bytes stored for the item in localStorage.
     *
     * @returns {number} - The number of bytes stored.
     */
    getBytes: function() {
        return (localStorage[this.key].length + this.key.length) * 2
    },
    /**
     * Delete the item from localStorage.
     */
    remove: function () {
        localStorage.removeItem(this.key)
    },
}

/**
 * Helper function for parsing a stored object or returning a default value.
 *
 * @param {string} key - The key to use when retrieving the object from localStorage.
 * @param {object} initial - The initial value to return if the object is not found.
 * @returns {object} The parsed object or the initial value.
 */
export function parseStoredObject (key, initial = {}) {
    try {
        const stored = localStorage.getItem(key)
        if (stored === null) return initial
        return JSON.parse(stored)
    } catch (error) {
        return initial
    }
}

export default LocalStorageItem
