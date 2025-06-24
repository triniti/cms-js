import React, { useMemo } from 'react';
import { Badge, Button } from 'reactstrap';
import { useField } from 'react-final-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreateModalButton, Icon, useFormContext, withPbj } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import schemaToCurie from '@triniti/cms/utils/schemaToCurie.js';
import SlotModal from '@triniti/cms/plugins/curator/components/promotion-screen/SlotModal.js';

const renderingColors = {
  server: 'danger',
  client: 'secondary',
  lazy: 'primary',
};

export default function SortableSlot(props) {
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
  
  // Provide default values if input.value is undefined
  const value = input.value || {};
  const { name = '', widget_ref = '', rendering = 'server', _schema = '' } = value;
  const curie = _schema ? schemaToCurie(_schema) : null;
  const { node: widget } = useNode(widget_ref || null);

  const style = {
    opacity: isDragging ? 0.75 : undefined,
    boxShadow: isDragging ? '0 0 0 2px rgba(8, 160, 232, 0.3), 0 4px 12px rgba(0,0,0,0.2)' : undefined,
    borderColor: isDragging ? 'var(--bs-secondary)' : undefined,
    zIndex: isDragging ? '100' : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const SlotModalWithPbj = useMemo(() => {
    if (!curie || !input.value) return null;
    return withPbj(SlotModal, curie, input.value);
  }, [curie, input.value]);

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
        {widget && (
          <>
            <Badge color="light" pill className="me-2">{name || 'unnamed'}</Badge>
            <a href={nodeUrl(widget, 'view')} target="_blank" className="text-ellipsis me-2">{widget.get('title')}</a>
            <Badge color={renderingColors[rendering] || 'secondary'} pill>{rendering}</Badge>
          </>
        )}
        {!widget && (
          <>
            <Badge color="light" pill className="me-2">{name || 'unnamed'}</Badge>
            <span className="text-ellipsis me-2">{widget_ref || 'Loading...'}</span>
            <Badge color={renderingColors[rendering] || 'secondary'} pill>{rendering}</Badge>
          </>
        )}
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        {SlotModalWithPbj && (
          <CreateModalButton
            text=""
            color="hover"
            className="me-0 mb-0 rounded-circle"
            icon={editMode ? 'pencil' : 'eye'}
            modal={SlotModalWithPbj}
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
