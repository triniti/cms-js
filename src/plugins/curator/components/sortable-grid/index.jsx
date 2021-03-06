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
  multiSelect,
  nodes,
  onEditAsset,
  onEditSequence,
  onRemoveAsset,
  onReorderGalleryAssets,
  onSelect,
  selected,
  showEditSequence,
}) => (
  <SortableContainer
    axis="xy"
    disabled={!isEditMode}
    imagesPerRow={imagesPerRow}
    invalidSeqSet={invalidSeqSet}
    multiSelect={multiSelect}
    nodes={nodes}
    onEditAsset={onEditAsset}
    onEditSequence={onEditSequence}
    onRemoveAsset={onRemoveAsset}
    onSortEnd={onReorderGalleryAssets}
    onSelect={onSelect}
    selected={selected}
    showEditSequence={showEditSequence}
  />
);

SortableGrid.propTypes = {
  imagesPerRow: PropTypes.number.isRequired,
  invalidSeqSet: PropTypes.object, // eslint-disable-line
  isEditMode: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  multiSelect: PropTypes.bool,
  onEditAsset: PropTypes.func,
  onEditSequence: PropTypes.func,
  onRemoveAsset: PropTypes.func,
  onReorderGalleryAssets: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.string),
  showEditSequence: PropTypes.bool,
};

SortableGrid.defaultProps = {
  isEditMode: false,
  invalidSeqSet: new Set(),
  nodes: [],
  multiSelect: false,
  onEditAsset: noop,
  onEditSequence: noop,
  onRemoveAsset: noop,
  onReorderGalleryAssets: noop,
  onSelect: noop,
  selected: [],
  showEditSequence: false,
};

export default SortableGrid;
