import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';

import SortableContainer from './SortableContainer';

import './styles.scss';

const SortableGrid = ({
  imagesPerRow,
  invalidSeqSet,
  isEditMode,
  nodes,
  onEditAsset,
  onEditSequence,
  onRemoveAsset,
  onReorderGalleryAssets,
  showEditSequence,
}) => (
  <SortableContainer
    axis="xy"
    disabled={!isEditMode}
    imagesPerRow={imagesPerRow}
    invalidSeqSet={invalidSeqSet}
    nodes={nodes}
    onEditAsset={onEditAsset}
    onEditSequence={onEditSequence}
    onRemoveAsset={onRemoveAsset}
    onSortEnd={onReorderGalleryAssets}
    showEditSequence={showEditSequence}
  />
);

SortableGrid.propTypes = {
  imagesPerRow: PropTypes.number.isRequired,
  invalidSeqSet: PropTypes.object, // eslint-disable-line
  isEditMode: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onEditAsset: PropTypes.func,
  onEditSequence: PropTypes.func,
  onRemoveAsset: PropTypes.func,
  onReorderGalleryAssets: PropTypes.func,
  showEditSequence: PropTypes.bool,
};

SortableGrid.defaultProps = {
  isEditMode: false,
  invalidSeqSet: new Set(),
  nodes: [],
  onEditAsset: noop,
  onEditSequence: noop,
  onRemoveAsset: noop,
  onReorderGalleryAssets: noop,
  showEditSequence: false,
};

export default SortableGrid;
