import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

/**
 * @param {EditorState} editorState
 *
 * @returns {Object}
 */
export default (editorState) => {
  const blocks = [];
  const errors = {};
  const validCanvasBlocks = [];
  let isValid = true;
  let index = -1;
  editorState.getCurrentContent().getBlockMap().forEach((block) => {
    index += 1;
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState, true);
      validCanvasBlocks.push(canvasBlock);
      blocks.push({
        block: canvasBlock,
      });
    } catch (e) {
      isValid = false;
      console.error(`[ERROR:Blocksmith:util:validateBlocks] - Block: ${block.toString()} - ${e}`);
      blocks.push({
        block,
        error: e.stack,
        index,
      });
      errors[block.getKey()] = {
        key: block.getKey(),
        error: e.stack,
      };
    }
  });

  return {
    blocks,
    errors,
    isValid,
    validEditorState: EditorState.push(
      editorState,
      convertToEditorState(validCanvasBlocks).getCurrentContent(),
    ),
  };
};
