import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';

export default (nodeRef) => ({
  type: actionTypes.CURRENT_NODE_REF_SET,
  nodeRef,
});
