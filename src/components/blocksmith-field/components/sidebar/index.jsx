import React, { lazy, Suspense, useEffect, useState } from 'react';
import { localize } from 'plugins/utils/services/Localization';
import useCuries from 'plugins/pbjx/components/useCuries';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import {
  Button,
  Input,
  InputGroup,
  Popover,
  PopoverBody,
  PopoverHeader,
  UncontrolledTooltip,
} from 'reactstrap';
import Icon from 'components/icon';
import { blockParentNode } from 'components/blocksmith-field/utils';
import { getButtonConfig } from 'components/blocksmith-field/buttonConfig';
import sidebarSections, { vendorButtonTypes } from 'components/blocksmith-field/components/sidebar/config';

const GenericSidebarButton = lazy(() => import('components/blocksmith-field/components/generic-sidebar-button'));

export default function Sidebar({
  onHoverInsert: handleHoverInsert,
  isHoverInsertMode,
  isOpen,
  onToggleBlockModal: handleToggleBlockModal,
  popoverRef,
  onToggleSidebar: handleToggleSidebar,
}) {
  const [q, setQ] = useState('');
  const [buttons, setButtons] = useState([]);
  const blockCuries = useCuries('triniti:canvas:mixin:block:v1');
  const currentlySupported = [
    'article-block',
    'audio-block',
    'code-block',
    'divider-block',
    'document-block',
    'eme-form-block',
    'facebook-post-block',
    'facebook-video-block',
    'google-map-block',
    'gallery-block',
    'heading-block',
    'iframe-block',
    'imgur-post-block',
    'instagram-media-block',
    'quote-block',
    'text-block',
    'tiktok-embed-block',
    'page-break-block',
    'pinterest-pin-block',
    'poll-block',
    'poll-grid-block',
    'soundcloud-audio-block',
    'spotify-embed-block',
    'spotify-track-block',
    'twitter-tweet-block',
    'video-block',
    'vimeo-video-block',
    'youtube-playlist-block',
    'youtube-video-block',
  ];

  const handleClick = (schema) => {
    if (schema.getId().getMessage() === 'text-block') {
      handleHoverInsert();
      handleToggleSidebar();
    } else {
      schema.createMessage().then((block) => {
        handleToggleBlockModal(block, true); // true is for isFreshBlock prop
      })
    }
  };

  useEffect(async () => {
    const blocks = await Promise.all((blockCuries || []).map(MessageResolver.resolveCurie));
    const schemas = blocks.map((block) => block.schema());
    setButtons(schemas.reduce((acc, schema) => {
      const message = schema.getCurie().getMessage();
      if (!currentlySupported.includes(message)) {
        return acc;
      }

      const buttonConfig = getButtonConfig(message);
      acc.push({
        Button: () => <GenericSidebarButton
          config={buttonConfig}
          message={message}
          onClick={() => handleClick(schema)}
          replaceRegEx={/block/}
        />,
        schema,
      });
      return acc;
    }, []));
  }, [blockCuries]);

  if (!buttons.length) {
    return null;
  }

  const sidebarSectionsWithVendor = [{
    header: localize(buttons[0].schema.getId().getVendor()),
    matchRegEx: new RegExp(`^(${vendorButtonTypes.join('|')})`),
    doesMatch: true,
    replaceRegEx: /block/,
  }].concat(sidebarSections);

  const availableButtons = sidebarSectionsWithVendor
    .map(({ doesMatch, header, matchRegEx, replaceRegEx }) => ({
      filteredButtons: buttons
        .filter(({ schema }) => `${schema.getCurie().getMessage()} ${header.toLowerCase()}`.indexOf(q.toLowerCase()) !== -1)
        .filter(({ schema }) => (`${schema.getCurie().getMessage()}`.match(matchRegEx) ? doesMatch : !doesMatch)),
      header,
      replaceRegEx,
    }))
    .filter(({ filteredButtons }) => filteredButtons.length) // remove sections with no buttons
    .map(({ filteredButtons, header, replaceRegEx }) => (
      <div className="popover-section-holder" key={header}>
        <PopoverHeader className="text-center">{ header }</PopoverHeader>
        <PopoverBody>
          <div className="popover-row">
            {filteredButtons.map(({ Button: ButtonComponent, schema }) => (
              <ButtonComponent
                key={schema.getCurie().getMessage()}
                message={schema.getCurie().getMessage()}
                onClick={() => handleClick(schema)}
                replaceRegEx={replaceRegEx}
              />
            ))}
          </div>
        </PopoverBody>
      </div>
    ));

  const blockWidth = blockParentNode.get() ? blockParentNode.get().offsetWidth : 0;

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      role="presentation"
    >
      <Button id="sidebar-button" onClick={handleToggleSidebar} color="hover">
        <Icon
          id="sidebar-icon"
          style={{ transform: `rotate(${isOpen ? 45 : 0}deg)` }}
          size="xl"
          color="success"
          imgSrc="plus-outline"
          alt="add new block"
        />
      </Button>
      <UncontrolledTooltip key="tooltip" placement="left" target="sidebar-icon">
        Add new block
      </UncontrolledTooltip>
      {isHoverInsertMode && (
          <div
            id="hover-insert-mode-indicator"
            onClick={handleHoverInsert}
            role="presentation"
            style={{ width: blockWidth, left: '33px' }}
          />
        )}
      <Popover
        className="sidebar-scrollable"
        isOpen={isOpen}
        placement="auto"
        target="sidebar-button"
        toggle={handleToggleSidebar}
        innerRef={popoverRef}
      >
        <PopoverHeader>
          <InputGroup>
            <Input
              autoComplete="off"
              className="form-control"
              name="q"
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Blocks..."
              theme="white"
              type="search"
              value={q}
              autoFocus
            />
            <Button color="secondary">
              <Icon imgSrc="search" className="me-0" />
            </Button>
          </InputGroup>
        </PopoverHeader>
        <div className="scrollable-container">
          <Suspense fallback={<></>}>
            {availableButtons.length ? availableButtons : (
              <div className="popover-section-holder">
                <PopoverHeader className="text-center">No blocks found</PopoverHeader>
                <PopoverBody className="text-center">Please refine your search</PopoverBody>
              </div>
            )}
          </Suspense>
        </div>
      </Popover>
    </div>
  );
}
