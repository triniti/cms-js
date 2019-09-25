import { actionTypes } from '../constants';

export default (nodeRefs, config) => ({
  type: actionTypes.BATCH_DELETE_NODES_REQUESTED,
  nodeRefs,
  config,
});
