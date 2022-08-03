import { actionTypes } from 'plugins/pbjx/constants';

/**
 * @param {Message} request - message using mixin 'gdbots:pbjx:mixin:request'
 * @param {string}  channel - channel aka namespace for this request
 *
 * @returns {Object}
 */
export default (request, channel = '') => ({
  type: actionTypes.REQUEST_PERSISTED,
  pbj: request,
  channel,
});
