import { blockTypes, inlineStyleTypes } from '../constants';
import getSelectedBlocksList from './getSelectedBlocksList';

/**
 * Returns true if an advanced block is currently selected. In this context, an advanced block is
 * one that cannot be natively copy-pasted by draft alone. Advanced blocks require explicit
 * serialization on copy and deseralization/insertion on paste.
 *
 * @param {EditorState} editorState  - a state instance of a DraftJs Editor
 *
 * @returns {boolean}
 */
export default (editorState) => {
  const selectedBlocksList = getSelectedBlocksList(editorState);
  return !!selectedBlocksList.find((contentBlock) => {
    if (contentBlock.getType() === blockTypes.ATOMIC) {
      return true;
    }
    const blockData = contentBlock.getData();
    if (blockData && blockData.has('canvasBlock') && blockData.get('canvasBlock').has('updated_date')) {
      return true;
    }
    let hasAdvancedStyle = false;
    contentBlock.findStyleRanges((characterMetaData) => {
      if (!hasAdvancedStyle && characterMetaData.hasStyle(inlineStyleTypes.HIGHLIGHT)) {
        hasAdvancedStyle = true;
      }
    });
    return hasAdvancedStyle;
  });
};
