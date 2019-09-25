import findBlock from './findBlock';

/**
 * Gets the DOM node for a block
 *
 * @param {ContentState}           contentState - a state instance of a DraftJs Editor
 * @param {(object|number|string)} id           - a block, a block index, or a block key
 *
 * @returns {EditorState} an EditorState instance
 */

export default (contentState, id) => {
  const block = findBlock(contentState, id);
  return document.querySelector(`[data-offset-key="${block.getKey()}-0-0"]`);
};
