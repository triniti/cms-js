import React, { Fragment, useContext, useMemo, useRef, useState, createContext } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import isEmpty from 'lodash-es/isEmpty';
import fastDeepEqual from 'fast-deep-equal/es6';
import { CreateModalButton, Icon, withPbj } from 'components';
import SlotPlaceholder from 'plugins/curator/components/promotion-screen/SlotPlaceholder';
import SlotModal from 'plugins/curator/components/promotion-screen/SlotModal';
import {
  DragOverlay,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import './SortableSlots.scss';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b))

const DragHandle = () =>  {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return (
    <button className="DragHandle" {...attributes} {...listeners} ref={ref}>
      <Icon imgSrc="drag" />
    </button>
  );
}

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {}
});

const SortableItem = ({ children, id }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id });
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

const SortableList = ({
  items,
  onChange,
  onRemove,
  onUpdate,
}) => {
  const [ active, setActive ] = useState(null);
  const itemValues = items?.value || [];
  const activeItem = useMemo(
    () => itemValues.find((item) => item.name === active?.name),
    [active, items]
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
          const activeIndex = items.value.findIndex(({ name }) => name === active.id);
          const overIndex = items.value.findIndex(({ name }) => name === over.id);
          
          onChange(arrayMove(items.value, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => setActive(null) }
    >
      <SortableContext items={itemValues.map(i => i.name)}>
        <ul className="SortableList" role="application">
          {itemValues.map((item, i) => {
            return <Fragment key={item.name}>{renderItem({ item, index: i, onRemove, onUpdate })}</Fragment>;
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
        {activeItem && renderItem({ activeItem, index: i, onRemove, onUpdate })}
      </DragOverlay>
    </DndContext>
  );
}

const renderItem = ({ item, index, onRemove, onUpdate }) => {
  return (
    <SortableItem id={item.name}>
      <SlotPlaceholder
        name={`slots[${index}]`}
        index={item.name}
        pbjName="slots"
        fieldName="slots"
        onRemove={() => onRemove(index)}
        onUpdate={onUpdate(index)}
        componentDragHandle={<DragHandle />}
        />
    </SortableItem>
  );
}

const SortableSlots = (props) => {
  const { editMode, form } = props;
  const { push } = form.mutators;
  const onChange = (slots) => form.change('slots', slots);

  return (
    <div id="sortable-slots">
      <FieldArray name="slots" isEqual={isEqual}>
        {({ fields }) => {
          const handleUpdate = index => pbj => fields.update(index, pbj.toObject());

          return <SortableList
            items={fields}
            onChange={onChange}
            onRemove={index => fields.remove(index)}
            onUpdate={index => handleUpdate(index)}
            />;
        }}
      </FieldArray>
      {editMode && (
        <div className="mt-1">
          <CreateModalButton
            className="mb-0"
            text="Add Slot"
            icon={'plus-outline'}
            modal={withPbj(SlotModal, 'triniti:curator::slot')}
            modalProps={{
              editMode,
              curie: 'triniti:curator::slot',
              onSubmit: (pbj) => push('slots', pbj.toObject()),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SortableSlots;