import { actionTypes } from '../constants';

export default (nodeRefs, config) => ({
  type: actionTypes.BATCH_MARK_NODES_AS_DRAFT_REQUESTED,
  nodeRefs,
  config,
});
