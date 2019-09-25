import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import schemas from './schemas';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const alerts = getAlerts(state);
  const { response, status } = getRequest(state, schemas.listAllChannels.getCurie());
  const isFulfilled = status === STATUS_FULFILLED;
  const channels = isFulfilled ? response.get('nodes', []) : [];

  return {
    alerts,
    isFulfilled,
    channels,
  };
};
