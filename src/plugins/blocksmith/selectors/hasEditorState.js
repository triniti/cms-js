import hasBlocksmith from './hasBlocksmith';

/**
 * Returns true if there is editorState for a given formName
 *
 * @param {{blocksmith: {}}} state - The entire redux state.
 * @param {string}           id    - An identifier. Either formName or node id.
 *
 * @returns {boolean}
 */
export default (state, id) => {
  const { blocksmith } = state;
  if (!hasBlocksmith(state, id)) {
    return false;
  }

  return !!blocksmith[id].editorState;
};
