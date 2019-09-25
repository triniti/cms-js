import hasBlocksmith from './hasBlocksmith';

/**
 * Returns a node's EditorState by its id
 *
 * @param {{blocksmith: {}}} state - The entire redux state.
 * @param {string}           id    - An identifier. Either formName or node id.
 *
 * @returns {?*} A DraftJs EditorState instance
 */
export default (state, id) => {
  if (!hasBlocksmith(state, id)) {
    return null;
  }
  return state.blocksmith[id];
};
