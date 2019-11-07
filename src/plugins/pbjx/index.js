/* eslint-disable no-unused-vars, class-methods-use-this */
import { serviceIds as appServiceIds } from '@triniti/app/constants';
import { serviceIds as pbjxServiceIds, TRANSPORT_HTTP_ENVELOPE_RECEIVED } from '@gdbots/pbjx/constants';
import Plugin from '@triniti/app/Plugin';
import reducer from './reducers';
import pbjxReducer from './reducers/pbjx';
import receiveEnvelope from './actions/receiveEnvelope';
import { serviceIds } from './constants';
import CtxBinder from './binders/CtxBinder';

export default class PbjxPlugin extends Plugin {
  constructor() {
    super('triniti', 'pbjx', '0.2.8');
  }

  configure(app, bottle) {
    bottle.service(serviceIds.CTX_BINDER, CtxBinder, appServiceIds.CONTAINER);
    this.reducer = reducer;
  }

  start(app) {
    const container = app.getContainer();
    app.getDispatcher().addSubscriber(container.get(serviceIds.CTX_BINDER));
    pbjxReducer(container.get(pbjxServiceIds.REDUX_REDUCER));
  }

  /**
   * @param {EnvelopeReceivedEvent} event
   */
  onEnvelopeReceived(event) {
    event.getRedux().dispatch(receiveEnvelope(event.getEnvelope()));
  }

  getSubscribedEvents() {
    return {
      [TRANSPORT_HTTP_ENVELOPE_RECEIVED]: this.onEnvelopeReceived,
    };
  }
}
