import React from 'react';
import { Button } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';

export default function GenericSidebarButton({
  config,
  message,
  onClick: handleClick,
  replaceRegEx,
}) {
  const label = message.replace(replaceRegEx, '').replace(/(-|\s+)/g, ' ');

  return (
    <div role="presentation" onMouseDown={(e) => e.preventDefault()}>
      <Button color="blocksmith" onClick={handleClick}>
        <span key={message} className="icon-holder">
          {[
            config.icon
            && (
            <Icon
              alert
              alt={message.replace(/-/g, ' ')}
              border
              className="mt-2 mb-1"
              color="black"
              imgSrc={config.icon.imgSrc}
              key="icon"
              src={config.icon.src}
              radius="rounded"
              size="xxl"
            />
            ),
            config.iconGroup
            && (
              <span key={message} className="mt-2 mb-1 icon-group icon-group-left">
              <>
                <Icon
                  alert
                  border
                  imgSrc={config.iconGroup.icons.primary.imgSrc}
                  radius="rounded"
                  size="xxl"
                  src={config.iconGroup.icons.primary.src}
                />
                <Icon
                  imgSrc={config.iconGroup.icons.secondary.imgSrc}
                  alert
                  size="xs"
                  src={config.iconGroup.icons.secondary.src}
                />
              </>
              </span>
            ),
          ]}
        </span>
        <span>{ label }</span>
      </Button>
    </div>
  );
};
