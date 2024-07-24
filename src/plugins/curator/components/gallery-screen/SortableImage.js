import React, { useState } from 'react';
import { ButtonToolbar, Card, Input, Label, Media } from 'reactstrap';
import { BackgroundImage, Icon } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function SortableImage(props) {
  const { node, batch } = props;
  const [isHovering, setIsHovering] = useState(false);
  const id = node.get('_id');
  const previewUrl = damUrl(id, '1by1', 'sm');
  const isSelected = batch.has(node);

  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseOver = () => setIsHovering(true);

  return (
    <>
      <Card
        onBlur={handleMouseLeave}
        onFocus={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
        inverse
        className={`cursor-default border mb-0 ${isSelected ? 'selected focus-ring-box-shadow' : ''}`}
      >
        <Media className="ratio ratio-1x1 mt-0 mb-0">
          <BackgroundImage imgSrc={previewUrl} alt="" />
        </Media>
        {(isHovering || isSelected) && (
          <div className="position-absolute w-100 h-100 bg-opacity-50 bg-black"></div>
        )}
        <ButtonToolbar className="position-absolute p-0 w-100 justify-content-between">
          {(isHovering || isSelected) && (
            <Label for={id} className="p-2 mb-0" style={{ zIndex: 2 }}>
              <Input type="checkbox" id={id} onChange={() => batch.toggle(node)} checked={isSelected} />
            </Label>
          )}
          {isHovering && (
            <a href={nodeUrl(node, 'view')} target="_blank" rel="noopener noreferrer" className='d-inline-block p-2 pb-1 text-white opacity-75'>
              <Icon imgSrc="external" alt="view" size="md" />
            </a>
          )}
        </ButtonToolbar>
      </Card>
    </>
  );
}
