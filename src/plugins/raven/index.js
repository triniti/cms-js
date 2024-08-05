import Plugin from '@triniti/cms/Plugin.js';
import { actionTypes as iamActionTypes } from '@triniti/cms/plugins/iam/constants.js';
import reducer from '@triniti/cms/plugins/raven/reducers/index.js';
import connect from '@triniti/cms/plugins/raven/actions/connect.js';
import disconnect from '@triniti/cms/plugins/raven/actions/disconnect.js';
import pruneCollaborators from '@triniti/cms/plugins/raven/actions/pruneCollaborators.js';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven');
  }

  async configure(app) {
    this.reducer = reducer;
    const dispatcher = app.getDispatcher();
    let pruneIntervalId = null;

    dispatcher.addListener(iamActionTypes.USER_LOADED, (event) => {
      const action = event.getAction();
      app.getRedux().dispatch(connect(action.user.generateNodeRef().toString()));

      if (pruneIntervalId) {
        clearInterval(pruneIntervalId);
      }

      pruneIntervalId = setInterval(() => {
        app.getRedux().dispatch(pruneCollaborators());
      }, 15000);
    });

    const disconnectListener = () => {
      app.getRedux().dispatch(disconnect());
      if (pruneIntervalId) {
        clearInterval(pruneIntervalId);
      }
    };
    dispatcher.addListener(iamActionTypes.LOGOUT_COMPLETED, disconnectListener);
    dispatcher.addListener(iamActionTypes.LOGIN_REJECTED, disconnectListener);
  }
}
