import { handleDocumentDragover, handleDocumentDrop } from '@triniti/cms/blocksmith/utils/index.js';
import { clearDragCache } from '@triniti/cms/blocksmith/utils/styleDragTarget.js';

/**
 * Cleans up editor/drag n drop state when a block is dropped outside of the editor. Included
 * as a function here so it will have a reference and can later be removed.
 */
export default () => {
  clearDragCache();
  document.querySelectorAll('.hidden-block').forEach((node) => node.classList.remove('hidden-block'));
  document.removeEventListener('dragover', handleDocumentDragover);
  document.removeEventListener('drop', handleDocumentDrop);
};
