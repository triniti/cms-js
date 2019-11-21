import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchVideosRequestV1 from '@tmz/schemas/tmz/ovp/request/SearchVideosRequestV1';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => {
  const { response, status } = getRequest(
    state,
    SearchVideosRequestV1.schema().getCurie(),
    pbjxChannelNames.LIVESTREAM_VIDEO_SEARCH,
  );
  return {
    isFulfilled: status === STATUS_FULFILLED,
    nodes: !response ? [] : response.get('nodes', []),
  };
};
