/**
 * Returns a node's medialive channel's status by its NodeRef
 *
 * @param {{ovp: {}}} state - The entire redux state.
 * @param {NodeRef} nodeRef - A NodeRef instance or a NodeRef string.
 *
 * @returns {?String} The node's medialive channel's status
 */
export default (state, nodeRef) => state.ovp.mediaLiveChannelStatus[`${nodeRef}`];
