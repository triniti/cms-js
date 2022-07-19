export default class Plugin {
  /**
   * @param {string} vendor
   * @param {string} name
   */
  constructor(vendor, name) {
    this.vendor = vendor;
    this.name = name;

    /**
     * @link http://redux.js.org/docs/basics/Reducers.html#handling-actions
     * @type {?Function}
     */
    this.reducer = null;

    /**
     * @link https://redux-saga.js.org/
     * @type {?Function}
     */
    this.saga = null;
  }

  /**
   * @returns {string}
   */
  getVendor() {
    return this.vendor;
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @returns {boolean}
   */
  hasReducer() {
    return this.reducer !== null;
  }

  /**
   * @returns {?Function}
   */
  getReducer() {
    return this.reducer;
  }

  /**
   * @returns {boolean}
   */
  hasSaga() {
    return this.saga !== null;
  }

  /**
   * @returns {?Function}
   */
  getSaga() {
    return this.saga;
  }

  /**
   * @param {App} app
   */
  async configure(app) {
    // override in concrete plugin
  }

  /**
   * @param {App} app
   */
  async start(app) {
    // override in concrete plugin
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.toString();
  }

  /**
   * @returns {string}
   */
  toString() {
    return `@${this.vendor}/${this.name}`;
  }
}
