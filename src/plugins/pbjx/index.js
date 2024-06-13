import { TRANSPORT_HTTP_ENVELOPE_RECEIVED } from '@gdbots/pbjx/constants.js';
import Plugin from '@triniti/cms/Plugin.js';
import reducer from '@triniti/cms/plugins/pbjx/reducers/index.js';
import saga from '@triniti/cms/plugins/pbjx/sagas/index.js';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope.js';
import { serviceIds } from '@triniti/cms/plugins/pbjx/constants.js';

export default class PbjxPlugin extends Plugin {
  constructor() {
    super('triniti', 'pbjx');
  }

  async configure(app) {
    this.reducer = reducer;
    this.saga = saga;

    app.register(serviceIds.MESSAGE_BINDER, async () => {
      const MessageBinder = (await import('@triniti/cms/plugins/pbjx/MessageBinder.js')).default;
      return new MessageBinder(app);
    });

    app.subscribe('gdbots:pbjx:mixin:command.bind', serviceIds.MESSAGE_BINDER, 'bindCtx');
    app.subscribe('gdbots:pbjx:mixin:request.bind', serviceIds.MESSAGE_BINDER, 'bindCtx');

    app.getDispatcher().addListener(TRANSPORT_HTTP_ENVELOPE_RECEIVED, (event) => {
      app.getRedux().dispatch(receiveEnvelope(event.getEnvelope()));
    });
  }
}
