/**
 * @param {Object} state
 * @param {NodeRef|string} nodeRef
 *
 * @returns {Object[]}
 */
export default ({ raven }, nodeRef) => raven.messages[`${nodeRef}`] || [];
