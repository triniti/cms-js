import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const caretFromPoint = (x, y) => {
  if (typeof document.caretRangeFromPoint === 'function') {
    return document.caretRangeFromPoint(x, y);
  }
  if (typeof document.caretPositionFromPoint === 'function') {
    const pos = document.caretPositionFromPoint(x, y);
    if (!pos) {
      return null;
    }
    const range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    return range;
  }
  return null;
};

// While the user drags a text selection out the left side of the editor, the
// browser collapses the selection focus to the start of the contenteditable.
// Clamp the focus to the leftmost text column at the current mouse Y so the
// selection follows the cursor's vertical position instead of jumping to the
// top of the editor.
export default function EdgeSelectionPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let isDragging = false;
    let activeRoot = null;

    const onMouseDown = (event) => {
      if (event.button !== 0 || !editor.isEditable()) {
        return;
      }
      isDragging = true;
    };

    const onDragStart = () => {
      isDragging = false;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (event) => {
      if (!isDragging || !activeRoot) {
        return;
      }

      if ((event.buttons & 1) !== 1) {
        isDragging = false;
        return;
      }

      const rect = activeRoot.getBoundingClientRect();
      const paddingLeft = parseFloat(window.getComputedStyle(activeRoot).paddingLeft) || 0;
      const innerLeft = rect.left + paddingLeft;
      if (event.clientX >= innerLeft) {
        return;
      }

      const range = caretFromPoint(innerLeft + 1, event.clientY);
      if (!range) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return;
      }

      if (!activeRoot.contains(selection.anchorNode) || !activeRoot.contains(range.startContainer)) {
        return;
      }

      selection.extend(range.startContainer, range.startOffset);
    };

    const unregisterRoot = editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement) {
        prevRootElement.removeEventListener('mousedown', onMouseDown);
        prevRootElement.removeEventListener('dragstart', onDragStart);
      }
      if (rootElement) {
        rootElement.addEventListener('mousedown', onMouseDown);
        rootElement.addEventListener('dragstart', onDragStart);
      }
      activeRoot = rootElement;
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onMouseUp);

    return () => {
      unregisterRoot();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onMouseUp);
    };
  }, [editor]);

  return null;
}
