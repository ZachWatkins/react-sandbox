//@ts-check
/** Now in seconds UST since epoch. */
export function now() {
  return Math.round(Date.now() / 1000)
}

/**
 * The primitive object which contains the class function.
 *
 * @example `const storage = SelfStoring.apply(this, "SelfStoringObject", function(){return JSON.stringify(this.state);});`
 * @param {string}   key           - The localStorage item's key.
 * @param {string[]} [props]       - One or more property names to store.
 * @throws {TypeError} ("cyclic object value") exception when a circular reference is found.
 * @throws {TypeError} ("BigInt value can't be serialized in JSON") when trying to stringify a BigInt value.
 */
export function SelfStoring(key, props) {
  console.log(this)
  this.storeKey = key || 'SelfStoring'
  this.storeProps = props || []
  if (0 > this.storeProps.indexOf('state')) this.storeProps.push('state')

  // Combining objects with shared properties causes reassignment.
  if (this['state'] === undefined) this.state = {}
  this.state.saved = 0
  this.state.restored = 0
  console.log(this)

  this.restore()
  this.save()
}
// Trait pattern avoids prototype property replacement using a null object.
SelfStoring.prototype = {
  toJSON: function () {
    const storable = Object.create(null)
    for (let i = 0; i < this.storeProps.length; i++) {
      const key = this.storeProps[i]
      storable[key] = this[key]
    }
    return storable
  },
  save: function () {
    localStorage.setItem(this.storeKey, JSON.stringify(this))
    if (localStorage[this.storeKey] === undefined) return 0
    return (this.state.saved = now())
  },
  restore: function () {
    console.log(this)
    if (!localStorage[this.storeKey]) return false
    const json = localStorage.getItem(this.storeKey)
    if (typeof json !== 'string') return false
    const data = JSON.parse(json)
    console.log(data)
    for (let i = 0; i < this.storeProps.length; i++) {
      const prop = this.storeProps[i]
      this[prop] = data[prop]
    }
    console.log(this)
    this.state.restored = now()
    return data
  },
}

export default SelfStoring
