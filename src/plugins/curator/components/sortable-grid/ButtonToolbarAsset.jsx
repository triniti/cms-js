import noop from 'lodash-es/noop';
import React, { useState } from 'react';
import { ButtonToolbar, Media, CardImgOverlay, CardTitle  } from 'reactstrap';
import { CheckboxField, BackgroundImage } from 'components';
import damUrl from 'plugins/dam/damUrl';
import ToolbarButton from './ToolbarButton';

const Asset = ({
  asset,
  isHovering,
  isOverlayOnlyVisibleOnHover,
  showEditSequence
}) => {
  const assetTitle = asset.get('title');
  const cssStyleImg = {};
  cssStyleImg.opacity = (isHovering ? 0.4 : 1);
  cssStyleImg.backgroundColor = '#29292B';
  return (
    <Media className="mt-0 aspect-ratio aspect-ratio-1by1 media" style={cssStyleImg}>
      <BackgroundImage imgSrc={damUrl(asset, 'o', 'sm')} />
      {
        (!isOverlayOnlyVisibleOnHover
        || (isOverlayOnlyVisibleOnHover && isHovering)
        || showEditSequence)
        && (
          <CardImgOverlay>
            <CardTitle className="h5 mb-0" style={{ wordBreak: 'break-all' }}>
              {showEditSequence ? asset.get('gallery_seq') : assetTitle}
            </CardTitle>
          </CardImgOverlay>
        )
      }
    </Media>
  );
};

export default function ButtonToolbarAsset ({
  multiSelect = false,
  isSelected = false,
  node,
  editMode,
  onEditAsset,
  onEditSequence = noop,
  onSelect = noop,
  onRemoveAsset,
  showEditSequence = false,
}) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseOver = () => {
    setIsHovering(true);
  }

  return (
    <div
      onBlur={handleMouseLeave}
      onFocus={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
    >
      <Asset
        asset={node}
        isHovering={editMode && isHovering}
        isOverlayOnlyVisibleOnHover
        showEditSequence={showEditSequence}
      />
      {editMode && !isHovering && multiSelect && isSelected && !showEditSequence && (
        <ButtonToolbar style={{ position: 'absolute', left: '0', top: '0', padding: '.5rem', width: '100%', justifyContent: 'space-between', minHeight: '44px' }}>
          <CheckboxField name={`${node.get('_id')}_visible`} checked={isSelected} onChange={() => { onSelect(node)}} />
        </ButtonToolbar>
      )}
      {editMode && isHovering && (
        <ButtonToolbar style={{ position: 'absolute', left: '0', top: '0', padding: '.5rem', width: '100%', justifyContent: 'space-between', minHeight: '44px' }}>
          {!showEditSequence && (
            <>
              {multiSelect && <CheckboxField name={`${node.get('_id')}_hover`} checked={isSelected} onChange={() => { onSelect(node); }} />}
              <div>
                <ToolbarButton icon="edit" id="media-edit" tooltip="Edit" onMouseDown={() => onEditAsset(node)} />
                <ToolbarButton icon="trash" id="media-remove" tooltip="Remove" onMouseDown={() => onRemoveAsset(node)} />
              </div>
            </>
          )}
          {showEditSequence
            && <ToolbarButton icon="cog" id="seq-edit" tooltip="Set Sequence" onMouseDown={() => onEditSequence(node)} />}
        </ButtonToolbar>
      )}
    </div>
  );
}
