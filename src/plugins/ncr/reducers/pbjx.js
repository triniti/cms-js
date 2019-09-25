const onGetNodeBatchResponse = (prevState = {}, action) => {
  if (!action.pbj.has('nodes')) {
    return prevState;
  }

  const state = { ...prevState };

  Object.values(action.pbj.get('nodes')).forEach((node) => {
    const label = node.schema().getQName().getMessage();
    if (!state.ncr.nodes[label]) {
      state.ncr.nodes[label] = {};
    }

    state.ncr.nodes[label][node.get('_id')] = node;
  });

  return state;
};

const onGetNodeResponse = (prevState = {}, action) => {
  const state = { ...prevState };

  const node = action.pbj.get('node');
  const label = node.schema().getQName().getMessage();

  if (!state.ncr.nodes[label]) {
    state.ncr.nodes[label] = {};
  }

  state.ncr.nodes[label][node.get('_id')] = node;
  return state;
};

const onSearchNodesResponse = (prevState = {}, action) => {
  if (!action.pbj.has('nodes')) {
    return prevState;
  }

  const state = { ...prevState };

  action.pbj.get('nodes', []).forEach((node) => {
    const label = node.schema().getQName().getMessage();
    if (!state.ncr.nodes[label]) {
      state.ncr.nodes[label] = {};
    }

    state.ncr.nodes[label][node.get('_id')] = node;
  });

  return state;
};

export default (rootReducer) => {
  rootReducer.subscribe('gdbots:ncr:mixin:get-node-batch-response', onGetNodeBatchResponse);
  rootReducer.subscribe('gdbots:ncr:mixin:get-node-response', onGetNodeResponse);
  rootReducer.subscribe('gdbots:ncr:mixin:search-nodes-response', onSearchNodesResponse);
};
