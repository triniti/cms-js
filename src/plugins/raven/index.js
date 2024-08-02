import Plugin from '@triniti/cms/Plugin.js';
import { actionTypes } from '@triniti/cms/plugins/iam/constants.js';
import connect from '@triniti/cms/plugins/raven/actions/connect.js';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven');
  }

  async configure(app) {
    const dispatcher = app.getDispatcher();

    dispatcher.addListener(actionTypes.USER_LOADED, (event) => {
      const action = event.getAction();
      app.getRedux().dispatch(connect(action.user));
    });
  }
}
