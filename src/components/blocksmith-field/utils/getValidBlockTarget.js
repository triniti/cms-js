import blockParentNode from 'components/blocksmith-field/utils/blockParentNode';

/**
 * Given a node (eg one provided by document.elementFromPoint), traverses
 * dom as necessary and returns the valid one, which is to say the one that is
 * a direct child of the blockParentNode.
 *
 * @param {Node} target - a state instance of a DraftJs Editor
 *
 * @returns {?Node} an EditorState instance
 */
export default (target) => {
  let validBlockTarget = target;
  if (blockParentNode.is(validBlockTarget)) {
    validBlockTarget = null; // not a valid block target
  } else if (blockParentNode.contains(validBlockTarget)) {
    while (!blockParentNode.is(validBlockTarget.parentNode)) {
      validBlockTarget = validBlockTarget.parentNode;
    }
  } else {
    validBlockTarget = null; // not a valid block target
  }
  return validBlockTarget;
};
