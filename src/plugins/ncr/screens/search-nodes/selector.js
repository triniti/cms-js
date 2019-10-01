import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getSearchNodesState from '../../selectors/getSearchNodesState';
import { searchViewTypes } from '../../constants';

const { TABLE } = searchViewTypes;

/**
 * @param {Object} state    - The entire redux state.
 * @param {Object} ownProps - Props given to the screen.
 * @param {Object} schemas
 *
 * @returns {Object}
 */
export default (state, ownProps, schemas) => {
  const alerts = getAlerts(state);
  const searchNodesRequestState = getRequest(state, schemas.searchNodes.getCurie());
  const { request, response } = searchNodesRequestState;
  const nodes = (response && response.has('nodes')) ? response.get('nodes') : [];
  const statuses = ((request && request.get('statuses')) || []).map((obj) => obj.value);
  const searchNodesState = getSearchNodesState(state, schemas.searchNodes.getCurie().toString());
  const view = (searchNodesState && searchNodesState.view) || TABLE;

  return {
    alerts,
    getNode: (nodeRef) => getNode(state, nodeRef),
    nodes,
    statuses,
    searchNodesRequestState,
    view,
  };
};
