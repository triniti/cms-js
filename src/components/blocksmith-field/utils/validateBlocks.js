import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from 'components/blocksmith-field/utils/convertToCanvasBlocks';
import convertToEditorState from 'components/blocksmith-field/utils/convertToEditorState';

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
  editorState.getCurrentContent().getBlockMap().forEach(async (block) => {
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = await convertToCanvasBlocks(singleBlockEditorState, true);
      if (canvasBlock) {
        validCanvasBlocks.push(canvasBlock);
        blocks.push({
          block: canvasBlock,
        });
      } else {
        isValid = false;
        blocks.push({
          block,
          error: 'Error: unable to convert to canvas block.',
        });
        errors[block.getKey()] = {
          block,
          error: 'Error: unable to convert to canvas block.',
        };
      }
    } catch (e) {
      isValid = false;
      console.error(`[ERROR:Blocksmith:util:validateBlocks] - Block: ${block.toString()} - ${e}`);
      window.onerror(e);
      blocks.push({
        block,
        error: e.stack || `${e}`,
      });
      errors[block.getKey()] = {
        block,
        error: e.stack || `${e}`,
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
