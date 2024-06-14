import swal from 'sweetalert2';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code.js';
import clearAlerts from '@triniti/cms/actions/clearAlerts.js';
import { actionTypes } from '@triniti/cms/plugins/pbjx/constants.js';

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
        title: 'Authentication Required',
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: 'Logout',
        html: '<p><strong>To avoid losing your work:</strong>'
          + '<ol class="text-start">'
          + '<li class="pb-2"><mark><u>DO NOT</u></mark> close or refresh.</li>'
          + '<li class="pb-2"><a href="/" target="_blank" rel="noopener noreferrer"><strong>Log in</strong></a> from a new tab.</li>'
          + '<li class="pb-2">Once logged in, return to this tab.</li>'
          + '<li>Click <strong>OK</strong> and then retry your operation.</li>'
          + '</ol>'
          + '</p>',
      }).then((result) => {
        if (result.isDismissed) {
          dispatch(logout());
        }
      }).catch(console.error);
    }, 1000);
  }

  return dispatch({
    type: actionTypes.ENVELOPE_RECEIVED,
    pbj: envelope,
  });
};
