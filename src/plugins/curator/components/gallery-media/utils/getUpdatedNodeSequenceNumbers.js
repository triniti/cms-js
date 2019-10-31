/* eslint-disable no-param-reassign */
/* eslint-disable-next-line max-len */
const getAutoCorrectedNodeSequence = (currentSequence, currentIndex, nodes, direction, correctedNodeSequence = {}) => {
  const nextIndex = (direction === 'reverse') ? currentIndex - 1 : currentIndex + 1;
  const nextNode = nodes[nextIndex];
  if (!nextNode || !nextNode.has('gallery_seq')) {
    return correctedNodeSequence;
  }

  const nextGallerySeq = nextNode.get('gallery_seq');
  const isValidSequence = (direction === 'reverse') ? nextGallerySeq > currentSequence : nextGallerySeq < currentSequence;
  if (isValidSequence) {
    return correctedNodeSequence;
  }

  const diff = Math.abs(nextGallerySeq - currentSequence) + 10;
  const nextSequence = (direction === 'reverse') ? nextGallerySeq + diff : nextGallerySeq - diff;

  correctedNodeSequence[nextNode.get('_id').toString()] = nextSequence;

  return getAutoCorrectedNodeSequence(
    nextSequence,
    nextIndex,
    nodes,
    direction,
    correctedNodeSequence,
  );
};

/**
 * Ensure and get valid and unique sequences to prevent duplication.
 * @param oldIndex
 * @param newIndex
 * @param lowSequenceIndex
 * @param highSequenceIndex
 * @param nodes
 * @return {{}}
 */
const getUniqueNodeSequence = (oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, nodes) => {
  const newNodes = [...nodes];

  const distanceFromStart = newIndex - 0;
  const distanceFromEnd = newNodes.length - newIndex;
  const isNearFromStartIndex = distanceFromEnd > distanceFromStart;

  const highSequence = newNodes[highSequenceIndex].get('gallery_seq');
  const lowSequence = newNodes[lowSequenceIndex].get('gallery_seq');
  const toBeCorrectedSequenceIndex = isNearFromStartIndex ? highSequenceIndex : lowSequenceIndex;

  const toBeCorrectedNode = newNodes[toBeCorrectedSequenceIndex];
  const movedNode = newNodes[oldIndex];
  const addendNode = newNodes[isNearFromStartIndex ? lowSequenceIndex : highSequenceIndex];

  let toBeCorrectedSequence = toBeCorrectedNode.get('gallery_seq');
  let newSequence = highSequence;
  while (toBeCorrectedSequence === newSequence
      || lowSequence === newSequence
      || highSequence === newSequence) {
    toBeCorrectedSequence = isNearFromStartIndex ? toBeCorrectedSequence + 10
      : toBeCorrectedSequence - 10;
    newSequence = Math.ceil((toBeCorrectedSequence + addendNode.get('gallery_seq')) / 2);
  }

  const autoCorrectedNodeSequence = getAutoCorrectedNodeSequence(
    toBeCorrectedSequence,
    toBeCorrectedSequenceIndex,
    newNodes,
    isNearFromStartIndex ? 'reverse' : 'forward',
  );
  const uniqueNodeSequence = {
    ...{
      [movedNode.get('_id').toString()]: newSequence,
      [toBeCorrectedNode.get('_id').toString()]: toBeCorrectedSequence,
    },
    ...autoCorrectedNodeSequence,
  };

  return uniqueNodeSequence;
};

const positionSwap = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  const oldIndexGallerySequence = nodes[oldIndex].get('gallery_seq');
  const newIndexGallerySequence = nodes[newIndex].get('gallery_seq');

  if (oldIndexGallerySequence === newIndexGallerySequence) {
    const lowSequenceIndex = oldIndex;
    const highSequenceIndex = newIndex;
    return getUniqueNodeSequence(oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, newNodes);
  }

  return {
    [newNodes[newIndex].get('_id').toString()]: oldIndexGallerySequence,
    [newNodes[oldIndex].get('_id').toString()]: newIndexGallerySequence,
  };
};

const moveToFirstPosition = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  const firstNodeGallerySequence = nodes[0].get('gallery_seq');
  const secondNodeGallerySequence = nodes[1].get('gallery_seq');
  const updatedFirstNodeGallerySequence = Math.ceil(
    (firstNodeGallerySequence + secondNodeGallerySequence) / 2,
  );
  return {
    [newNodes[oldIndex].get('_id').toString()]: firstNodeGallerySequence,
    [newNodes[0].get('_id').toString()]: updatedFirstNodeGallerySequence,
  };
};

const moveToLastPosition = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  const lastNodeGallerySequence = nodes[newIndex].get('gallery_seq');
  const penultimateNodeGallerySequence = nodes[newIndex - 1].get('gallery_seq');
  const updatedLastNodeGallerySequence = Math.ceil(
    (penultimateNodeGallerySequence + lastNodeGallerySequence) / 2,
  );
  return {
    [newNodes[oldIndex].get('_id').toString()]: lastNodeGallerySequence,
    [newNodes[newIndex].get('_id').toString()]: updatedLastNodeGallerySequence,
  };
};

const move = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  let lowSequenceNumber = 0;
  let highSequenceNumber = 0;
  let lowSequenceIndex = 0;
  let highSequenceIndex = 0;

  if (newIndex < oldIndex) {
    lowSequenceIndex = newIndex;
    highSequenceIndex = newIndex - 1;
    lowSequenceNumber = nodes[lowSequenceIndex].get('gallery_seq');
    highSequenceNumber = nodes[highSequenceIndex].get('gallery_seq');
  } else if (newIndex > oldIndex) {
    lowSequenceIndex = newIndex + 1;
    highSequenceIndex = newIndex;
    lowSequenceNumber = nodes[lowSequenceIndex].get('gallery_seq');
    highSequenceNumber = nodes[highSequenceIndex].get('gallery_seq');
  }

  const newSequence = Math.ceil((lowSequenceNumber + highSequenceNumber) / 2);
  if (newSequence === highSequenceNumber) {
    return getUniqueNodeSequence(oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, newNodes);
  }

  return {
    [newNodes[oldIndex].get('_id').toString()]: newSequence,
  };
};

export default (oldIndex, newIndex, nodes) => {
  if (newIndex === oldIndex + 1 || newIndex === oldIndex - 1) {
    return positionSwap(oldIndex, newIndex, nodes);
  }
  if (newIndex === 0) {
    return moveToFirstPosition(oldIndex, newIndex, nodes);
  }
  if (newIndex === nodes.length - 1) {
    return moveToLastPosition(oldIndex, newIndex, nodes);
  }
  return move(oldIndex, newIndex, nodes);
};
