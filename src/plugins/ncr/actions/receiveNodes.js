import { actionTypes } from '@triniti/cms/plugins/ncr/constants.js';

export default (nodes) => ({
  type: actionTypes.NODES_RECEIVED,
  nodes,
});
