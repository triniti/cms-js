import Event from '@gdbots/pbjx/events/Event.js';

const appSym = Symbol('app');
const actionSym = Symbol('action');

export default class ActionEvent extends Event {
  /**
   * @param {App}    app    - The app instance.
   * @param {Object} action - The redux action being dispatched.
   */
  constructor(app, action) {
    super();
    this[appSym] = app;
    this[actionSym] = action;
  }

  /**
   * @returns {App}
   */
  getApp() {
    return this[appSym];
  }

  /**
   * @returns {Object}
   */
  getAction() {
    return this[actionSym];
  }
}
