import swal from 'sweetalert2';
import noop from 'lodash-es/noop';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import clearAlerts from 'actions/clearAlerts';
import { actionTypes } from 'plugins/pbjx/constants';

/**
 * Once the Pbjx HTTP operation completes it will dispatch
 * an event using its dispatcher (not redux).
 *
 * @link https://github.com/gdbots/pbjx-js/blob/master/src/transports/HttpTransport.js#L96
 *
 * We listen for that and dispatch it again through redux so
 * we can extract its sweet, sweet juices in the form of derefs
 * in a reducer which populates the ncr state before anything
 * else runs that thinks it needs to go fetch stuff.
 *
 * @param {Message} envelope - a message using mixin 'gdbots:pbjx::envelope'
 *
 * @returns {Object}
 */
export default (envelope) => (dispatch) => {
  if (envelope.get('code') === Code.UNAUTHENTICATED.getValue()) {
    setTimeout(() => {
      dispatch(clearAlerts());
      swal.fire({
        title: 'Session Expired',
        icon: 'error',
        html: '<p><strong>To avoid losing your work:</strong>'
          + '<ol class="text-start">'
          + '<li class="pb-2"><mark><u>DO NOT</u></mark> close or refresh.</li>'
          + '<li class="pb-2"><a href="/" target="_blank" rel="noopener noreferrer"><strong>Login</strong></a> in a new tab.</li>'
          + '<li class="pb-2">Once logged in, return to this tab.</li>'
          + '<li>Click <strong>OK</strong> and then retry your operation.</li>'
          + '</ol>'
          + '</p>',
      }).then(noop).catch(console.error);
    }, 1000);
  }

  return dispatch({
    type: actionTypes.ENVELOPE_RECEIVED,
    pbj: envelope,
  });
};
