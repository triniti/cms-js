const nousers = {};
export default (state, nodeRef) => {
  return state.raven.collaborations[nodeRef] || nousers;
};
