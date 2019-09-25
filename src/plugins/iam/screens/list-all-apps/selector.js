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
  const getAllAppsRequestState = getRequest(state, schemas.getAllApps.getCurie());
  const { response, status } = getAllAppsRequestState;
  const apps = status === STATUS_FULFILLED ? response.get('nodes', []) : [];

  return {
    alerts,
    apps,
    getAllAppsRequestState,
  };
};
