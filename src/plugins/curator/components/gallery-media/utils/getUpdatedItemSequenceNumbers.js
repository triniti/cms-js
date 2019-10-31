/* eslint-disable no-param-reassign */
function getAutoCorrectedItemSequence(currentSequence, currentIndex, items, direction, correctedItemSequence = {}) {
  const nextIndex = (direction === 'reverse') ? currentIndex - 1 : currentIndex + 1;
  const nextItem = items[nextIndex];
  if (!nextItem) {
    return correctedItemSequence;
  }

  const isValid = (direction === 'reverse') ? nextItem.gallerySequence > currentSequence
    : nextItem.gallerySequence < currentSequence;
  if (isValid) {
    return correctedItemSequence;
  }

  const diff = Math.abs(nextItem.gallerySequence - currentSequence) + 10;
  // ensure that the next sequence is correct in order
  const nextSequence = (direction === 'reverse') ? nextItem.gallerySequence + diff : nextItem.gallerySequence - diff;
  correctedItemSequence[nextItem.assetId] = nextSequence;

  return getAutoCorrectedItemSequence(nextSequence, nextIndex, items, direction, correctedItemSequence);
}

/**
 * Ensure to get correct sequences to remove duplication
 * @param oldIndex
 * @param newIndex
 * @param lowSequenceIndex
 * @param highSequenceIndex
 * @param items
 * @return {{}}
 */
function getUniqueItemSequence(oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, items) {
  const newItems = [...items];

  const distanceFromStart = newIndex - 0;
  const distanceFromEnd = newItems.length - newIndex;
  const isNearFromStartIndex = distanceFromEnd > distanceFromStart;

  const highSequence = newItems[highSequenceIndex].gallerySequence;
  const lowSequence = newItems[lowSequenceIndex].gallerySequence;

  const toBeCorrectedSequenceIndex = isNearFromStartIndex ? highSequenceIndex : lowSequenceIndex;
  const toBeCorrectedItem = newItems[toBeCorrectedSequenceIndex];

  let toBeCorrectedSequence = toBeCorrectedItem.gallerySequence;
  let newSequence = highSequence;
  while (highSequence === newSequence
  || lowSequence === newSequence
  || toBeCorrectedSequence === newSequence) {
    toBeCorrectedSequence = isNearFromStartIndex ? toBeCorrectedSequence + 10 : toBeCorrectedSequence - 10;
    newSequence = Math.ceil((toBeCorrectedSequence + newItems[isNearFromStartIndex ? lowSequenceIndex : highSequenceIndex].gallerySequence) / 2);
  }

  const recurseDirection = isNearFromStartIndex ? 'reverse' : 'forward';
  const autoCorrectedItemSequence = getAutoCorrectedItemSequence(
    toBeCorrectedSequence,
    toBeCorrectedSequenceIndex,
    newItems,
    recurseDirection,
  );

  return {
    ...{
      [newItems[oldIndex].assetId]: newSequence,
      [toBeCorrectedItem.assetId]: toBeCorrectedSequence,
    },
    ...autoCorrectedItemSequence
  };
}

function positionSwap(oldIndex, newIndex, items) {
  const newItems = [...items];
  const oldIndexGallerySequence = items[oldIndex].gallerySequence;
  const newIndexGallerySequence = items[newIndex].gallerySequence;

  if (oldIndexGallerySequence === newIndexGallerySequence) {
    return getUniqueItemSequence(oldIndex, newIndex, oldIndex, newIndex, items);
  }

  return {
    [newItems[newIndex].assetId]: oldIndexGallerySequence,
    [newItems[oldIndex].assetId]: newIndexGallerySequence,
  };
}

function moveToFirstPosition(oldIndex, newIndex, items) {
  const newItems = [...items];
  const firstItemGallerySequence = items[0].gallerySequence;
  const secondItemGallerySequence = items[1].gallerySequence;
  const updatedFirstItemGallerySequence = Math.ceil(
    (firstItemGallerySequence + secondItemGallerySequence) / 2,
  );
  return {
    [newItems[oldIndex].assetId]: firstItemGallerySequence,
    [newItems[0].assetId]: updatedFirstItemGallerySequence,
  };
}

function moveToLastPosition(oldIndex, newIndex, items) {
  const newItems = [...items];
  const lastItemGallerySequence = items[newIndex].gallerySequence;
  const penultimateItemGallerySequence = items[newIndex - 1].gallerySequence;
  const updatedLastItemGallerySequence = Math.ceil(
    (penultimateItemGallerySequence + lastItemGallerySequence) / 2,
  );
  return {
    [newItems[oldIndex].assetId]: lastItemGallerySequence,
    [newItems[newIndex].assetId]: updatedLastItemGallerySequence,
  };
}

function move(oldIndex, newIndex, items) {
  const newItems = [...items];
  let lowSequenceNumber = 0;
  let highSequenceNumber = 0;
  let lowSequenceIndex = 0;
  let highSequenceIndex = 0;

  if (newIndex < oldIndex) {
    lowSequenceIndex = newIndex;
    highSequenceIndex = newIndex - 1;
    lowSequenceNumber = items[lowSequenceIndex].gallerySequence;
    highSequenceNumber = items[highSequenceIndex].gallerySequence;
  } else if (newIndex > oldIndex) {
    lowSequenceIndex = newIndex + 1;
    highSequenceIndex = newIndex;
    lowSequenceNumber = items[lowSequenceIndex].gallerySequence;
    highSequenceNumber = items[highSequenceIndex].gallerySequence;
  }

  const newSequence = Math.ceil((lowSequenceNumber + highSequenceNumber) / 2);
  if (newSequence === highSequenceNumber) {
    return getUniqueItemSequence(oldIndex, newIndex, lowSequenceIndex, highSequenceIndex, items);
  }

  return {
    [newItems[oldIndex].assetId]: newSequence,
  };
}

export default (oldIndex, newIndex, items) => {
  if (newIndex === oldIndex + 1 || newIndex === oldIndex - 1) {
    return positionSwap(oldIndex, newIndex, items);
  }
  if (newIndex === 0) {
    return moveToFirstPosition(oldIndex, newIndex, items);
  }
  if (newIndex === items.length - 1) {
    return moveToLastPosition(oldIndex, newIndex, items);
  }
  return move(oldIndex, newIndex, items);
};
