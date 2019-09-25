import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';

/**
 * @param {Object} state - the entire redux state
 *
 * @returns {Object}
 */
export default (state) => {
  const { response } = getRequest(state, schemas.searchNodes.getCurie());
  return {
    getNode: (nodeRef) => getNode(state, nodeRef),
    response,
  };
};
