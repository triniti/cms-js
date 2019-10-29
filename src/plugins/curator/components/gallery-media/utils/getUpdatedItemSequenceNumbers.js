function positionSwap(oldIndex, newIndex, items) {
  const newItems = [...items];
  const oldIndexGallerySequence = items[oldIndex].gallerySequence;
  const newIndexGallerySequence = items[newIndex].gallerySequence;
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
  if (newIndex < oldIndex) {
    lowSequenceNumber = items[newIndex - 1].gallerySequence;
    highSequenceNumber = items[newIndex].gallerySequence;
  } else if (newIndex > oldIndex) {
    lowSequenceNumber = items[newIndex].gallerySequence;
    highSequenceNumber = items[newIndex + 1].gallerySequence;
  }
  const newValue = Math.ceil((lowSequenceNumber + highSequenceNumber) / 2);
  return {
    [newItems[oldIndex].assetId]: newValue,
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
