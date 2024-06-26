import React, { useState } from 'react';
import isEmpty from 'lodash-es/isEmpty.js';
import noop from 'lodash-es/noop.js';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import { FieldArray } from 'react-final-form-arrays';
import { CreateModalButton, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import SlotModal from '@triniti/cms/plugins/curator/components/promotion-screen/SlotModal.js';
import SortableSlot from '@triniti/cms/plugins/curator/components/promotion-screen/SortableSlot.js';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

export default function SortableSlots() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { editMode, form } = useFormContext();
  const { push } = form.mutators;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div id="form-group-slots">
      <FieldArray name="slots" isEqual={isEqual}>
        {({ fields }) => {
          if (fields.length === 0) {
            if (editMode) {
              return null;
            }
            return <input className="form-control" readOnly value="No slots" />;
          }

          const handleDragCancel = () => setActiveIndex(null);
          const handleDragStart = (event) => {
            const index = fields.value.findIndex(o => `${o.name}-${o.widget_ref}` === event.active.id);
            setActiveIndex(index);
          };
          const handleDragEnd = (event) => {
            const { active, over } = event;
            const oldIndex = fields.value.findIndex(o => `${o.name}-${o.widget_ref}` === active.id);
            const newIndex = fields.value.findIndex(o => `${o.name}-${o.widget_ref}` === over.id);
            if (active.id !== over.id) {
              fields.move(oldIndex, newIndex);
            }
            setActiveIndex(null);
          };

          return (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragCancel={handleDragCancel}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={fields.value || []} strategy={verticalListSortingStrategy}>
                <ul className="SortableList">
                  {fields.map((fname, index) => {
                    const handleRemove = () => fields.remove(index);
                    const handleUpdate = pbj => fields.update(index, pbj.toObject());
                    return (
                      <SortableSlot
                        key={fname}
                        name={fname}
                        pbjName="slots"
                        onDragEnd={handleDragEnd}
                        onRemove={handleRemove}
                        onUpdate={handleUpdate}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
              <DragOverlay>
                {activeIndex !== null && (
                  <SortableSlot
                    name={`slots[${activeIndex}]`}
                    pbjName="slots"
                    onDragEnd={noop}
                    onRemove={noop}
                    onUpdate={noop}
                    asOverlay
                  />
                )}
              </DragOverlay>
            </DndContext>
          );
        }}
      </FieldArray>

      {editMode && (
        <CreateModalButton
          className="mb-0"
          text="Add Slot"
          icon="plus-outline"
          modal={withPbj(SlotModal, 'triniti:curator::slot:v1')}
          modalProps={{
            editMode,
            curie: 'triniti:curator::slot:v1',
            onSubmit: (pbj) => {
              push('slots', pbj.toObject());
            },
          }}
        />
      )}
    </div>
  );
}
