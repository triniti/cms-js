import React from 'react';
import { Card } from 'reactstrap';
import ButtonToolbarAsset from '@triniti/cms/plugins/curator/components/sortable-grid/ButtonToolbarAsset.js';
import { useSortable } from '@dnd-kit/sortable';

const itemStyles = {
  float: 'left',
  marginRight: '10px',
  minWidth: '110px',
  cursor: 'grab',
};

export default function SortableItem({
  id,
  children,
  invalidSeqSet,
  imagesPerRow,
  isSelected,
  editMode,
  onSelect,
  node,
  ...props
}) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id, disabled: !editMode });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};
  style.width = `calc(calc(100% - ${imagesPerRow * 10}px) / ${imagesPerRow}`;

  return (
    <div ref={setNodeRef} style={{ ...itemStyles, ...style }} {...attributes} {...listeners}>
      <Card
        inverse
        style={{
          cursor: !editMode ? 'auto' : 'pointer',
          marginBottom: '10px',
          border: invalidSeqSet.has(node.get('gallery_seq')) ? '2px dashed #ffc107' : '',
        }}
      >
        <ButtonToolbarAsset
          {...props}
          editMode={editMode}
          node={node}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      </Card>
    </div>
  );
}
