import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';
import searchScreenSelector from '@triniti/cms/plugins/ncr/screens/search-nodes/selector';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import schemas from './schemas';

/**
 * @param {Object} state    - The entire redux state.
 * @param {Object} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const searchScreen = searchScreenSelector(state, ownProps, schemas);
  const { request } = searchScreen.searchNodesRequestState;
  const sort = (request && request.get('sort').toString())
    || SearchNotificationsSort.CREATED_AT_DESC.getValue();
  const statuses = ((request && request.get('statuses')) || []).map((obj) => obj.value);
  const sendStatus = (request && request.has('send_status'))
    ? request.get('send_status').toString() : null;
  const appRef = request && request.get('app_ref');

  // get all apps for search options app_ref
  const { response, status } = getRequest(state, schemas.getAllApps.getCurie());
  const apps = status === STATUS_FULFILLED ? response.get('nodes', []) : [];
  const allAppOptions = apps.map(
    (app) => ({ label: app.get('title'), value: NodeRef.fromNode(app).toString() }),
  );

  return {
    ...searchScreen,
    allAppOptions,
    appRef,
    getNode: (nodeRef) => getNode(state, nodeRef),
    sendStatus,
    sort,
    statuses,
  };
};
