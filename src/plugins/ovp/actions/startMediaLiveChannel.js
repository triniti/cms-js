import { actionTypes } from '../constants';

/**
 * @param {nodeRef} nodeRef - The NodeRef of the node whose channel was started.
 *
 * @returns {Object}
 */
export default (nodeRef) => ({
  type: actionTypes.MEDIALIVE_CHANNEL_STARTED,
  nodeRef,
});
