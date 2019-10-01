export default (state) => {
  if (!state.blocksmith.copiedBlock) {
    return null;
  }

  return state.blocksmith.copiedBlock;
};
