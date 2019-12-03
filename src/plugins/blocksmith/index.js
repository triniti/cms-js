import Plugin from '@triniti/app/Plugin';
import reducer from './reducers';

export default class BlocksmithPlugin extends Plugin {
  constructor() {
    super('triniti', 'blocksmith', '0.2.11');
  }

  configure() {
    this.reducer = reducer;
  }
}
