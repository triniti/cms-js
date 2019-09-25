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
  const { response, status } = getRequest(state, schemas.listAllRoles.getCurie());
  const isFulfilled = status === STATUS_FULFILLED;
  const roles = isFulfilled ? response.get('roles', []) : [];

  return {
    alerts,
    isFulfilled,
    roles,
  };
};
