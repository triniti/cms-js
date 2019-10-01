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
  const listAllPicklistsRequestState = getRequest(state, schemas.listAllPicklists.getCurie());
  const { response, status } = listAllPicklistsRequestState;
  const picklistRefs = status === STATUS_FULFILLED ? response.get('picklists', []) : [];

  return {
    alerts,
    listAllPicklistsRequestState,
    picklistRefs,
  };
};
