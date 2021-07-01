import noop from 'lodash/noop';
import swal from 'sweetalert2';
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
      swal.fire({
        title: 'Session Expired',
        type: 'error',
        html: '<p><strong>To avoid losing your work:</strong>'
          + '<ol class="text-left">'
          + '<li class="pb-2"><mark><u>DO NOT</u></mark> close or refresh.</li>'
          + '<li class="pb-2"><a href="/" target="_blank" rel="noopener noreferrer"><strong>Login</strong></a> in a new tab.</li>'
          + '<li class="pb-2">Once logged in, return to this tab.</li>'
          + '<li>Click <strong>OK</strong> and then retry your operation.</li>'
          + '</ol>'
          + '</p>',
      }).then(noop).catch(console.error);
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
