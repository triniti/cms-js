import { connectionStatus } from '@triniti/cms/plugins/raven/constants.js';

/**
 * @param {Object} state
 *
 * @returns {boolean}
 */
export default ({ raven }) => raven.connection === connectionStatus.opened;
