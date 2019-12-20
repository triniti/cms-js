import { actionTypes } from '../constants';

export default (nodes) => ({
  type: actionTypes.NODES_RECEIVED,
  nodes,
});
