import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import { EVENT_PREFIX } from '@gdbots/pbjx/constants';
import AuthenticationRequired from '../exceptions/AuthenticationRequired';
import PermissionDenied from '../exceptions/PermissionDenied';
import isAuthenticated from '../selectors/isAuthenticated';
import isGranted from '../selectors/isGranted';

export default class Authorizer extends EventSubscriber {
  constructor() {
    super();
    this.checkPermission = this.checkPermission.bind(this);
  }

  /**
   * @param {PbjxEvent} pbjxEvent
   */
  checkPermission(pbjxEvent) {
    if (!pbjxEvent.isRootEvent()) {
      // lifecycle events on nested messages do not require permission
      return;
    }

    const schema = pbjxEvent.getMessage().schema();
    if (!schema.hasMixin('gdbots:pbjx:mixin:request') && !schema.hasMixin('gdbots:pbjx:mixin:command')) {
      return;
    }

    const curie = schema.getCurie().toString();
    const state = pbjxEvent.getRedux().getState();

    if (!isAuthenticated(state)) {
      throw new AuthenticationRequired();
    }

    if (!isGranted(state, curie)) {
      // fixme: exception handling for permission errors needs work
      throw new PermissionDenied();
    }
  }

  getSubscribedEvents() {
    return {
      [`${EVENT_PREFIX}message.validate`]: this.checkPermission,
    };
  }
}
