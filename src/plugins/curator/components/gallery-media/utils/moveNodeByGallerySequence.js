import moveNodeByIndex from './moveNodeByIndex';
/**
 * Move node to the index of the first item that has a lesser gallery sequence
 * compared to the given value of the `gallerySequence` param.
 *
 * @param gallerySequence
 * @param nodeToMove
 * @param nodesToReorder
 * @return {[*]}
 */
export default (gallerySequence, nodeToMove, nodesToReorder = []) => {
  const id = nodeToMove ? nodeToMove.get('_id').toString() : '';

  const oldIndex = nodesToReorder.findIndex(node => node.get('_id').toString() === id);
  if (oldIndex < 0) {
    return nodesToReorder.slice();
  }

  const targetIndex = nodesToReorder.findIndex(node => node.get('gallery_seq') < gallerySequence);
  let newIndex = oldIndex < targetIndex ? targetIndex - 1 : targetIndex;
  newIndex = newIndex < 0 ? (nodesToReorder.length - 1) : newIndex;

  return moveNodeByIndex(oldIndex, newIndex, nodesToReorder);
};
