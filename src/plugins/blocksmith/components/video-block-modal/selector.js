import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const { request, response, status } = getRequest(
    state,
    schemas.searchNodes.getCurie(),
    pbjxChannelNames.VIDEO_SEARCH,
  );

  return {
    getNode: (nodeRef) => getNode(state, nodeRef),
    isFulfilled: status === STATUS_FULFILLED,
    video: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    videos: (response && response.has('nodes')) ? response.get('nodes') : [],
    imageNode: block.has('poster_image_ref') ? getNode(state, block.get('poster_image_ref')) : null,
    sort: (request && request.get('sort').getValue()) || SearchAssetsSort.CREATED_AT_DESC.getValue(),
  };
};
