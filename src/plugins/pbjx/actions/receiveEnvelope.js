import { actionTypes } from '../constants';

/**
 * Once the Pbjx HTTP operation completes it will dispatch
 * an event using its dispatcher (not redux).
 *
 * @link https://github.com/gdbots/pbjx-js/blob/master/src/transports/HttpTransport.js#L105
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
export default (envelope) => ({
  type: actionTypes.ENVELOPE_RECEIVED,
  pbj: envelope,
});
