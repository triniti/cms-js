/**
 * @param {Object} state
 *
 * @returns {boolean}
 */
export default ({ raven }) => raven.connection.isConnected;
