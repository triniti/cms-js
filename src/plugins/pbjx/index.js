import { TRANSPORT_HTTP_ENVELOPE_RECEIVED } from '@gdbots/pbjx/constants';
import Plugin from '@triniti/cms/Plugin';
import reducer from '@triniti/cms/plugins/pbjx/reducers';
import saga from '@triniti/cms/plugins/pbjx/sagas';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope';
import { serviceIds } from '@triniti/cms/plugins/pbjx/constants';

export default class PbjxPlugin extends Plugin {
  constructor() {
    super('triniti', 'pbjx');
  }

  async configure(app) {
    this.reducer = reducer;
    this.saga = saga;

    app.register(serviceIds.MESSAGE_BINDER, async () => {
      const MessageBinder = (await import('@triniti/cms/plugins/pbjx/MessageBinder')).default;
      return new MessageBinder(app);
    });

    app.subscribe('gdbots:pbjx:mixin:command.bind', serviceIds.MESSAGE_BINDER, 'bindCtx');
    app.subscribe('gdbots:pbjx:mixin:request.bind', serviceIds.MESSAGE_BINDER, 'bindCtx');

    app.getDispatcher().addListener(TRANSPORT_HTTP_ENVELOPE_RECEIVED, (event) => {
      app.getRedux().dispatch(receiveEnvelope(event.getEnvelope()));
    });
  }
}
