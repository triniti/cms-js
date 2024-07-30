import React from 'react';
import { Badge, Button, Media } from 'reactstrap';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon, Loading } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js'
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import brokenImage from '@triniti/cms/assets/img/broken-image--xxs.jpg';

const noop = (event) => {
  console.log('noop');
  event.stopPropagation();
  event.preventDefault();
};

function SortableValue(props) {
  const {
    editMode,
    id,
    index,
    nodeRef,
    labelField = 'title',
    showImage = true,
    showLink = true,
    showType = false,
    urlTemplate = 'view',
    onRemove
  } = props;
  const { node, pbjxError } = useNode(nodeRef);

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
    minWidth: '100px',
    width: 'calc(10% - 8px)',
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return (
      <div>
        <Loading inline size="sm" error={error}>Loading {nodeRef}...</Loading>
      </div>
    );
  }

  const status = `${node.get('status')}`;
  const schema = node.schema();
  const isPublishable = schema.hasMixin('gdbots:ncr:mixin:publishable');
  const url = nodeUrl(node, urlTemplate) || nodeUrl(node, 'view');

  return (
    <li
      ref={setNodeRef}
      key={id}
      className="sortable-item d-flex flex-nowrap align-items-center"
      data-id={id}
      data-index={index}
      style={style}
    >
      {editMode && (
        <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
          <span
            className="sortable-drag-handle btn-hover btn-hover-bg"
            {...attributes}
            {...listeners}
            onClick={noop}
          >
            <Icon imgSrc="drag" />
          </span>
        </div>
      )}
      <div className="d-flex px-2">
        {showImage && (
          <Media
            src={node.has('image_ref') ? damUrl(node.get('image_ref'), '1by1', 'xs') : brokenImage}
            alt=""
            width="32"
            height="32"
            object
            className="rounded-2"
          />
        )}
        <span>{node.get(labelField)}</span>
        {showType && (
          <Badge pill color="light">{schema.getQName().getMessage()}</Badge>
        )}
        {(isPublishable || status === 'deleted') && (
          <Badge pill className={`status-${status}`}>{status}</Badge>
        )}
        {(showLink && (
          <a href={url} rel="noopener noreferrer" target="_blank" className="m-1 ms-2 me-2">
            <Icon imgSrc="external" size="sm" />
          </a>
        ))}
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        {editMode && (
          <Button color="hover" className="mb-0 rounded-circle" onClick={onRemove}>
            <Icon imgSrc="trash" alt="Remove" />
          </Button>
        )}
      </div>
    </li>
  );
}

export default function SortableValues(props) {
  const { input } = props;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = input.value.indexOf(active.id);
      const newIndex = input.value.indexOf(over.id);
      input.onChange(arrayMove(input.value, oldIndex, newIndex));
    }
  };

  const handleRemove = (index) => {
    const newValues = [...input.value];
    newValues.splice(index, 1);
    input.onChange(newValues);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
      <SortableContext items={input.value} strategy={verticalListSortingStrategy}>
        <ul className="sortable-list">
          {input.value.map((id, index) => (
            <SortableValue
              {...props}
              key={id}
              id={id}
              index={index}
              nodeRef={id}
              onRemove={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleRemove(index);
              }}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
