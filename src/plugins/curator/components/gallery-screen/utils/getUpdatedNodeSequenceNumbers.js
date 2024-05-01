/* eslint-disable no-param-reassign */
/* eslint-disable-next-line max-len */
const getAutoCorrectedNodeSequenceNumber = (currentSequence, currentIndex, nodes, direction, correctedNodeSequence = {}) => {
  const nextIndex = (direction === 'reverse') ? currentIndex - 1 : currentIndex + 1;
  const nextNode = nodes[nextIndex];
  if (!nextNode || !nextNode.has('gallery_seq')) {
    return correctedNodeSequence;
  }

  const nextGallerySeq = nextNode.get('gallery_seq');
  const isValid = (direction === 'reverse') ? nextGallerySeq > currentSequence
    : nextGallerySeq < currentSequence;
  if (isValid) {
    return correctedNodeSequence;
  }

  const correctionSum = Math.abs(nextGallerySeq - currentSequence) + 10;
  const correctedGallerySeq = (direction === 'reverse') ? nextGallerySeq + correctionSum
    : nextGallerySeq - correctionSum;

  correctedNodeSequence[nextNode.get('_id').toString()] = correctedGallerySeq;

  return getAutoCorrectedNodeSequenceNumber(
    correctedGallerySeq,
    nextIndex,
    nodes,
    direction,
    correctedNodeSequence,
  );
};

/**
 * Get valid unique sequences when duplication of sequence occurs.
 * @param oldIndex
 * @param newIndex
 * @param lowSequenceIndex
 * @param highSequenceIndex
 * @param nodes
 * @return {{}}
 */
const getUniqueNodeSequenceNumber = (oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, nodes) => {
  const newNodes = [...nodes];

  const distanceFromStart = newIndex - 0;
  const distanceFromEnd = (newNodes.length - 1) - newIndex;
  const isNearFromStartIndex = distanceFromEnd > distanceFromStart;
  const correctedSequenceIndex = isNearFromStartIndex ? highSequenceIndex : lowSequenceIndex;
  const recurseDirection = isNearFromStartIndex ? 'reverse' : 'forward';

  const highSequenceNode = newNodes[highSequenceIndex];
  const lowSequenceNode = newNodes[lowSequenceIndex];
  const addendNode = newNodes[isNearFromStartIndex ? lowSequenceIndex : highSequenceIndex];
  const movedNode = newNodes[oldIndex];
  const correctedNode = newNodes[correctedSequenceIndex];

  let correctedSequence = correctedNode.get('gallery_seq');
  let movedNodeSequence = highSequenceNode.get('gallery_seq');
  while (correctedSequence === movedNodeSequence
  || lowSequenceNode.get('gallery_seq') === movedNodeSequence
  || highSequenceNode.get('gallery_seq') === movedNodeSequence) {
    correctedSequence = isNearFromStartIndex ? correctedSequence + 10
      : correctedSequence - 10;
    movedNodeSequence = Math.ceil((correctedSequence + addendNode.get('gallery_seq')) / 2);
  }
  const autoCorrectedNodeSequence = getAutoCorrectedNodeSequenceNumber(
    correctedSequence,
    correctedSequenceIndex,
    newNodes,
    recurseDirection,
  );

  return {
    ...autoCorrectedNodeSequence,
    ...{
      [movedNode.get('_id').toString()]: movedNodeSequence,
      [correctedNode.get('_id').toString()]: correctedSequence,
    },
  };
};

const positionSwap = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  const oldIndexGallerySequence = nodes[oldIndex].get('gallery_seq');
  const newIndexGallerySequence = nodes[newIndex].get('gallery_seq');
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
  const autoCorrectedNodeSequence = getAutoCorrectedNodeSequenceNumber(
    updatedFirstNodeGallerySequence,
    newIndex,
    newNodes,
    'forward',
  );
  return {
    ...autoCorrectedNodeSequence,
    ...{
      [newNodes[oldIndex].get('_id').toString()]: firstNodeGallerySequence + 10,
      [newNodes[0].get('_id').toString()]: updatedFirstNodeGallerySequence,
    },
  };
};

const moveToLastPosition = (oldIndex, newIndex, nodes) => {
  const newNodes = [...nodes];
  const lastNodeGallerySequence = nodes[newIndex].get('gallery_seq');
  const penultimateNodeGallerySequence = nodes[newIndex - 1].get('gallery_seq');
  const updatedLastNodeGallerySequence = Math.ceil(
    (penultimateNodeGallerySequence + lastNodeGallerySequence) / 2,
  );
  const autoCorrectedNodeSequence = getAutoCorrectedNodeSequenceNumber(
    updatedLastNodeGallerySequence,
    newIndex,
    newNodes,
    'reverse',
  );
  return {
    ...autoCorrectedNodeSequence,
    ...{
      [newNodes[oldIndex].get('_id').toString()]: lastNodeGallerySequence - 10,
      [newNodes[newIndex].get('_id').toString()]: updatedLastNodeGallerySequence,
    },
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
    return getUniqueNodeSequenceNumber(
      oldIndex,
      newIndex,
      lowSequenceIndex,
      highSequenceIndex,
      newNodes,
    );
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
