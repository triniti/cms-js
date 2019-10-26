import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { Card } from '@triniti/admin-ui-plugin/components';
import ButtonToolbarAsset from './ButtonToolbarAsset';

export default SortableElement(
  ({
    gallerySequence,
    isDisabled,
    imagesPerRow,
    invalidSeqSet,
    node,
    onEditAsset,
    onEditSequence,
    onRemoveAsset,
    showEditSequence,
  }) => (
    <div
      style={{ float: 'left', marginRight: '10px', width: `calc(calc(100% - ${imagesPerRow * 10}px) / ${imagesPerRow}` }}
    >
      <Card
        inverse
        shadow
        style={{
          cursor: isDisabled ? 'auto' : 'pointer',
          marginBottom: '10px',
          border: invalidSeqSet.has(node.get('gallery_seq')) ? '2px dashed #ffc107' : '',
        }}
      >
        <ButtonToolbarAsset
          disabled={isDisabled}
          gallerySequence={gallerySequence}
          node={node}
          onEditAsset={onEditAsset}
          onEditSequence={onEditSequence}
          onRemoveAsset={onRemoveAsset}
          showEditSequence={showEditSequence}
        />
      </Card>
    </div>
  ),
);
