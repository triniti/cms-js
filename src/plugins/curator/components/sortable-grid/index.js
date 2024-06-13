import React from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext,  } from '@dnd-kit/sortable';
import SortableItem from '@triniti/cms/plugins/curator/components/sortable-grid/SortableItem.js';

import '@triniti/cms/plugins/curator/components/sortable-grid/styles.scss';

const gridStyles = {
  // display: 'grid',
  // gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  backgroundColor: 'lightgray',
  padding: '10px',
  overflow: 'hidden auto',
  height: 'calc(100vh - 30rem)',
};

export default function SortableGrid({
  onDragEnd: handleDragEnd,
  nodes = [],
  selected,
  ...props
}) {

  // This is needed otherwise checkbox on ButtonToolbarAsset won't work
  const pointerSensor = useSensor(PointerSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      distance: 5
    },
  });
  const items = nodes.map((node) => `${node.get('_id')}`);

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={useSensors(pointerSensor)}>
      <SortableContext items={items}>
        <div style={gridStyles}>
          {nodes.map((node) => (
            <SortableItem
              {...props}
              key={`${node.get('_id')}`}
              id={`${node.get('_id')}`}
              isSelected={selected.indexOf(`${node.get('_id')}`) > -1}
              useDragOverlay={true}
              node={node}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
