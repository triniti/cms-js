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
  const id = nodeToMove.get('_id').toString();
  const nodes = [...nodesToReorder];

  const oldIndex = nodes.findIndex(node => node.get('_id').toString() === id);
  if (!gallerySequence || oldIndex < 0) {
    return nodes;
  }

  const targetIndex = nodes.findIndex(node => node.get('gallery_seq') < gallerySequence);
  let newIndex = oldIndex < targetIndex ? targetIndex - 1 : targetIndex;
  newIndex = newIndex < 0 ? (nodes.length - 1) : newIndex;
  nodes.splice(newIndex, 0, nodes.splice(oldIndex, 1)[0]);

  return nodes;
};
