import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const { picklistId } = ownProps;
  const nodeRef = new NodeRef(schemas.node.getQName(), picklistId);
  const getNodeRequestState = getRequest(
    state,
    schemas.getNodeRequest.getCurie(),
    `${pbjxChannelNames.PICKLIST_PICKER_REQUEST}/${picklistId}`,
  );

  const node = getNode(state, nodeRef);
  const allowOther = node && node.get('allow_other');
  const alphaSort = node && node.get('alpha_sort');

  let options = (node && node.get('options')) || [];
  if (alphaSort) {
    options = options.sort();
  }

  options = options.map((option) => ({
    label: option,
    value: option,
  }));

  return {
    allowOther,
    getNodeRequestState,
    node,
    options,
  };
};
