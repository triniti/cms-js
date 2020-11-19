import { EditorState } from 'draft-js';
import validateBlocks from './validateBlocks';

// todo: add docblock
export default (...args) => {
  const editorState = EditorState.push(...args);
  return {
    editorState,
    errors: validateBlocks(editorState).errors,
  };
};
