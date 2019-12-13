import { actionTypes } from '../constants';

export default (nodes) => ({
  type: actionTypes.COLLABORATION_NODES_RECEIVED,
  nodes,
});
