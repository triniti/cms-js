import { actionTypes } from '@triniti/cms/plugins/pbjx/constants.js';

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
