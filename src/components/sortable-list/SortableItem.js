import React, { createContext, useContext, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@triniti/cms/components/index.js';

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {}
});

export default function SortableItem({ children, id, editMode = true }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id, disabled: !editMode });
  const context = useMemo(
    () => ({
      attributes,
      editMode,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, editMode, listeners, setActivatorNodeRef]
  );
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li className="SortableItem" ref={setNodeRef} style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const {
    attributes,
    editMode,
    listeners,
    ref
  } = useContext(SortableItemContext);

  const className = editMode ? 'DragHandle ' : 'DragHandle disabled';

  return (
    <button className={className} {...attributes} {...listeners} ref={ref}>
      <Icon imgSrc="drag" />
    </button>
  );
}
