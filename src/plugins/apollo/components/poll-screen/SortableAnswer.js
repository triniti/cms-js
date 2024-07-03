import React from 'react';
import { Button, CardText } from 'reactstrap';
import { useField } from 'react-final-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreateModalButton, Icon, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import schemaToCurie from '@triniti/cms/utils/schemaToCurie.js';
import AnswerModal from '@triniti/cms/plugins/apollo/components/poll-screen/AnswerModal.js';

export default function SortableAnswer(props) {
  const { editMode } = useFormContext();
  const { asOverlay = false, onRemove, onUpdate, name: fieldName } = props;
  const { input } = useField(fieldName);
  const { _id, title, _schema } = input.value;
  const key = _id;
  const curie = schemaToCurie(_schema);

  const {
    attributes,
    isDragging = false,
    listeners,
    setNodeRef,
    transform = null,
    transition,
  } = asOverlay ? {} : useSortable({ id: _id });

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const conditionalProps = asOverlay ? {} : { ref: setNodeRef, 'data-id': key };

  return (
    <li
      {...conditionalProps}
      key={key}
      className="sortable-item d-flex flex-nowrap align-items-center"
      style={style}
    >
      {editMode && (
        <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
          {!asOverlay && (
            <button className="sortable-drag-handle btn-hover btn-hover-bg" {...attributes} {...listeners}>
              <Icon imgSrc="drag" />
            </button>
          )}
          {asOverlay && <span className="sortable-drag-handle btn-hover btn-hover-bg"><Icon imgSrc="drag" /></span>}
        </div>
      )}
      <div className="d-flex px-2">
        <CardText>{title}</CardText>
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
    </li>
  );
}
