import hasBlocksmith from './hasBlocksmith';

/**
 * Returns a node's editor dirty flag by its id
 *
 * @param {{blocksmith: {}}} state - The entire redux state.
 * @param {string} id    - An identifier. Either formName or node id.
 *
 * @returns {boolean} whether or not the editor component is dirty
 */
export default (state, id) => {
  if (!hasBlocksmith(state, id)) {
    return false;
  }
  return state.blocksmith[id].isDirty;
};
