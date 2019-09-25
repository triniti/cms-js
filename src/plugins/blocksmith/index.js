import Plugin from '@triniti/app/Plugin';
import reducer from './reducers';

export default class BlocksmithPlugin extends Plugin {
  constructor() {
    super('triniti', 'blocksmith', '0.1.0');
  }

  configure() {
    this.reducer = reducer;
  }
}
