import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode.js';

export default (state, nodeRef) => {
  if (!hasNode(state, nodeRef)) {
    return null;
  }

  return state.ncr[`${nodeRef}`];
};
