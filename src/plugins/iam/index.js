import Plugin from '@triniti/cms/Plugin.js';
import reducer from '@triniti/cms/plugins/iam/reducers/index.js';
import { serviceIds } from '@triniti/cms/plugins/iam/constants.js';

export default class IamPlugin extends Plugin {
  constructor() {
    super('triniti', 'iam');
  }

  async configure(app) {
    this.reducer = reducer;

    app.register(serviceIds.AUTHORIZER, async () => {
      const Authorizer = (await import('@triniti/cms/plugins/iam/Authorizer.js')).default;
      return new Authorizer(app);
    });

    app.subscribe('gdbots:pbjx:mixin:command.validate', serviceIds.AUTHORIZER, 'checkPermission');
    app.subscribe('gdbots:pbjx:mixin:request.validate', serviceIds.AUTHORIZER, 'checkPermission');
  }
}
