import React, { createContext, useContext, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from 'components';
import useFormContext from 'components/useFormContext';

export function DragHandle() {
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  const className = editMode ? 'DragHandle ' : 'DragHandle disabled';

  return (
    <button className={className} {...attributes} {...listeners} ref={ref}>
      <Icon imgSrc="drag" />
    </button>
  );
}

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {}
});

export default function SortableItem({ children, id }) {
  const formContext = useFormContext();
  const { editMode } = formContext;
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
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
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