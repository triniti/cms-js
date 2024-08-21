import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ButtonToolbar, Card, Input, Label, Media } from 'reactstrap';
import { BackgroundImage, Icon } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function SortableImage(props) {
  const { id, index, seq, image, batch, isReordering, canReorder } = props;
  const [isHovering, setIsHovering] = useState(false);
  const previewUrl = damUrl(image.get('_id'), '1by1', 'sm');
  const isSelected = !isReordering && batch.has(image);
  const isSeqDifferent = isReordering && image.get('gallery_seq') !== seq;

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
    width: 'calc(10% - 16px)',
    boxShadow: isDragging ? "0 0 0 2px rgba(8, 160, 232, 0.3), 0 4px 12px rgba(0,0,0,0.2)" : undefined,
    borderColor: isDragging ? "var(--bs-body-bg) !important" : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      key={id}
      className="border m-2 p-0 rounded-3 overflow-hidden"
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
        className={`mb-0 ${isSelected || isSeqDifferent ? 'selected focus-ring-box-shadow' : ''}`}
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
                    <Input type="checkbox" id={id} onChange={() => batch.toggle(image)} checked={isSelected} />
                  </Label>
                )}
              </>
            )}
            {isHovering && (
              <a href={nodeUrl(image, 'edit')} target="_blank" rel="noopener noreferrer" className="d-inline-block p-2 pb-1 text-white opacity-75">
                <Icon imgSrc="pencil" alt="edit" size="md" />
              </a>
            )}
          </ButtonToolbar>
        )}
      </Card>
    </div>
  );
}
