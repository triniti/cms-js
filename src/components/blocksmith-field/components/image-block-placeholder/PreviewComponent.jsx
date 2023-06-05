import React, { useEffect } from 'react';
import { Media } from 'reactstrap';
import { BackgroundImage } from 'components';
import damUrl from 'dam/utils/damUrl';
// import delegate from './delegate';
// import selector from './selector';

const PreviewComponent = ({
  handleGetImageNode,
  onToggleImagePreviewSrc: handleToggleImagePreviewSrc,
  image = null,
  imageRef = null,
}) => {

  useEffect(() => {
    if (!image && imageRef) {
      handleGetImageNode(imageRef);
    }
  }, [imageRef]);
  
  return !image ? null : (
    <Media
      aspectRatio="1by1"
      className="mt-2 ml-1 block-placeholder-thumbnail"
      onClick={() => handleToggleImagePreviewSrc(damUrl(image, '4by3', 'md'))}
    >
      <BackgroundImage
        imgSrc={damUrl(image, '1by1', 'xxs')}
        alt="Image Block Thumbnail"
      />
    </Media>
  );
}

export default PreviewComponent;
//export default connect(selector, delegate)(PreviewComponent);