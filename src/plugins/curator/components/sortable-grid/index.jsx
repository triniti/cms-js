import React from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';

import SortableContainer from './SortableContainer';
import './styles.scss';

export default class SortableGrid extends React.PureComponent {
  static propTypes = {
    imagesPerRow: PropTypes.number.isRequired,
    invalidSeqSet: PropTypes.object, // eslint-disable-line
    isEditMode: PropTypes.bool,
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    onEditAsset: PropTypes.func,
    onEditSequence: PropTypes.func,
    onRemoveAsset: PropTypes.func,
    onReorderGalleryAssets: PropTypes.func,
    showEditSequence: PropTypes.bool,
    updatedGallerySequences: PropTypes.object,
  };

  static defaultProps = {
    isEditMode: false,
    invalidSeqSet: new Set(),
    nodes: [],
    onEditAsset: noop,
    onEditSequence: noop,
    onRemoveAsset: noop,
    onReorderGalleryAssets: noop,
    showEditSequence: false,
    updatedGallerySequences: null,
  };

  constructor(props) {
    super(props);

    this.state = { nodes: props.nodes };
    this.handleSortEnd = this.handleSortEnd.bind(this);
  }

  handleSortEnd({ oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }

    const { onReorderGalleryAssets } = this.props;
    const { nodes } = this.state;
    const oldOrderedNodes = [...nodes];
    const newOrderedNodes = arrayMove(oldOrderedNodes, oldIndex, newIndex);
    this.setState({ nodes: newOrderedNodes });
    onReorderGalleryAssets(oldIndex, newIndex, oldOrderedNodes, newOrderedNodes);
  }

  render() {
    const {
      imagesPerRow,
      invalidSeqSet,
      isEditMode,
      onEditAsset,
      onEditSequence,
      onRemoveAsset,
      showEditSequence,
      updatedGallerySequences,
    } = this.props;
    const { nodes } = this.state;

    return (
      <SortableContainer
        axis="xy"
        disabled={!isEditMode}
        imagesPerRow={imagesPerRow}
        invalidSeqSet={invalidSeqSet}
        nodes={nodes}
        onEditAsset={onEditAsset}
        onEditSequence={onEditSequence}
        onRemoveAsset={onRemoveAsset}
        onSortEnd={this.handleSortEnd}
        showEditSequence={showEditSequence}
        updatedGallerySequences={updatedGallerySequences}
      />
    );
  }
}
