import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ButtonToolbar, Card, Input, Label, Media } from 'reactstrap';
import { BackgroundImage, Icon } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function SortableImage(props) {
  const { id, index, node, batch, isReordering, canReorder } = props;
  const [isHovering, setIsHovering] = useState(false);
  const previewUrl = damUrl(node.get('_id'), '1by1', 'sm');
  const isSelected = !isReordering && batch.has(node);

  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseOver = () => setIsHovering(true);

  const {
    attributes,
    isDragging = false,
    listeners,
    setNodeRef,
    transform = null,
    transition,
  } = useSortable({
    id,
    disabled: !canReorder,
  });

  const style = {
    minWidth: '100px',
    width: 'calc(10% - 8px)',
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      key={id}
      className="m-1"
      data-id={id}
      data-index={index}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        onBlur={handleMouseLeave}
        onFocus={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
        inverse
        className={`border mb-0 ${isSelected ? 'selected focus-ring-box-shadow' : ''}`}
        style={{ cursor: 'grab' }}
      >
        <Media className="ratio ratio-1x1 mt-0 mb-0">
          <BackgroundImage imgSrc={previewUrl} alt="" />
        </Media>
        {(isHovering || isSelected) && (
          <div className="position-absolute w-100 h-100 bg-opacity-50 bg-black"></div>
        )}
        {!isDragging && (
          <ButtonToolbar className="position-absolute p-0 w-100 justify-content-between">
            {(isHovering || isSelected) && (
              <>
                {(isReordering || !canReorder) && <span />}
                {!isReordering && canReorder && (
                  <Label for={id} className="p-2 mb-0" style={{ zIndex: 2, cursor: 'pointer' }}>
                    <Input type="checkbox" id={id} onChange={() => batch.toggle(node)} checked={isSelected} />
                  </Label>
                )}
              </>
            )}
            {isHovering && (
              <a href={nodeUrl(node, 'view')} target="_blank" rel="noopener noreferrer"
                 className='d-inline-block p-2 pb-1 text-white opacity-75'>
                <Icon imgSrc="external" alt="view" size="md" />
              </a>
            )}
          </ButtonToolbar>
        )}
      </Card>
    </div>
  );
}
