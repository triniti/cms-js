import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { BackgroundImage, CardImgOverlay, CardTitle, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '../../utils/damUrl';

const Asset = ({ asset, isHovering, isOverlayOnlyVisibleOnHover, showEditSequence }) => {
  const assetTitle = asset.get('title');
  const cssStyleImg = {};
  cssStyleImg.opacity = (isHovering ? 0.4 : 1);
  return (
    <Media aspectRatio="1by1" className="mt-0" style={cssStyleImg}>
      <BackgroundImage
        imgSrc={damUrl(asset)}
        alt=""
      />
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

Asset.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  isHovering: PropTypes.bool,
  isOverlayOnlyVisibleOnHover: PropTypes.bool,
  showEditSequence: PropTypes.bool,
};

Asset.defaultProps = {
  isHovering: false,
  isOverlayOnlyVisibleOnHover: false,
  showEditSequence: false,
};

export default Asset;
