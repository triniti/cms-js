import React from 'react';
import isEmpty from 'lodash-es/isEmpty';
import fastDeepEqual from 'fast-deep-equal/es6';
import { FieldArray } from 'react-final-form-arrays';
import { CreateModalButton, SortableList, withPbj } from 'components';
import AnswerPlaceholder from 'plugins/apollo/components/poll-screen/AnswerPlaceholder';
import AnswerModal from 'plugins/apollo/components/poll-screen/AnswerModal';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

const SortableAnswers = (props) => {
  const { editMode, form } = props;
  const { push } = form.mutators;
  const onChange = (answers) => form.change('answers', answers);

  return (
    <div id="sortable-answers">
      <FieldArray name="answers" isEqual={isEqual}>
        {({ fields }) => {
          if (!editMode && fields.length === 0) {
            return <input className="form-control" readOnly value="No answers" />;
          }

          const handleUpdate = index => pbj => fields.update(index, pbj.toObject());

          return (
            <SortableList
              keyField="_id"
              items={fields.value}
              onChange={onChange}
              renderItem={({item, index}) => (
                <SortableList.Item id={item._id}>
                  <AnswerPlaceholder
                    name={`answers[${index}]`}
                    pbjName="answers"
                    fieldName="answers"
                    onRemove={() => fields.remove(index)}
                    onUpdate={handleUpdate(index)}
                    componentDragHandle={<SortableList.DragHandle />}
                  />
                </SortableList.Item>
              )}
              />
            );
        }}
      </FieldArray>
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
    </div>
  );
}

export default SortableAnswers;