import { actionTypes } from '../constants';

export default (node, history) => ({
  type: actionTypes.CLONE_NODE_REQUESTED,
  node,
  history,
});
