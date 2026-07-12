export class Store {
  constructor(initialState = {}) {
    this.state = structuredClone(initialState);
    /** @type {Map<string, ((value: any) => unknown)[]>} */
    this.listeners = new Map();
  }

  get(key) {
    return this.state[key];
  }

  getState() {
    return structuredClone(this.state);
  }

  /**
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    this.state[key] = value;

    this.emit(key, value);
  }

  /**
   * @param {string} key 
   * @param {(value: any) => unknown} callback 
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key))
      this.listeners.set(key, []);

    this.listeners.get(key).push(callback);
  }

  /**
   * @param {string} key 
   * @param {any} value 
   */
  emit(key, value) {
    if (!this.listeners.has(key)) return;

    this.listeners.get(key)?.forEach((cb) => cb(value));
  }
}

export default Store;