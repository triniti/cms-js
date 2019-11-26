import { STATUS_FULFILLED } from '@triniti/app/constants';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchVideosRequestV1 from '@tmz/schemas/tmz/ovp/request/SearchVideosRequestV1';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => {
  const { exception, response, status } = getRequest(
    state,
    SearchVideosRequestV1.schema().getCurie(),
    pbjxChannelNames.LIVESTREAM_VIDEO_SEARCH,
  );
  return {
    alerts: getAlerts(state),
    exception,
    isFulfilled: status === STATUS_FULFILLED,
    nodes: !response ? [] : response.get('nodes', []),
    status,
  };
};
