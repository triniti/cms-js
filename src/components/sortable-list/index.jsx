import React, { Fragment, useMemo, useState } from 'react';
import {
  DragOverlay,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import SortableItem, { DragHandle } from './SortableItem';

import './SortableSlots.scss';

const SortableList = ({
  keyField = 'name', // Specify a unique key field to use from object list
  items = [],
  onChange,
  renderItem,
}) => {
  const [ active, setActive ] = useState(null);
  const activeItem = useMemo(
    () => items.find((item) => item[keyField] === active?.id),
    [active, items],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActive(active.id) }
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex((item) => item[keyField] === active.id);
          const overIndex = items.findIndex((item) => item[keyField] === over.id);
          
          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => setActive(null) }
    >
      <SortableContext items={items.map(i => i[keyField])}>
        <ul className="SortableList" role="application">
          {items.map((item, i) => {
            return <Fragment key={item[keyField]}>{renderItem({ item, index: i })}</Fragment>;
          })}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={
        {
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.4"
              }
            }
          })
        }
      }>
        {activeItem && renderItem({ activeItem, index: i })}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableList;
SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;