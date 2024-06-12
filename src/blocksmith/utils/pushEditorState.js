import { EditorState } from 'draft-js';
import validateBlocks from '@triniti/cms/blocksmith/utils/validateBlocks.js';

/**
 * Enforce/detect validity of incoming EditorState with this util. Only necessary when the
 * returned EditorState will be used during a render - raw EditorState.push is fine within
 * other utils.
 */
export default async (...args) => {
  const editorState = EditorState.push(...args);
  const { errors } = await validateBlocks(editorState);
  return {
    editorState,
    errors,
  };
};