import React from 'react';
import isEmpty from 'lodash-es/isEmpty.js';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import { FieldArray } from 'react-final-form-arrays';
import { CreateModalButton, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import SlotModal from '@triniti/cms/plugins/curator/components/promotion-screen/SlotModal.js';
import SortableSlot from '@triniti/cms/plugins/curator/components/promotion-screen/SortableSlot.js';
import {
  DndContext,
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

          const handleDragEnd = (event) => {
            const { active, over } = event;
            const oldIndex = fields.value.findIndex(o => `${o.name}-${o.widget_ref}` === active.id);
            const newIndex = fields.value.findIndex(o => `${o.name}-${o.widget_ref}` === over.id);
            if (active.id !== over.id) {
              fields.move(oldIndex, newIndex);
            }
          };

          const items = fields.value.map(o => `${o.name}-${o.widget_ref}`);

          return (
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="sortable-list">
                  {fields.map((fname, index) => {
                    const o = fields.value[index];
                    const id = `${o.name}-${o.widget_ref}`;
                    const handleRemove = () => fields.remove(index);
                    const handleUpdate = pbj => fields.update(index, pbj.toObject());
                    return (
                      <SortableSlot
                        key={id}
                        id={id}
                        index={index}
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
