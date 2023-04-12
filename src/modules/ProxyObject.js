/**
 * Proxy a function property.
 *
 * @author Zachary K. Watkins <watkinza@gmail.com>
 * @param {object} proxy  - Proxy.
 * @param {string} key    - Property or method name to proxy.
 * @param {object} source - Object to proxy.
 */
function proxyMethod(proxy, key, source) {
  proxy[key] = source[key]
}

/**
 * Proxy a non-function property.
 *
 * @author Zachary K. Watkins <watkinza@gmail.com>
 * @param {object} proxy  - Proxy.
 * @param {string} key    - Property or method name to proxy.
 * @param {object} source - Object to proxy.
 */
function proxyProp(proxy, key, source) {
  Object.defineProperty(proxy, key, {
    get: function () {
      return source[key]
    },
    set: function (value) {
      source[key] = value
    },
    enumerable: true,
  })
}

/**
 * Create an object which routes methods and properties to another object.
 *
 * @param {object}   source - An object to represent.
 * @param {string[]} keys   - Names of the properties and methods available to the proxy. Accepts dot notation and the result by keeping the rightmost name.
 */
export function ProxyObject(source, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (typeof source[key] === 'function') {
      this[key] = source[key].bind(source)
    } else {
      Object.defineProperty(this, key, {
        get: function () {
          return source[key]
        },
        set: function (value) {
          source[key] = value
        },
        enumerable: true,
      })
    }
  }
}

/**
 * Create an object which routes methods and properties to another object.
 *
 * @param {object}   source - An object to represent.
 * @param {string[]} keys   - Names of the properties and methods available to the proxy. Accepts dot notation and the result by keeping the rightmost name.
 */
export function ProxyObjectDeep(source, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (typeof this[key] === 'function') {
      this[key] = source[key].bind(source)
    } else if (0 > key.indexOf('.')) {
      Object.defineProperty(this, key, {
        get: function () {
          return source[key]
        },
        set: function (value) {
          source[key] = value
        },
        enumerable: true,
      })
    } else {
      // Using dot notation.
      const steps = key.split('.')
      if (steps.length < 3) {
        Object.defineProperty(this, steps[1], {
          get: function () {
            return source[steps[0]][steps[1]]
          },
          set: function (value) {
            source[steps[0]][steps[1]] = value
          },
          enumerable: true,
        })
      } else if (steps.length < 4) {
        Object.defineProperty(this, steps[2], {
          get: function () {
            return source[steps[0]][steps[1]][steps[2]]
          },
          set: function (value) {
            source[steps[0]][steps[1]][steps[2]] = value
          },
          enumerable: true,
        })
      }
    }
  }
}

/**
 * Proxy an object.
 *
 * @param {string[]} props - Names of the properties and methods available to the proxy.
 * @returns {ProxyObject} A proxy object representing the parent object.
 */
export function HasProxy(...props) {
  const keys = props || Object.keys(this)
  return new ProxyObject(this, keys)
}

/**
 * Proxy an object while allowing nested properties to be flattened using dot notation.
 *
 * @param {string[]} props - Names of the properties and methods available to the proxy.
 * @returns {ProxyObject} A proxy object representing the parent object.
 */
export function HasProxyDeep(...props) {
  const keys = props || Object.keys(this)
  return new ProxyObjectDeep(this, keys)
}

export default ProxyObject
