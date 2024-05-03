import React from 'react';
import { CreateModalButton, SortableListField, withPbj } from '@triniti/cms/components/index.js';
import AnswerPlaceholder from 'plugins/apollo/components/poll-screen/AnswerPlaceholder';
import AnswerModal from 'plugins/apollo/components/poll-screen/AnswerModal';

const SortableAnswers = (props) => {
  const { editMode, form } = props;
  const { push } = form.mutators;

  return (
    <SortableListField
      name="answers"
      components={{
        Placeholder: AnswerPlaceholder
      }}
      keyField="_id"
      renderedNoItems={
        <input className="form-control" readOnly value="No answers." />
      }
      renderedAddItem={
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
      }
    />
  );
}

export default SortableAnswers;
