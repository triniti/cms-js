import hasNode from 'plugins/ncr/selectors/hasNode';

export default (state, nodeRef) => {
  if (!hasNode(state, nodeRef)) {
    return null;
  }

  return state.ncr[`${nodeRef}`];
};
