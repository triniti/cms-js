import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';
import { tokens } from '../constants';

export default (editorState) => {
  const blocks = [];
  const validCanvasBlocks = [];
  let isValid = true;
  editorState.getCurrentContent().getBlockMap().forEach((block) => {
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState, true);
      if (
        canvasBlock.schema().getId().getCurie().getMessage() !== 'text-block'
        || canvasBlock.get('text') !== `<p>${tokens.EMPTY_BLOCK_TOKEN}</p>`
      ) {
        validCanvasBlocks.push(canvasBlock);
        blocks.push({
          type: 'canvas',
          block: canvasBlock,
        });
      }
    } catch (e) {
      isValid = false;
      console.log(`[ERROR:Blocksmith:util:validateBlocks] - ${e}`);
      blocks.push({
        type: 'content',
        block,
      });
    }
  });
  return {
    blocks,
    isValid,
    validEditorState: EditorState.push(
      editorState,
      convertToEditorState(validCanvasBlocks).getCurrentContent(),
    ),
  };
};
