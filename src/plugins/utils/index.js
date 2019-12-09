/* eslint-disable class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import reducer from './reducers';

export default class UtilsPlugin extends Plugin {
  constructor() {
    super('triniti', 'utils', '0.2.15');
  }

  configure() {
    this.reducer = reducer;
  }
}
