const onGetAllChannelsResponse = (prevState = {}, action) => {
  if (!action.pbj.has('nodes')) {
    return prevState;
  }

  const state = { ...prevState };

  action.pbj.get('nodes', []).forEach((node) => {
    if (!state.ncr.nodes.channel) {
      state.ncr.nodes.channel = {};
    }

    state.ncr.nodes.channel[node.get('_id')] = node;
  });

  return state;
};

export default (rootReducer) => {
  rootReducer.subscribe('triniti:taxonomy:mixin:get-all-channels-response', onGetAllChannelsResponse);
};
