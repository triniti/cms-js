import { actionTypes } from '@triniti/cms/plugins/ncr/constants';

export default (nodes) => ({
  type: actionTypes.NODES_RECEIVED,
  nodes,
});