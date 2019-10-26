import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { Container } from '@triniti/admin-ui-plugin/components';
import SortableElement from './SortableElement';

export default SortableContainer(
  ({
    disabled,
    imagesPerRow,
    invalidSeqSet,
    nodes,
    onEditAsset,
    onEditSequence,
    onRemoveAsset,
    showEditSequence,
    updatedGallerySequences,
  }) => (
    <Container
      className="pb-0 pr-0"
      style={{
        overflow: 'hidden',
        overflowY: 'auto',
        height: 'calc(100vh - 21rem)',
      }}
    >
      {nodes.map((node, index) => (
        <SortableElement
          disabled={disabled}
          gallerySequence={updatedGallerySequences ? updatedGallerySequences[node.get('_id').toString()] : 0}
          imagesPerRow={imagesPerRow}
          isDisabled={disabled} // disabled gets hijacked https://github.com/clauderic/react-sortable-hoc/blob/master/src/SortableElement/index.js#L89
          index={index}
          invalidSeqSet={invalidSeqSet}
          key={node.get('_id')}
          node={node}
          onEditAsset={onEditAsset}
          onEditSequence={onEditSequence}
          onRemoveAsset={onRemoveAsset}
          showEditSequence={showEditSequence}
        />
      ))}
    </Container>
  ),
);
