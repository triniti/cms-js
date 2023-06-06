/* globals GOOGLE_MAPS_API_KEY */
import React from 'react';

const GoogleMapBlockPreview = (props) => {
  const { formState, width = 528 } = props;
  const { zoom, maptype, q } = formState.values;
  const zoomParam = zoom === 0 ? '' : `&zoom=${zoom}`;

  return (
    <iframe
      frameBorder="0"
      title="google-map-block-preview"
      width={width}
      height={width / (16 / 9)}
      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}${zoomParam}&maptype=${maptype || 'roadmap'}&q=${q || ''}`}
      allowFullScreen
    />
  );
};

export default GoogleMapBlockPreview;