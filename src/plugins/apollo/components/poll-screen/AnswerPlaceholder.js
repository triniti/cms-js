import React from 'react';
import kebabCase from 'lodash-es/kebabCase';
import lowerCase from 'lodash-es/lowerCase';
import { Button, CardText } from 'reactstrap';
import { useField } from 'react-final-form';
import { CreateModalButton, Icon, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import schemaToCurie from 'utils/schemaToCurie';
import AnswerModal from 'plugins/apollo/components/poll-screen/AnswerModal';

export default function AnswerPlaceholder(props) {
  const { editMode } = useFormContext();
  const { componentDragHandle, onRemove, onUpdate, name: fieldName } = props;
  const { input } = useField(fieldName);

  const { title, initial_votes, _schema } = input.value;
  const curie = schemaToCurie(_schema);
  const key = `${kebabCase(lowerCase(title))}-${initial_votes}`;

  const rowClassnames = editMode
    ? 'd-flex flex-nowrap align-items-center'
    : 'd-flex flex-nowrap align-items-center'

  return (
    <div
      key={key}
      data-id={key}
      className={rowClassnames}
    >
      <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
        {componentDragHandle || <Icon imgSrc="insert" size="lg" className="text-black-50" />}
      </div>
      <div className="d-flex px-2">
        <CardText className="ms-1 mb-1">{title}</CardText>
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        <CreateModalButton
          text=""
          color="hover"
          className="me-0 mb-0 rounded-circle"
          icon={editMode ? 'pencil' : 'eye'}
          modal={withPbj(AnswerModal, curie, input.value)}
          modalProps={{
            editMode,
            curie,
            onSubmit: onUpdate,
          }}
        />
        {editMode && (
          <Button color="hover" className="mb-0 rounded-circle" onClick={onRemove}>
            <Icon imgSrc="trash" alt="Remove" />
          </Button>
        )}
      </div>
    </div>
  );
}
