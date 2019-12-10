import { STATUS_FULFILLED } from '@triniti/app/constants';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
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
    SearchVideosRequestV1Mixin.findOne().getCurie(),
    pbjxChannelNames.LIVESTREAM_VIDEO_SEARCH,
  );
  return {
    alerts: getAlerts(state),
    exception,
    isFulfilled: status === STATUS_FULFILLED,
    nodes: response ? response.get('nodes', []) : [],
    status,
  };
};
