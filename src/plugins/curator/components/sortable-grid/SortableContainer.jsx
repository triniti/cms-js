import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { Container } from '@triniti/admin-ui-plugin/components';
import SortableElement from './SortableElement';

export default SortableContainer(
  ({ disabled,
    imagesPerRow,
    invalidSeqSet,
    nodes,
    multiSelect,
    onEditAsset,
    onEditSequence,
    onRemoveAsset,
    onSelect,
    selected,
    showEditSequence,
  }) => (
    <Container
      className="pb-0 pr-0"
      style={{
        overflow: 'hidden',
        overflowY: 'auto',
        height: 'calc(100vh - 25rem)',
      }}
    >
      {nodes.map((node, index) => (
        <SortableElement
          disabled={disabled}
          imagesPerRow={imagesPerRow}
          isDisabled={disabled} // disabled gets hijacked https://github.com/clauderic/react-sortable-hoc/blob/master/src/SortableElement/index.js#L89
          index={index}
          invalidSeqSet={invalidSeqSet}
          isSelected={selected.indexOf(node.get('_id').toNodeRef().toString()) > -1}
          key={node.get('_id')}
          multiSelect={multiSelect}
          node={node}
          onEditAsset={onEditAsset}
          onEditSequence={onEditSequence}
          onRemoveAsset={onRemoveAsset}
          onSelect={onSelect}
          showEditSequence={showEditSequence}
        />
      ))}
    </Container>
  ),
);
