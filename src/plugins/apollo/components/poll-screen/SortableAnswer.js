import React, { useMemo } from 'react';
import { Button} from 'reactstrap';
import { useField } from 'react-final-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreateModalButton, Icon, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import schemaToCurie from '@triniti/cms/utils/schemaToCurie.js';
import AnswerModal from '@triniti/cms/plugins/apollo/components/poll-screen/AnswerModal.js';

export default function SortableAnswer(props) {
  const { editMode } = useFormContext();
  const { id, index, onRemove, onUpdate, name: fieldName } = props;
  const { input } = useField(fieldName);
  
  const {
    attributes,
    isDragging = false,
    listeners,
    setNodeRef,
    transform = null,
    transition,
  } = useSortable({
    id,
    disabled: !editMode,
  });

  const style = {
    opacity: isDragging ? 0.75 : undefined,
    boxShadow: isDragging ? '0 0 0 2px rgba(8, 160, 232, 0.3), 0 4px 12px rgba(0,0,0,0.2)' : undefined,
    borderColor: isDragging ? 'var(--bs-secondary)' : undefined,
    zIndex: isDragging ? '100' : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const AnswerModalWithPbj = useMemo(() => {
    if (!input.value || !input.value._schema) {
      return null;
    }
    const curie = schemaToCurie(input.value._schema);
    return withPbj(AnswerModal, curie, input.value);
  }, [input.value]);

  // Return early if input.value is not ready
  if (!input.value) {
    return null;
  }

  const { title, _schema } = input.value;
  const curie = schemaToCurie(_schema);

  return (
    <li
      ref={setNodeRef}
      key={id}
      className="sortable-item d-flex flex-nowrap align-items-center ps-1"
      data-id={id}
      data-index={index}
      style={style}
    >
      {editMode && (
        <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1">
          <button className="sortable-drag-handle btn-hover btn-hover-bg" {...attributes} {...listeners}>
            <Icon imgSrc="drag" />
          </button>
        </div>
      )}
      <div className="d-flex p-1 align-items-center fs-6">
        <span className="text-ellipsis me-2">{title}</span>
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        {AnswerModalWithPbj && (
          <CreateModalButton
            text=""
            color="hover"
            className="me-0 mb-0 rounded-circle"
            icon={editMode ? 'pencil' : 'eye'}
            modal={AnswerModalWithPbj}
            modalProps={{
              editMode,
              curie,
              onSubmit: onUpdate,
            }}
          />
        )}
        {editMode && (
          <Button color="hover" className="mb-0 rounded-circle" onClick={onRemove}>
            <Icon imgSrc="trash" alt="Remove" />
          </Button>
        )}
      </div>
    </li>
  );
}
