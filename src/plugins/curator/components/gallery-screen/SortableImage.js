import React, { useState } from 'react';
import { Button, ButtonToolbar, Card, Input, Media } from 'reactstrap';
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
        role="button"
        className={`p-1 mb-0 cursor-pointer ${isSelected ? 'selected' : ''}`}
      >
        <Media className="ratio ratio-1x1 mt-0 mb-0 border">
          <BackgroundImage imgSrc={previewUrl} alt="" />
        </Media>
        <ButtonToolbar style={{
          position: 'absolute',
          left: '0',
          top: '0',
          padding: '.5rem',
          width: '100%',
          justifyContent: 'space-between',
          minHeight: '44px'
        }}>
          {(isHovering || isSelected) && (
            <Input type="checkbox" onChange={() => batch.toggle(node)} checked={isSelected} />
          )}
          {isHovering && (
            <div>
              <a href={nodeUrl(node, 'view')} target="_blank" rel="noopener noreferrer">
                <Button color="light" className="rounded-circle" tag="span">
                  <Icon imgSrc="external" alt="view" />
                </Button>
              </a>
            </div>
          )}
        </ButtonToolbar>
      </Card>
    </>
  );
}
