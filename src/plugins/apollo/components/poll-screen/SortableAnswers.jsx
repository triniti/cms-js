import React, { useEffect, useRef } from 'react';
import isEmpty from 'lodash-es/isEmpty';
import fastDeepEqual from 'fast-deep-equal/es6';
import { FieldArray } from 'react-final-form-arrays';
import { CreateModalButton, withPbj } from 'components';
import Sortable from 'sortablejs';
import AnswerPlaceholder from 'plugins/apollo/components/poll-screen/AnswerPlaceholder';
import AnswerModal from 'plugins/apollo/components/poll-screen/AnswerModal';
import noop from 'lodash/noop';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

export default function SortableAnswers(props) {
  const { editMode, form } = props;
  const { move, push } = form.mutators;
  const sortableRef = useRef();

  useEffect(() => {
    if (!editMode) {
      return noop;
    }

    Sortable.create(sortableRef.current, {
      draggable: '.sortable-field',
      handle: '.sortable-handle',
      onEnd: evt => move('answers', evt.oldDraggableIndex, evt.newDraggableIndex),
    });
  }, [editMode]);

  return (
    <>
      <div ref={sortableRef} className="bg-gray-100 rounded px-2 overflow-hidden mb-2">
        <FieldArray name="answers" isEqual={isEqual}>
          {({ fields }) => {
            if (!editMode && fields.length === 0) {
              return <input className="form-control" readOnly value="No answers" />;
            }

            return fields.map((fname, index) => {
              const handleRemove = () => fields.remove(index);
              const handleUpdate = pbj => fields.update(index, pbj.toObject());

              return (
                <AnswerPlaceholder
                  key={fname}
                  name={fname}
                  index={index}
                  pbjName="answers"
                  onRemove={handleRemove}
                  onUpdate={handleUpdate}
                  isFirst={index === 0}
                  isLast={index === fields.length - 1}
                />
              );
            });
          }}
        </FieldArray>
      </div>
      {editMode && (
        <CreateModalButton
          className="mb-0"
          text="Add Answer"
          icon={'plus-outline'}
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
    </>
  );
}
