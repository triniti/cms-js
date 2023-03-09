import { actionTypes } from '../constants';

export default (nodeRef) => ({
  type: actionTypes.CURRENT_NODE_REF_SET,
  nodeRef,
});
