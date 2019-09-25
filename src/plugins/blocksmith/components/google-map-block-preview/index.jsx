/* globals GOOGLE_MAPS_API_KEY */
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const GoogleMapBlockPreview = ({ block, width }) => {
  const zoomParam = block.get('zoom') === 0 ? '' : `&zoom=${block.get('zoom')}`;
  return (
    <iframe
      frameBorder="0"
      title="google-map-block-preview"
      width={width}
      height={width / (16 / 9)}
      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}${zoomParam}&maptype=${block.get('maptype') || 'roadmap'}&q=${block.get('q') || ''}${block.has('center') ? `&center=${block.get('center').getLatitude()},${block.get('center').getLongitude()}` : ''}`}
      allowFullScreen
    />
  );
};

GoogleMapBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default GoogleMapBlockPreview;
