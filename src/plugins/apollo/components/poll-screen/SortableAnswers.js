import React, { useState } from 'react';
import isEmpty from 'lodash-es/isEmpty.js';
import noop from 'lodash-es/noop.js';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import { FieldArray } from 'react-final-form-arrays';
import { CreateModalButton, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import AnswerModal from '@triniti/cms/plugins/apollo/components/poll-screen/AnswerModal.js';
import SortableAnswer from '@triniti/cms/plugins/apollo/components/poll-screen/SortableAnswer.js';
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

export default function SortableAnswers() {
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
    <div id="form-group-answers">
      <FieldArray name="answers" isEqual={isEqual}>
        {({ fields }) => {
          if (fields.length === 0) {
            if (editMode) {
              return null;
            }
            return <input className="form-control" readOnly value="No answers" />;
          }

          const handleDragCancel = () => setActiveIndex(null);
          const handleDragStart = (event) => {
            const index = fields.value.findIndex(o => o._id === event.active.id);
            setActiveIndex(index);
          };
          const handleDragEnd = (event) => {
            const { active, over } = event;
            const oldIndex = fields.value.findIndex(o => o._id === active.id);
            const newIndex = fields.value.findIndex(o => o._id === over.id);
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
                      <SortableAnswer
                        name={fname}
                        pbjName="answers"
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
                  <SortableAnswer
                    name={`answers[${activeIndex}]`}
                    pbjName="answers"
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
          text="Add Answer"
          icon="plus-outline"
          modal={withPbj(AnswerModal, `${APP_VENDOR}:apollo::poll-answer:v1`)}
          modalProps={{
            editMode,
            curie: `${APP_VENDOR}:apollo::poll-answer:v1`,
            onSubmit: (pbj) => {
              push('answers', pbj.toObject());
            },
          }}
        />
      )}
    </div>
  );
}
