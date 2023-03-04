import { connectionStatus } from 'plugins/raven/constants';

/**
 * @param {Object} state
 *
 * @returns {boolean}
 */
export default ({ raven }) => raven.connection === connectionStatus.opened;
