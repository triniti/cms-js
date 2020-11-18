import { EditorState } from 'draft-js';
import validateBlocks from './validateBlocks';

export default (...args) => {
  const editorState = EditorState.push(...args);
  const { blocks, isValid } = validateBlocks(editorState);
  return {
    editorState,
    errors: isValid ? {} : blocks.reduce((acc, { error, index, type }) => {
      if (type !== 'content') {
        return acc;
      }
      acc[index] = error;
      return acc;
    }, {}),
  };
  // if (isValid) {
  //   return {
  //     editorState,
  //     errors: {},
  //   };
  // }
  // return {
  //   editorState,
  //   errors: blocks.reduce((acc, { error, index, type }) => {
  //     if (type !== 'content') {
  //       return acc;
  //     }
  //     acc[index] = error;
  //     return acc;
  //   }, {}),
  // };
};
