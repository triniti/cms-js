import React from 'react';
import { Badge, Button, CardText } from 'reactstrap';
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
  const { asOverlay = false, onRemove, onUpdate, name: fieldName } = props;
  const { input } = useField(fieldName);
  const { name, widget_ref, rendering, _schema } = input.value;
  const key = `${name}-${widget_ref}`;
  const curie = schemaToCurie(_schema);
  const { node: widget } = useNode(widget_ref);

  const {
    attributes,
    isDragging = false,
    listeners,
    setNodeRef,
    transform = null,
    transition,
  } = asOverlay ? {} : useSortable({ id: key });

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
      className="SortableItem d-flex flex-nowrap align-items-center"
      style={style}
    >
      {editMode && (
        <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
          {!asOverlay && (
            <button className="DragHandle" {...attributes} {...listeners}>
              <Icon imgSrc="drag" />
            </button>
          )}
          {asOverlay && <span className="DragHandle"><Icon imgSrc="drag" /></span>}
        </div>
      )}
      <div className="d-flex px-2">
        <CardText>
          {widget && (
            <>
              <Badge color="light" pill className="me-2">{name}</Badge>
              <a href={nodeUrl(widget, 'view')} target="_blank">{widget.get('title')}</a>
              <Badge color={renderingColors[rendering]} pill className="ms-2">{rendering}</Badge>
            </>
          )}
          {!widget && (
            <>
              <Badge color="light" pill className="me-2">{name}</Badge>
              {widget_ref}
              <Badge color={renderingColors[rendering]} pill className="ms-2">{rendering}</Badge>
            </>
          )}
        </CardText>
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        <CreateModalButton
          text=""
          color="hover"
          className="me-0 mb-0 rounded-circle"
          icon={editMode ? 'pencil' : 'eye'}
          modal={withPbj(SlotModal, curie, input.value)}
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
