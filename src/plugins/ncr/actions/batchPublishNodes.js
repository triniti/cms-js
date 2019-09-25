import { actionTypes } from '../constants';

export default (nodeRefs, config) => ({
  type: actionTypes.BATCH_PUBLISH_NODES_REQUESTED,
  nodeRefs,
  config,
});
