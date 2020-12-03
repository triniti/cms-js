import { EditorState } from 'draft-js';
import validateBlocks from './validateBlocks';

/**
 * Enforce/detect validity of incoming EditorState with this util. Only necessary when the
 * returned EditorState will be used during a render - raw EditorState.push is fine within
 * other utils.
 */
export default (...args) => {
  const editorState = EditorState.push(...args);
  return {
    editorState,
    errors: validateBlocks(editorState).errors,
  };
};
