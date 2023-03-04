import { actionTypes } from 'plugins/ncr/constants';

export default (nodes) => ({
  type: actionTypes.NODES_RECEIVED,
  nodes,
});