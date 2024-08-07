import { $isAtNodeEnd } from '@lexical/selection';

export default (selection) => {
  if (!selection || !selection.anchor) {
    return null;
  }

  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }

  return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
};
